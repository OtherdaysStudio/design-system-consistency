# Adapter: Web (React + CSS variables / Tailwind)

How the stack-agnostic core (manifest, protocol, metric) instantiates on the web. The native
enforcement points: a **typed token accessor**, a **component library with enum-variant props**, and
**lint gates** that make raw values fail the build.

## Token consumption — make the token cheaper than the literal

Codegen emits three things from the manifest; pick per project, but make raw values *awkward*:

1. **CSS custom properties** — `:root { --color-action-primary: #2f6df6; --space-md: 16px; … }`
   plus `.type-*` utility classes for typography composites. Re-themeable in one place.
2. **A typed accessor** `token` — `token.color.action.primary === 'var(--color-action-primary)'`.
   This is the ergonomic path: `style={{ background: token.color.action.primary, padding: token.space.md }}`.
   Autocomplete surfaces the whole scale; a hex literal has to be typed from memory.
3. **Tailwind v4 `@theme`** (optional) — tokens become utilities (`bg-action-primary`, `p-md`).

The rule the lint enforces: **a value in a style position is either a `token.*` access, a
`var(--…)` of a defined token, or a `<Text variant>` for type — never a raw hex/px/rem/shadow.**

## Components — the unit of reuse

Every styled element a screen needs already exists as a registered component. Import, don't rebuild:

```tsx
import { Card, Stack, Text, Button, Badge, token } from '@/ds';
```

- **Variants are discriminated unions**, mirroring the manifest enums — `variant`, `size`, `tone`,
  `state`. There is no `height?: number` prop to pass, so a one-off size is *unrepresentable*.
- **Layout via `<Stack gap="md">`**, not `<div style={{ gap: '12px' }}>` — the gap is a spacing-token
  enum, which is the main defense against ad-hoc margins.
- **Type only via `<Text variant>`** — the single sanctioned way to set font-size/weight/line-height.
  Inline `fontSize` is a drift signal and a clone of `Text`.

## Composition primitives (so the system can express *good* layout, not just consistent layout)
Token + component reuse alone yields consistent-but-sometimes-unusable screens (see SKILL §7). The
components carry the primitives needed to compose well — reach for them instead of hand-fixing:
- **`<Stack justify="between">`** (also `start|center|end`) and `align="baseline"` — for split rows
  (label ↔ control, content ↔ action). The reason agents left toggles mid-row was the *absence* of
  this prop; never simulate right-alignment with margins.
- **`<Text variant="hero">`** — an impact step above `display` for prices / headline numbers.
- **`<Badge dot>`** — a status indicator with no text, so you don't repeat the title word
  ("Saved" badge next to a "Saved" title).
- **`<Card padding="sm">`** — compact inset for dense list rows (default `md` is for content cards).
- Components ship **self-contained defaults** (e.g. `ProfileHeader` renders without props) — a
  component that throws in isolation isn't done.

## Mobile & touch readiness (a primitive most desktop-first systems lack)
A design system that only sizes for desktop is missing a primitive (SKILL §7). Field-tested
numbers (source: learnui.design — *Font Sizes in UI Design: The Complete Guide*; iOS HIG / Material):

- **Body & form-input font size ≥ 16px, always.** Below 16px, iOS Safari auto-zooms an input on
  focus and the layout jumps. Aperture body/input = `type.body` (16px) — keep it there; never style a
  field smaller.
- **Mobile vs desktop type ramp.** Mobile: titles 28-40, body 16-20. Desktop: titles 35-50, body up
  to 24. Aperture's larger presets are now **fluid** — `type.title/heading/display/hero` emit
  `clamp(mobileMin … desktopMax)` (interpolated 375px→1280px), so they're mobile-right at small widths
  and grow on desktop. Body/label/caption stay fixed.
- **Touch targets ≥ 44px.** Interactive controls on touch surfaces need a ≥44px hit area (iOS HIG 44,
  Material 48). The default `size.control.md` (40px) is desktop-comfortable but below the touch
  minimum — use `size.control.touch` (44px) for the primary tappable control on mobile.
- **Fewest font sizes possible.** The guide's #1 rule (≈4 sizes total) is the same small-scale
  discipline this framework enforces — resist adding type steps; reuse `<Text variant>`.

## Drift signals the scorer (and you) look for

| Signal | Why it's drift | Fix |
|---|---|---|
| Raw `<button>`, `<input>` | re-invents `Button`/`TextField`, loses variants + a11y | import the component |
| `<div>` with background + border-radius + shadow/border | a hand-rolled `Card` | `<Card>` |
| `<span>` with `borderRadius: 999/50%` + background | a hand-rolled `Badge` | `<Badge tone>` |
| inline `fontSize`/`fontWeight` on a text element | fragments the type scale | `<Text variant>` |
| flex `<div>` with a literal `gap` | ad-hoc spacing | `<Stack gap>` |
| any hex/`px`/`rem`/`rgba`/`box-shadow` literal in a style prop | bypassed the token | `token.*` |

## Lint gates (CI)

- **`stylelint-declaration-strict-value`** — forbid literal values for color/spacing/radius/font
  properties; require a `var(--…)` or `token.*`.
- **ESLint token-adherence rule** — reject hex/px/rem literals inside JSX `style` objects and
  styled-components template literals.
- Both run pre-commit and in CI; a violation not present in `decision-log.json` fails the build.

## Controlled-experiment note

To measure cleanly, the reference harness standardizes the **styling medium** on inline `style={{}}`
objects + the `token` accessor (and `<Text>` for type), so the only variable under test is
*whether* a value references a token — not which CSS methodology is used. In production you'd use
CSS Modules / Tailwind / styled-components; the same TA/CR/VC/CC definitions apply, the parser just
reads a different surface.
