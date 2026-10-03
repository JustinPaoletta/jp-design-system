# Quality verification

Unit tests cover component behavior and Angular form integration. Storybook interaction tests cover primitive compositions. Showcase tests exercise full application flows outside Storybook.

`quality.spec.ts` runs axe against real rendered routes for WCAG A/AA violations and stores visual baselines for both accents and densities. Chromium and WebKit run in CI. The visual job runs on macOS to match the reviewed Mac snapshots. Functional and axe checks run on Linux Chromium and WebKit. Baselines are platform-specific; macOS screenshots do not prove Linux visual parity.

Run functional and axe checks in both browsers, excluding the macOS-only visual suite:

```sh
npx nx run showcase-e2e:e2e -- --project=chromium --project=webkit --grep-invert="recipes visual"
```

Run the four reviewed visual baselines on macOS Chromium:

```sh
npx nx run showcase-e2e:e2e -- --project=chromium --grep="recipes visual"
```

Use that same macOS Chromium command with `--update-snapshots` only to deliberately review and establish baselines, then commit the reviewed PNG files. CI never updates baselines automatically. Review accessible names, focus order, nested overlay dismissal, contrast, reduced motion, and mobile layout manually as well; automated checks do not replace assistive-technology testing.

Application production budgets cap the initial bundle and component stylesheet sizes. Distribution smoke checks validate built packages in an isolated application without workspace path aliases.

## Storybook runner compatibility

Storybook 10 loads its usual `test-runner.ts` through a process-wide Node loader, which Jest 30.5 rejects inside its test sandbox. The documented custom Jest configuration in `.storybook/test-runner-jest.config.mjs` retains the stock story transforms and browser environment, and replaces only the hook-loading setup. `test-runner.hooks.ts` keeps the existing desktop/mobile viewport selection; `runner-jest-setup.mjs` registers it with the runner's exported `setPreVisit` and `setupPage`. Interaction and accessibility assertions remain enabled. Revisit this adapter when the upstream loader integration changes. See [Storybook test runner configuration](https://storybook.js.org/docs/writing-tests/integrations/test-runner#configure).

The local runner limits Jest to two workers, allows five minutes for the production build/server to become ready, fails early if that child exits, and cleans up its own Unix process group on termination.

## Live development middleware

`npx nx run ui:test-storybook-dev` runs the same interaction/accessibility suite against the live localhost Storybook development server. This exercises Webpack development middleware, which the static production Storybook check does not use. It retains the bounded workers/readiness timeout and cleans up its own processes. Run the static and live targets sequentially because they use the same port. CI runs both to validate the scoped security override when dependencies change.
