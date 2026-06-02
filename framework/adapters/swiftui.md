# Adapter: SwiftUI

How the stack-agnostic core instantiates in SwiftUI. **This supersedes the v1 sketch**
(`swiftui-design-consistency`) — same insight, now grounded in one manifest, a gated protocol, and a
measurable score. SwiftUI gives you native enforcement points; prefer them over loose convention,
because the goal is to make the consistent path the *ergonomic* one and raw values *awkward* to write.

## Token consumption — codegen'd from the manifest

`harness/codegen.js` emits `DS/Tokens.swift` from `design-system.json`:

- **A non-instantiated `DS` enum namespace** — the single home for every scalar primitive:
  ```swift
  enum DS {
      enum Spacing { static let xs: CGFloat = 4, sm = 8, md = 16, lg = 24, xl = 32 }
      enum Radius  { static let sm: CGFloat = 6, md = 10, lg = 16, pill = 999 }
      enum Size    { static let controlMd: CGFloat = 40, iconMd = 20 }
  }
  ```
- **Semantic colors by role**, surfaced as `Color` extensions (in a real app these resolve to Asset
  Catalog ColorSets with Any+Dark appearances, so dark mode comes for free):
  `Color.dsActionPrimary`, `Color.dsTextPrimary` — never `Color.red`, never `Color(hex:)`. Semantic
  naming is what lets one change re-theme everything; fifty scattered `Color.blue` cannot.
- **Typography presets** as `Font.ds*` + a `.dsType(.body)` view modifier — the sanctioned way to set
  type. `.font(.system(size: 14))` is a drift signal.
- **Composite shadows** as a `.dsShadow(.md)` modifier.
- **Cascading values** (theme, density) belong in `@Entry`-backed `EnvironmentValues`, injected once
  rather than threaded through initializers.

## Components — native enforcement points

Express each kind of reuse where SwiftUI makes the raw path awkward:

| Need | Native home | Example |
|---|---|---|
| A control with defined variants | **`ButtonStyle`/`ToggleStyle`** + an `enum Variant` | `DSButton("Save"){ }.dsButtonStyle(.primary, .lg)` |
| Cross-cutting surface styling | **`ViewModifier`** | `.dsCard(.elevated)` |
| Layout spacing | a **`DSStack`** wrapper whose gap is a `DS.Spacing` token | `DSStack(.vertical, gap: .md){ }` |
| Text | **`DSText`** / `.dsType(_:)` | `DSText("Title", .heading)` |
| A value that cascades by context | **`@Environment` + `@Entry` key** | `@Environment(\.dsDensity)` |

Variants are **enums, not free parameters** — there is no arbitrary-height argument to pass, so
one-off sizes are structurally impossible. That is the point.

## Drift signals (static analysis for Mode A + the scorer)

Grep / AST signals that mark re-invention:

- numeric literals inside `.padding(`, `.frame(height:`, `.cornerRadius(`, `VStack(spacing:` →
  reference `DS.*`.
- `Color.red`/`.blue`/…, `Color(red:green:blue:)`, `Color(hex:)` → semantic `Color.ds*`.
- `.font(.system(size:))` and native `.body`/`.title` styles → `.dsType(_:)`/`Font.ds*`.
- a `.background(…).cornerRadius(…)` chain → a hand-rolled card → `.dsCard()`.
- a native `Button`/`TextField` styled by hand → `DSButton`/`DSTextField`.

## Lint gates (CI)

- **SwiftLint `no_magic_numbers`** plus **`custom_rules`** regex banning `padding\(\d`,
  `cornerRadius\(\d`, `Color\.(red|blue|green|…)`, `\.font\(\.system\(size:`.
- Violations not recorded in `decision-log.json` fail the build. A deliberate off-scale value
  (an optical nudge, a measured-perf tweak) is logged with a justification + review date, not
  silently allowed and not silently "fixed" by a later audit.

## Composition primitives (parity with web — see SKILL §7)
Consistency ≠ usability here too. Ensure the SwiftUI DS can *express* good layout, not just tokens:
right-aligned actions via `Spacer()` inside `DSStack` (don't fake it with padding); an impact
`Font.dsHero` step above display for hero numbers; a `DSBadge` dot/icon mode so a status indicator
needn't repeat the title word; a compact `.dsCard(.compact)` inset for list rows; and views that
render with sensible defaults. (The web set carries these today; add the analogues here when this
adapter is next exercised — a missing primitive is the bug, not the screen.)

## When deciding which mechanism

Cross-cutting *look* → `ViewModifier`. A *control* with defined variants → a Style protocol. A value
that should *cascade and change by context* → `@Environment`. Explain the *why* when you apply a rule
— a developer who understands extends the system correctly; one who's just obeying routes around it.
