# Component audit fixes

This checklist tracks the 34 findings from the component audit on 23–25 October 2026.
The shared Checkbox finding also covers Tree Table.

Complete each correction before the final review.
Use focused regression checks for behavior changes.
Examine the affected state in Chrome at desktop and narrow widths.

## Findings

- [x] `app-shell-1` — App Shell: Closed mobile navigation still receives focus.
- [x] `assistant-panel-1` — Assistant Panel: The mobile focus trap skips the scrollable conversation.
- [x] `assistant-panel-2` — Assistant Panel: New exchanges remain below the visible conversation.
- [x] `assistant-panel-3` — Assistant Panel: The mobile overlay can retain focus behind its scrim.
- [x] `button-1` — Button: Forced colors removes the spinner gap.
- [x] `chart-1` — Chart: The open data table makes a narrow page overflow.
- [x] `checkbox-1` — Checkbox: Forced colors shows a tick in the unchecked state.
- [x] `checkbox-2` — Checkbox: Mixed appearance and native state diverge after activation.
- [x] `combobox-1` — Combobox: Long lists cover the search field.
- [x] `combobox-2` — Combobox: Forced colors hide the active option.
- [x] `command-palette-1` — Command Palette: Forced colors hide the active command.
- [x] `date-picker-1` — Date Picker: Rapid arrow navigation can commit the previous date (known PR #16 issue).
- [x] `drawer-1` — Drawer: Backdrop scrolling moves the host page.
- [x] `file-upload-1` — File Upload: Upload completion does not update the live status region.
- [x] `multi-select-1` — Multi Select: The first selected chip moves the field behind the open list.
- [x] `multi-select-2` — Multi Select: A long selected label hides controls beyond the narrow viewport.
- [x] `range-slider-1` — Range Slider: The maximum value is clipped with larger text at 320px.
- [x] `split-pane-1` — Split Pane: Pane sizing uses the full host size and makes the divider outrun the pointer.
- [x] `split-pane-2` — Split Pane: Default and Keyboard stories expose the wrong separator orientation.
- [x] `table-1` — Table: Width field can display a value that the table did not apply.
- [x] `virtual-table-1` — Virtual Table: A new page retains the previous table scroll position.
- [x] `app-shell-2` — App Shell: Collapsed navigation has no visible label hint.
- [x] `chart-2` — Chart: Hidden series show the empty-dataset message.
- [x] `combobox-3` — Combobox: Popup width exceeds the field width.
- [x] `command-palette-2` — Command Palette: A disabled-row click interrupts search input.
- [x] `date-picker-2` — Date Picker: Month controls lead to calendars with no available dates.
- [x] `scheduling-calendar-1` — Scheduling Calendar: Refresh feedback is easy to miss.
- [x] `scheduling-calendar-2` — Scheduling Calendar: The single-appointment count uses a plural label.
- [x] `select-1` — Select: The Invalid example asks for a role that is already selected.
- [x] `table-2` — Table: Narrow tables do not clearly indicate hidden columns.
- [x] `table-3` — Table: Resizable tables leave an oversized empty panel beside short column sets.
- [x] `time-picker-1` — Time Picker: Invalid draft text omits the allowed range and step.
- [x] `tree-table-2` — Tree Table: Narrow tables hide data columns without a scroll cue.
- [x] `tree-view-1` — Tree View: Branch disclosure requires a precise pointer position.

## Verification

Record completed checks below.
Automated checks do not establish human screen-reader or physical touch acceptance.

- `app-shell-1`: 31 unit checks pass. Chrome confirms closed navigation is absent from the accessibility tree and Tab order.

- `assistant-panel-1`: The regression and Chrome Shift+Tab reach the named conversation log.

- Assistant Panel: 21 unit checks pass. Chrome verifies message following, reading position, keyboard scrolling, and focus after a viewport change.

- Checkbox: 7 unit checks pass. Chrome confirms mixed state after activation and one visible mark for one selected Tree Table row.

- `button-1`: Chrome forced colors retains the spinner gap with system colors.

- `combobox-2`: Chrome forced colors shows a solid outline on the active option.

- `command-palette-1`: Chrome forced colors shows the active command with a system-color outline.

- `command-palette-2`: Chrome keeps search focus and accepts typing after a disabled-row click.

- File Upload: 6 unit checks pass. Chrome exposes the completed filename and result in the live region and keeps focus through Retry, Cancel, and Remove.

- Overlay placement: 17 unit checks pass. Chrome keeps a 60-option Combobox below its field at 288 px wide.

- Multi Select: Chrome keeps a long selected chip and its Remove control within a 320 px page.

- Chart: 19 unit checks pass. Chrome keeps the data area within the page and explains hidden series.

- Date Picker: 21 unit checks pass. Chrome verifies bounded month controls and rapid selection across a month boundary.

- Drawer: Chrome keeps the background at its original scroll position during a backdrop wheel action. Closing releases the lock.

- Range Slider: Chrome displays 100 without clipping at 320 px with 200% text size.

- Split Pane: 5 unit checks pass. A 100 px Chrome pointer move produces a 100 px divider move.

- Tables: 50 unit checks pass across Table, Tree Table, and Virtual Table. Chrome verifies width normalization and page scroll reset.

- App Shell labels: Chrome shows collapsed labels on hover and focus without a repeated accessible description.

- Scheduling Calendar: 10 unit checks pass. Chrome shows refresh text beside a singular appointment count.

- Select: Chrome shows the empty placeholder and error in the Invalid example.

- Scroll cues: Chrome shows hints only when Table and Tree Table contain hidden columns. Keyboard scrolling remains available.

- Time Picker: 13 unit checks pass. Chrome shows the allowed range and interval beside an invalid draft.

- Tree View: Chrome verifies the 32 px disclosure target, including activation at its edge.

## Repository checks

- [x] Run the complete unit suite with coverage.
- [x] Run UI and Showcase lint and type checks.
- [x] Build Storybook and run all story checks.
- [x] Run the affected browser regression checks.
- [x] Run documentation writing, writing-check tests, link, and formatting checks.

Chrome screenshots are stored in the ignored `output/playwright/component-fixes/` folder.
These corrections do not establish human screen-reader or physical touch acceptance.

## Final results

| Check                 | Result                                                                         |
| --------------------- | ------------------------------------------------------------------------------ |
| UI unit checks        | 589 pass; branch coverage is 90.12%.                                           |
| Showcase unit checks  | 59 pass; branch coverage is 91.32%.                                            |
| Production Storybook  | 388 stories pass across 97 suites.                                             |
| Development Storybook | 388 stories pass; runtime isolation checks pass.                               |
| Browser checks        | 487 pass in Chromium, Firefox and WebKit.                                      |
| Expected skips        | Eight forced-color cases skip in Firefox and WebKit.                           |
| Visual comparisons    | All 94 pass. The 31 changed baselines were examined.                           |
| Package consumer      | The isolated Angular package build and six Chromium theme configurations pass. |
| Source checks         | UI, Showcase and browser-test lint checks pass. Angular type checks pass.      |
| Documentation         | Writing, writing-check tests, local links and formatting checks pass.          |

The document writing check does not establish full ASD-STE100 conformance.
The separate manual acceptance work remains in `MANUAL_QA.md`.
The combined release candidate has later results in the [verification record](docs/qa/VERIFICATION.md#october-25-2026-combined-candidate).
