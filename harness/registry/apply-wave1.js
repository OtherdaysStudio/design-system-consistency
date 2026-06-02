// Two-wave grow-the-manifest eval, step 2 (deterministic, run between agent waves).
// Reads every wave-1 agent's entry.json, registers them into a working copy of the
// manifest (observing content-hash collisions => merges), and reports CONVERGENCE:
// how many distinct registry entries N independent agents collapsed to per component.
// Then emits a grown manifest + resolved + cheatsheet for wave-2 to retrieve against.
import fs from 'node:fs';
import path from 'node:path';
import { loadManifest, buildResolved, cssVarFor } from '../lib/manifest.js';
import { register } from './registry.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const GROW = path.join(ROOT, 'runs', 'v2', 'grow');
const wave1 = path.join(GROW, 'wave1');

const manifest = loadManifest(path.join(ROOT, 'reference', 'design-system.json'));
const baseCount = manifest.components.length;

// collect every entry.json the wave-1 agents wrote, grouped by component dir
const perComponent = {};
if (fs.existsSync(wave1)) {
  for (const comp of fs.readdirSync(wave1)) {
    const dir = path.join(wave1, comp);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.entry.json')) continue;
      try { (perComponent[comp] ||= []).push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))); }
      catch (e) { console.warn('skip malformed', comp, f, e.message); }
    }
  }
}

const report = { perComponent: {}, totals: { agents: 0, registered: 0, merged: 0 } };
for (const [comp, entries] of Object.entries(perComponent)) {
  const idsBefore = new Set(manifest.components.map((c) => c.id));
  const outcomes = entries.map((e) => register(manifest, e));
  const newIds = new Set(manifest.components.map((c) => c.id).filter((id) => !idsBefore.has(id)));
  report.perComponent[comp] = {
    agents: entries.length,
    distinctEntries: newIds.size,            // 1 = perfect convergence; >1 = forks
    convergence: +(1 / Math.max(1, newIds.size)).toFixed(3),
    registered: outcomes.filter((o) => o.result === 'REGISTERED').length,
    merged: outcomes.filter((o) => o.result === 'MERGED').length,
    finalIds: [...newIds],
    names: [...new Set(entries.map((e) => e.canonicalName))],
  };
  report.totals.agents += entries.length;
  report.totals.registered += report.perComponent[comp].registered;
  report.totals.merged += report.perComponent[comp].merged;
}
const comps = Object.values(report.perComponent);
report.meanConvergence = comps.length ? +(comps.reduce((s, c) => s + c.convergence, 0) / comps.length).toFixed(3) : null;
report.manifestGrew = `${baseCount} -> ${manifest.components.length} components`;

// write grown manifest + resolved + cheatsheet for wave-2
fs.mkdirSync(GROW, { recursive: true });
fs.writeFileSync(path.join(GROW, 'grown-design-system.json'), JSON.stringify(manifest, null, 2));

const { resolved } = buildResolved(manifest);
const resolvedExport = {
  tokens: [...resolved.values()].map((t) => ({ id: t.id, tier: t.tier, type: t.type, dimension: t.dimension, value: t.value, canon: t.canon, cssVar: t.cssVar, swift: t.swift })),
  components: manifest.components.map((c) => ({ id: c.id, logicalId: c.logicalId, platform: c.platform, canonicalName: c.canonicalName, category: c.category, intentKeywords: c.intentKeywords, importName: c.web?.importName, importPath: c.web?.importPath, swiftConstruct: c.swift?.construct })),
};
fs.writeFileSync(path.join(GROW, 'grown-resolved.json'), JSON.stringify(resolvedExport, null, 2));

const web = manifest.components.filter((c) => c.platform === 'web');
const cheat = `# Aperture DS (GROWN) — web usage. Import from '@/ds'. Style via token.* / <Text variant>. No raw literals.\n\n## Components (includes newly-registered ones — REUSE them)\n` +
  web.map((c) => `- <${c.canonicalName}> — ${(c.variants || []).map((v) => `${v.name}: ${(v.values || []).join('|')}`).join('; ')}  · ${c.purposeStatement}${c.status === 'new' ? '  [NEW]' : ''}`).join('\n') + '\n';
fs.writeFileSync(path.join(GROW, 'grown-USAGE.md'), cheat);

console.log(JSON.stringify(report, null, 2));
console.log('\nwrote grown-design-system.json, grown-resolved.json, grown-USAGE.md');
