# Design inspection

## Select popup correction

The October 20 review found native option lists in Select, the schedule time zone and the chart category field.
The earlier captures did not expose their platform popup appearance.
All three now use `jp-select`, with a themed trigger and option list.

The chevron has reserved space at the control edge.
Long trigger labels show an ellipsis. Popup labels wrap.
The selected option has a checkmark. Keyboard navigation has a separate active state.
The popup uses the shared overlay surface, border, radius and shadow.

Chrome inspection covers the open time-zone list, long labels and a clipped dialog.
Narrow views use 320px width in both text directions.
The measured chevron inset is 13px. Long labels retain a 12px gap before the chevron.
The inspected pages have no horizontal overflow.

Captures are in `output/playwright/select-review/`.
The local gallery at `dist/qa/system-polish/select-review/` shows the six reviewed states.
Three new macOS baselines cover the open time-zone list.
The inspection includes 16 changed schedule and chart baselines.
Two overlay baselines also reflect positions aligned to device pixels.

The [visual rules](docs/content/VISUAL_STYLE.md#inspection) now require open-list inspection.
The [verification record](docs/qa/VERIFICATION.md#october-20-2026-select-popup-correction) states the test scope.

## Card reference review

The user approved `Primitives/Layout/Card` as the visual reference on October 19, 2026.
Further changes apply its typography, spacing, surfaces and actions across related components.
The changes remain in pull request #15.

The Card places the title before its header status.
Body text uses 14px. Actions have a separate footer with a subtle border.
The baseball example shows the final score, game context and one save action.
Other stories show saved feedback, plain content and a long title.

Chrome captures are in `dist/qa/card-refinement/`.
The review includes desktop, phone, keyboard focus and saved states.
This approval covers the Card direction. Passing checks do not approve later component changes.

## Remaining component inspection

The October 19 follow-up covers one representative story from each of the 97 Storybook groups.
Chrome captures use 1000px and 320px widths.
The 194 final captures have no horizontal page overflow.
Code and wide tables keep their internal scroll regions.

The inspection found and corrected these related issues:

- File Upload examples now support selection, removal, cancellation, retry and completion.
- Settings show saved feedback only when current values match the last successful request.
- Split Button, Context Menu, Inline Edit and menu options use consistent action text.
- Inline Alert uses clear title and message spacing without a decorative side border.
- Assistant examples keep Stop and Retry inside the panel at narrow widths.
- Avatar groups expose all member names. Breadcrumb menus retain hidden destinations.
- Photos show crop, contain, loading, failure and recovery behavior.
- Code blocks use basic syntax colors and preserve exact source and copy values.
- Pagination, Stepper, Banner, Carousel and Table Toolbar examples respond to their controls.
- Both dashboard compositions use the approved hierarchy. Narrow metric values align.
- Surface and Text examples fit their narrow containers.

The four suggestions from the supplied visual audit are implemented.
The examples use the 2026 ALCS Game 6 record and locally stored photos.
The [photo credits](apps/showcase/public/example-photos/README.md) identify the sources and licenses.

Captures are in `dist/qa/system-polish/final-pass/`.
The local gallery contains all 97 groups and both widths.
Capture waits for Storybook interactions and accessibility checks to finish.
Earlier captures that showed unfinished typing were replaced.
Generated inspection images remain outside Git.

Additional checks cover keyboard access, image recovery, upload recovery and edits during pending saves.
The [verification record](docs/qa/VERIFICATION.md) gives automated results.
This inspection does not approve every possible content, theme, device or state combination.
Manual acceptance and API promotion remain in the [task list](COMPONENT_EXPANSION_PLAN.md).

## Component-wide Card adaptation

The next inspection covers 20 components and two compositions.
The changes apply the approved Card direction across navigation, selection, content, data and feedback.
They retain the charcoal surfaces, semantic tokens and baseball examples.

- Dialogs, drawers, popovers, banners, toasts and empty states use consistent title and description sizes.
- Notifications use one Card with separate message groups and working read and dismissal actions.
- Tabs, segmented controls, checklists and tree rows have consistent selection and focus states.
- Narrow steppers show a vertical sequence. Long breadcrumb labels wrap.
- Description lists, timelines and player lists have bounded Card examples.
- Form sections, page headers and code blocks have clear labels, descriptions and actions.
- Virtual tables retain fixed row heights. Narrow tables use column-based minimum widths.
- Alert and assistant compositions use Card slots and working actions.

Chrome inspection found three additional defects.
The code-block header crowded its Copy action at 320px.
The virtual table gave its selection checkbox too little space.
Tabs could leave the selected or focused item outside the visible row.
The changes correct these defects and add regression checks for tab visibility and table geometry.

The baseline inspection also found clipped profile text in the compact roster workspace.
The profile now wraps within its pane. Expanded player details use clear baseball copy.

Chrome comparison captures are in `dist/qa/system-polish/`.
The gallery contains 22 numbered views, with original, updated desktop and 320px captures.
Desktop captures use a 1000px viewport.
The gallery and captures remain outside Git.
The [verification record](docs/qa/VERIFICATION.md) records automated results separately.

This inspection does not cover every state in all 97 component groups.
Remaining suggestions and manual acceptance tasks stay in the [task list](COMPONENT_EXPANSION_PLAN.md).

## Form and roster adaptation

The Controls Form and Data Display examples now use `JpCard` directly.
The shared component controls their title size, panel inset, border and action footer.
The native form retains its controls and density setting.
Save, Cancel, Reset and Delete update local example state and show a status message.

The roster shows player names with position and squad details beneath them.
Availability remains in a separate column at phone widths.
The footer action filters available players and restores the full roster.
The table retains its native caption and named scroll region without a second panel border.
The unframed table removes its outer cell inset to preserve word boundaries at 320px.

Chrome comparison captures are in `dist/qa/card-rollout/`.
The examples store changes only while the page or story remains open.

## October 19 refinement inspection

A second Chrome inspection found problems that the first audit pass did not resolve.
The declared font was not supplied. Card headings and routine buttons had too much emphasis.
The form and roster repeated headings, borders and visible example settings.
Crowded calendar lanes showed clipped initials instead of readable event titles.

- Include the Inter font and its license with the token package.
- Use 16px card titles and 14px routine button labels.
- Align the dashboard brand and toolbar. Reduce chart labels and panel borders.
- Group form fields in one panel. Keep preview settings in a separate disclosure.
- Give the roster one heading and one table frame.
- Use an event overview when calendar lanes cannot fit readable titles and times.

The fresh before-and-after gallery is `dist/qa/design-refinement/index.html`.
It includes dashboard, form, roster and calendar captures from Chrome.
Additional captures show phone layouts and the collapsed sidebar.
These files remain outside Git. Automated results are recorded separately from visual approval.

## October 19 visual audit changes

The supplied `design-system-visual-audit.pdf` examines 320 captures across 97 component groups.
This change applies its shared sizing, hierarchy, composition and data-layout recommendations.
The dark surfaces, gold accent and baseball copy remain.

| Area                    | Change                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Controls                | Default controls use 40px height. Icons use 16px, 20px or 24px. Fields and selection controls have clearer boundaries.   |
| Hierarchy               | Page titles, card titles and metrics use distinct sizes. Cards, raised panels and overlays use separate surface colors.  |
| Forms                   | Examples use JP buttons and fields. Related controls share spacing. Destructive actions have a separate section.         |
| Navigation and feedback | Menus, notifications and assistant panels use clearer rows and actions. Selected navigation has no vertical accent line. |
| Data                    | Table alignment is consistent. The calendar has equal day columns, a shared time gutter and bounded all-day content.     |
| States                  | Open, failed and streaming stories retain their named states. New examples show populated fields and busy schedules.     |

Chrome inspection uses 1440 × 1000 desktop and 390 × 844 mobile viewports.
Local captures and their gallery are in `dist/qa/visual-audit/`.
These inspection images are generated files and remain outside Git.
Reviewed regression baselines remain in the browser test directories.

The independent inspection found mobile inline-editor overflow, narrow reorder labels and duplicate meter text.
It also found calendar issues with long all-day lists, short-event titles and a midnight clock change.
The changes include corrections for these findings and calendar regression tests.

Chromium full-page capture reset the calendar scroll frame in the automated images.
The capture procedure now measures page height and checks that the frame retains its initial position.
The live calendar keeps its initial activity position.

The [visual style guide](docs/content/VISUAL_STYLE.md) records the shared sizes, surfaces, motion limits and screenshot procedure.
The [verification record](docs/qa/VERIFICATION.md) records the current automated results.
Lower-priority audit suggestions remain in the [task list](COMPONENT_EXPANSION_PLAN.md).
Screen-reader, Windows and physical-device acceptance remain separate tasks.

## October 11 reference inspection

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

That inspection did not identify further P0, P1 or P2 findings.
The October 19 inspection later found font and composition problems.

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

This inspection used the Riverton Falcons baseball setting.
The copy guide at that time defined the shared players, roles, availability labels and game results.
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
Later examples use the 2026 ALCS Game 6 record in the [copy guide](docs/content/BASEBALL_EXAMPLES.md).
