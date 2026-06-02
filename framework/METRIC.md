# The Consistency Metric

One headline number, made of four measurable parts. It is both the **acceptance test** for a
generation run and the **CI drift-detector** over time. Implemented in `harness/scorer/` (Babel +
postcss for web, a structural tokenizer for SwiftUI), compared against the same `design-system.json`.

```
COMPOSITE = 0.40·TA + 0.30·CR + 0.20·(VC·100) + 0.10·(CC·100)        → 0–100
```

Weights are defaults, tunable per org (token-critical teams push TA to 0.5–0.6; reliability-critical
teams push CC to 0.2–0.25). **Report all four sub-scores separately** and **flag any sub-score < 60
even when the composite passes**. Tiers: 0–50 poor · 50–75 developing · 75–90 mature · 90–100
excellent.

Before any comparison, **canonicalize** values: `#FF0000` = `rgb(255,0,0)` = `red` →
lowercase hex; `16px` = `16` = `.md`; aggressive whitespace/identifier normalization. Two values
that render identically must compare equal.

---

## TA — Token Adherence (weight 0.40)
```
TA = token-referencing styleable declarations / all styleable declarations × 100
```
- **Denominator** — every declaration where a token *could* apply: color/background/border-color,
  padding/margin/gap, border-radius, font-size/weight/line-height, box-shadow (web); and
  `padding`/`frame`/`cornerRadius`/`foregroundStyle`/`font`/`background` (SwiftUI).
- **Numerator** — declarations referencing a **defined** manifest token (`var(--…)`, the `token.*`
  accessor, `DS.Spacing.md`, `Color.dsActionPrimary`, `.dsType(.body)`). A raw literal that matches
  no token contributes 0.
- **Excluded from the denominator** — `0`, `auto`, `inherit`, `currentColor`, `none`, `transparent`,
  `100%`, vendor prefixes, unitless z-index/flex/opacity.
- **Type-check guard** — a reference only counts if the token's `$type` matches the property family
  (a spacing prop must reference a *dimension* token, a color prop a *color* token). A
  spacing-token-used-for-color is a violation, not a pass. This closes the obvious false-pass.

## CR — Component Reuse (weight 0.30)
```
CR = reused registered components / (reused + hand-rolled clones) × 100
```
- **reused** — JSX elements / SwiftUI views whose name resolves to a registered component
  (`<Button>`, `DSButton`, `.dsCard()`).
- **clones (missed opportunities)** — hand-rolled elements that re-invent a registered component:
  a raw `<button>`, a `<div>` with surface styling (background + radius + shadow/border) where a
  `Card` exists, a pill-shaped `<span>` where a `Badge` exists, an element setting inline typography
  where `Text` exists, a flex container with a literal gap where `Stack` exists; in SwiftUI, a native
  `Button` styled by hand, a `.background().cornerRadius()` card chain, `VStack(spacing: 12)`.
  Detected structurally (AST shape / modifier-chain pattern), not by string match.

## VC — Value Clustering (weight 0.20, reported ×100)
```
per dimension d:  efficiency_d = min(distinct observed_d, defined tokens_d) / distinct observed_d
VC = weighted avg over dimensions:  color 0.30 · spacing 0.30 · typography 0.20 · radius 0.10 · shadow 0.10
```
Counts *distinct values per dimension* — fewer is more consistent. 12 distinct spacings against an
8-step scale → 8/12 = 0.67. Strip responsive/media variants and cluster by intent before counting so
`16px-mobile / 24px-desktop` isn't double-penalized. (VC catches **proliferation**; TA catches
**off-token literals** — they are complementary, so a rogue value is always caught by at least one.)

## CC — Cross-session Convergence (weight 0.10, reported ×100)
Run the **same task N≥3 times** (recommend 5) as independent agents. Normalize each output
(identifiers, whitespace, formatting) — mandatory first, or naming-only diffs tank an otherwise
converged set. Extract each run's **decision set** = {token ids used} ∪ {component names used}.

```
CC = mean pairwise agreement of the decision sets across runs       (Jaccard; 1.0 = identical choices)
```
A practical proxy for Krippendorff's α over per-decision selections; both reward independent agents
reaching the *same* tokens and components. CC < 0.60 → flag (output too non-deterministic). Because
N runs are costly, sample CC on a cadence (per sprint), not every commit.

---

**Caveat, stated in every report.** A high composite is **necessary but not sufficient** for visual
correctness — it proves you reused the system's decisions, not that the result looks good. Pair it
with screenshot / visual-regression for pixel fidelity, and re-tune the weights if a high score ever
meets poor design feedback.
