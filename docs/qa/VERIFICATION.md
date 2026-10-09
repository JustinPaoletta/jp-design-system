# Verification evidence

This page keeps dated evidence for the component expansion and readiness changes.
Test totals apply to the stated revisions and selections.
Later changes need their own checks.

## October 8 readiness evidence

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
[acceptance automation](ACCEPTANCE_AUTOMATION.md) and
[manual QA](../../MANUAL_QA.md).
