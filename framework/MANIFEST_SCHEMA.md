# Manifest Schema (`design-system.json`)

One file. DTCG-superset (`$value`/`$type`/`$description`, curly-brace refs `{group.token}`) extended
with a component registry, platform transforms, indices, and a decision log. It is the **one source
of truth** that both stacks and the scorer read. See
[`references/example-design-system.json`](./references/example-design-system.json) for a complete,
valid instance (the "Aperture DS" used to validate this framework).

```jsonc
{
  "$schema": "...", "manifestVersion": "1.0",
  "metadata": { "name", "version", "lastUpdated", "lastUpdatedBy", "sourceOfTruth", "namingConvention" },
  "tokens":    { "primitives": {...}, "semantic": {...}, "composite": {...}, "component": {...} },
  "components": [ /* registry entries */ ],
  "platforms": { "web": { transforms:[...] }, "swift": { transforms:[...] } },
  "indices":   { "byCategory", "byIntent", "byLogicalId" },   // rebuilt from data, kept out of source
  "decisionLog": [ /* exceptions */ ]
}
```

## Token layering (refs resolve one direction only)

| Tier | Rule | Example |
|---|---|---|
| `primitives` | raw values, **no refs** | `"blue.500": { "$value":"#2f6df6", "$type":"color" }` |
| `semantic` | role-named, **must** ref a primitive (reject semantic→semantic) | `"color.action.primary": { "$value":"{blue.500}", "$type":"color", "$description":"Primary CTA; AA on onAction" }` |
| `composite` | one token, object `$value`; sub-values are refs | `"type.body": { "$type":"typography", "$value": { "fontSize":"{fontSize.md}", "fontWeight":"{fontWeight.regular}", "lineHeight":"{lineHeight.normal}" } }` |
| `component` | component-scoped, ref semantic/composite/primitive | `"button.radius": { "$value":"{radius.md}", "$type":"dimension" }` |

`$description` answers **why / where**, never restates the name. Reject tautologies
("primary primary color").

## Component registry entry

Extends a shadcn-style registry item with the **agentic** fields existing systems lack — the
metadata a generator needs to *retrieve and reuse* instead of re-inventing. Validator-required
minimum: `id`, `logicalId`, `platform`, `canonicalName`, `intentKeywords`, `category`,
`purposeStatement`, `variants`.

```jsonc
{
  "id": "btn-web-0001",                  // sha1(intent + signature + platform)[:12]
  "logicalId": "button",                 // sha1(intent + signature)[:12] — shared across platforms
  "platform": "web",
  "canonicalName": "Button",
  "intentKeywords": ["button","action","submit","cta","confirm"],   // what to match a request against
  "category": "button",                  // template {category}/{variant}/{modifiers}, not free-form
  "purposeStatement": "Triggers an action. NOT navigation — use Link.",  // semantic intent, not a label
  "variants": [ { "name":"variant", "type":"enum", "values":["primary","secondary","danger","ghost"] },
                { "name":"size",    "type":"enum", "values":["sm","md","lg"] } ],
  "antiPatterns": [ { "pattern":"<button> with inline padding/background",
                      "reason":"re-invents the component, drifts from tokens",
                      "correctAlternative":"<Button variant size>", "severity":"must-not" } ],
  "tokenMap": { "all":["button.radius","button.paddingX","size.control.md","type.label"],
                "primary":["button.bg.primary","button.fg.primary"] },   // tokens each variant needs
  "web":   { "importName":"Button", "importPath":"@/ds", "files":[...] },
  "swift": { "construct":"DSButton(_:action:)", "style":"DSButtonStyle", "source":"..." }
}
```

Optional-but-valuable fields: `whenToUse` (scenario → preferred component + why-not-alternative),
`variantCombinations.invalid` (the interaction matrix), `relationships` (parent contexts,
incompatibleWith, requiredNeighbors), `a11y`, `status` (stable|new|experimental|deprecated),
`decisionLogRefs`.

## Platform transforms (as data)

Deterministic rules, not code, so codegen *and* the scorer apply the same mapping:

- **web:** `cssVar = '--' + kebab(id)` (`color.action.primary → --color-action-primary`); scalar
  tokens also expose a typed accessor `token.<path>` returning `var(--…)`; typography composites
  apply via `<Text variant>`; shadows assemble into a single `--shadow-<name>`.
- **swift:** `space.* → DS.Spacing.<seg>`, `radius.* → DS.Radius.<seg>`,
  `size.control.* → DS.Size.control<Cap>`, `fontSize.* → DS.FontSize.<seg>`,
  semantic `color.* → Color.ds<Camel>`, `type.* → .dsType(.<preset>)`/`Font.ds<Cap>`,
  `shadow.* → .dsShadow(.<name>)`.

## Validation (eager, before any codegen)

Every token has `$type` + `$value`; all `{refs}` resolve; no circular refs; primitives contain no
refs; composites carry their required sub-keys (typography: fontSize/fontWeight/lineHeight; shadow:
offsetX/offsetY/blur/spread/color); names match the declared convention; every component has the
required minimum fields. The harness `harness/lib/manifest.js` implements this; `node harness/codegen.js`
fails the build on any violation.
