// Prepare the stuff-vs-topk-vs-none eval: precompute, for each task, the context each
// arm injects (full catalog vs retrieved top-k vs nothing), record token costs, and
// emit a large-DS resolved.json for the scorer. Agents read the context files.
import fs from 'node:fs';
import path from 'node:path';
import { loadManifest, buildResolved } from '../lib/manifest.js';
import { renderCatalog, renderTopK, estTokens } from './rank.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const OUT = path.join(ROOT, 'runs', 'v2', 'retrieval');
const manifest = loadManifest(path.join(ROOT, 'reference', 'large', 'design-system.large.json'));

export const TASKS = [
  { id: 'data-table-toolbar', comp: 'DataTableToolbar', needs: ['Table', 'Pagination', 'SearchInput'],
    brief: "A data table toolbar above a list: a search input on the left, and on the right a row-count and pagination controls. (The table itself can be a placeholder.)",
    intents: ['data table rows columns', 'pagination next prev pages', 'search input query', 'filter button'] },
  { id: 'media-gallery', comp: 'MediaGallery', needs: ['Gallery', 'Image', 'Carousel'],
    brief: "A media gallery section: a heading and a responsive grid/carousel of images that open larger on click.",
    intents: ['image gallery grid photos', 'carousel slider slides', 'lightbox zoom fullscreen image'] },
  { id: 'notification-center', comp: 'NotificationCenter', needs: ['Alert', 'EmptyState', 'Badge'],
    brief: "A notification center panel: a header with an unread badge, a list of alert/notice rows, and an empty state when there are none.",
    intents: ['alert warning notice', 'toast notification', 'empty state nothing placeholder', 'unread badge count'] },
  { id: 'checkout-stepper', comp: 'CheckoutStepper', needs: ['Stepper', 'Breadcrumb'],
    brief: "A checkout flow header: a multi-step progress stepper (Cart / Shipping / Payment / Review) with the current step highlighted.",
    intents: ['multi step wizard stepper progress', 'breadcrumb trail path'] },
];

fs.mkdirSync(path.join(OUT, 'context'), { recursive: true });
const full = renderCatalog(manifest);
fs.writeFileSync(path.join(OUT, 'context', 'FULL-CATALOG.md'), full.text);

const costs = { fullTokens: estTokens(full.text), perTask: {} };
for (const t of TASKS) {
  const top = renderTopK(manifest, t.intents, 6);
  fs.writeFileSync(path.join(OUT, 'context', `${t.id}.topk.md`), top.text);
  const hit = t.needs.filter((n) => top.names.includes(n));
  costs.perTask[t.id] = { topkTokens: estTokens(top.text), topkCount: top.count, needed: t.needs, retrievedNeeded: hit, recall: +(hit.length / t.needs.length).toFixed(2) };
}
costs.meanTopkTokens = Math.round(Object.values(costs.perTask).reduce((s, x) => s + x.topkTokens, 0) / TASKS.length);
costs.topkPctOfFull = +(100 * costs.meanTopkTokens / costs.fullTokens).toFixed(1);
costs.meanRetrievalRecall = +(Object.values(costs.perTask).reduce((s, x) => s + x.recall, 0) / TASKS.length).toFixed(2);
fs.writeFileSync(path.join(OUT, 'context-costs.json'), JSON.stringify(costs, null, 2));

// large-DS resolved for the scorer (CR needs importNames)
const { resolved } = buildResolved(manifest);
fs.writeFileSync(path.join(OUT, 'large-resolved.json'), JSON.stringify({
  tokens: [...resolved.values()].map((t) => ({ id: t.id, tier: t.tier, type: t.type, dimension: t.dimension, value: t.value, canon: t.canon, cssVar: t.cssVar, swift: t.swift })),
  components: manifest.components.map((c) => ({ id: c.id, logicalId: c.logicalId, platform: c.platform, canonicalName: c.canonicalName, category: c.category, intentKeywords: c.intentKeywords, importName: c.web?.importName, importPath: c.web?.importPath })),
}, null, 2));

console.log(JSON.stringify(costs, null, 2));
console.log(`\nfull catalog = ${costs.fullTokens} tok; mean top-k = ${costs.meanTopkTokens} tok (${costs.topkPctOfFull}% of full); retrieval recall of needed = ${costs.meanRetrievalRecall}`);
