# Quality verification

Use Nx through the workspace package manager. These checks cover component
behavior, Angular forms, Storybook interactions and full Showcase flows.
Confirmed totals live in [Verification](qa/VERIFICATION.md), and supported
platforms/limits in [Support matrix](qa/SUPPORT_MATRIX.md).

## Baseline checks

```sh
npm run format:check
npm run lint
npm run test
npm run typecheck
npm run build
npm exec -- nx run packages:build
npm exec -- nx run packages:smoke
npm exec -- nx run packages:check-release
npm exec -- nx run packages:check-readiness
node tools/docs/check-links.mjs
node tools/docs/check-writing.mjs
node --test tools/docs/check-writing.spec.mjs
```

The Docs workflow runs the link and writing checks and the writing-check tests.
The writing check covers selected [ASD-STE100 clarity rules](content/WRITING.md).
It does not replace a person's examination of meaning or technical accuracy.

UI/Showcase unit coverage gates are 90% for statements, branches, functions
and lines. Tokens and the placeholder Storybook app must reach 100%.
Production Showcase budgets are 500kB warning/1MB error for the initial bundle
and 6kB warning/8kB error for a component stylesheet. These budgets do not
measure an isolated consumer's tree-shaken library cost.

## Storybook checks

```sh
npm exec -- nx run ui:test-storybook
npm exec -- nx run ui:test-storybook-dev
```

Run these sequentially: both test runners use port 4500. The static target
checks the production Storybook; the development target exercises live
Webpack middleware and compiler/runtime isolation. Accessibility failures
remain errors. Jest is bounded to two workers; runner-owned child processes
are cleaned up on termination.

Keep normal previews on port 4400. Development output is isolated per port,
and the live runner checks its own compiler/runtime hash before and after
testing. It also checks the default preview if one is present. See
[the reload incident](qa/STORYBOOK_RELOAD_REGRESSION.md) and
[contributor requirements](governance/CONTRIBUTING.md#keep-live-storybook-previews-isolated).

## Browser and visual checks

Run functional/axe checks in Chromium, Firefox and WebKit, excluding all six macOS
visual title prefixes:

```sh
npm exec -- nx run showcase-e2e:e2e -- --project=chromium --project=firefox --project=webkit --grep-invert="recipes visual|component expansion visual|product tools visual|workflow visual|advanced layout visual|larger features visual"
```

Run the visual suite on macOS Chromium:

```sh
npm exec -- nx run showcase-e2e:e2e -- --project=chromium --grep="recipes visual|component expansion visual|product tools visual|workflow visual|advanced layout visual|larger features visual"
```

Use the visual command with `--update-snapshots` only when deliberately
examining new baselines; narrow the grep to the new states. Commit examined
PNG files. CI compares snapshots and never updates them automatically.
Linux functional checks do not establish macOS pixel parity.

Showcase axe scans use `wcag2a`, `wcag2aa`, `wcag21a` and `wcag21aa`:
WCAG 2.1 A/AA, with no WCAG 2.2 conformance claim. Storybook uses axe's
ordinary enabled rules. Open overlay, validation, selection and assistant
states extend the closed-route scans.

The seven larger features have 640px LTR, 320px LTR and 320px RTL reflow
checks in all three engines. Four forced-colors interaction cases run in Chromium
and intentionally skip Firefox and WebKit. Axe runs after restoring default colors
because of the forced-colors contrast calculation limitation. Native
`details.name` grouping is asserted through repeated keyboard and click use.
See [Acceptance automation](qa/ACCEPTANCE_AUTOMATION.md) for the focused
command, assertions and limits.

Actual Chrome 200%/400% zoom was inspected for the seven larger features.
See [readiness evidence and maintainer instructions](qa/READINESS.md).
VoiceOver/NVDA, real Windows contrast themes, text-only zoom and other zoom combinations remain open.
Physical touch and native picker dialogs are also unreviewed.
Follow the [manual checklist](../MANUAL_QA.md).

## Storybook runner compatibility

Storybook 10 loads its usual `test-runner.ts` through a process-wide Node loader, which Jest 30.5 rejects inside its test sandbox. The documented custom Jest configuration in `.storybook/test-runner-jest.config.mjs` keeps the stock story transforms and browser environment, and replaces only the hook-loading setup. `test-runner.hooks.ts` keeps the existing desktop/mobile viewport selection; `runner-jest-setup.mjs` registers it with the runner's exported `setPreVisit` and `setupPage`. Interaction and accessibility assertions remain enabled. Examine this adapter when the upstream loader integration changes. See [Storybook test runner configuration](https://storybook.js.org/docs/writing-tests/integrations/test-runner#configure).

The runner limits Jest to two workers. It gives five minutes for the production build/server to become ready. If that child exits early, the run fails. On termination, the runner removes its own Unix process group.
