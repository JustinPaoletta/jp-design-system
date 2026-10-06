# Verification evidence

Recorded October 4, 2026 (America/New_York). This is the current consolidated
record for the component expansion. Test totals describe these revisions;
update this page when the suite or implementation changes.

## Confirmed revisions

- Feature implementation `88f69e22c934e3172a2375d72bd7d8ce8d03b282`:
  [successful CI](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37244858852).
- Acceptance/release automation `366c0b31b0208103b44d89701397b12d3680fddd`:
  [successful CI](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37249933305)
  and [successful documentation checks](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37249933329).

The second revision adds tests and release safety checks; it does not change
component behavior. This record is evidence for those commits, rather than a
prediction that every later commit passes CI.

## Results

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

Automation does not establish VoiceOver/NVDA usability, Windows high-contrast readability, actual browser zoom, physical touch or native picker-dialog behavior. Application approval, SSR/hydration support and maturity promotion also must have separate evidence.
These remain in [the task list](../../COMPONENT_EXPANSION_PLAN.md),
[acceptance automation](ACCEPTANCE_AUTOMATION.md) and
[manual QA](../../MANUAL_QA.md).
