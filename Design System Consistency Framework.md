---
name: swiftui-design-consistency
description: Enforce and maintain design consistency in SwiftUI codebases — consistent spacing, sizing, colors, typography, and reused components/tokens instead of one-off values created fresh each time. Use this skill whenever the user is writing new SwiftUI views, auditing or cleaning up an existing SwiftUI app for visual inconsistency, asks about design tokens / design systems / "DS namespace" in Swift, mentions reusing components, ViewModifiers, ButtonStyles, or complains about drift like "all my buttons are different sizes" or "I keep hardcoding colors." Trigger it even when the user just says "build a view" or "style this" in a SwiftUI context — consistency should be applied by default, not only on request.
---

# SwiftUI Design Consistency

> **▸ Superseded / generalized.** This v1 sketch has been built upon and generalized into a
> cross-stack framework (web + SwiftUI), grounded in research and empirically validated to reach
> ~99% consistency. See [`framework/SKILL.md`](./framework/SKILL.md) (core), the SwiftUI adapter
> [`framework/adapters/swiftui.md`](./framework/adapters/swiftui.md), and the measured proof in
> [`docs/RESULTS.md`](./docs/RESULTS.md). This original is kept as the historical starting point.

> **This document is a rough starting point, not a finished spec.** It captures one person's
> first-pass thinking about how design consistency *should* work in a SwiftUI app. Your job is
> not to follow it literally — it's to **consistently improve on it**. Treat every section as a
> hypothesis to pressure-test against the actual codebase in front of you. Where the real project
> contradicts the assumptions here, the real project wins, and you should say so and adapt. Where
> this document is vague, sharpen it. Where it's wrong, replace it. Surface what you changed and why.

## What this skill is for

Design consistency in SwiftUI is fundamentally a **retrieval problem before it's a creation
problem**. Most inconsistency comes not from bad taste but from re-invention: a developer needs a
button, can't quickly see that a suitable style already exists, and writes a fresh one with
slightly different padding. Repeat across months and you get six button heights and a dozen near-
identical shades of grey.

So the central instinct this skill should instill is: **before creating any styled element, look
for an existing token or component that already serves the purpose.** Create new only when nothing
fits — and when you do, register it so the *next* person finds it.

There are two modes, sharing one source of truth:

- **Mode A — Audit & refactor** existing code toward consistency.
- **Mode B — Govern** new code as it's written.

Both read and write the same **manifest** (the design system's memory). Detect which mode applies
from the request: a pointer at a codebase or words like "clean up / audit / why are my buttons
inconsistent" → Mode A. A request to write or style a view → Mode B. Often you'll do a little of
both; that's fine.

## The shared core (set this up first, in either mode)

Before anything else, locate or scaffold the source of truth. Do not invent values in a vacuum —
if the project already has *de facto* values (even messy ones), Mode A's audit should inform what
the canonical set becomes.

**1. A `DS` token namespace** — a non-instantiated enum hierarchy, the single home for every
layout primitive:

```swift
enum DS {
    enum Spacing { static let xs: CGFloat = 4, sm: CGFloat = 8, md: CGFloat = 16, lg: CGFloat = 24, xl: CGFloat = 32 }
    enum Radius  { static let sm: CGFloat = 6, md: CGFloat = 12, lg: CGFloat = 20, pill: CGFloat = 999 }
    enum Size    { static let controlHeight: CGFloat = 48, iconSm: CGFloat = 16, iconMd: CGFloat = 24 }
}
```

The scale above is a *placeholder*. Derive the real one from the codebase or ask. Resist inventing
a huge scale — a small, opinionated set is what creates consistency; too many options just recreates
the chaos with prettier names.

**2. Semantic Color & Font, backed by the Asset Catalog.** Colors should be named by *role*, not
appearance, and defined as Asset Catalog color sets so light/dark mode and theming come for free:

```swift
extension Color {
    static let dsSurface = Color("Surface")        // not "white" / "gray2"
    static let dsTextPrimary = Color("TextPrimary")
    static let dsDanger = Color("Danger")          // not "red"
}
```

Semantic naming is what lets a single change propagate. `Color.dsDanger` can be rethemed once;
fifty scattered `Color.red` calls cannot.

**3. A manifest** — a `design-system.json` (or similar) recording which tokens and components exist,
their values, and where they live. This is the memory that makes consistency possible across
sessions and people. Without it, Mode B has nothing to retrieve and Mode A's work evaporates. Keep
it in sync: anything created or reconciled gets written here.

Consider also a short **decision log** for intentional exceptions — the off-scale value that exists
for a real reason — so future audits don't "fix" something deliberate.

## Components: the unit of reuse

SwiftUI gives you native enforcement points. Prefer them over loose convention, because the goal is
to make the consistent path the *ergonomic* path — raw values should feel awkward to write.

- **ViewModifiers** for cross-cutting styling repeated across views (the main defense against
  copy-pasted modifier chains):

  ```swift
  struct DSCardStyle: ViewModifier {
      func body(content: Content) -> some View {
          content
              .padding(DS.Spacing.md)
              .background(Color.dsSurface)
              .clipShape(RoundedRectangle(cornerRadius: DS.Radius.md))
      }
  }
  extension View { func dsCard() -> some View { modifier(DSCardStyle()) } }
  ```

- **Style protocols** (`ButtonStyle`, `LabelStyle`, `ToggleStyle`, …) are the *correct* native home
  for component variants. Express variants as an **enum**, not free parameters — this structurally
  prevents one-off sizes, because there's no arbitrary-height argument to pass:

  ```swift
  struct DSButtonStyle: ButtonStyle {
      enum Variant { case primary, secondary, danger }
      let variant: Variant
      // single source of truth for height/padding/radius/color per variant
  }
  ```

- **`@Environment` + custom `EnvironmentKey`** for values that should cascade and be themeable
  (e.g. injecting a theme or density), rather than threading constants through initializers.

When deciding which: cross-cutting *look* → ViewModifier; a *control* with defined variants →
Style protocol; a value that should *cascade and change by context* → Environment.

## Rules to enforce (SwiftUI-flavored)

Explain the *why* when you apply these — a developer who understands the reason will extend the
system correctly; one who's just obeying will route around it.

1. **No bare layout literals.** `padding(16)`, `frame(height: 48)`, `cornerRadius(12)` →
   reference `DS.*`. Raw numerics in spacing/sizing/radius positions are the primary drift signal.
2. **No raw color or font.** `Color.red`, `.font(.system(size: 14))` → semantic extensions.
3. **Style protocols / modifiers over inline chains.** A `.background().cornerRadius().padding()`
   chain appearing 3+ times wants extraction.
4. **Variants are enums, not free parameters** — see above.
5. **Asset Catalog for all colors** — enables dark mode; kills scattered hex.
6. **Reuse before create; register after create.** No orphan components — if it's not in the
   manifest, it doesn't exist for the next person.

These are defaults, not dogma. If the project has a good reason to deviate, record it in the
decision log rather than silently breaking the rule or silently enforcing it.

## Mode A — Audit & refactor (existing code)

1. **Scan for drift.** Grep for the signals: numeric literals inside `.padding(`, `.frame(`,
   `.cornerRadius(`, and `spacing:`; `Color(red:green:blue:)`, hex initializers, system color
   literals like `.red`; inline `.font(.system(size:))`; and modifier chains repeated 3+ times.
2. **Report the real numbers** plainly — "4 distinct button heights, 7 raw colors, 3 duplicate
   card chains." Concrete counts make the problem legible and motivate the cleanup.
3. **Reconcile.** Cluster near-values (14/15/16 → one `DS.Spacing.md`) and propose a canonical set.
   This is a judgment step — present the clustering, don't just impose it.
4. **Refactor with diffs, not silently.** Snap literals to the nearest token, extract repeated
   chains into ViewModifiers/Styles, and show the changes for confirmation. Off-scale values
   sometimes exist on purpose; surface them rather than steamrolling.
5. **Register** every token and component into the manifest; log intentional exceptions.

## Mode B — Govern (new code)

1. **Read the manifest first**, before generating anything.
2. Apply, in order: **match** the intent to an existing View/Style/Modifier → **reuse** it →
   if styling is needed, **snap** values to `DS.*` → only then **create**, as a registered
   Style/Modifier → **register** it.
3. Never emit a raw literal or a one-off variant. If something genuinely novel is required, build
   it as a first-class, reusable, registered piece — not an inline special case.

## Output

For any task, produce: the view/refactor code, any new design-system additions (clearly marked as
additions), and the **updated manifest** (and decision-log entries where relevant). In Mode A,
lead with the drift report so the user sees the before-state.

## Your standing instruction: improve this skill as you use it

This document is a v1 sketch. Each time you apply it to a real codebase you will learn things it
got wrong or left vague — token scales that don't fit, drift patterns the grep list misses,
SwiftUI APIs that offer better enforcement than what's described here. When that happens, **propose
concrete edits to this skill**, explain the reasoning, and (with the user's agreement) fold them
back in. The aim is a skill that gets sharper and more codebase-aware over time, not one that stays
frozen at this first guess. Consistency is the topic; it should also be the practice.
