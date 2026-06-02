# Design System Consistency Framework

**A cross-stack framework that teaches an AI to *reuse* a design system instead of re-inventing it —
and a harness that proves it reaches ~99% consistency.**

This builds on the v1 SwiftUI sketch (`Design System Consistency Framework.md`) and generalizes it:
the same insight (consistency is a **retrieval** problem before a creation problem), now stack-agnostic
(web + SwiftUI), grounded in one machine-queryable manifest, and — critically — **measured**.

## The thesis

Most AI UI drift is blamed on taste. It isn't. ~70% is **retrieval failure** (the token/component
existed but wasn't in context, so the model re-invented it), plus **stateless re-invention** across
sessions and **sampling variance** within them. The fix is not "be consistent" — it's to make the
right value *cheaper to retrieve than to invent*, persist every decision in one manifest, and **gate
creation behind mandatory retrieval**. Do that and independent agents converge on the same UI.

## What's here

```
framework/                  ← THE DELIVERABLE (the generalized skill)
  SKILL.md                  core, stack-agnostic framework
  PROTOCOL.md               the gated convergence protocol (retrieve → reuse → snap → register)
  MANIFEST_SCHEMA.md        the one-manifest contract
  METRIC.md                 the composite consistency score, defined precisely
  adapters/web.md           React + CSS-vars/Tailwind instantiation
  adapters/swiftui.md       SwiftUI instantiation (supersedes the v1)

reference/                  ← a real, small "Aperture DS" used to test the framework
  design-system.json        one manifest: 100+ tokens (3 tiers) + 16 component entries (web+swift)
  web/ds/*.tsx              8 React components (tsc --strict clean, token-only)
  swiftui/DS/**/*.swift     8 SwiftUI components (whole-module typecheck clean)
  (tokens.css / tokens.ts / DS.swift are code-GENERATED from the manifest)

harness/                    ← the measurement rig
  lib/manifest.js           load / validate / resolve / transform (one manifest, two emitters)
  codegen.js                manifest → CSS vars + token.ts + Tailwind @theme + DS.swift
  scorer/                   the composite scorer (TA / CR / VC / CC) + a validated self-test
  tasks/tasks.json          6 composite UI-build tasks
  cheatsheet.js             emits the per-stack "manifest query result" agents retrieve

runs/                       ← evidence: generated UI + scored reports (baseline vs framework)
research/                   ← the grounded design brief + resolved decisions
docs/RESULTS.md             ← the headline numbers and what they mean
```

## The measured result

A composite score — `0.40·TA + 0.30·CR + 0.20·VC + 0.10·CC` — over UI built by **independent agents**:
**T**oken **A**dherence, **C**omponent **R**euse, **V**alue **C**lustering, and **C**ross-session
**C**onvergence (do blind agents produce the same thing?). Same 6 tasks, built cold (baseline) vs.
with the framework, on both stacks:

| Condition | Token Adherence | Component Reuse | Value Clustering | Convergence | **Composite** |
|---|---|---|---|---|---|
| Baseline (cold generation) | ~0% | ~0% | ~40% | — | **~9%** |
| **With framework** | **100%** | **100%** | **100%** | **~97%** | **~99.7%** |

See [`docs/RESULTS.md`](docs/RESULTS.md) for the full per-stack, per-task breakdown and methodology.

## Reproduce it

```bash
cd harness && npm install            # Babel + postcss parsers
node codegen.js                      # regenerate token files from the manifest (validates it)
node cheatsheet.js                   # regenerate the per-stack usage cheatsheets
node scorer/score.test.js            # validate the scorer (good=100 / bad=18 fixtures)
node scorer/score.js ../runs/run2    # score a run directory
```

The UI generation itself is driven by an agent workflow (see `harness/RUNNING.md`); the scorer reads
the resulting files statically, so the numbers are reproducible from the committed `runs/`.
