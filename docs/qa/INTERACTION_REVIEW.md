# Component interaction review

Reviewed on October 20, 2026.

The source review covers all 91 primitive folders.
The Chrome review covers one representative story from each of the 97 catalog groups.
The catalog has 381 stories, including four new refresh examples.

## Shared behavior

Hover transitions use 90ms and change colors or borders.
Pressed feedback and keyboard focus appear immediately.
Actions activate on click or their documented keyboard event.
Disabled controls keep their disabled behavior.
Selected controls retain readable foreground colors.

Slider values, drag positions and pane sizes update without layout transitions.
Drawers use 160ms entry motion.
Menus and popovers appear and dismiss immediately.
Reduced motion removes transitions and indicator animation.

Populated charts, calendars, notification lists and virtual tables retain their content during refresh.
Their busy indicators do not change the layout.
Without usable data, the components show initial loading placeholders.
Inline saves keep button dimensions constant.
Password reveal keeps both label widths available.

## Inventory

A shared control supplies its behavior to composed components.
Display and layout components do not need decorative interaction motion.
Projected application controls keep their own styling contract.

| Primitive folder                                                            | Reviewed behavior                                                                   |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [accessibility](../../libs/ui/src/lib/primitives/accessibility)             | Focus and direction helpers; no visible control.                                    |
| [accordion](../../libs/ui/src/lib/primitives/accordion)                     | Child disclosures supply feedback.                                                  |
| [app-shell](../../libs/ui/src/lib/primitives/app-shell)                     | Shared hover, press and focus feedback.                                             |
| [assistant](../../libs/ui/src/lib/primitives/assistant)                     | Shared hover, press and focus feedback.                                             |
| [avatar](../../libs/ui/src/lib/primitives/avatar)                           | Display or layout only; no added motion.                                            |
| [avatar-group](../../libs/ui/src/lib/primitives/avatar-group)               | Shared hover, press and focus feedback.                                             |
| [badge](../../libs/ui/src/lib/primitives/badge)                             | Display or layout only; no added motion.                                            |
| [banner](../../libs/ui/src/lib/primitives/banner)                           | Shared hover, press and focus feedback.                                             |
| [box](../../libs/ui/src/lib/primitives/box)                                 | Display or layout only; no added motion.                                            |
| [breadcrumbs](../../libs/ui/src/lib/primitives/breadcrumbs)                 | Shared hover, press and focus feedback.                                             |
| [button](../../libs/ui/src/lib/primitives/button)                           | Shared hover, press and focus feedback.                                             |
| [button-group](../../libs/ui/src/lib/primitives/button-group)               | Projected buttons supply feedback.                                                  |
| [card](../../libs/ui/src/lib/primitives/card)                               | Projected actions supply feedback.                                                  |
| [carousel](../../libs/ui/src/lib/primitives/carousel)                       | Shared hover, press and focus feedback.                                             |
| [chart](../../libs/ui/src/lib/primitives/chart)                             | Legend and disclosure feedback; retained canvas during refresh.                     |
| [checkbox](../../libs/ui/src/lib/primitives/checkbox)                       | Immediate selection mark and focus; shared hover feedback.                          |
| [checkbox-group](../../libs/ui/src/lib/primitives/checkbox-group)           | Immediate selection marks and focus; shared hover feedback.                         |
| [checklist](../../libs/ui/src/lib/primitives/checklist)                     | Row and selection feedback.                                                         |
| [chip](../../libs/ui/src/lib/primitives/chip)                               | Shared hover, press and focus feedback.                                             |
| [code-block](../../libs/ui/src/lib/primitives/code-block)                   | Copy button supplies feedback.                                                      |
| [combobox](../../libs/ui/src/lib/primitives/combobox)                       | Shared hover, press and focus feedback.                                             |
| [command-palette](../../libs/ui/src/lib/primitives/command-palette)         | Shared hover, press and focus feedback.                                             |
| [context-menu](../../libs/ui/src/lib/primitives/context-menu)               | Shared hover, press and focus feedback.                                             |
| [copy-button](../../libs/ui/src/lib/primitives/copy-button)                 | Button supplies press and stable loading feedback.                                  |
| [date-picker](../../libs/ui/src/lib/primitives/date-picker)                 | Shared hover, press and focus feedback.                                             |
| [date-range-picker](../../libs/ui/src/lib/primitives/date-range-picker)     | Date pickers supply feedback.                                                       |
| [description-list](../../libs/ui/src/lib/primitives/description-list)       | Display or layout only; no added motion.                                            |
| [dialog](../../libs/ui/src/lib/primitives/dialog)                           | Shared hover, press and focus feedback.                                             |
| [disclosure](../../libs/ui/src/lib/primitives/disclosure)                   | Shared hover, press and focus feedback.                                             |
| [divider](../../libs/ui/src/lib/primitives/divider)                         | Display or layout only; no added motion.                                            |
| [drawer](../../libs/ui/src/lib/primitives/drawer)                           | Dialog supplies focus, entry and dismissal.                                         |
| [dropdown-menu](../../libs/ui/src/lib/primitives/dropdown-menu)             | Shared hover, press and focus feedback.                                             |
| [empty-state](../../libs/ui/src/lib/primitives/empty-state)                 | Projected actions supply feedback.                                                  |
| [error-summary](../../libs/ui/src/lib/primitives/error-summary)             | Shared hover, press and focus feedback.                                             |
| [file-upload](../../libs/ui/src/lib/primitives/file-upload)                 | Shared hover, press and focus feedback.                                             |
| [form-field](../../libs/ui/src/lib/primitives/form-field)                   | Its supplied control owns feedback.                                                 |
| [form-section](../../libs/ui/src/lib/primitives/form-section)               | Its supplied controls own feedback.                                                 |
| [grid](../../libs/ui/src/lib/primitives/grid)                               | Display or layout only; no added motion.                                            |
| [heading](../../libs/ui/src/lib/primitives/heading)                         | Display or layout only; no added motion.                                            |
| [icon](../../libs/ui/src/lib/primitives/icon)                               | Display or layout only; no added motion.                                            |
| [icon-button](../../libs/ui/src/lib/primitives/icon-button)                 | Shared hover, press and focus feedback.                                             |
| [inline](../../libs/ui/src/lib/primitives/inline)                           | Display or layout only; no added motion.                                            |
| [inline-alert](../../libs/ui/src/lib/primitives/inline-alert)               | Button supplies action feedback.                                                    |
| [inline-edit](../../libs/ui/src/lib/primitives/inline-edit)                 | Edit and cancel feedback; stable loading button.                                    |
| [input](../../libs/ui/src/lib/primitives/input)                             | Shared hover, press and focus feedback.                                             |
| [keyboard-hint](../../libs/ui/src/lib/primitives/keyboard-hint)             | Display or layout only; no added motion.                                            |
| [link](../../libs/ui/src/lib/primitives/link)                               | Shared hover, press and focus feedback.                                             |
| [list](../../libs/ui/src/lib/primitives/list)                               | Display or layout only; no added motion.                                            |
| [live-announcer](../../libs/ui/src/lib/primitives/live-announcer)           | Announcements have no decorative motion.                                            |
| [media](../../libs/ui/src/lib/primitives/media)                             | Display or layout only; no added motion.                                            |
| [meter](../../libs/ui/src/lib/primitives/meter)                             | Display or layout only; no added motion.                                            |
| [multi-select](../../libs/ui/src/lib/primitives/multi-select)               | Shared hover, press and focus feedback.                                             |
| [notification-list](../../libs/ui/src/lib/primitives/notification-list)     | Action and link feedback; retained rows during refresh.                             |
| [number-stepper](../../libs/ui/src/lib/primitives/number-stepper)           | Shared hover, press and focus feedback.                                             |
| [overflow-chip](../../libs/ui/src/lib/primitives/overflow-chip)             | Shared hover, press and focus feedback.                                             |
| [page-header](../../libs/ui/src/lib/primitives/page-header)                 | Projected buttons and links supply feedback.                                        |
| [pagination](../../libs/ui/src/lib/primitives/pagination)                   | Buttons supply feedback.                                                            |
| [password-field](../../libs/ui/src/lib/primitives/password-field)           | Input supplies feedback and stable reveal labels.                                   |
| [popover](../../libs/ui/src/lib/primitives/popover)                         | Panel appears immediately; its supplied trigger owns feedback.                      |
| [progress](../../libs/ui/src/lib/primitives/progress)                       | Shared hover, press and focus feedback.                                             |
| [radio-group](../../libs/ui/src/lib/primitives/radio-group)                 | Immediate selection and focus; shared field feedback.                               |
| [range-slider](../../libs/ui/src/lib/primitives/range-slider)               | Thumb and field feedback; immediate endpoint changes.                               |
| [reorder](../../libs/ui/src/lib/primitives/reorder)                         | Shared hover, press and focus feedback.                                             |
| [scheduling-calendar](../../libs/ui/src/lib/primitives/scheduling-calendar) | Mode and appointment feedback; retained scroll container during refresh.            |
| [search-field](../../libs/ui/src/lib/primitives/search-field)               | Input supplies field and clear-action feedback.                                     |
| [segmented-control](../../libs/ui/src/lib/primitives/segmented-control)     | Shared hover, press and focus feedback.                                             |
| [select](../../libs/ui/src/lib/primitives/select)                           | Shared hover, press and focus feedback.                                             |
| [skeleton](../../libs/ui/src/lib/primitives/skeleton)                       | Shared hover, press and focus feedback.                                             |
| [skip-link](../../libs/ui/src/lib/primitives/skip-link)                     | Shared hover, press and focus feedback.                                             |
| [slider](../../libs/ui/src/lib/primitives/slider)                           | Thumb and field feedback; immediate dragging and keyboard values.                   |
| [spinner](../../libs/ui/src/lib/primitives/spinner)                         | Shared hover, press and focus feedback.                                             |
| [split-button](../../libs/ui/src/lib/primitives/split-button)               | Shared hover, press and focus feedback.                                             |
| [split-pane](../../libs/ui/src/lib/primitives/split-pane)                   | Handle feedback; immediate resizing.                                                |
| [stack](../../libs/ui/src/lib/primitives/stack)                             | Display or layout only; no added motion.                                            |
| [status-dot](../../libs/ui/src/lib/primitives/status-dot)                   | Display or layout only; no added motion.                                            |
| [stepper](../../libs/ui/src/lib/primitives/stepper)                         | Shared hover, press and focus feedback.                                             |
| [surface](../../libs/ui/src/lib/primitives/surface)                         | Display or layout only; no added motion.                                            |
| [switch](../../libs/ui/src/lib/primitives/switch)                           | Immediate press feedback and short thumb movement.                                  |
| [table](../../libs/ui/src/lib/primitives/table)                             | Sorting, disclosure, field and resize feedback.                                     |
| [table-toolbar](../../libs/ui/src/lib/primitives/table-toolbar)             | Supplied search controls and buttons own feedback.                                  |
| [tabs](../../libs/ui/src/lib/primitives/tabs)                               | Shared hover, press and focus feedback.                                             |
| [text](../../libs/ui/src/lib/primitives/text)                               | Display or layout only; no added motion.                                            |
| [textarea](../../libs/ui/src/lib/primitives/textarea)                       | Shared hover, press and focus feedback.                                             |
| [time-picker](../../libs/ui/src/lib/primitives/time-picker)                 | Shared hover, press and focus feedback.                                             |
| [timeline](../../libs/ui/src/lib/primitives/timeline)                       | Display or layout only; no added motion.                                            |
| [toast](../../libs/ui/src/lib/primitives/toast)                             | Shared hover, press and focus feedback.                                             |
| [toggle-button](../../libs/ui/src/lib/primitives/toggle-button)             | Shared hover, press and focus feedback.                                             |
| [tooltip](../../libs/ui/src/lib/primitives/tooltip)                         | Content appears immediately; the hover buffer prevents accidental dismissal.        |
| [tree-table](../../libs/ui/src/lib/primitives/tree-table)                   | Shared hover, press and focus feedback.                                             |
| [tree-view](../../libs/ui/src/lib/primitives/tree-view)                     | Shared hover, press and focus feedback.                                             |
| [virtual-table](../../libs/ui/src/lib/primitives/virtual-table)             | Mode and sorting feedback; retained rows, scroll position and focus during refresh. |

## Evidence

The Chrome sweep inspected 269 visible control instances across the representative stories.
It checked color transitions and pressed states and saved a capture for each group.
Additional captures cover busy data views, narrow RTL layouts and password reveal.
No active `transition: all` rule remained in that sample.
Modal content was checked within its active layer.

Browser regressions cover press activation, stable dimensions, reduced motion, slider dragging and password reveal.
Refresh regressions cover retained DOM elements, scroll position, focus and disabled actions.
The full Storybook, browser and visual checks are recorded in [verification evidence](VERIFICATION.md).

Captures stay in the ignored `output/playwright/system-interactions/` directory.
The review does not change API maturity or close the existing human acceptance tasks.
See the [visual style rules](../content/VISUAL_STYLE.md#motion).
