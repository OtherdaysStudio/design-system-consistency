// Honest discriminator for the retrieval eval: CR can't separate the arms (the large
// DS uses guessable names, and hallucinated PascalCase names are invisible to CR), so
// measure NAME VALIDITY (hallucination) and CROSS-AGENT CONVERGENCE per arm instead.
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import fs from 'node:fs';
import path from 'node:path';
const traverse = _traverse.default || _traverse;

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const OUT = path.join(ROOT, 'runs', 'v2', 'retrieval', 'out');
const DS = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'runs', 'v2', 'retrieval', 'large-resolved.json'), 'utf8')).components.map((c) => c.canonicalName));
const PRIMS = new Set(['Stack', 'Text', 'Box', 'Container', 'Grid']); // structural primitives, not the point

function compsIn(code) {
  const set = new Set(); let ast;
  try { ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] }); } catch { return set; }
  traverse(ast, { JSXOpeningElement(p) { const n = p.node.name; if (n.type === 'JSXIdentifier' && /^[A-Z]/.test(n.name) && !PRIMS.has(n.name)) set.add(n.name); } });
  return set;
}
const jaccard = (a, b) => { const i = [...a].filter((x) => b.has(x)).length; const u = new Set([...a, ...b]).size; return u ? i / u : 1; };

const rows = [];
for (const arm of ['none', 'full', 'retrieval']) {
  let valid = 0, total = 0; const halluc = new Set(); const convs = [];
  for (const task of fs.readdirSync(path.join(OUT, arm))) {
    const dir = path.join(OUT, arm, task); const sets = [];
    for (const f of fs.readdirSync(dir)) {
      const s = compsIn(fs.readFileSync(path.join(dir, f), 'utf8')); sets.push(s);
      for (const c of s) { total++; if (DS.has(c)) valid++; else halluc.add(c); }
    }
    if (sets.length >= 2) { let t = 0, p = 0; for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) { t += jaccard(sets[i], sets[j]); p++; } convs.push(t / p); }
  }
  rows.push({ arm, validRate: +(100 * valid / total).toFixed(0), hallucinated: [...halluc], convergence: +(100 * convs.reduce((s, x) => s + x, 0) / convs.length).toFixed(0) });
}
console.log(JSON.stringify(rows, null, 2));
console.log('\narm        valid-name%   convergence%   hallucinated');
for (const r of rows) console.log(`${r.arm.padEnd(10)} ${String(r.validRate).padStart(7)}      ${String(r.convergence).padStart(7)}        ${r.hallucinated.join(', ') || '(none)'}`);
