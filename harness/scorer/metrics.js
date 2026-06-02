// Pure scoring functions for the composite consistency metric.
// COMPOSITE = 0.40·TA + 0.30·CR + 0.20·(VC·100) + 0.10·(CC·100)

export const WEIGHTS = { TA: 0.40, CR: 0.30, VC: 0.20, CC: 0.10 };
const VC_DIM_WEIGHTS = { color: 0.30, spacing: 0.30, typography: 0.20, radius: 0.10, shadow: 0.10 };

// ---- Token Adherence ----
export function scoreTA(decls) {
  const styleable = decls.filter((d) => d.kind === 'ref' || d.kind === 'literal');
  const refs = styleable.filter((d) => d.kind === 'ref');
  if (styleable.length === 0) return { value: null, num: 0, den: 0 };
  return { value: (refs.length / styleable.length) * 100, num: refs.length, den: styleable.length };
}

// ---- Component Reuse ----
export function scoreCR(reused, missed) {
  const den = reused.length + missed.length;
  if (den === 0) return { value: null, reused: 0, missed: 0 };
  return { value: (reused.length / den) * 100, reused: reused.length, missed: missed.length };
}

// ---- Value Clustering ----
export function scoreVC(decls, definedByDim) {
  const observed = {}; // dim -> Set of values
  for (const d of decls) {
    if (d.kind !== 'ref' && d.kind !== 'literal') continue;
    const dim = d.family === 'borderWidth' || d.family === 'size' ? null : d.family; // ignore minor dims
    if (!dim || !(dim in VC_DIM_WEIGHTS)) continue;
    const key = d.tokenId && (dim === 'typography' || dim === 'shadow') ? d.tokenId : (d.value != null ? String(d.value) : d.tokenId);
    if (key == null) continue;
    (observed[dim] ||= new Set()).add(key);
  }
  const perDim = {};
  let wSum = 0, acc = 0;
  for (const [dim, w] of Object.entries(VC_DIM_WEIGHTS)) {
    const obs = observed[dim];
    if (!obs || obs.size === 0) continue;
    const defined = (definedByDim[dim]?.size) || obs.size;
    const eff = Math.min(obs.size, defined) / obs.size;
    perDim[dim] = { observed: obs.size, defined, efficiency: +eff.toFixed(4) };
    acc += w * eff; wSum += w;
  }
  if (wSum === 0) return { value: null, perDim };
  return { value: acc / wSum, perDim };
}

// ---- Cross-session Convergence (mean pairwise Jaccard of decision sets) ----
export function scoreCC(runFeatureSets) {
  const sets = runFeatureSets.filter((s) => s && s.size > 0);
  if (sets.length < 2) return { value: null, runs: sets.length };
  let total = 0, pairs = 0;
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const a = sets[i], b = sets[j];
      const inter = [...a].filter((x) => b.has(x)).length;
      const uni = new Set([...a, ...b]).size;
      total += uni === 0 ? 1 : inter / uni; pairs++;
    }
  }
  return { value: total / pairs, runs: sets.length };
}

export function featureSet(parsed) {
  return new Set([...parsed.tokensUsed, ...[...parsed.componentsUsed].map((c) => 'C:' + c)]);
}

// ---- Composite ----
export function tierOf(score) {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'mature';
  if (score >= 50) return 'developing';
  return 'poor';
}

export function scoreComposite({ TA, CR, VC, CC }) {
  // normalize to 0-100
  const parts = [];
  if (TA != null) parts.push(['TA', WEIGHTS.TA, TA]);
  if (CR != null) parts.push(['CR', WEIGHTS.CR, CR]);
  if (VC != null) parts.push(['VC', WEIGHTS.VC, VC * 100]);
  if (CC != null) parts.push(['CC', WEIGHTS.CC, CC * 100]);
  const wSum = parts.reduce((s, [, w]) => s + w, 0);
  if (wSum === 0) return { composite: null, tier: 'n/a', flags: [] };
  const composite = parts.reduce((s, [, w, v]) => s + w * v, 0) / wSum;
  const flags = [];
  for (const [name, , v] of parts) if (v < 60) flags.push(name);
  return { composite: +composite.toFixed(2), tier: tierOf(composite), flags };
}
