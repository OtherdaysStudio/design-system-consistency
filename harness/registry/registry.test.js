// Proves the registry mechanics: deterministic content-hash IDs make two
// independent agents converge on ONE entry for the same novel component;
// query then routes a third agent to reuse it.
import { loadManifest } from '../lib/manifest.js';
import { query, register, signature } from './registry.js';
import path from 'node:path';

const manifest = loadManifest(path.resolve(import.meta.dirname, '..', '..', 'reference', 'design-system.json'));
const checks = [];
const assert = (n, c, d) => checks.push({ n, pass: !!c, d });

// 1) query an EXISTING intent -> REUSE
const q1 = query(manifest, { intent: 'a primary submit button cta', platform: 'web' });
assert('existing intent -> REUSE', q1.decision.action === 'REUSE', `${q1.decision.action} match=${q1.decision.matchId} sim=${q1.decision.similarity}`);

// 2) query a NOVEL intent -> CREATE
const q2 = query(manifest, { intent: 'segmented control tab switcher', platform: 'web' });
assert('novel intent -> CREATE', q2.decision.action === 'CREATE', `${q2.decision.action} (${q2.decision.reason})`);

// 3) two independent agents build the SAME novel component -> same id -> MERGE (no fork)
const before = manifest.components.length;
const agentA = {
  canonicalName: 'SegmentedControl', platform: 'web', category: 'control',
  intentKeywords: ['segmented', 'control', 'tabs', 'switcher', 'toggle', 'group'],
  variants: [{ name: 'size', type: 'enum', values: ['sm', 'md'] }],
  web: { importName: 'SegmentedControl', importPath: '@/ds' },
};
const agentB = { // different wording, same logical component + signature
  canonicalName: 'SegmentedControl', platform: 'web', category: 'control',
  intentKeywords: ['switcher', 'segmented', 'tabs', 'group', 'control', 'toggle'],
  variants: [{ name: 'size', type: 'enum', values: ['sm', 'md'] }],
  web: { importName: 'SegmentedControl', importPath: '@/ds' },
};
const rA = register(manifest, agentA);
const rB = register(manifest, agentB);
assert('agent A registers novel', rA.result === 'REGISTERED', JSON.stringify(rA));
assert('agent B collides -> MERGE not fork', rB.result === 'MERGED' && rB.id === rA.id, `${rB.result} idEq=${rB.id === rA.id}`);
assert('only ONE entry added (no duplicate)', manifest.components.length === before + 1, `added ${manifest.components.length - before}`);
assert('signatures identical across agents', signature(agentA) === signature(agentB), signature(agentA));

// 4) a third agent now QUERIES the grown manifest and is routed to REUSE the new component
const q3 = query(manifest, { intent: 'need a segmented tab switcher', platform: 'web' });
assert('grown manifest -> third agent REUSEs', q3.decision.action === 'REUSE' && q3.decision.matchId === rA.id,
  `${q3.decision.action} match=${q3.decision.matchId} (created=${rA.id})`);

console.log('\n=== registry self-test ===');
for (const c of checks) console.log(`  ${c.pass ? '✅' : '❌'} ${c.n}  (${c.d})`);
const failed = checks.filter((c) => !c.pass);
if (failed.length) { console.error(`\n❌ ${failed.length} failed`); process.exit(1); }
console.log('\n✅ registry mechanics verified (deterministic IDs -> convergence, not forks)');
