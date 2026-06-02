# Running the harness

## What measures consistency
`scorer/score.js <runsDir>` parses every generated file under `<runsDir>/<condition>/<task>/*.{tsx,swift}`
and reports the composite score per condition (and a both-stacks aggregate). It needs only
`reference/_resolved.json` (produced by `node codegen.js`) — it never executes the generated UI, so
results are deterministic and reproducible from committed files.

```bash
npm install                       # once: Babel + postcss
node codegen.js                   # manifest → token files + _resolved.json (also validates manifest)
node cheatsheet.js                # manifest → per-stack USAGE.md (the retrieval "query result")
node scorer/score.test.js         # validate the scorer itself (fixtures: good=100, bad≈18)
node scorer/score.js ../runs/run2 --json ../runs/run2/report.json
```

## How UI is generated (the experiment)
Generation is driven by an agent workflow (one independent agent per file), not a script that calls a
model API — so it runs inside an agentic harness. Each agent is told to **write one file to an exact
path**; the scorer reads those files. Conditions:

- **baseline** — the task only ("build this React component / SwiftUI view, style it nicely"). No
  manifest, no components: cold generation, the AI default. Agents hand-roll and drift.
- **framework** — the agent first reads `reference/<stack>/USAGE.md` (the design-system query result)
  and `framework/SKILL.md` (the protocol), then must reuse registered components, set type only via
  `<Text>`/`DSText`, set spacing only via `<Stack>`/`DSStack`, and reference tokens for anything else.

Layout convention: `runs/<run>/<condition>-<stack>/<task>/agent-<k>.<ext>`. Multiple agents per task
(N≥3) enable the cross-session convergence (CC) metric. Both conditions use the **same styling
medium** (inline styles / SwiftUI modifiers) so the only variable under test is whether values
reference the design system.

The exact workflow scripts used are under the session's `workflows/scripts/` (dc-run1, dc-run2); the
prompts are embedded there. To re-run, re-issue the workflow with a fresh `runs/<id>` path.

## Visual proof (optional)
`node render/build-gallery.mjs <task>` esbuild-bundles the *actual* generated files for a task
(framework vs baseline) against the real DS into `render/dist/gallery-<task>.html`. Serve the dir
(`python3 -m http.server` — `file://` is blocked in headless Chromium) and screenshot to see whether
the measured convergence is visually real. Sample outputs are in `docs/images/`.

## Iterating the framework
The score is a feedback loop. When a sub-metric lands below target, the per-file offender list
(`literals[...]`, `missed: [...]`) localizes the cause; sharpen the framework/manifest, regenerate,
re-run, re-score. Run1→Run2 did exactly this: the only sub-99 residual (cross-session convergence)
traced to the framework offering *two* valid spacing paths, so the "one canonical path per decision"
rule was added and re-tested.
