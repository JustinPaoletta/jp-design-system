# Choosing components

Use the narrowest primitive that matches the job. Visual values come from
documented inputs and tokens. [Design principles](../DESIGN_PRINCIPLES.md)
keep accent as a signal, and [Components](./COMPONENTS.md) records the API.
Support level is in [Maturity](../governance/MATURITY.md).

## Dialog, popover, dropdown, tooltip

| Need                                                              | Use                                                     | Leave it                            |
| ----------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------- |
| A decision that blocks the page, especially a destructive confirm | [`jp-dialog`](../PRIMITIVES.md#jp-dialog)               | A menu or a hint                    |
| Extra content anchored to a control, still part of the page       | [`jp-popover`](../PRIMITIVES.md#jp-popover)             | A modal confirmation                |
| A list of actions                                                 | [`jp-dropdown-menu`](../PRIMITIVES.md#jp-dropdown-menu) | A dialog with one button per action |
| A short name for an icon control                                  | [`jp-tooltip`](../PRIMITIVES.md#jp-tooltip)             | Text the user must read to succeed  |

All four are controlled where they have `open`. Bind `open` and `openChange`
(`[(open)]` works). Escape closes the topmost registered overlay first.

Dialog uses a native modal `<dialog>`, traps focus, and restores focus to the
opener. Popover content is `role="region"`. Dropdown items are buttons with
`role="menuitem"`; arrow keys move inside the menu. Tooltip text is
`aria-describedby` on the trigger while open, so it supplements a control
that already has a name.

## Select and combobox

| Need                                           | Use                                           |
| ---------------------------------------------- | --------------------------------------------- |
| A short, known list and the platform select UI | [`jp-select`](../PRIMITIVES.md#jp-select)     |
| Typing to narrow a single string value         | [`jp-combobox`](../PRIMITIVES.md#jp-combobox) |

Both are string `ControlValueAccessor`s. Combobox filters `options` locally
by label. Set `loading` while the application fetches options, and set
`emptyText` only for a completed search with no matches. A failed fetch is
the `error` input, not the empty state. Combobox selects one value. It does
not keep a set of selected values.

## Badge and chip

[`jp-badge`](../PRIMITIVES.md#jp-badge) is a status label. It does not remove
anything. [`jp-chip`](../PRIMITIVES.md#jp-chip) is one removable filter or
selected value. The application deletes that value when `removed` emits.

`jp-table-toolbar` still renders its own filter buttons (`Remove filter:`
plus the filter label, and `Clear filters`). The recipes page uses that
toolbar. Use `jp-chip` for a filter row the application draws itself.

## Table and a simple list

[`jp-table`](../PRIMITIVES.md#jp-table) is for rows that share columns, with
optional sort and selection. It does not fetch, filter, sort the array, or
page. Pair it with [`jp-table-toolbar`](../PRIMITIVES.md#jp-table-toolbar) and
[`jp-pagination`](../PRIMITIVES.md#jp-pagination) when the screen has search,
filters, bulk actions, or pages. The [search recipe](./RECIPES.md#search-sort-and-pagination)
owns the row array.

Use preview `JpList` for a semantic collection with an optional item template;
use a stack/surface composition for unlike content blocks. `JpDescriptionList`
pairs terms and values. These contracts are in
[Component expansion](../COMPONENT_EXPANSION.md). Zero rows use
[`jp-empty-state`](../PRIMITIVES.md#jp-empty-state), either projected into the
table or rendered by the table's `emptyTitle`.

## Toast and inline alert

| Need                                                                           | Use                                                                                                               |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| A transient note that does not block the task                                  | [`JpToastService`](../PRIMITIVES.md#jptoastservice) and one [`jp-toast-outlet`](../PRIMITIVES.md#jp-toast-outlet) |
| A failure or success the user must see next to the form or table, with a retry | [`jp-inline-alert`](../PRIMITIVES.md#jp-inline-alert)                                                             |

Error alerts use `role="alert"`. Other alert tones and toasts use
`role="status"`. The outlet is `aria-live="polite"`. Put the retry on the
inline alert when the user has to recover in place. A toast disappears on a
timer (default 4000ms) and is a poor place for the only copy of an error.

## Common mistakes

- Binding `routerLink` on `jp-app-shell-nav-item`. The interactive element is
  an inner anchor. Showcase listens for `(click)`, calls `preventDefault`,
  and navigates with `Router.navigateByUrl`. See
  [Navigation](./COMPOSITION.md#navigation).
- Forgetting the controlled `open` binding, then wondering why a dialog,
  popover, or menu stays closed. The components emit `openChange`. They do
  not store that click themselves.
- Putting required instructions only in a tooltip.
- Using `jp-select` for a list the user must search, or `jp-combobox` for
  several selected values.
- Asking `jp-table` to load or mutate application data.
- Showing a failed refresh by clearing the current rows. Keep the previous
  rows and render an inline alert.
- Using a toast as the only record of a failed save.
- Treating a non-empty `error` as optional decoration. It sets the invalid
  state and replaces the hint in `aria-describedby`.
- Passing a `label` attribute to `jp-checkbox` or `jp-switch`. The caption is
  projected content.
- Setting `jp-heading` size independently of `as`. Pick the heading level, or
  use `jp-text` for other copy.
- Painting large surfaces with the accent. Accent is for primary actions,
  focus, active navigation, and selection.
- Importing `Ui` / `<lib-ui>`. That export is deprecated. See
  [compatibility](../governance/COMPATIBILITY.md).
- Installing from `libs/ui` or `libs/tokens` instead of the built tarballs.
  See [Getting started](./GETTING_STARTED.md).

## Expanded choices

| Need                                        | Use and boundary                                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Navigate to a destination                   | Native anchor with `jpLink`; use a button for an action. `JpLink` supports `RouterLink` on the same anchor.                     |
| Several selected values                     | `JpMultiSelect` for searchable choices; `JpCheckboxGroup` for a visible group. `JpSegmentedControl` is a single compact choice. |
| A search query or password                  | `JpSearchField` / `JpPasswordField`; combobox means choosing an option.                                                         |
| Page-wide feedback or longer-lived history  | `JpBanner` / `JpNotificationList`; keep contextual errors near the control.                                                     |
| Indeterminate work or a bounded measurement | `JpSpinner` / `JpMeter`; progress describes task completion.                                                                    |
| A side/bottom task panel                    | `JpDrawer`; app-shell navigation is separate.                                                                                   |
| Nested navigation/data                      | `JpTreeView` / `JpTreeTable`; provide stable IDs and controlled selection/expansion.                                            |
| Large flat datasets                         | `JpVirtualTable` with fixed row height and paginated accessibility mode; ordinary tables support richer row details.            |
| Appointments rather than date entry         | `JpSchedulingCalendar`; native pickers edit civil date/time strings.                                                            |
| Compare values visually                     | `JpChart` plus equivalent native data; the application owns aggregation and dataset meaning.                                    |
| Rearrange items or browse optional slides   | `JpReorder` / `JpCarousel`; carousel rotation is opt-in.                                                                        |

All additional APIs above are preview. Use the [catalog](COMPONENTS.md) for
contracts and limits, and [maturity](../governance/MATURITY.md) before adoption.
