# Design inspection

Date: October 11, 2026, local time.

## References and captures

Source images: `dist/qa/design-refresh/reference-1.jpg` and `reference-2.jpg`.
Both source images are 1280 × 480 pixels.
The expanded sidebar crop is 621 × 439 pixels.
The source CSS size and image density are unknown.

Implementation: `dist/qa/design-refresh/final-dashboard.png`.
Chrome viewport: 1240 × 876 CSS pixels, with `deviceScaleFactor: 1`.
The shell capture is 1208 × 876 pixels.
The browser page has 16 CSS pixels of outer padding.

Full comparison: `dist/qa/design-refresh/comparison.png`.
The source crop and implementation use the same 621-pixel presentation width.
Resizing preserves each image's aspect ratio.
This is a style comparison, not a pixel-parity claim.

Focused comparisons: `comparison-navigation.png`, `comparison-metrics.png` and `comparison-panels.png` in the same directory.
These captures show selection, typography, borders and panel spacing.

States: expanded sidebar, collapsed sidebar, Gold accent and default density.
Additional mobile capture: `dist/qa/design-refresh/mobile.png`, at 390 × 844 CSS pixels.
The mobile capture includes the full page.

## Findings

No actionable P0, P1 or P2 findings remain in this inspection.

| Area             | Result                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Typography       | The existing font family remains. Headings, metrics, labels and body text have separate sizes. Mobile text wraps.            |
| Spacing          | Panels use small corners and consistent spacing. The mobile layout stacks the panels.                                        |
| Colors           | Charcoal surfaces, low shadows and warm gold follow the reference direction. Status colors remain separate.                  |
| Images and icons | Existing navigation icons remain. The chart uses Chart.js. The avatar uses initials. No generated raster asset is needed.    |
| Copy             | The dashboard uses Overview content, activity times and insight text. Technical demo text was removed from this composition. |

The user requested the reference appearance across existing components.
The implementation keeps the library's font family and navigation icons.
It does not copy an unknown font or introduce a new logo.
The chart uses eight sample points instead of the reference's longer series.
The native data disclosure remains available.
These differences preserve the existing library and its accessibility controls.

## Comparison history

- P2: Always-visible chart controls made the first dashboard capture too tall.
  Fix: Add `controlsCollapsed` and place controls inside the native data disclosure for this composition.
  Evidence: `final-dashboard.png` and `comparison-panels.png` show the shorter panel.
- P2: Several stories forced Neon despite the selected Gold theme.
  Fix: Remove their accent overrides and keep the global theme default.
  Evidence: The final Chrome inspection reports Gold for all eight inspected cases.
- Requested change: Remove the vertical selection line.
  Evidence: The active item's `::before` content is `none` at expanded, collapsed and mobile widths.

## Interaction and source checks

Chrome checks include native chart data inspection, sidebar collapse and mobile dismissal with Escape.
The final interaction pass checks the rendered state after Angular updates.
No page errors occurred in the Chrome interaction pass.

Static and live Storybook checks each pass 320 stories in 97 suites.
The live checks also pass the compiler/runtime isolation guards.
Chromium passes 138 behavior and accessibility tests.
Firefox and WebKit each pass 134 tests, with four intentional forced-colors skips.
The macOS Chromium visual suite has 84 inspected baselines.
The isolated package consumer passes 18 browser, accent and density combinations.

Source tests, lint, Angular type checks and the Showcase production build pass.

Manual assistive-technology and physical-device inspections remain in the existing readiness checklist.
This design inspection does not complete those tasks.

## Final result

passed

## October 12 baseball copy inspection

Storybook and Showcase now use the Riverton Falcons baseball setting.
The [copy guide](docs/content/BASEBALL_EXAMPLES.md) defines the shared players, roles, availability labels and game results.
Component names remain in the Storybook navigation.

Chrome captures use a 1440 × 1000 desktop viewport and a 390 × 844 mobile viewport, both at device pixel ratio 1.
Local inspection images are in `dist/qa/baseball-copy/`.
These generated images are not tracked in Git.

- `jp-baseball-game.png` shows the Falcons winning 5–3, with nine hits and no errors.
- The inning chart uses whole-number run labels and a dashed line for the Bears.
- `jp-baseball-roster.png` shows the shared players, positions and availability labels.
- `jp-baseball-lineup.png` shows the coach contact address, club role and message preference.
- `jp-baseball-mobile.png` shows the game dashboard without horizontal page overflow.

The 84 visual baselines were inspected and updated for the new copy.
The charcoal surfaces, restrained accents and navigation treatment remain consistent with the October 11 reference inspection.
