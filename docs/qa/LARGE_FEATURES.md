# Larger feature verification

October 4, 2026. All seven feature contracts remain preview. Implementation and
consumer screens are in draft [PR #13](https://github.com/JustinPaoletta/jp-design-system/pull/13).

## Contracts and consumer examples

| Feature                  | Consumer route       | Contract                                                   |
| ------------------------ | -------------------- | ---------------------------------------------------------- |
| Tree view and tree table | `/hierarchy`         | [Hierarchy APIs](../HIERARCHY_COMPONENTS.md)               |
| Scheduling calendar      | `/scheduling`        | [Calendar APIs](../SCHEDULING_CALENDAR.md)                 |
| Reordering and carousel  | `/interaction-tools` | [Interaction APIs](../INTERACTION_COMPONENTS.md)           |
| Charts and virtual table | `/data-performance`  | [Data/performance APIs](../DATA_PERFORMANCE_COMPONENTS.md) |

Each feature includes semantic tokens, localized copy, controlled state, native or
explicit keyboard contracts, loading/empty/error states as appropriate, unit and
Storybook checks, a consuming screen, browser accessibility checks, and public
packaged-consumer template compilation. Carousel has a concrete reference-card
use case and remains manual by default; chart animation is disabled.

The native hierarchical table deliberately retains HTML table semantics with
ordinary disclosure buttons. It does not claim treegrid cell navigation. The
virtual table offers an explicit native paginated mode so the complete dataset
remains reachable without depending on navigation through recycled rows.

## Automated evidence

- UI: 458 tests in 97 suites. Coverage: 98.15% statements, 91.22% branches,
  95.61% functions, and 98.89% lines. Showcase: 58 tests in 11 suites, with
  98.85% statements and 91.46% branches. Tokens: 17 tests in two suites with
  100% coverage. All existing coverage gates pass without lowering thresholds.
- Storybook: 319 interaction/accessibility checks in 97 suites pass in both
  static and live modes. The live run keeps the normal 4400 preview available
  and confirms compiler/runtime isolation before and after testing.
- Angular type/template checks, project lint, semantic-color/primitive-token
  rules, generated-token consistency, documentation links and the runtime
  dependency audit pass. The runtime audit reports zero vulnerabilities.
- The production Showcase initial bundle is 349.30 kB under its existing
  budget; the chart engine and feature screens load on demand.
- Isolated Angular 22.2.1 tarball-consumer compilation passes using the public
  package exports, including all seven features and their projected directives.

Browser checks run on macOS Chromium/WebKit and CI Linux Chromium/WebKit;
visual baselines use macOS Chromium. All 232 functional/accessibility cases pass
across the integrated run and targeted rechecks, including 82 for this batch and
all 150 prior checks. All 66 visual comparisons pass,
covering 24 new feature baselines and all 42 existing baselines. The existing
baseline images are not refreshed for this batch. Hosted results are available
through the [draft PR checks](https://github.com/JustinPaoletta/jp-design-system/pull/13/checks).

Source-mode Showcase uses private compiler aliases for its three shell primitives
and lazy routes to keep feature code out of the initial entry chunk. These aliases
are internal workspace configuration, not distributed package entrypoints. The
isolated tarball consumer uses public package imports.

## Virtualization measurement

The consumer dataset has 10,000 rows with three data columns. The browser test
records the mounted window, full native-table DOM construction/layout time and
node count in an attached JSON report. It checks actual row geometry, final-row
reachability, independent selection across distant windows, controlled sorting,
and complete native paginated access. Native DOM timings are diagnostic; this is
not a claimed Angular rendering benchmark or a universal speed guarantee.

The recorded local full-matrix sample mounts 19 data rows. The full native-table
baseline contains 40,001 descendant nodes with a 220,002 px layout height;
construction plus layout took 84.6 ms in Chromium and 132 ms in WebKit on this
machine. These timings are recorded observations, not performance gates.
Zero-overscan checks include partially visible rows and verify real sticky-header
geometry. Additional cases preserve scroll/page state when an active mode is
chosen and recover focus before consumer sorting removes a focused checkbox.
Whole-pixel row-height normalization prevents fractional CSS geometry from
accumulating across distant windows. Calendar checks also verify readable short
appointment titles and the restoration of visible times in agenda/mobile rows.

## Review and scope limits

Manual VoiceOver/NVDA, physical touch, Windows forced colors and zoom review have
not been completed by these automated checks. Consumer API feedback, the declared
browser compatibility/native details-name audit, per-API maturity promotion and
release/distribution/design-kit coordination remain outstanding. Firefox is not
part of the executed Chromium/WebKit matrix.

Advanced extension requests require their own product contracts: multi-select or
virtualized hierarchy, editable treegrid cells, calendar editing/recurrence/backend
sync, cross-list transfer/automatic drag scrolling, variable-height virtual rows,
and additional chart types/large-scale streaming are not advertised by this batch.
