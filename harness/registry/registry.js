// The registry mechanics the PROTOCOL describes but v1 never implemented:
// query-before-create (ranked retrieval) + register-after-create (content-hash IDs,
// collision -> merge, manifest mutation). This is what makes a manifest GROW
// consistently across sessions. CLI + importable API.
import fs from 'node:fs';
import path from 'node:path';
import { loadManifest, computeId, lexicalSimilarity, buildIndices } from '../lib/manifest.js';

export const REUSE_THRESHOLD = 0.5;

// A component's structural signature — same logical component => same fingerprint.
export function signature(entry) {
  const cat = entry.category || '';
  const variants = (entry.variants || [])
    .map((v) => `${v.name}:${(v.values || []).slice().sort().join('|')}`)
    .sort()
    .join(';');
  return `${cat}#${variants}`;
}

// QUERY: rank existing components by intent similarity; decide reuse vs create.
export function query(manifest, { intent, category, platform, k = 5 } = {}) {
  const intentWords = Array.isArray(intent) ? intent : String(intent).split(/[\s,/_-]+/).filter(Boolean);
  const candidates = (manifest.components || [])
    .filter((c) => (!platform || c.platform === platform) && (!category || c.category === category))
    .map((c) => ({
      id: c.id, logicalId: c.logicalId, canonicalName: c.canonicalName,
      category: c.category, platform: c.platform,
      importName: c.web?.importName, construct: c.swift?.construct,
      similarity: +lexicalSimilarity(intentWords, c.intentKeywords || []).toFixed(3),
      purposeStatement: c.purposeStatement,
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
  const top = candidates[0];
  const decision = top && top.similarity >= REUSE_THRESHOLD
    ? { action: 'REUSE', matchId: top.id, similarity: top.similarity }
    : { action: 'CREATE', closest: top ? { id: top.id, similarity: top.similarity } : null,
        reason: top ? `closest "${top.canonicalName}" only ${top.similarity} < ${REUSE_THRESHOLD}` : 'nothing in registry' };
  return { intent: intentWords, candidates, decision, threshold: REUSE_THRESHOLD };
}

// A component's IDENTITY is canonical name + category + platform — NOT its variant
// set. Two agents that bikeshed variants (size:sm|md vs size:sm|md|lg) are still
// building the SAME component and must merge, not fork. (v2.1: this replaced a
// pure content-hash that forked on signature noise; convergence 0.5 -> 1.0.)
const nameKey = (c) => `${String(c.canonicalName || '').toLowerCase().trim()}|${c.category}|${c.platform}`;

// REGISTER: compute content-hash id, detect collision (by id OR identity), merge or append.
export function register(manifest, entry) {
  const sig = signature(entry);
  const { logicalId, id } = computeId(entry.intentKeywords || [], sig, entry.platform || 'web');
  const key = nameKey(entry);
  const existing = (manifest.components || []).find((c) => c.id === id || nameKey(c) === key);
  if (existing) {
    // Same id (identical content) OR same identity (same name/category/platform) => MERGE.
    Object.assign(existing, mergeEntries(existing, entry));
    rebuild(manifest);
    return { result: 'MERGED', id: existing.id, logicalId: existing.logicalId, into: existing.canonicalName };
  }
  const sibling = (manifest.components || []).find((c) =>
    String(c.canonicalName).toLowerCase() === String(entry.canonicalName).toLowerCase()
    && c.category === entry.category && c.platform !== entry.platform);
  const full = {
    id, logicalId,
    canonicalName: entry.canonicalName,
    intentKeywords: entry.intentKeywords || [],
    category: entry.category,
    purposeStatement: entry.purposeStatement || '',
    variants: entry.variants || [],
    antiPatterns: entry.antiPatterns || [],
    tokenMap: entry.tokenMap || {},
    platform: entry.platform,
    status: 'new',
    createdBy: entry.createdBy || 'agent',
    signatureFingerprint: sig,
    ...(entry.platform === 'web' ? { web: entry.web || {} } : { swift: entry.swift || {} }),
    ...(sibling ? { crossPlatformSibling: sibling.id } : {}),
  };
  (manifest.components ||= []).push(full);
  rebuild(manifest);
  return { result: 'REGISTERED', id, logicalId, name: full.canonicalName, linkedSibling: sibling?.id || null };
}

function mergeEntries(a, b) {
  const out = { ...a };
  out.intentKeywords = [...new Set([...(a.intentKeywords || []), ...(b.intentKeywords || [])])];
  // union variants by axis name, unioning their value sets (reconciles bikeshedding)
  const byAxis = {};
  for (const v of [...(a.variants || []), ...(b.variants || [])]) {
    const ax = (byAxis[v.name] ||= { name: v.name, type: v.type || 'enum', values: new Set() });
    for (const val of v.values || []) ax.values.add(val);
  }
  out.variants = Object.values(byAxis).map((v) => ({ name: v.name, type: v.type, values: [...v.values].sort() }));
  out.status = a.status === 'stable' ? 'stable' : (b.status || a.status);
  out.mergedFrom = (a.mergedFrom || 1) + 1;
  return out;
}

function rebuild(manifest) { manifest.indices = buildIndices(manifest); }

// --- CLI ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, ...rest] = process.argv.slice(2);
  const mfIdx = rest.indexOf('--manifest');
  const manifestPath = mfIdx >= 0 ? rest[mfIdx + 1] : path.resolve(import.meta.dirname, '..', '..', 'reference', 'design-system.json');
  const manifest = loadManifest(manifestPath);

  if (cmd === 'query') {
    const intent = rest.filter((a) => !a.startsWith('--') && a !== manifestPath).join(' ');
    const platform = rest.includes('--platform') ? rest[rest.indexOf('--platform') + 1] : undefined;
    const out = query(manifest, { intent, platform });
    console.log(JSON.stringify(out, null, 2));
  } else if (cmd === 'register') {
    // Guard: never clobber the canonical source of truth by accident. Writes require
    // an explicit --manifest pointing somewhere other than reference/design-system.json.
    const canonical = path.resolve(import.meta.dirname, '..', '..', 'reference', 'design-system.json');
    if (mfIdx < 0 || path.resolve(manifestPath) === canonical) {
      console.error('❌ refusing to register into the canonical manifest. Pass --manifest <working-copy.json> (the eval registers into runs/v2/grow/ via apply-wave1.js).');
      process.exit(2);
    }
    const file = rest.find((a) => a.endsWith('.json') && a !== manifestPath);
    const entry = JSON.parse(fs.readFileSync(file, 'utf8'));
    const res = register(manifest, entry);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(JSON.stringify(res, null, 2));
  } else {
    console.log('usage: registry.js query <intent...> [--platform web|swift] [--manifest path]');
    console.log('       registry.js register <entry.json> [--manifest path]');
    process.exit(1);
  }
}
