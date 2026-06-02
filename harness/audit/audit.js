// Mode A: audit an EXISTING (drifted) codebase and refactor it toward the manifest.
//   node audit.js <srcDir>                 -> drift report + candidate manifest
//   node audit.js <srcDir> --fix <outDir>  -> snap inline-style literals to nearest token
//
// The drift report makes the problem legible ("11 distinct greys, 9 spacings, 14 card
// clones"); --fix performs the reconcile/snap the framework describes, with a summary
// of what snapped and what was left for human judgment.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
import { loadManifest, buildResolved, canonColor, canonDim } from '../lib/manifest.js';
const traverse = _traverse.default || _traverse;
const generate = _generate.default || _generate;

const ROOT = path.resolve(import.meta.dirname, '..', '..');

const COLOR_PROPS = new Set(['color', 'backgroundColor', 'background', 'borderColor', 'outlineColor', 'fill', 'stroke']);
const DIM_FAMILY = { padding: 'spacing', paddingTop: 'spacing', paddingRight: 'spacing', paddingBottom: 'spacing', paddingLeft: 'spacing', margin: 'spacing', marginTop: 'spacing', marginRight: 'spacing', marginBottom: 'spacing', marginLeft: 'spacing', gap: 'spacing', rowGap: 'spacing', columnGap: 'spacing', borderRadius: 'radius', fontSize: 'typography' };
const CLONE = { button: 'Button', input: 'TextField', textarea: 'TextField' };

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(f));
    else if (/\.(tsx|jsx)$/.test(e.name)) out.push(f);
  }
  return out;
}
function rgb(hex) { const h = hex.replace('#', ''); if (h.length < 6) return null; return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function colorDist(a, b) { const x = rgb(a), y = rgb(b); if (!x || !y) return Infinity; return Math.sqrt(x.reduce((s, v, i) => s + (v - y[i]) ** 2, 0)); }

export function buildTokenTargets(manifest) {
  const { resolved } = buildResolved(manifest);
  const targets = { color: [], spacing: [], radius: [], typography: [] };
  for (const t of resolved.values()) {
    if (t.type === 'color' && /^#/.test(t.value)) targets.color.push({ id: t.id, v: t.canon });
    else if (t.dimension === 'spacing') targets.spacing.push({ id: t.id, v: parseFloat(t.canon) });
    else if (t.dimension === 'radius') targets.radius.push({ id: t.id, v: parseFloat(t.canon) });
    else if (t.id.startsWith('fontSize.')) targets.typography.push({ id: t.id, v: parseFloat(t.canon) });
  }
  return targets;
}
// nearest token within tolerance; returns token id or null
function snapColor(v, targets) { let best = null, bd = 40; for (const t of targets.color) { const d = colorDist(v, t.v); if (d < bd) { bd = d; best = t; } } return best?.id; }
function snapDim(v, targets, tol) { const n = parseFloat(v); let best = null, bd = tol; for (const t of targets) { const d = Math.abs(n - t.v); if (d < bd) { bd = d; best = t; } } return best?.id; }

export function audit(srcDir, manifest, { fix = false, outDir = null } = {}) {
  const targets = buildTokenTargets(manifest);
  const observed = { color: new Map(), spacing: new Map(), radius: new Map(), typography: new Map() };
  const clones = {};
  let totalLiterals = 0, snapped = 0, unsnapped = 0;
  const files = walk(srcDir);

  for (const file of files) {
    let ast; const code = fs.readFileSync(file, 'utf8');
    try { ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] }); } catch { continue; }
    let changed = false;
    traverse(ast, {
      JSXOpeningElement(p) {
        const tag = p.node.name.name;
        if (tag && CLONE[tag]) clones[CLONE[tag]] = (clones[CLONE[tag]] || 0) + 1;
      },
      JSXAttribute(p) {
        if (p.node.name.name !== 'style') return;
        let obj = p.node.value; if (obj?.type === 'JSXExpressionContainer') obj = obj.expression;
        if (!obj || obj.type !== 'ObjectExpression') return;
        for (const prop of obj.properties) {
          if (prop.type !== 'ObjectProperty') continue;
          const key = prop.key.name || prop.key.value;
          const v = prop.value;
          let raw = null;
          if (v.type === 'StringLiteral') raw = v.value;
          else if (v.type === 'NumericLiteral') raw = String(v.value);
          else continue;
          let family = null, canon = null, tokenId = null;
          if (COLOR_PROPS.has(key) && /#|rgb|hsl|^[a-z]+$/i.test(raw)) { family = 'color'; canon = canonColor(raw); tokenId = snapColor(canon, targets); }
          else if (DIM_FAMILY[key]) {
            family = DIM_FAMILY[key]; canon = canonDim(raw);
            if (canon === '0') continue;
            const tol = family === 'spacing' ? 4 : family === 'radius' ? 4 : 3;
            const set = family === 'spacing' ? targets.spacing : family === 'radius' ? targets.radius : targets.typography;
            tokenId = snapDim(canon, set, tol);
          } else continue;
          if (canon == null || raw.includes(' ')) continue; // skip shorthands (e.g. "16px 20px")
          totalLiterals++;
          observed[family].set(canon, (observed[family].get(canon) || 0) + 1);
          if (tokenId) {
            snapped++;
            if (fix) {
              prop.value = memberExpr(tokenId); changed = true;
            }
          } else unsnapped++;
        }
      },
    });
    if (fix && changed && outDir) {
      const rel = path.relative(srcDir, file);
      const dest = path.join(outDir, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      // ensure token import
      let out = generate(ast, { retainLines: false, jsescOption: { minimal: true } }).code;
      if (!/from ['"]@\/ds['"]/.test(out)) out = `import { token } from '@/ds';\n` + out;
      else if (!/\btoken\b/.test(out.split('\n')[0])) out = out.replace(/import\s*\{([^}]*)\}\s*from\s*['"]@\/ds['"]/, (m, g) => `import { token,${g}} from '@/ds'`);
      fs.writeFileSync(dest, out);
    } else if (fix && outDir) {
      const dest = path.join(outDir, path.relative(srcDir, file));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, code);
    }
  }

  const report = { files: files.length, totalLiterals, snapped, unsnapped, drift: {}, cloneOpportunities: clones };
  for (const [fam, m] of Object.entries(observed)) {
    report.drift[fam] = { distinctValues: m.size, values: [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([v, n]) => `${v}×${n}`) };
  }
  return report;
}

function memberExpr(tokenId) {
  // token.color.action.primary  /  token.space.md  (built as nested MemberExpression)
  const parts = ['token', ...tokenId.split('.')];
  let node = { type: 'Identifier', name: parts[0] };
  for (let i = 1; i < parts.length; i++) {
    const prop = /^\d/.test(parts[i]) ? { type: 'StringLiteral', value: parts[i] } : { type: 'Identifier', name: parts[i] };
    node = { type: 'MemberExpression', object: node, property: prop, computed: /^\d/.test(parts[i]) };
  }
  return node;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const srcDir = path.resolve(args[0]);
  const fix = args.includes('--fix');
  const outDir = fix ? path.resolve(args[args.indexOf('--fix') + 1]) : null;
  const manifest = loadManifest(path.join(ROOT, 'reference', 'design-system.json'));
  const report = audit(srcDir, manifest, { fix, outDir });
  console.log(JSON.stringify(report, null, 2));
  if (fix) console.log(`\n✅ refactored ${report.snapped}/${report.totalLiterals} literals -> tokens (within tolerance); ${report.unsnapped} left for review. wrote ${outDir}`);
}
