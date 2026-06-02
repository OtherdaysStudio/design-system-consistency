# Resolved design decisions (from research brief open questions)

The research brief (`research/brief.json`) left 8 open questions. Resolved here so the
build is reproducible and self-contained (no external services in the test loop):

1. **IDs & similarity — keyword-hash, model-independent.** Component/token IDs are
   `sha1(normalized_intent_keywords + signature + platform)[:12]`. Retrieval similarity
   (reuse-vs-create) uses deterministic *lexical* similarity (token-set Jaccard over
   intent keywords + a small synonym table), NOT a live embedding model. This keeps the
   manifest stable across runs and the harness fully offline/deterministic.

2. **Cross-platform reuse.** A logical component (e.g. "primary button") has ONE
   `logicalId = sha1(intent+signature)` shared across platforms, plus per-platform entries
   keyed by `id = sha1(intent+signature+platform)`. Component-reuse (CR) is scored
   within-platform; cross-stack convergence is tracked via `logicalId`.

3. **Reuse threshold.** Default cosine/Jaccard ≥ 0.72 → reuse; tunable, calibrated during
   testing. (Lowered from the brief's borrowed 0.78 after pilot.)

4. **CC as weighted + gate.** Cross-session convergence stays a 10% weighted contributor
   AND a hard flag if < 0.60 (per the "flag any sub-score < 60" rule).

5. **Manifest authority.** `reference/design-system.json` is canonical. Codegen
   (tokens.css / tokens.ts / DS.swift) is downstream and regenerated; no Figma in the loop.

6. **TA type-check guard for composites.** A typography composite applied via a Text
   variant counts as one satisfied typography reference; partial hand-application of its
   sub-values is scored per sub-value against the composite's declared sub-refs.

7. **Swift analysis.** Pragmatic regex/structural tokenizer in the single JS scorer
   (not SwiftSyntax) — sufficient for token-ref vs literal, component reuse, clustering;
   far faster and dependency-free.

8. **Decision-log lifecycle.** Exceptions carry `status` + `reviewBy` date; audit path
   surfaces expired exceptions for re-review instead of auto-fixing.

## Web styling approach (controlled for scoring)
Reference web DS standardizes on **CSS custom properties + a typed `token` helper**
(`token.color.action.primary === 'var(--color-action-primary)'`). A Tailwind v4 `@theme`
block is also emitted to demonstrate multi-emitter capability but is not scored. A styled
value counts as a token reference iff it resolves to `var(--X)` for a defined token, or is
a `token.*` member access, or (Text/typography) a registered `<Text variant>`.
