// Shared manifest library: load, validate, resolve, and provide platform
// transforms + token-reference recognition. Consumed by codegen.js and the scorer.
import fs from 'node:fs';
import path from 'node:path';

// ---------- value canonicalization ----------
const NAMED_COLORS = {
  white: '#ffffff', black: '#000000', red: '#ff0000', green: '#008000',
  blue: '#0000ff', gray: '#808080', grey: '#808080', transparent: 'transparent',
  orange: '#ffa500', yellow: '#ffff00', purple: '#800080', pink: '#ffc0cb',
};

export function canonColor(v) {
  if (v == null) return null;
  let s = String(v).trim().toLowerCase();
  if (NAMED_COLORS[s]) s = NAMED_COLORS[s];
  // #rgb -> #rrggbb
  let m = s.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
  if (m) return `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}`;
  if (/^#[0-9a-f]{6}$/.test(s)) return s;
  if (/^#[0-9a-f]{8}$/.test(s)) return s;
  // rgb()/rgba()
  m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const parts = m[1].split(/[,\s/]+/).filter(Boolean).map((x) => x.trim());
    const [r, g, b] = parts;
    const a = parts[3];
    const hx = (n) => {
      let val = n.endsWith('%') ? Math.round(parseFloat(n) * 2.55) : parseInt(n, 10);
      val = Math.max(0, Math.min(255, val || 0));
      return val.toString(16).padStart(2, '0');
    };
    const base = `#${hx(r)}${hx(g)}${hx(b)}`;
    if (a != null && a !== '1' && a !== '1.0') {
      const av = Math.round(parseFloat(a) * 255).toString(16).padStart(2, '0');
      return base + av;
    }
    return base;
  }
  return s; // swift Color names, asset names, etc. left as-is
}

// dimension/number canonicalization -> string of the numeric value (px stripped)
export function canonDim(v) {
  if (v == null) return null;
  let s = String(v).trim().toLowerCase();
  if (s === '0' || s === '0px' || s === '0rem') return '0';
  const m = s.match(/^(-?\d*\.?\d+)(px|rem|pt)?$/);
  if (m) {
    let n = parseFloat(m[1]);
    if (m[2] === 'rem') n = n * 16; // assume 16px root for comparison
    return String(n);
  }
  return s;
}

export function canonValue(type, v) {
  if (type === 'color') return canonColor(v);
  if (type === 'dimension') return canonDim(v);
  if (type === 'number' || type === 'fontWeight') return canonDim(v);
  return String(v);
}

// ---------- naming transforms ----------
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const kebabSeg = (seg) => seg.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export function cssVarFor(id) {
  return '--' + id.split('.').map(kebabSeg).join('-');
}

// Swift symbol(s) for a token id (the forms the scorer should recognize / codegen emits).
export function swiftSymbolsFor(id, type, tier) {
  const segs = id.split('.');
  const g = segs[0];
  if (g === 'space') return [`DS.Spacing.${segs[1]}`];
  if (g === 'radius') return [`DS.Radius.${segs[1]}`];
  if (g === 'size' && segs[1] === 'control') return [`DS.Size.control${cap(segs[2])}`];
  if (g === 'size' && segs[1] === 'icon') return [`DS.Size.icon${cap(segs[2])}`];
  if (g === 'fontSize') return [`DS.FontSize.${segs[1]}`];
  if (g === 'borderWidth') return [`DS.BorderWidth.${segs[1]}`];
  if (g === 'color' && tier === 'semantic') {
    // color.action.primary -> Color.dsActionPrimary
    const name = segs.slice(1).map(cap).join('');
    return [`Color.ds${name}`, `.ds${name}`];
  }
  if (g === 'type') return [`.dsType(.${segs[1]})`, `Font.ds${cap(segs[1])}`];
  if (g === 'shadow') return [`.dsShadow(.${segs[1]})`];
  return []; // primitives colors / component tokens not directly referenced in swift
}

// VC dimension bucket for a token / value.
export function dimensionOf(id, type) {
  const g = id.split('.')[0];
  if (type === 'color') return 'color';
  if (type === 'shadow') return 'shadow';
  if (g === 'space') return 'spacing';
  if (g === 'radius') return 'radius';
  if (g === 'size') return 'size';
  if (g === 'fontSize' || g === 'fontWeight' || g === 'lineHeight' || g === 'type') return 'typography';
  if (g === 'borderWidth') return 'borderWidth';
  return type;
}

// ---------- load + flatten ----------
export function loadManifest(file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  return raw;
}

// Walk tokens tree; a node with $value is a token. Returns Map id -> {id, tier, type, raw, def}
export function flattenTokens(manifest) {
  const out = new Map();
  const tiers = ['primitives', 'semantic', 'composite', 'component'];
  const walk = (node, tier) => {
    if (node && typeof node === 'object' && '$value' in node) {
      // the id is unknown here; handled by caller via key
      return;
    }
  };
  for (const tier of tiers) {
    const group = manifest.tokens?.[tier];
    if (!group) continue;
    const recurse = (obj) => {
      for (const [key, val] of Object.entries(obj)) {
        if (val && typeof val === 'object' && '$value' in val) {
          out.set(key, { id: key, tier, type: val.$type, raw: val.$value, def: val });
        } else if (val && typeof val === 'object') {
          recurse(val);
        }
      }
    };
    recurse(group);
  }
  return out;
}

// Resolve a $value (possibly {ref} or composite object) to concrete value(s).
function resolveValue(val, tokens, seen = new Set()) {
  if (typeof val === 'string') {
    const m = val.match(/^\{([^}]+)\}$/);
    if (m) {
      const refId = m[1];
      if (seen.has(refId)) throw new Error(`circular ref at ${refId}`);
      const t = tokens.get(refId);
      if (!t) throw new Error(`unresolved ref {${refId}}`);
      return resolveValue(t.raw, tokens, new Set([...seen, refId]));
    }
    return val;
  }
  if (val && typeof val === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(val)) o[k] = resolveValue(v, tokens, seen);
    return o;
  }
  return val;
}

export function buildResolved(manifest) {
  const tokens = flattenTokens(manifest);
  const resolved = new Map();
  for (const [id, t] of tokens) {
    const value = resolveValue(t.raw, tokens);
    resolved.set(id, {
      id, tier: t.tier, type: t.type, raw: t.raw, value,
      dimension: dimensionOf(id, t.type),
      cssVar: cssVarFor(id),
      swift: swiftSymbolsFor(id, t.type, t.tier),
      canon: typeof value === 'string' ? canonValue(t.type, value) : null,
    });
  }
  return { tokens, resolved };
}

// ---------- validation ----------
export function validate(manifest) {
  const errors = [];
  const tokens = flattenTokens(manifest);
  for (const [id, t] of tokens) {
    if (!t.type) errors.push(`${id}: missing $type`);
    if (t.raw === undefined) errors.push(`${id}: missing $value`);
    // primitives must not contain refs
    if (t.tier === 'primitives' && typeof t.raw === 'string' && /\{[^}]+\}/.test(t.raw)) {
      errors.push(`${id}: primitive must not reference another token`);
    }
    // composites must have required sub-keys
    if (t.type === 'typography') {
      for (const k of ['fontSize', 'fontWeight', 'lineHeight']) {
        if (!(t.raw && typeof t.raw === 'object' && k in t.raw)) errors.push(`${id}: typography missing ${k}`);
      }
    }
    if (t.type === 'shadow') {
      for (const k of ['offsetX', 'offsetY', 'blur', 'spread', 'color']) {
        if (!(t.raw && typeof t.raw === 'object' && k in t.raw)) errors.push(`${id}: shadow missing ${k}`);
      }
    }
  }
  // refs resolve + no cycles
  for (const [id, t] of tokens) {
    try { resolveValue(t.raw, tokens); } catch (e) { errors.push(`${id}: ${e.message}`); }
  }
  // component minimum fields
  const required = ['id', 'logicalId', 'platform', 'canonicalName', 'intentKeywords', 'category', 'purposeStatement', 'variants'];
  for (const c of manifest.components || []) {
    for (const f of required) if (!(f in c)) errors.push(`component ${c.id || c.canonicalName}: missing ${f}`);
  }
  return errors;
}

// ---------- indices ----------
export function buildIndices(manifest) {
  const byCategory = {}, byIntent = {}, byLogicalId = {};
  for (const c of manifest.components || []) {
    (byCategory[c.category] ||= []).push(c.id);
    (byLogicalId[c.logicalId] ||= []).push(c.id);
    for (const kw of c.intentKeywords || []) (byIntent[kw] ||= []).push(c.id);
  }
  return { byCategory, byIntent, byLogicalId };
}

// deterministic, model-independent id
import crypto from 'node:crypto';
export function computeId(intentKeywords, signature, platform) {
  const norm = [...new Set(intentKeywords.map((k) => k.toLowerCase().trim()))].sort().join(',');
  const logical = crypto.createHash('sha1').update(`${norm}|${signature}`).digest('hex').slice(0, 12);
  const full = crypto.createHash('sha1').update(`${norm}|${signature}|${platform}`).digest('hex').slice(0, 12);
  return { logicalId: logical, id: full };
}

// lexical reuse-similarity: token-set F1 with stopword removal, light stemming,
// and synonym expansion. F1 (balanced precision/recall) separates "this intent is
// already served" from "genuinely novel" far more cleanly than raw Jaccard, which
// unfairly penalizes components that carry many keywords.
const SYN = { btn: 'button', cta: 'button', click: 'button', tap: 'button', field: 'input', textbox: 'input', pill: 'badge', chip: 'badge', tag: 'badge', panel: 'card', tile: 'card', box: 'card', copy: 'text', paragraph: 'text', vstack: 'stack', hstack: 'stack', flex: 'stack' };
const STOP = new Set(['a', 'an', 'the', 'need', 'want', 'for', 'to', 'of', 'with', 'and', 'this', 'that', 'my', 'our', 'some', 'build', 'create', 'make', 'please', 'add', 'show', 'display', 'component', 'view', 'screen', 'ui']);
function stem(w) { let s = w.toLowerCase().trim(); if (s.length > 3 && s.endsWith('s')) s = s.slice(0, -1); return s; }
function expand(words) {
  const s = new Set();
  for (const w of words) {
    const lw = String(w).toLowerCase().trim();
    if (!lw || STOP.has(lw)) continue;
    const st = stem(lw);
    s.add(st);
    if (SYN[lw]) s.add(stem(SYN[lw]));
    if (SYN[st]) s.add(stem(SYN[st]));
  }
  return s;
}
export function lexicalSimilarity(intentA, intentB) {
  const a = expand(intentA), b = expand(intentB);
  if (a.size === 0 || b.size === 0) return 0;
  const inter = [...a].filter((x) => b.has(x)).length;
  if (inter === 0) return 0;
  const precision = inter / a.size; // how much of the query the component covers
  const recall = inter / b.size;    // how on-topic the component is for the query
  return (2 * precision * recall) / (precision + recall); // F1
}

export const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
