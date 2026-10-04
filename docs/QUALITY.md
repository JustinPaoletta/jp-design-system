# Quality verification

Unit tests cover component behavior and Angular form integration. Storybook interaction tests cover primitive compositions. Showcase tests exercise full application flows outside Storybook.

The supported accessibility target and its limits are in [the QA support matrix](qa/SUPPORT_MATRIX.md). Showcase axe asserts **WCAG 2.1 A/AA** (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`). It does not assert WCAG 2.2. The README's "WCAG A/AA" line does not name a version; the tags above are the automated level. VoiceOver and NVDA are the intended readers and have not been reviewed. JAWS is out of scope. No manual screen reader review is claimed here.

`quality.spec.ts` runs those axe tags against closed Showcase routes and stores visual baselines. `a11y-states.spec.ts` runs the same tags against an open dialog, menu, popover, combobox list, validation error, selected table row, active tab, and assistant response, and checks keyboard open/close plus reduced-motion transitions on the shell and assistant panel. Chromium and WebKit run functional and axe checks in CI on Linux. The visual job runs on macOS Chromium. Baselines are platform-specific; macOS screenshots do not prove Linux visual parity.

## Visual matrix

| States                                                                                      | Accents         | Densities           | Browser        |
| ------------------------------------------------------------------------------------------- | --------------- | ------------------- | -------------- |
| Product recipes page (full page, 1280×900)                                                  | neon and cobalt | default and compact | macOS Chromium |
| Mobile shell (390×844), open delete dialog, seeded assistant response, settings email error | neon only       | default only        | macOS Chromium |

The four extra states are single-theme so runtime stays bounded. Their titles still contain `recipes visual`.

Run functional and axe checks in both browsers, excluding the macOS-only visual suite:

```sh
npx nx run showcase-e2e:e2e -- --project=chromium --project=webkit --grep-invert="recipes visual|component expansion visual|product tools visual|workflow visual"
```

Run every reviewed visual baseline, including the four single-theme states, on macOS Chromium:

```sh
npx nx run showcase-e2e:e2e -- --project=chromium --grep="recipes visual|component expansion visual|product tools visual|workflow visual"
```

Use that same macOS Chromium command with `--update-snapshots` only to deliberately review and establish baselines, then commit the reviewed PNG files. CI never updates baselines automatically. Narrow the grep to new titles when adding snapshots so existing recipe PNGs are not rewritten. Review accessible names, focus order, nested overlay dismissal, contrast, reduced motion, and mobile layout manually as well; automated checks do not replace assistive-technology testing. Reduced motion is only partially automated (shell sidebar, collapse toggle, and assistant surface). 200% zoom, 400% zoom, and Windows forced colors are manual and were not run.

## CI follow-up

The CI workflow selects recipe and component-expansion visual titles in the macOS job, and excludes both from Linux functional runs.

Product-tools visual titles follow the same split. Eight new macOS Chromium
baselines cover neon/cobalt at default/compact density, mobile LTR/RTL, invalid
wizard submission, and an open overflow panel. Existing screenshots include the
new Product tools navigation item. Functional tests cover both Chromium and
WebKit, including native slider keys, exact entry, wizard focus/recovery,
nested completion, and overflow focus. WebKit uses Option+Tab for native link
navigation; the test does not force Chromium's Tab convention on it.

The macOS visual job already runs:

```sh
npx nx run showcase-e2e:e2e -- --project=chromium --grep="recipes visual|component expansion visual|product tools visual|workflow visual"
```

These titles match that grep:

- `recipes visual neon default`
- `recipes visual neon compact`
- `recipes visual cobalt default`
- `recipes visual cobalt compact`
- `recipes visual neon default mobile shell`
- `recipes visual neon default open dialog`
- `recipes visual neon default assistant response`
- `recipes visual neon default settings error`

The Linux functional job uses `--grep-invert="recipes visual|component expansion visual|product tools visual|workflow visual"`, so the new screenshots stay on the macOS job. Interaction tests in `a11y-states.spec.ts` do not use that phrase, so the existing Chromium and WebKit functional job already includes them.

Application production budgets cap the initial bundle and component stylesheet sizes. Distribution smoke checks validate built packages in an isolated application without workspace path aliases.

## Storybook runner compatibility

Storybook 10 loads its usual `test-runner.ts` through a process-wide Node loader, which Jest 30.5 rejects inside its test sandbox. The documented custom Jest configuration in `.storybook/test-runner-jest.config.mjs` retains the stock story transforms and browser environment, and replaces only the hook-loading setup. `test-runner.hooks.ts` keeps the existing desktop/mobile viewport selection; `runner-jest-setup.mjs` registers it with the runner's exported `setPreVisit` and `setupPage`. Interaction and accessibility assertions remain enabled. Revisit this adapter when the upstream loader integration changes. See [Storybook test runner configuration](https://storybook.js.org/docs/writing-tests/integrations/test-runner#configure).

The local runner limits Jest to two workers, allows five minutes for the production build/server to become ready, fails early if that child exits, and cleans up its own Unix process group on termination.

## Live development middleware

`npx nx run ui:test-storybook-dev` runs the same interaction/accessibility suite against the live localhost Storybook development server. This exercises Webpack development middleware, which the static production Storybook check does not use. It retains the bounded workers/readiness timeout and cleans up its own processes. Run the static and live targets sequentially because they use the same port. CI runs both to validate the scoped security override when dependencies change.

Development output is isolated by server port. Storybook otherwise shares its
disk bundle directory across servers for the same configuration; the patched
middleware serves those disk assets, so a test server on 4500 could overwrite
the runtime used by a preview on 4400 and cause continuous HMR reloads. The live
runner compares each server's HMR compiler hash with its served runtime before
and after the suite. When the default preview on 4400 is already running, it
checks that preview too. Production output keeps its usual directory.

## Component expansion coverage

`component-expansion.spec.ts` exercises search/password controls, form recovery,
native disclosures, multi-selection, drawer focus, WCAG 2.1 A/AA axe checks, and
mobile RTL layout in Chromium and WebKit. Theme checks use reduced motion so
contrast is measured on the settled theme.

`component-expansion-visual.spec.ts` adds eight macOS Chromium baselines: the full
page in neon/cobalt and default/compact density; mobile LTR and RTL; a desktop
drawer; and a mobile RTL drawer. Both drawer screenshots capture the viewport
rather than expanding the viewport over the full underlying page.

Second-batch coverage and limits are recorded in [PRODUCT_TOOLS.md](qa/PRODUCT_TOOLS.md). The catalogue has 231 Storybook checks; the new page adds seven browser scenarios per supported browser and eight macOS Chromium visual states.

## Everyday workflow verification

See [the workflow QA record](qa/WORKFLOWS.md) for command/menu keyboard and focus, async-save cancellation, native temporal validation, upload/inbox state handling, and the expanded visual/browser matrix.
