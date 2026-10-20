# Verification evidence

## October 20, 2026 Select popup correction

Select, schedule time zones and chart categories now use the same themed option list.
The [design inspection](../../design-qa.md#select-popup-correction) records the visual checks.

| Check                      | Result                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| UI unit tests              | 508 tests in 99 suites pass with coverage gates.                                                             |
| Showcase unit tests        | 59 tests in 13 suites pass with coverage gates.                                                              |
| Live Storybook             | 367 stories in 97 suites pass. Compiler and runtime isolation checks pass.                                   |
| Affected browser checks    | 169 checks pass across Chromium, Firefox and WebKit. Eight forced-colors cases remain intentionally skipped. |
| macOS Chromium visuals     | All 87 comparisons pass. The inspection covers 18 changed and three new baselines.                           |
| Installed package consumer | All 18 browser, accent and density combinations pass.                                                        |
| Source checks              | UI, Showcase and browser-test lint pass. Angular type checks pass.                                           |

The browser checks cover form selection, save, cancel, reset, timezone conversion and chart categories.
They also cover open-list accessibility, viewport bounds, forced colors and RTL.
The package checks cover the published Select export, reactive forms, disabled choices, form data and resets.

The calendar review regression failed before correction.
The weekly grid now uses the earliest visible time across all seven days.
This includes an overnight appointment that continues at midnight.
All 39 scheduling browser checks pass after this correction.

A prior overflow screenshot failure also reproduced locally.
Shared overlays now align their positions to device pixels.
The overflow test passes five consecutive runs after this change.
The test also waits for fonts before opening the panel.
CI retains visual differences from the hidden output directory.

Chrome captures confirm open-menu styling and spacing at 320px.
A nested menu stays visible beyond a clipped dialog.
Escape closes that menu while the dialog remains open.
These checks do not establish manual screen-reader or physical-device acceptance.

## October 19, 2026 remaining component inspection

The [design inspection](../../design-qa.md#remaining-component-inspection) covers all 97 Storybook groups.
Chrome captures show one representative story per group at 1000px and 320px widths.
All 194 final captures fit the page width.
The capture waits for each story to finish its interactions and accessibility checks.

| Check                              | Result                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| UI unit tests                      | 503 tests in 99 suites pass with coverage gates.                                                       |
| Showcase unit tests                | 59 tests in 13 suites pass with coverage gates.                                                        |
| Token unit tests                   | 17 tests in two suites pass.                                                                           |
| Static Storybook                   | 363 stories in 97 suites pass.                                                                         |
| Live Storybook                     | The same 363 stories pass. Compiler and runtime isolation checks pass.                                 |
| Browser behavior and accessibility | 418 checks pass across Chromium, Firefox and WebKit. Eight forced-colors cases have intentional skips. |
| macOS Chromium visuals             | All 84 comparisons pass. All 22 changed baselines were inspected.                                      |
| Installed package consumer         | All 18 browser, accent and density combinations pass.                                                  |
| Source checks                      | UI, Showcase, browser-test and token lint pass. Angular type checks pass.                              |

Additional Chrome checks cover upload recovery, assistant cancellation and retry, image recovery, and open overflow panels.
Escape returns focus to the avatar and breadcrumb triggers.
Avatar initials remain visible during a withheld image request. The loaded photo preserves the frame size.
Dashboard metric values share the same vertical position at 320px.

The focus regressions failed before correction.
Six added unit cases cover input changes that remove overflow content and preserve focus outside the component.
Chrome also confirms focus restoration after live avatar and breadcrumb input changes.
The settings regressions cover edits during a pending save and changes after a successful save.

Documentation writing checks, their 12 tests, local links, formatting and token guards pass.

These results do not establish screen-reader, Windows or physical-device acceptance.
The five promotion and integration tasks remain in the [task list](../../COMPONENT_EXPANSION_PLAN.md).

## October 19, 2026 component-wide Card adaptation

The [design inspection](../../design-qa.md#component-wide-card-adaptation) covers 20 components and two compositions.
Chrome captures show 22 views at 1000px and 320px widths.
The captures have no horizontal page overflow.
Code blocks and wider tables retain their internal scroll regions.

| Check                              | Result                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| UI unit tests                      | All 482 tests in 98 suites pass with coverage gates.                                                   |
| Showcase unit tests                | All 57 tests in 13 suites pass with coverage gates.                                                    |
| Live Storybook                     | All 351 stories in 97 suites pass. Runtime isolation checks pass.                                      |
| Browser behavior and accessibility | 418 checks pass across Chromium, Firefox and WebKit. Eight forced-colors cases have intentional skips. |
| Source checks                      | UI, Showcase and browser-test lint pass. Angular type checks pass.                                     |
| macOS Chromium visuals             | All 84 comparisons pass after inspection of 67 changed baselines.                                      |

The new regressions check tab visibility after selection and resize, including RTL calculations and observer cleanup.
Tree checks retain independent description and retry behavior.
Narrow table checks cover selection bounds, fixed geometry and access to the last row.
Notifications demonstrate read, unread, dismissal and mark-all actions.

After the tab and table corrections, 81 affected browser checks pass across all three engines.
Actual Chrome checks confirm RTL tab visibility without document scrolling.
The narrow table keeps its selected checkbox inside the cell and retains its 48px row height.

The final profile and assistant corrections pass 39 browser checks across the same engines.
The Showcase production build passes without component style-budget warnings.
Documentation writing checks, their 12 tests, local links, formatting and token guards pass.

These checks do not replace screen-reader, Windows or physical-device inspection.
The dated evidence below retains its original scope.

## October 19, 2026 form and roster adaptation

The form and roster use the approved Card direction.
The [design inspection](../../design-qa.md#form-and-roster-adaptation) describes the changes and Chrome captures.

| Check                            | Result                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------ |
| UI unit tests                    | All 478 tests in 98 suites pass with coverage gates.                           |
| Showcase unit tests              | All 57 tests in 13 suites pass with coverage gates.                            |
| Live Storybook                   | All 340 stories in 97 suites pass. Runtime isolation checks pass.              |
| Form and roster browser behavior | All 15 checks pass across Chromium, Firefox and WebKit.                        |
| Form and roster accessibility    | All six automated WCAG AA checks pass across the same engines.                 |
| Final table CSS checks           | All 42 advanced-layout and roster browser checks pass across the same engines. |
| Source and build checks          | Scoped lint, Angular types and the Showcase production build pass.             |

Form checks cover projected controls, saved values, Cancel, Reset, Delete and density changes.
The save action keeps values and clears the form's dirty state.
Roster checks cover filtering, native table semantics and phone reflow.
The examples keep changes only while the page or story remains open.

Chrome inspection covers 1440px desktop, 390px phone and 320px narrow viewports.
Keyboard activation saves the form and retains a visible focus ring.
Automated accessibility checks do not replace screen-reader inspection.
This evidence covers the form and roster group. The dated results below retain their original scope.

## October 19, 2026 Card reference

The [Card reference review](../../design-qa.md#card-reference-review) limits the next design decision to one component.
Chrome inspection covers the desktop card, a 390px phone viewport and long text at 320px.
Keyboard activation saves the example recap and shows confirmation text.
The focus ring remains visible. These views have no horizontal page overflow.

All 478 UI unit tests pass with coverage gates.
Live Storybook passes 338 stories in 97 suites, including four Card stories and runtime isolation checks.
UI lint, Angular types and the Showcase production build pass.
All 84 macOS Chromium visual comparisons pass after baseline inspection.
The earlier refinement checks below have their own scope.

The user subsequently approved the Card direction. Further component groups need their own inspection.

## October 19, 2026 design refinement

The second [design inspection](../../design-qa.md) covers the font, dashboard, form, roster and calendar changes.
The token package supplies Inter and its license.
Chrome captures show the revised compositions at desktop and phone widths.

| Check                              | Result                                                                                                |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| UI unit tests                      | 478 tests in 98 suites pass.                                                                          |
| Showcase unit tests                | 54 tests in 12 suites pass.                                                                           |
| Token unit tests                   | 17 tests in two suites pass.                                                                          |
| Source checks                      | UI, Showcase, tokens and browser-test lint pass. Angular type checks pass.                            |
| Static and live Storybook          | Each run passes 335 stories in 97 suites. Live compiler/runtime isolation checks pass.                |
| Browser behavior and accessibility | 412 tests pass across Chromium, Firefox and WebKit. Eight forced-colors cases have intentional skips. |
| Installed package consumer         | All 18 browser, accent and density combinations pass, including the Inter font load check.            |

The Showcase production build passes without component style-budget warnings.
Calendar tests check readable event rows, focus during layout changes and clock-change ordering.
The roster keeps its native table caption while hiding the repeated visible heading.
Form tests check that preview density changes preserve entered values.

These automated results do not replace visual approval or the remaining manual inspections.
The first audit results below remain as dated history.

## October 19, 2026 visual audit changes

The [design inspection](../../design-qa.md) records the visual changes and Chrome captures.
The [visual style guide](../content/VISUAL_STYLE.md) defines shared sizes, surfaces and screenshot states.
Local checks use Node 24.21.0 on macOS.

| Check                              | Result                                                                                                |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| UI unit tests                      | 474 tests in 98 suites pass. Statement coverage is 98.08%.                                            |
| Showcase unit tests                | 58 tests in 11 suites pass. Statement coverage is 98.85%.                                             |
| Token unit tests                   | 17 tests in two suites pass with full coverage.                                                       |
| Source checks                      | UI, Showcase, tokens and browser-test lint pass. Angular type checks pass.                            |
| Static and live Storybook          | Each run passes 335 stories in 97 suites. Live runtime isolation checks pass.                         |
| Browser behavior and accessibility | 406 tests pass across Chromium, Firefox and WebKit. Eight forced-colors cases have intentional skips. |
| macOS Chromium visuals             | 84 inspected baseline comparisons pass.                                                               |
| Installed package consumer         | All 18 browser, accent and density combinations pass.                                                 |
| Generated tokens                   | Source and generated artifacts match. Color and token guards pass.                                    |

The Showcase production build passes without component style-budget warnings.
Calendar regressions cover overlapping appointments, bounded all-day content, full mobile titles and clock changes.
After the final calendar changes, 36 related browser checks pass across all three engines.
The isolated package consumer uses Angular 22.2.1 and real local tarballs.
Its source has no workspace aliases or package symlinks.

The checks do not approve API maturity or a release.
Screen-reader, Windows and physical-device inspections remain in the [task list](../../COMPONENT_EXPANSION_PLAN.md).

## October 19, 2026 baseball records

Storybook and Showcase now use the [2024 Dodgers and Yankees records](../content/BASEBALL_EXAMPLES.md).
World Series Game 5 ended Dodgers 7, Yankees 6, with seven Dodgers hits and no Dodgers errors.
The October 12 inspection below records the earlier fictional copy.

## October 12, 2026 baseball examples

On October 12, Storybook and Showcase used fictional baseball copy.
The game dashboard showed a 5–3 Falcons win, nine hits and no errors.
Related examples use the same players, roles, positions and availability labels.
The [design inspection](../../design-qa.md) records desktop and mobile Chrome captures.

| Check                     | Result                                            |
| ------------------------- | ------------------------------------------------- |
| Source checks             | 463 UI tests and 58 Showcase tests pass.          |
| Lint and Angular types    | UI, Showcase and browser-test source checks pass. |
| Static and live Storybook | 320 stories in 97 suites pass in each run.        |
| macOS Chromium visuals    | 84 inspected baseline comparisons pass.           |
| Isolated package consumer | 18 browser, accent and density combinations pass. |

The Showcase production build passes.
Chart tests check whole-number decimal ticks and fractional percentage ticks.
Live Storybook compiler/runtime isolation checks pass.
Chromium passes 138 behavior and accessibility tests.
Firefox and WebKit each pass 134 tests, with four intentional forced-colors skips in each engine.

## October 11, 2026 design refresh

The default accent is now `gold`. Explicit `neon` and `cobalt` accents remain available.
The [design inspection](../../design-qa.md) records the reference comparison and local browser checks.

| Check                               | Result                                                   |
| ----------------------------------- | -------------------------------------------------------- |
| Static and live Storybook           | 320 stories in 97 suites pass in each run.               |
| Chromium behavior and accessibility | 138 tests pass.                                          |
| Firefox behavior and accessibility  | 134 tests pass; four forced-colors checks are skipped.   |
| WebKit behavior and accessibility   | 134 tests pass; four forced-colors checks are skipped.   |
| macOS Chromium visual checks        | 84 baselines cover all three accents and both densities. |
| Isolated package consumer           | 18 browser, accent and density combinations pass.        |

Earlier dated records below retain their original counts and theme scope.

This page keeps dated evidence for the component expansion and readiness changes.
Test totals apply to the stated revisions and selections.
Later changes need their own checks.

## October 8 local readiness evidence

Local checks used Node 24.21.0 on macOS.
The readiness change adds Firefox, native overlay fallback tests and installed consumer runtime flows.
See [Readiness](READINESS.md) for scope and the maintainer's completion steps.

| Check                        | Local result                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| UI unit tests                | 461 tests / 98 suites; 98.11% statements, 91.18% branches, 95.61% functions, 98.89% lines                          |
| Live Storybook               | All 319 checks / 97 suites passed; compiler/runtime isolation guards passed                                        |
| Static Storybook             | All 319 checks / 97 suites passed                                                                                  |
| Development dependency audit | Handlebars 4.7.10 clears critical findings; 38 package findings remain from two unpatched development dependencies |
| Runtime dependency audit     | No vulnerabilities in the runtime-only audit                                                                       |
| Visual regression            | All 66 macOS Chromium comparisons passed without baseline changes                                                  |
| Functional and accessibility | 406 passed across Chromium/Firefox/WebKit; eight intentional forced-colors skips                                   |
| Overlay fallbacks            | All 18 missing/throwing native API cases passed; included in the functional total                                  |
| Installed consumer           | All 12 browser/accent/density combinations passed; Angular 22.2.1; no workspace aliases or symlinks                |
| API evidence inventory       | 113 public classes; 36 stable, 76 preview, one deprecated; seven guard tests passed                                |
| Release preparation          | Seven safety tests and the `0.1.0-rc.1` dry-run passed; release files were unchanged                               |
| All project unit checks      | UI, Showcase, tokens and the placeholder Storybook application passed their coverage gates                         |
| Build, lint and types        | All repository production builds, all project lint, token guards/drift and Angular type/template checks passed     |
| Documentation                | 55 maintained documents and 12 writing-helper tests passed; no broken local links                                  |
| Actual Chrome zoom           | Eight route/zoom inspections passed at 200%/400%; limited neon/default/LTR scope                                   |

The first combined browser run reached 401 passes before Firefox disk-space failures.
The complete Firefox selection then passed alone: 134 passes and four intentional skips.
Chromium and WebKit had no failed cases in the combined run.
These results give 406 successful distinct functional cases across the three engines.

Consumer runtime dependencies are isolated.
Its build reuses the workspace compiler tools, whose versions are recorded in the report.
Neither passing tests nor evidence-file presence approves an API promotion.

## October 9 hosted readiness evidence

Revision `b31915546a98f8ccd2cfeb85219b2030a1c995a5` passed
[CI](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37880218175)
and [documentation checks](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37880218165).
The UTC completion date was October 9, 2026.

The hosted functional selection passed 406 cases and skipped eight forced-colors cases intentionally.
All 66 macOS Chromium visual comparisons passed.
All 12 installed consumer combinations passed.
Static and live Storybook each passed 319 checks in 97 suites.
Lint, unit coverage, builds, type checks, API evidence and runtime audit also passed.

These results apply to that revision.
Later documentation or source changes need their own checks.

## October 4 confirmed revisions

- Feature implementation `88f69e22c934e3172a2375d72bd7d8ce8d03b282`:
  [successful CI](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37244858852).
- Acceptance/release automation `366c0b31b0208103b44d89701397b12d3680fddd`:
  [successful CI](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37249933305)
  and [successful documentation checks](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37249933329).

The second revision adds tests and release safety checks; it does not change
component behavior. This record is evidence for those commits, rather than a
prediction that every later commit passes CI.

## October 4 results

| Check                            | Confirmed result                                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| UI unit tests                    | 458 tests / 97 suites; 98.15% statements, 91.22% branches, 95.61% functions, 98.89% lines at the feature revision                |
| Showcase unit tests              | 58 tests / 11 suites; 98.85% statements, 91.46% branches, 99.40% functions, 99.62% lines at the feature revision                 |
| Token unit tests                 | 17 tests / 2 suites; 100% coverage at the feature revision                                                                       |
| Static Storybook                 | 319 interaction/accessibility checks / 97 suites at the automation revision                                                      |
| Live Storybook                   | The same 319 checks / 97 suites; compiler/runtime isolation guards passed                                                        |
| Browser functional/accessibility | 260 passed, 4 intentional WebKit forced-colors skips across Chromium/WebKit in Linux CI                                          |
| Visual regression                | 66 macOS Chromium PNG comparisons passed                                                                                         |
| Release preparation              | 7 Node tests passed, including dry-run immutability and rollback                                                                 |
| Documentation writing            | 54 maintained documents pass the local clarity check; 12 writing-check tests pass. These results cover the documentation update. |
| Package consumer                 | Isolated Angular 22.2.1 tarball consumer compiled without workspace aliases                                                      |
| Build and lint                   | Hosted production builds, type/template checks, formatting/token guards and lint passed                                          |
| Runtime dependency audit         | No findings in the October 4 runtime-only audit; development-tool remainder is in [Security inspection](../SECURITY_REVIEW.md)   |

The focused local acceptance selection passed 30 browser checks and skipped
four WebKit cases. It includes 24 reflow cases, four Chromium forced-colors
cases and two strengthened native disclosure cases. Those tests are included
in the hosted browser total above.

## Visual matrix

All baselines use macOS Chromium with reduced motion/disabled screenshot
animations. Counts are examined PNG comparisons, not component coverage.

| Group               | Count | Scope                                                                                                                       |
| ------------------- | ----: | --------------------------------------------------------------------------------------------------------------------------- |
| Recipes             |     8 | Neon/cobalt × default/compact full page; neon/default mobile shell, dialog, assistant response and validation error         |
| Component expansion |     8 | Both accents/densities, mobile LTR/RTL, desktop drawer and mobile RTL drawer                                                |
| Product tools       |     8 | Both accents/densities, mobile LTR/RTL, invalid wizard submission and open overflow panel                                   |
| Workflows           |    10 | Both accents/densities, mobile LTR/RTL, command palette, context menu, failed inline save and failed upload                 |
| Advanced layout     |     8 | Both accents/densities, mobile LTR/RTL, table preferences/details and image failure                                         |
| Larger features     |    24 | Hierarchy, scheduling, interaction tools and data performance, each in four accent/density combinations plus mobile LTR/RTL |

There is no WebKit, Linux, forced-colors or actual-zoom visual baseline.
Commands and exact title-prefix selection are in [Quality](../QUALITY.md).

## Coverage and limits

The API guides define the supported behavior and preview limits. Browser
suites exercise controlled state, keyboard navigation, focus restoration,
validation/retry, native overlay paths and settled-theme WCAG 2.1 A/AA scans.
The larger-feature suite also exercises lazy tree loading, scheduling modes/time zones and reorder cancellation/saved-state examples. It includes carousel rotation preferences, chart equivalents and virtual-table selection/page mode.

Virtual-table diagnostics used 10,000 rows and three columns: 19 data rows
were mounted in the virtual viewport. A separate native full HTML table had 40,001 descendant nodes and a scroll height of 220,002px. Its construction took 84.6ms in Chromium and 132ms in WebKit.
Those times are diagnostics, not an Angular benchmark or universal performance
promise. See the [data-performance contract](../DATA_PERFORMANCE_COMPONENTS.md).

The feature build's initial Showcase bundle was 349.30kB with all feature
pages lazy-loaded. The full UI package entry is not the same measurement;
there is no isolated one-component tree-shaking benchmark.

These October 4 automated runs did not establish VoiceOver/NVDA usability or Windows high-contrast readability.
They also did not establish actual browser zoom, physical touch or native picker-dialog behavior.
The October 8 actual Chrome zoom inspection has the limited scope described above. Application approval, SSR/hydration support and maturity promotion also must have separate evidence.
These remain in [the task list](../../COMPONENT_EXPANSION_PLAN.md),
[maintainer handoff](READINESS.md) and
[manual QA](../../MANUAL_QA.md).
