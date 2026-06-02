# The Convergence Protocol

The behavioral sequence that makes independent agents land on the *same* UI. In a tool-using
harness each gate is enforced by tool-call ordering (the harness refuses `create_*` until
`query_manifest` ran this session). By hand, follow it literally. The point of every step is to
remove a degree of freedom that would otherwise let two agents diverge.

---

### STEP 0 — Load state
Read `design-system.json` and `decision-log.json` **first**, before generating anything. You cannot
reuse what you haven't loaded, and you cannot honor an intentional exception you haven't read.
*Gate: generation is disabled until the manifest is loaded this session.*

### STEP 1 — Retrieve
Query the manifest by **intent**, not by guessing a name:
`query({ intent, category?, platform?, limit? })`. The query returns existing registry items with
their import paths, variants, anti-patterns, and required tokens — ready to paste as reference.
*Gate: `create_component` is FORBIDDEN unless a query ran earlier this session. This single rule is
what kills synonym bloat — you cannot invent `CardWrapper` without first being shown `Card`.*

### STEP 2 — Reuse-vs-create gate
Score every candidate by similarity to the new intent (lexical token-set Jaccard with a small
synonym table — deterministic and model-independent; no embedding service required).

- **Top match ≥ threshold (default 0.72)** → **reuse** it. Adapt only through registered overrides
  (a variant, a prop). Log `{ matchedId, similarity, adaptation }`.
- **Below threshold** → you may create — but first record *why the closest match was insufficient*.
  "Nothing matched" is not a reason if you didn't query.

Calibrate the threshold per design system (buttons cluster tighter than layouts). Lower it if you
see forks of things that should have merged; raise it if unrelated intents collapse together.

### STEP 3 — Order of operations for any styling
Strict order, every time:
1. **Match** the intent to an existing View/Style/Modifier/registry-item.
2. **Reuse** it.
3. If styling is still needed, **snap** every value to the nearest token (`space.md`, not `16px`).
4. **Only then create** — and only as a first-class, registered Style/Modifier/component.
5. **Register** it (STEP 6).

Never emit a raw literal. Never emit an inline one-off variant. If something genuinely novel is
required, it becomes a reusable, registered piece — not an inline special case that the next agent
can't find.

### STEP 4 — Naming & ID determinism
Names follow the template `{category}/{variant}/{modifiers}` chosen from the registry's enums, never
free-form. IDs are content-derived:

```
intentKeywords  = normalize(lowercase, dedupe, sort)
logicalId       = sha1(intentKeywords + signatureFingerprint)[:12]      # stack-independent
id              = sha1(intentKeywords + signatureFingerprint + platform)[:12]
```

Content-hashing (not UUIDs/sequential) is the mechanical heart of convergence: two agents in two
sessions building "primary button, 48px, label text" compute the **same id**, choose the **same
name**, and write to the **same file**. They agree without ever communicating.

### STEP 5 — Collision → merge, never fork
Before appending, look up the computed `id` in the index. If it exists, **diff** the source and
metadata and propose a **MERGE** (union of source locations) or an explicit **VARIANT**. A silent
second copy is the bug the whole framework exists to prevent.

### STEP 6 — Register-after-create loop
On create, auto-generate the registry entry (id, intentKeywords, variants, tokenMap, source
location, `status: "new"`) and a decision-log line, append, rebuild indices, and **require
confirmation before commit** (default action = register; on reject, roll back or mark
`experimental`). No created artifact is ever invisible to the next session — the orphan that isn't
registered is the orphan that gets re-invented tomorrow.

### STEP 7 — Exceptions are first-class
A deliberate off-scale value (a platform-specific override, a measured-perf tweak, a legacy-compat
shim) goes in `decision-log.json`:

```json
{ "id": "dl-0007", "componentId": "btn-web-0001", "type": "platform-specific-override",
  "value": "letterSpacing: 0.2px", "justification": "optical fix on the wordmark only",
  "status": "active", "reviewBy": "2026-12-01" }
```

The audit/refactor path **must** query this log and surface the reason rather than auto-fixing — and
flag entries past `reviewBy` for re-review so the log doesn't quietly legitimize drift.

### STEP 8 — Variance control
For UI code generation, pin temperature to **0.1–0.2** (0.0 for token/color/name references). For
high-stakes shared components, sample N=3–5 and keep the output most similar to existing manifest
entries. This removes the `15px`-vs-`16px` jitter that no amount of prompting fixes.

---

**Why this converges independent agents.** Identical content-hashed IDs + an enforced naming
template + mandatory same-manifest retrieval + a reuse threshold mean two agents on the same task,
in different sessions, on different stacks, deterministically reach the same tokens, the same
component id, and the same names. The CC sub-metric measures exactly how well that holds.
