# v2: the seven improvements — audit & results

v1 proved the easy claim (reuse an existing, in-context design system → ~99.7% consistency). v2
attacks the parts v1 skipped. Each improvement is real, tested, and committed; below are the honest
numbers — including a refuted hypothesis and a case where the structural score was confidently wrong.

**Verification:** all 10 self-tests/gates pass (`manifest·scorer·registry·eslint·mcp·contrast·swift·gate·retrieval·audit`).

---

## #1 — Grow-the-manifest (create → register → reuse) ✅
The thing v1 never tested: does the manifest grow *consistently* when new components are needed?

- **Registry mechanics** (`harness/registry/`): real `query` (ranked retrieval) + `register`
  (content-hash IDs, collision→merge, manifest mutation) — wiring the previously-unused `computeId`.
- **Wave 1** (12 agents build 4 *novel*, uncovered components): first cut **forked** (convergence
  0.5) because content-hash IDs included variant signatures and agents bikeshedded variants.
  **Diagnosed → fix:** identity = `canonicalName+category+platform`, merge unions variant axes →
  **convergence 1.0** (12 agents → 4 entries, manifest grew 16→20).
- **Wave 2** (12 independent agents build screens needing those components): **100% reuse** — every
  agent reused the wave-1-created `SegmentedControl/Breadcrumb/Accordion/StatSparkline`.

> The full loop works: independent sessions create components that converge to one entry, and later
> independent sessions reuse them. That's "consistency over time," not just "reuse what's there."

## #2 — Retrieval at scale ✅ (with an honest nuance)
v1's thesis ("retrieval beats stuffing context") was untestable at 16 components. Built a
**111-component** DS, a `query_manifest` ranking layer, and a self-tested **MCP server**.

| arm | valid-name % | convergence % | context tokens |
|---|---|---|---|
| none | 65% (35% hallucinated) | 55% | 0 |
| full catalog | **100%** | 67% | 1997 |
| top-k retrieval | 81% | 42% | **181 (9.1%)** · recall of needed = 1.0 |

**Honest finding:** at this scale the full catalog *still fits* (~2k tokens), so stuffing wins on
validity/convergence; **retrieval delivers 81% valid reuse at 9% of the token cost** and finds 100%
of needed components. The thesis only *dominates* when the catalog can't fit (≈600+ components, or
with full per-component API docs); retrieval's measured weakness (inventing fine-grained children
like `StepConnector`) points to a concrete fix: retrieve *relationships*, not just top matches.

## #3 — Enforcement teeth ✅
The gates v1 only described, now shipped and tested:
- **ESLint** `ds-consistency/no-raw-style-literals` (RuleTester-verified), **stylelint**
  `declaration-strict-value`, **SwiftLint** custom rules.
- **Scorer gate**: `score.js <src> --flat --gate 90` — a repo-level merge gate with per-file
  remediation hints (clean dir passes 99.7; drifted dir fails with the offending literals listed).
- **pre-commit hook** + **GitHub Action**. Consistency now *fails the build*, not just a benchmark.

## #4 — Mode A: audit & refactor existing drift ✅
The higher-value, harder half. On the v1 baseline (hand-rolled, 12 files):
- **Drift report:** 20 distinct colors, 14 spacings, 10 radii; 125 literals; clone opportunities.
- **Auto-refactor** snapped **108/125** literals → nearest token (within tolerance) → composite
  **10.7 → 35.3**. CR stays 0 because component-clone extraction is *flagged but not auto-applied*
  (too risky to automate) — the honest ceiling for a pure literal-snap codemod.

## #5 — Fidelity gate: consistent ≠ correct ✅ (the most pointed finding)
- **WCAG contrast** (`harness/fidelity/contrast.js`): the 99.7%-consistent DS had **4 real contrast
  failures** (danger-button label 3.91:1, warning-on-tint 2.20:1, success 2.83:1, secondary 4.35:1).
  Fixed the tokens → **100% pass**. A consistency score cannot see this.
- **VLM visual judge:** on `settings-row`, all **5 agents converged on an off-brief layout** (toggle
  not right-aligned) — `matchesBrief: false` at cross-agent consistency 5/5. *High consistency masking
  a shared mistake.* Also caught visual divergence the structural CC misses (pricing feature-lists
  with/without check glyphs; stat caption rendered in two different greys).

> Lesson: ship the composite as the *reuse/drift* gate and fidelity (contrast + VLM) as the
> *correctness* gate. Neither substitutes for the other.

## #6 — Rigorous eval: cross-model ✅ (hypothesis refuted, informatively)
| model | baseline | framework | lift |
|---|---|---|---|
| Opus | 14.2 | **99.4** | +85.2 |
| Sonnet | 14.1 | **99.4** | +85.3 |
| Haiku | 14.8 | **78.6** | +63.8 |

The framework does **not** lift the weaker model more. All three nail the easy, binary rule
(component reuse: CR=100), but the *ceiling* scales with capability — Haiku reuses perfectly yet
slips on token discipline (TA=50 → composite 79). **So enforcement (#3) matters most for weaker
models.** Metric blind spots (VC headroom, TA-n/a, CC-as-Jaccard) are now documented in `METRIC.md`.
(N=2/cell — directional.)

## #7 — Real-world: multi-screen drifted app ✅
`apps/acme-console` — Dashboard/Settings/Billing, hand-rolled with organic cross-screen drift (3
"devs"): **23 colors, 10 spacings, 5 radii, 78 literals, 4 button clones** across 3 screens. Full
pipeline (drift-report → auto-refactor) lifted composite **15.2 → 48.3** (72/78 literals snapped);
remaining lift needs the component-clone extraction the audit flags.

---

## Net
v1 answered "can an AI reuse a design system?" (yes, ~99.7%). v2 answers the harder questions: it can
**grow** one consistently (convergence 1.0, reuse 100%), **retrieve** from a large one at ~9% token
cost, be **enforced** in CI, **audit & lift** existing drift, and — crucially — v2 shows where the
consistency number *lies* (contrast failures; a shared off-brief layout) and ships the fidelity gate
that catches it. The most useful output of this round isn't a higher score — it's the two honest
findings (Haiku's TA ceiling; the off-brief settings row) that say exactly where to look next.
