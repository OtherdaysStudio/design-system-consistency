---
name: design-system-consistency
description: >-
  Create and maintain UI that is consistent ACROSS a design system instead of re-inventing
  components and values every time. Use this whenever an AI (or a developer) is generating,
  styling, auditing, or refactoring UI in ANY stack — React/CSS/Tailwind, SwiftUI, Flutter,
  Vue, etc. Trigger it on "build a screen / view / component", "style this", "make our UI
  consistent", "why are my buttons all different", "I keep hardcoding colors/spacing", or any
  request that produces interface code. Consistency is applied BY DEFAULT, not only on request.
  This is the cross-stack generalization of the SwiftUI-specific v1 (see swiftui-design-consistency).
---

# Design System Consistency (cross-stack)

> **Read this once before generating any UI. It changes how you build, not just what you build.**

## 0. The reframe: drift is a retrieval problem, not a taste problem

Most UI inconsistency is blamed on taste. It isn't. Decompose every divergence into three
orthogonal causes — only one is taste, and it's the smallest:

| Cause | What it looks like | The real fix |
|---|---|---|
| **Retrieval failure** (~70%) | A token/component existed but wasn't in context, so you re-invented it. `Button` vs `PrimaryButton`; `padding: 16px` emitted as a literal because the token was never visible. | Make the right value **cheaper to retrieve than to invent**: a queryable manifest + *mandatory retrieve-before-create*. |
| **Stateless re-invention** (cross-session) | Button radius 6 at 11am, radius 8 at 2pm — two generations with zero memory of each other. | One **Git-tracked manifest** every session reads and writes. "Be consistent" is performative without queryable prior state. |
| **Sampling variance** (in-session) | `15px` vs `16px`, `#F0F0F0` vs `#F5F5F5` — token-selection randomness, not a decision. | Low temperature for UI code + snap-to-nearest-token. |

**Taste vs retrieval is the load-bearing distinction.** Choosing 12px from a valid range *when
no prior decision exists* is taste — legitimately free. Choosing 12px, then 16px for the **same
role** without checking what was chosen before is a retrieval failure: a fact that existed was
omitted. The framework's whole job is to **collapse taste into a finite set of pre-made
decisions** (tokens + components + enum variants) so that at generation time there is nothing
left to taste — only facts to retrieve. A hardcoded literal is then revealed for what it is: the
cost-optimized output of a system that failed to make the token cheaper than the literal.

**Core thesis.** *Make the right value cheaper to retrieve than to invent; persist every decision
in one machine-queryable manifest that spans every stack; gate creation behind mandatory
retrieval — and independent agents will converge on the same UI, which a four-part composite score
then proves.*

## 1. The single source of truth: one manifest, every stack

Before anything else, locate or scaffold **one** `design-system.json` (DTCG-superset). It is the
memory that makes consistency possible across sessions, people, and stacks. It is
**machine-optimized first, human-readable second** — prose specs exhaust the context window and
can't be queried. Full contract in [`MANIFEST_SCHEMA.md`](./MANIFEST_SCHEMA.md). Shape:

- **Tokens in three tiers + composites**, references resolve one direction only:
  - `primitives` — raw values, no refs (`blue.500 = #2f6df6`, `space.md = 16px`).
  - `semantic` — role-named, **must** reference a primitive (`color.action.primary = {blue.500}`).
    Semantic naming is what lets one change propagate; `color.action.primary` can be re-themed once,
    fifty scattered `#2f6df6` cannot.
  - `composite` — one token, object value (`type.body` = {fontSize, fontWeight, lineHeight};
    `shadow.md` = {x,y,blur,spread,color}). Sub-values are refs, never hardcoded.
  - `component` — component-scoped, ref semantic/composite (`button.radius = {radius.md}`).
- **A component registry** — each entry carries the agentic fields a code generator needs to
  *retrieve and reuse* rather than re-invent: `canonicalName`, `intentKeywords`, `purposeStatement`
  (semantic intent, not a label), `variants` (as enums), `antiPatterns`, `tokenMap`, and the
  per-platform `importPath` / `construct`.
- **Platform transforms as DATA** — the rules that emit each stack from the same JSON
  (web → CSS vars + a typed `token` accessor + Tailwind `@theme`; swift → a `DS` enum namespace +
  Asset-Catalog colors + `ShapeStyle`/`Font` extensions). Codegen output is gitignored; **the JSON
  is canonical**; CI asserts generated == manifest.

Keep the scale **small and opinionated**. A tight set is what *creates* consistency; a huge scale
just recreates the chaos with prettier names. Derive real values from the codebase if any exist —
where the real project contradicts a guess, the real project wins.

## 2. The convergence protocol (gated — you cannot skip steps)

This is the operational sequence, not advice. In a tool-using harness, each gate is enforced by
tool-call ordering; when running by hand, follow it literally. Full version in
[`PROTOCOL.md`](./PROTOCOL.md).

```
STEP 0  LOAD STATE   Read design-system.json (+ decision-log) FIRST, before generating anything.
STEP 1  RETRIEVE     Query the manifest by intent. (create_* is FORBIDDEN until you've queried.)
STEP 2  REUSE GATE   Closest match ≥ threshold → REUSE/adapt via registered overrides; log it.
                     Below threshold → you may create, but record WHY the closest match failed.
STEP 3  ORDER OF OPS For any styling: match intent → reuse component → SNAP every value to the
                     nearest token → only THEN create, and only as a first-class registered
                     Style/Modifier/registry-item. NEVER a raw literal or an inline one-off.
STEP 4  NAMING       Names follow {category}/{variant}/{modifiers}. IDs are content-hashed
                     (sha1 of normalized intent + signature + platform) — so two agents building
                     the same logical component land on the SAME id and name. Convergence is
                     mechanical, not hoped-for.
STEP 5  COLLISION    Computed id already exists? Diff and propose MERGE or an explicit VARIANT —
                     never a silent fork.
STEP 6  REGISTER     Auto-write the new entry + decision-log line; rebuild indices; confirm before
                     commit. No created artifact is ever invisible to the next session.
STEP 7  EXCEPTIONS   A deliberate off-scale value goes in decision-log.json with a templated
                     justification + review date. Audits surface the reason instead of auto-fixing.
STEP 8  VARIANCE     temperature 0.1–0.2 (0.0 for token/name references) for UI code.
```

The reuse-before-create discipline is the single highest-leverage mechanism: it eliminates
synonym bloat (`Card` / `CardWrapper` / `c-card`) by forcing a similarity check *before any new
artifact exists*.

## 3. Mechanical enforcement over exhortation

"Be consistent" is a no-op; a gate that fails the build is not. Make the consistent path the
*ergonomic* path and deviation *awkward*:

1. **No bare style literals.** Raw color / spacing / radius / font-size / shadow values in a style
   position are the primary drift signal. They must reference a token. If no token fits, ask before
   generating — don't invent one inline.
2. **Variants are enums, not free parameters** — on every stack. There is no arbitrary-height
   argument to pass, so one-off sizes are structurally impossible (React discriminated-union
   `variant` prop; SwiftUI `enum Variant`).
3. **Reuse before create; register after create.** No orphan components — if it isn't in the
   manifest, it doesn't exist for the next person.
4. **Native enforcement points over loose convention.** Express styling where the platform makes
   the raw path awkward: web → a typed `token` accessor + component library + a strict-value lint;
   SwiftUI → `ButtonStyle`/`ViewModifier`/`@Environment`. Explain the *why* — a developer who
   understands extends the system correctly; one who's just obeying routes around it.
5. **Lint gates in CI.** web: `stylelint-declaration-strict-value` + a token-adherence ESLint rule;
   swift: SwiftLint `no_magic_numbers` + custom rules banning `padding(<num>)`, `cornerRadius(<num>)`,
   `Color.red`, `.font(.system(size:`. Violations not in the decision log fail the build.
6. **One canonical path per decision.** Where the system offers two *valid* ways to express the same
   thing — a gap via `<Stack gap>` *or* `token.space` on a raw `<div>`; a status pill via `<Badge>`
   *or* a token-styled `<span>` — pick ONE as canonical and route the other out. Redundant paths are
   the subtle way two fully token-compliant agents still diverge (it shows up as a depressed
   convergence score even when adherence and reuse are perfect). The canonical choices here:
   **spacing/layout is expressed only through the layout component** (`<Stack gap>` / `DSStack(gap:)`),
   **type only through `<Text>`/`DSText`**, and **every semantic element through its most specific
   registered component** — never re-style on a raw element what a component already encodes.

## 4. Stack adapters

The core above is stack-agnostic. Each stack instantiates it through its own native enforcement
points — same manifest, same protocol, same metric:

- **Web (React + CSS variables / Tailwind):** [`adapters/web.md`](./adapters/web.md)
- **SwiftUI:** [`adapters/swiftui.md`](./adapters/swiftui.md) (supersedes the v1 sketch)

A logical component (e.g. "primary button") has ONE `logicalId` shared across stacks plus a
per-platform entry, so a web `Button` and a SwiftUI `DSButton` are recognizably the *same decision*
expressed twice.

## 5. Two modes, one source of truth

Detect which applies from the request; you'll often do a little of both.

- **Mode A — Audit & refactor existing code.** Scan for drift signals (numeric literals in
  spacing/sizing/radius positions, raw colors/fonts, modifier/util chains repeated 3+ times).
  **Report the real numbers** plainly ("4 button heights, 7 raw greys, 3 duplicate card chains") —
  concrete counts make the problem legible. Cluster near-values (14/15/16 → one `space.md`), propose
  a canonical set, refactor **with diffs**, snap literals to tokens, extract repeated chains into
  Styles/Modifiers/components, and **register** everything. Off-scale values sometimes exist on
  purpose — surface them, don't steamroll (check the decision log first).
- **Mode B — Govern new code.** Run the protocol in §2 every time. Read manifest → match intent →
  reuse → snap → create-as-registered → register. Never emit a raw literal or a one-off variant.

## 6. Consistency is measurable (and self-verifying)

A framework that can't be measured can't be tuned or trusted. The acceptance test and the CI
drift-detector are the same **composite score** (full math in [`METRIC.md`](./METRIC.md)):

```
COMPOSITE = 0.40·TA + 0.30·CR + 0.20·(VC·100) + 0.10·(CC·100)        (0–100)
```

- **TA — Token Adherence:** styled declarations that reference a defined token / all styleable
  declarations. (Type-guarded: a spacing prop must reference a *dimension* token, not a color.)
- **CR — Component Reuse:** reused registered components / (reused + hand-rolled clones detected).
- **VC — Value Clustering:** per dimension, `min(distinct observed, defined tokens) / distinct
  observed` — penalizes proliferating values beyond the scale.
- **CC — Cross-session Convergence:** run the same task N≥3 times; agreement of the token/component
  choices across independent runs. This is the property the whole framework exists to produce.

Report all four separately and flag any sub-score < 60 even when the composite passes.

## 7. Consistency is necessary, not sufficient — design the composition, then verify it

A perfect composite means agents *reused the system's decisions*. It does **not** mean the screen
is usable: independent agents routinely converge on the *same* badly-composed layout (real case —
all five put a settings toggle mid-row instead of right-aligned, scoring ~100 while missing the
brief). Three disciplines close that gap.

**(a) When consistent UI still looks wrong, suspect a MISSING PRIMITIVE — not a one-off.** The most
reliable diagnosis from real review: agents drift into bad composition because the design system
*can't express* the good one, so they reach for the only thing it can. **Fix the primitive, not the
screen.** Cases that all root-caused to a DS gap:
- a control wouldn't right-align → the layout component had **no `justify`/space-between** → add it.
- a price/number lacked impact → no type step **above `display`** → add a `hero` size.
- a status indicator duplicated the title word → `Badge` had **no icon/`dot` mode** → add it.
- list rows were too tall → the surface had **one fixed inset** → add a compact `padding`.
- a component crashed in isolation → it **lacked self-contained defaults** → add them.

A design system isn't just tokens + components; it must also carry the **layout, hierarchy,
density, and (for mobile) touch-target + responsive-type primitives** needed to compose *well*. A
missing primitive *is* the bug — extend the system and register the addition.

**(b) Composition rules the metric can't see** (enforce them anyway): right-aligned/split actions
use an explicit space-between (never assume it); a value and its delta/badge sit *inline*, not
stacked, unless intended; supporting text is always *smaller/lighter* than the title it supports
(never inverted); an action reads as a button (fill/secondary), not bare text; one clear primary
action per view.

**(c) Verify visually — never ship on the score alone.** Closing step for any UI task: **render it,
check WCAG contrast of the actual token pairings, and put real (or VLM) eyes on it against the
brief.** The composite is the *reuse/drift* gate; contrast + visual review is the *correctness*
gate — a high composite is necessary but not sufficient. Ship both. (`harness/fidelity/contrast.js`
+ the render/review tooling.)

## 8. Output contract

For any task, produce: the view/refactor code; any new design-system additions **clearly marked as
additions** (as registered Styles/Modifiers/registry-items, never inline specials); the **updated
manifest** (+ decision-log entries where relevant); and, in Mode A, lead with the drift report so
the user sees the before-state. State plainly what you reused vs created and why.

## 9. Standing instruction: improve this framework as you use it

This is a living artifact. Each real codebase will teach you something it got wrong or left vague —
a token scale that doesn't fit, a drift pattern the signals miss, a native API that enforces better
than what's described. When that happens, **propose concrete edits**, explain the reasoning, and
(with agreement) fold them back in. Consistency is the topic; it should also be the practice.
