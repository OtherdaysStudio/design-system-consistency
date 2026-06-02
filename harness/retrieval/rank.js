// Retrieval layer for a large design system: rank components by intent and render
// either the FULL catalog (the "stuff everything in context" approach) or just the
// top-k matches (the framework's "retrieve, don't stuff" approach). Used by the MCP
// server and the stuff-vs-topk-vs-none eval. Token cost is the whole point at scale.
import path from 'node:path';
import { loadManifest, lexicalSimilarity } from '../lib/manifest.js';

export const estTokens = (s) => Math.ceil(s.length / 4); // rough GPT-ish estimate

export function rank(manifest, intent, k = 6) {
  const words = Array.isArray(intent) ? intent : String(intent).split(/[\s,/_-]+/).filter(Boolean);
  return (manifest.components || [])
    .map((c) => ({ c, score: +lexicalSimilarity(words, c.intentKeywords || []).toFixed(3) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.c);
}

const line = (c) => `- <${c.canonicalName}> (${c.category}) — ${(c.variants || []).map((v) => `${v.name}:${(v.values || []).join('|')}`).join('; ')} · ${c.purposeStatement}`;

// FULL: every component (what you must paste if you don't have retrieval).
export function renderCatalog(manifest) {
  const body = (manifest.components || []).map(line).join('\n');
  return { text: `# ${manifest.metadata?.name} — full catalog (${manifest.components.length} components)\n${body}`, count: manifest.components.length };
}

// TOP-K: only the components relevant to the task's intents (union, deduped).
export function renderTopK(manifest, intents, k = 6) {
  const seen = new Set(); const picked = [];
  for (const intent of intents) {
    for (const c of rank(manifest, intent, k)) {
      if (!seen.has(c.id)) { seen.add(c.id); picked.push(c); }
    }
  }
  return { text: `# retrieved components (top matches for this task)\n${picked.map(line).join('\n')}`, count: picked.length, names: picked.map((c) => c.canonicalName) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ROOT = path.resolve(import.meta.dirname, '..', '..');
  const mf = process.argv.includes('--manifest') ? process.argv[process.argv.indexOf('--manifest') + 1] : path.join(ROOT, 'reference', 'large', 'design-system.large.json');
  const manifest = loadManifest(mf);
  const intent = process.argv.slice(2).filter((a) => !a.startsWith('--') && a !== mf).join(' ') || 'tab switcher';
  const full = renderCatalog(manifest);
  const top = renderTopK(manifest, [intent], 6);
  console.log(top.text);
  console.log(`\nintent: "${intent}"`);
  console.log(`full catalog: ${full.count} components ≈ ${estTokens(full.text)} tokens`);
  console.log(`top-k retrieval: ${top.count} components ≈ ${estTokens(top.text)} tokens  (${(100 * estTokens(top.text) / estTokens(full.text)).toFixed(1)}% of full)`);
}
