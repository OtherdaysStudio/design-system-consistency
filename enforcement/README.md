# Enforcement — make consistency the path of least resistance

The framework says "consistency must be mechanical, not exhortation." This directory ships the
actual gates so raw literals and hand-rolled clones **fail the build**, on web and SwiftUI, in the
editor and in CI.

| Gate | What it catches | Install |
|---|---|---|
| **ESLint** `ds-consistency/no-raw-style-literals` | raw hex/px/rem/shadow in JSX `style={{}}` | `eslint-plugin-ds-consistency/` → add to flat config |
| **stylelint** `declaration-strict-value` | raw values in CSS/SCSS | copy `.stylelintrc.json` + `npm i -D stylelint stylelint-declaration-strict-value` |
| **SwiftLint** custom rules | `.padding(16)`, `.cornerRadius(12)`, `Color.red`, `.font(.system(size:))` | copy `.swiftlint.yml` |
| **Scorer gate** (composite) | the whole repo drifting below threshold | `node harness/scorer/score.js <src> --flat --gate 90` |
| **pre-commit hook** | blocks local commits below threshold | `cp hooks/pre-commit .git/hooks/ && chmod +x .git/hooks/pre-commit` |
| **GitHub Action** | blocks PRs below threshold + uploads report | copy `github-workflow-consistency.yml` → `.github/workflows/` |

## ESLint (flat config)
```js
import ds from 'eslint-plugin-ds-consistency';
export default [
  { files: ['**/*.{jsx,tsx}'], plugins: { 'ds-consistency': ds },
    rules: { 'ds-consistency/no-raw-style-literals': 'error' } },
];
```

## The scorer gate (web + SwiftUI, one command)
```bash
node harness/scorer/score.js src --flat --gate 90 --manifest reference/_resolved.json
# exit 0 if composite ≥ 90; exit 1 with per-file remediation hints otherwise
```
This is the same composite metric (`0.40·TA + 0.30·CR + 0.20·VC + 0.10·CC`) used to validate the
framework — now run as a merge gate on real code.

## Philosophy
Lint rules catch the *literal* (the symptom); the scorer gate catches *drift* (the disease —
including hand-rolled component clones the linters can't see). Use both. Intentional exceptions go in
the design system's `decision-log.json`, never in a blanket eslint-disable.
