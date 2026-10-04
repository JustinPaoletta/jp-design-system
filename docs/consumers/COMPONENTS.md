# Components

Public components, directives, and services exported from
`libs/ui/src/index.ts` on October 4, 2026. Import them from
`@jp-design-system/ui`. Support level and the full export inventory are in
[Maturity](../governance/MATURITY.md). Design rules are in
[Design principles](../DESIGN_PRINCIPLES.md). The longer workspace reference
is [PRIMITIVES.md](../PRIMITIVES.md).

`Ui` (`lib-ui`) is deprecated. Do not use it in new templates. Migration is
in [Compatibility](../governance/COMPATIBILITY.md).

Storybook titles below link to the story source. Run
`npx nx run ui:storybook` and open http://localhost:4400. Groupings:
`Primitives/Layout`, `Primitives/Typography`, `Primitives/Controls`,
`Primitives/Data Display`, `Primitives/Navigation`, `Primitives/Feedback`,
`Primitives/Assistant`, and the `Compositions/*` stories named in
[Composition](./COMPOSITION.md).

## Conventions

- Components use OnPush. There is no `class` or `style` input. Visual choices
  are the inputs below and the semantic tokens.
- String-union inputs fall back to the documented default when the value is
  not in the allowed set. `jp-grid` `columns` also accepts those numbers as
  numeric strings. Unknown `paddingX` / `paddingY` values become `null`.
- Boolean inputs use Angular's boolean attribute transform (`disabled` with
  no value is true; the string `"false"` is false).
- Field controls implement `ControlValueAccessor`. `disabled` is true when
  the input is set or when the form control is disabled.
- A non-empty `error` marks the field invalid and is the `aria-describedby`
  target. `hint` is used only when `error` is empty.
- Generated ids are module counters (`jp-input-1`) or `Math.random()`
  strings. Server rendering is not a contract. Pass `id` where the component
  offers it.
- Overlay `open` inputs are controlled. Bind `open` and `openChange`.
- Projection attributes that are not classes are still part of the contract:
  `[jpAppShellSidebar]`, `[jpAppShellMain]`, `[jpAppShellNavIcon]`,
  `[jpEmptyStateIcon]`, `[jpTableSearch]`, `[jpTableFilters]`,
  `[jpTableActions]`, `[jpTableBulkActions]`.

Space tokens: `none`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`.
Radius tokens: `none`, `sm`, `md`, `lg`, `xl`, `full`.
Layout tags: `div`, `section`, `article`, `aside`, `main`, `header`,
`footer`, `nav`.

## Layout

### jp-box

Class `JpBox`. Story:
[Primitives/Layout/Box](../../libs/ui/src/lib/primitives/box/box.stories.ts).

Padding and max-width only. No border or background. Use `jp-surface` for a
panel.

| Input      | Type                     | Default                     |
| ---------- | ------------------------ | --------------------------- |
| `as`       | layout tag               | `div`                       |
| `padding`  | space token              | `none`                      |
| `paddingX` | space token or `null`    | `null` (inherits `padding`) |
| `paddingY` | space token or `null`    | `null` (inherits `padding`) |
| `maxWidth` | `none`, `narrow`, `wide` | `none`                      |

`paddingX="none"` clears horizontal padding while `padding` still applies
vertically.

### jp-stack

Class `JpStack`. Story:
[Primitives/Layout/Stack](../../libs/ui/src/lib/primitives/stack/stack.stories.ts).

Vertical flex.

| Input     | Type                                | Default   |
| --------- | ----------------------------------- | --------- |
| `as`      | layout tag                          | `div`     |
| `gap`     | space token                         | `md`      |
| `align`   | `start`, `center`, `end`, `stretch` | `stretch` |
| `justify` | `start`, `center`, `end`, `between` | `start`   |

### jp-inline

Class `JpInline`. Story:
[Primitives/Layout/Inline](../../libs/ui/src/lib/primitives/inline/inline.stories.ts).

Horizontal flex.

| Input     | Type                                | Default  |
| --------- | ----------------------------------- | -------- |
| `as`      | layout tag                          | `div`    |
| `gap`     | space token                         | `sm`     |
| `align`   | `start`, `center`, `end`, `stretch` | `center` |
| `justify` | `start`, `center`, `end`, `between` | `start`  |
| `wrap`    | boolean                             | `true`   |

### jp-grid

Class `JpGrid`. Story:
[Primitives/Layout/Grid](../../libs/ui/src/lib/primitives/grid/grid.stories.ts).

| Input       | Type                    | Default |
| ----------- | ----------------------- | ------- |
| `as`        | layout tag              | `div`   |
| `gap`       | space token             | `md`    |
| `columns`   | `1`, `2`, `3`, `4`, `6` | `3`     |
| `mode`      | `fixed`, `auto-fit`     | `fixed` |
| `minColumn` | `sm`, `md`, `lg`        | `md`    |

`fixed` repeats `columns` and does not wrap. `auto-fit` uses `minColumn`.
See [Layout](./LAYOUT.md).

### jp-surface

Class `JpSurface`. Story:
[Primitives/Layout/Surface](../../libs/ui/src/lib/primitives/surface/surface.stories.ts).

| Input       | Type                                               | Default   |
| ----------- | -------------------------------------------------- | --------- |
| `as`        | layout tag                                         | `section` |
| `tone`      | `canvas`, `sunken`, `subtle`, `raised`, `emphasis` | `raised`  |
| `padding`   | space token                                        | `lg`      |
| `radius`    | radius token                                       | `lg`      |
| `border`    | `none`, `subtle`, `default`, `strong`              | `default` |
| `elevation` | `none`, `raised`, `floating`, `overlay`            | `raised`  |

Elevation is the token shadow, kept light on the dark theme.

### jp-app-shell

Class `JpAppShell`. Story:
[Primitives/Layout/App Shell](../../libs/ui/src/lib/primitives/app-shell/app-shell.stories.ts).

| Input or output          | Type      | Default                                                     |
| ------------------------ | --------- | ----------------------------------------------------------- |
| `sidebarCollapsed`       | boolean   | `false`                                                     |
| `sidebarCollapsedChange` | `boolean` | Emits the next collapsed value                              |
| `mobileNavOpen`          | boolean   | `false`                                                     |
| `mobileNavOpenChange`    | `boolean` | Menu, scrim, Escape, close, or a viewport grow past `48rem` |
| `sidebarLabel`           | string    | `Primary` (`aria-label` on the sidebar)                     |

Project navigation with `[jpAppShellSidebar]` and page content with
`[jpAppShellMain]`. The shell does not store the two booleans. Bind them.

Breakpoint behavior and the fixed sidebar id `jp-app-shell-sidebar` are in
[Layout](./LAYOUT.md). `Open navigation`, `Close navigation`,
`Expand sidebar`, and `Collapse sidebar` come from `JP_MESSAGES.appShell`.
One shell per document.

### jp-app-shell-nav-item

Class `JpAppShellNavItem`. Also exports `JP_APP_SHELL_NAV_ITEM_TAGS` and
`JpAppShellNavItemTag`. Story:
[Primitives/Layout/App Shell Nav Item](../../libs/ui/src/lib/primitives/app-shell/app-shell-nav-item.stories.ts).

| Input      | Type             | Default                                      |
| ---------- | ---------------- | -------------------------------------------- |
| `as`       | `a`, `button`    | `a`                                          |
| `href`     | string or `null` | `null` (anchors use `#` when enabled)        |
| `active`   | boolean          | `false` (`aria-current="page"` when enabled) |
| `disabled` | boolean          | `false` (removes `href`, `tabindex="-1"`)    |

The label is projected. An icon goes in `[jpAppShellNavIcon]` and is
`aria-hidden`. `routerLink` on the host does not reach the inner anchor.
See [Navigation](./COMPOSITION.md#navigation).

## Typography

`jp-text` separates tag (`as`) and visual `size`. `jp-heading` uses `as`
for both the heading level and the size token. There is no heading `size`
input.

### jp-text

Class `JpText`. Story:
[Primitives/Typography/Text](../../libs/ui/src/lib/primitives/text/text.stories.ts).

| Input      | Type                                          | Default                                           |
| ---------- | --------------------------------------------- | ------------------------------------------------- |
| `as`       | `p`, `span`, `label`, `small`, `strong`, `em` | `p`                                               |
| `size`     | `caption`, `body`, `body-lg`                  | `body`                                            |
| `tone`     | `primary`, `secondary`, `muted`, `disabled`   | `primary`                                         |
| `weight`   | `regular`, `medium`, `semibold`, `bold`       | `regular`                                         |
| `truncate` | boolean                                       | `false`                                           |
| `mono`     | boolean                                       | `false`                                           |
| `forId`    | string or `null`                              | `null` (the `for` attribute when `as` is `label`) |

`span`, `label`, `small`, `strong`, and `em` render inline. `p` renders as
a block. `truncate` forces a single line with an ellipsis and requires a
bounded container.

### jp-heading

Class `JpHeading`. Story:
[Primitives/Typography/Heading](../../libs/ui/src/lib/primitives/heading/heading.stories.ts).

| Input    | Type                                        | Default    |
| -------- | ------------------------------------------- | ---------- |
| `as`     | `h1` through `h6`                           | `h2`       |
| `tone`   | `primary`, `secondary`, `muted`, `disabled` | `primary`  |
| `weight` | `regular`, `medium`, `semibold`, `bold`     | `semibold` |

Sizes are `--jp-font-size-heading-h1` (1.5rem) down to
`--jp-font-size-heading-h6` (0.8125rem).

## Controls

Buttons are not value accessors. `jp-input`, `jp-textarea`, `jp-select`,
`jp-checkbox`, `jp-switch`, `jp-radio-group`, and `jp-combobox` are.
Control sizes are `sm`, `md`, `lg` and follow density. See
[Layout](./LAYOUT.md).

### jp-button

Class `JpButton`. Story:
[Primitives/Controls/Button](../../libs/ui/src/lib/primitives/button/button.stories.ts).

| Input          | Type                                           | Default   |
| -------------- | ---------------------------------------------- | --------- |
| `variant`      | `primary`, `secondary`, `ghost`, `destructive` | `primary` |
| `size`         | `sm`, `md`, `lg`                               | `md`      |
| `type`         | `button`, `submit`, `reset`                    | `button`  |
| `disabled`     | boolean                                        | `false`   |
| `loading`      | boolean                                        | `false`   |
| `loadingLabel` | string                                         | `Loading` |

The label is projected. `loading` disables the inner button and sets
`aria-busy`. `loadingLabel` is visually clipped and becomes `aria-label`
while loading, so it replaces the accessible name. The projected label stays
on screen. Primary uses accent tokens. Destructive uses error tokens.

### jp-icon-button

Class `JpIconButton`. Story:
[Primitives/Controls/Icon Button](../../libs/ui/src/lib/primitives/icon-button/icon-button.stories.ts).

| Input       | Type                        | Default  |
| ----------- | --------------------------- | -------- |
| `ariaLabel` | string                      | required |
| `size`      | `sm`, `md`, `lg`            | `md`     |
| `type`      | `button`, `submit`, `reset` | `button` |
| `disabled`  | boolean                     | `false`  |

The glyph is projected. There is no `variant` input.

### jp-input

Class `JpInput`. Story:
[Primitives/Controls/Input](../../libs/ui/src/lib/primitives/input/input.stories.ts).
Value type: `string`.

| Input                                                                                                | Type                                                          | Default                |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------- |
| `label`, `hint`, `error`, `placeholder`, `ariaLabel`, `name`, `autocomplete`, `pattern`, `inputMode` | string                                                        | `''`                   |
| `type`                                                                                               | `text`, `email`, `password`, `search`, `tel`, `url`, `number` | `text`                 |
| `size`                                                                                               | `sm`, `md`, `lg`                                              | `md`                   |
| `id`                                                                                                 | string or unset                                               | generated `jp-input-N` |
| `required`, `disabled`, `readonly`, `invalid`                                                        | boolean                                                       | `false`                |
| `minLength`, `maxLength`                                                                             | number or `null`                                              | `null`                 |
| `min`, `max`, `step`                                                                                 | string, number, or `null`                                     | `null`                 |

### jp-textarea

Class `JpTextarea`. Story:
[Primitives/Controls/Textarea](../../libs/ui/src/lib/primitives/textarea/textarea.stories.ts).
Value type: `string`.

Same label, hint, error, placeholder, ariaLabel, name, autocomplete, size,
id, required, disabled, readonly, and invalid inputs as `jp-input`.
`minLength` and `maxLength` are number or `null`. `rows` is a number,
default `4` (`numberAttribute`). Id prefix `jp-textarea-N`. No `type`,
`pattern`, `inputMode`, `min`, `max`, or `step`.

### jp-select

Class `JpSelect`. Also exports `JpSelectOption`
(`{ value: string; label: string; disabled?: boolean }`). Story:
[Primitives/Controls/Select](../../libs/ui/src/lib/primitives/select/select.stories.ts).

Native `<select>`. Value type: `string`. Inputs match the shared field set
(`label`, `hint`, `error`, `ariaLabel`, `name`, `autocomplete`, `size`,
`id`, `required`, `disabled`, `invalid`) plus `options` (default `[]`).
Id prefix `jp-select-N`. There is no `placeholder` input.

### jp-checkbox

Class `JpCheckbox`. Story:
[Primitives/Controls/Checkbox](../../libs/ui/src/lib/primitives/checkbox/checkbox.stories.ts).
Value type: `boolean`.

| Input                                | Type            | Default                   |
| ------------------------------------ | --------------- | ------------------------- |
| `indeterminate`                      | boolean         | `false`                   |
| `required`, `disabled`, `invalid`    | boolean         | `false`                   |
| `name`, `ariaLabel`, `hint`, `error` | string          | `''`                      |
| `id`                                 | string or unset | generated `jp-checkbox-N` |

The caption is projected content. There is no `label` input.
`indeterminate` sets the native mixed state. The form value stays boolean.
A non-empty `error` is `role="alert"`.

### jp-switch

Class `JpSwitch`. Story:
[Primitives/Controls/Switch](../../libs/ui/src/lib/primitives/switch/switch.stories.ts).
Value type: `boolean`.

| Input                 | Type            | Default                 |
| --------------------- | --------------- | ----------------------- |
| `id`                  | string or unset | generated `jp-switch-N` |
| `disabled`, `invalid` | boolean         | `false`                 |

The caption is projected and referenced with `aria-labelledby`. The control
is a button with `role="switch"` and `aria-checked`. Space and Enter toggle
it. There is no `label`, `hint`, `error`, or `required` input.

### jp-radio-group

Class `JpRadioGroup`. Also exports `JpRadioOption`
(`{ value: string; label: string; disabled?: boolean }`). Story:
[Primitives/Controls/Radio Group](../../libs/ui/src/lib/primitives/radio-group/radio-group.stories.ts).

Value type: `string`. Renders a `fieldset` of native radios.

| Input                                         | Type                       | Default                      |
| --------------------------------------------- | -------------------------- | ---------------------------- |
| `options`                                     | readonly `JpRadioOption[]` | `[]`                         |
| `label`, `ariaLabel`, `hint`, `error`, `name` | string                     | `''`                         |
| `id`                                          | string or unset            | generated `jp-radio-group-N` |
| `required`, `disabled`, `invalid`             | boolean                    | `false`                      |

`label` is the `legend`. Disabled options cannot be selected. Arrow keys,
Home, and End move among enabled options and select them. Provide `label`
or `ariaLabel`.

### jp-combobox

Class `JpCombobox`. Also exports `JpComboboxOption` (same shape as
`JpRadioOption`). Story:
[Primitives/Controls/Combobox](../../libs/ui/src/lib/primitives/combobox/combobox.stories.ts).

Value type: `string`. One selected value. The textbox is `role="combobox"`
with a listbox popup. A hidden input carries `name` when `name` is set.

| Input                                         | Type                          | Default                   |
| --------------------------------------------- | ----------------------------- | ------------------------- |
| `options`                                     | readonly `JpComboboxOption[]` | `[]`                      |
| `placeholder`                                 | string                        | `Search options`          |
| `loading`                                     | boolean                       | `false`                   |
| `loadingText`                                 | string                        | `Loading options…`        |
| `emptyText`                                   | string                        | `No results found.`       |
| `label`, `ariaLabel`, `hint`, `error`, `name` | string                        | `''`                      |
| `id`                                          | string or unset               | generated `jp-combobox-N` |
| `required`, `disabled`, `invalid`             | boolean                       | `false`                   |

`open`, `query`, `activeIndex`, and `value` are component state, not
inputs. Filtering compares the typed query to option labels locally. The
application loads options and sets `loading`. Arrow keys, Home, and End move
among enabled matches. Enter selects. Escape, Tab, and blur close. Loading
blocks selection. Clearing the query clears the value. Use `error` for a
failed request. `emptyText` is an empty successful filter.

The popup uses the shared overlay positioner (`popover="manual"`, with a
fixed-position fallback). Full top-layer parity is not claimed.

## Data display

### jp-badge

Class `JpBadge`. Story:
[Primitives/Data Display/Badge](../../libs/ui/src/lib/primitives/badge/badge.stories.ts).

| Input  | Type                                                       | Default   |
| ------ | ---------------------------------------------------------- | --------- |
| `tone` | `neutral`, `accent`, `success`, `warning`, `error`, `info` | `neutral` |
| `size` | `sm`, `md`                                                 | `md`      |

The label is projected. The badge is not a button. A value the user can
remove is `jp-chip`, not a badge.

### jp-chip

Class `JpChip`. Also exports `JP_CHIP_SIZES` and `JpChipSize`. Story:
[Primitives/Controls/Chip](../../libs/ui/src/lib/primitives/chip/chip.stories.ts).

Removable filter or selection. The application owns the collection and
deletes the item when `removed` emits. Status that cannot be removed stays
on `jp-badge`. Showcase `/product-recipes` still removes toolbar filters
with the toolbar's own buttons.

| Input or output | Type       | Default                                   |
| --------------- | ---------- | ----------------------------------------- |
| `label`         | string     | required                                  |
| `size`          | `sm`, `md` | `md` (any other value falls back to `md`) |
| `disabled`      | boolean    | `false`                                   |
| `removed`       | `void`     | click, Enter, Space, Delete, or Backspace |

The remove control is `type="button"`. Its accessible name comes from
`JP_MESSAGES.chip.remove`. The English default is `Remove` plus the label
(`Remove Healthy`). The icon is `aria-hidden`. The visible
text is `label`, which truncates with an ellipsis. The remove button stays
visible. `disabled` blocks click, Delete, and Backspace.

Tab lands on the remove button. Delete or Backspace while focus is inside
the chip removes it and calls `preventDefault` so Backspace does not
navigate. After removal, focus moves to the next enabled sibling chip's
remove button, or the previous one if there is no next sibling. When no
sibling button remains, focus is the application's job.

Lay chips out with `jp-inline` (it wraps by default). The chip does not
build a `+N` overflow menu.

### jp-empty-state

Class `JpEmptyState`. Story:
[Primitives/Data Display/Empty State](../../libs/ui/src/lib/primitives/empty-state/empty-state.stories.ts).

| Input         | Type   | Default  |
| ------------- | ------ | -------- |
| `title`       | string | required |
| `description` | string | `''`     |

Host `role="status"`. Icon slot: `[jpEmptyStateIcon]`. Actions are the
default slot, usually a `jp-button`.

### jp-table

Class `JpTable`. Also exports `JpTableCellDef`, `JpTableRowKey`
(`string | number`), `JpTableSort` (`{ key: string; direction: 'asc' | 'desc' }`),
`JpSortableTableColumn` (`JpTableColumn` plus optional `sortable`), and
`JpTableCellContext`. `JpTableColumn` is `{ key, header, align? }` with
`align` of `start`, `center`, or `end`. `JpTableCellValue` is
`string | number | null | undefined`. Story:
[Primitives/Data Display/Table](../../libs/ui/src/lib/primitives/table/table.stories.ts).

| Input or output    | Type                                   | Default                                |
| ------------------ | -------------------------------------- | -------------------------------------- |
| `caption`          | string                                 | `''`                                   |
| `columns`          | `JpSortableTableColumn[]`              | `[]`                                   |
| `rows`             | `Record<string, JpTableCellValue>[]`   | `[]`                                   |
| `striped`          | boolean                                | `false`                                |
| `emptyTitle`       | string                                 | `No data`                              |
| `emptyDescription` | string                                 | `''`                                   |
| `rowKey`           | field name or `(row) => JpTableRowKey` | `'id'`                                 |
| `sort`             | `JpTableSort` or `null`                | `null`                                 |
| `sortChange`       | `JpTableSort` or `null`                | asc, then desc, then `null`            |
| `selectable`       | boolean                                | `false`                                |
| `selectedKeys`     | readonly `JpTableRowKey[]`             | `[]`                                   |
| `selectionChange`  | `JpTableRowKey[]`                      | full key list, including off-page keys |
| `rowLabel`         | `(row) => string`                      | text of the first column               |

The table does not fetch, filter, or reorder `rows`. Sortable headers set
`aria-sort`. A row whose key is not a string or number can render and cannot
be selected. The header checkbox selects the current page only.
`selectionChange` preserves keys that are not on the page.

Rich cells: `<ng-template jpTableCell="columnKey" let-value>`. Context also
exposes `value`, `row`, and `column`. `JpTableCellDef` is that directive.
`jpTableCell` is required and is the column key.

Project a `jp-empty-state` to replace `emptyTitle` / `emptyDescription`.
The frame scrolls horizontally. See [Layout](./LAYOUT.md).

### jpTableCell

Directive `JpTableCellDef`, selector `ng-template[jpTableCell]`. Covered by
the table story. `jpTableCell` is the required column key.

### jp-table-toolbar

Class `JpTableToolbar`. Also exports `JpTableFilter`
(`{ key: string; label: string }`). Story:
[Primitives/Data Display/Table Toolbar](../../libs/ui/src/lib/primitives/table-toolbar/table-toolbar.stories.ts).

| Input or output | Type                       | Default                                     |
| --------------- | -------------------------- | ------------------------------------------- |
| `label`         | string                     | `Table controls` (the section `aria-label`) |
| `activeFilters` | readonly `JpTableFilter[]` | `[]`                                        |
| `selectedCount` | number                     | `0`                                         |
| `disabled`      | boolean                    | `false`                                     |
| `removeFilter`  | `string`                   | the filter key                              |
| `clearFilters`  | `void`                     | emitted by Clear filters                    |

Slots, which are not directives: `[jpTableSearch]`, `[jpTableFilters]`,
`[jpTableActions]`, `[jpTableBulkActions]`. The bulk-action slot renders
when `selectedCount > 0`, next to `{count} selected` (`role="status"`).
Each active filter is a button whose accessible name comes from
`JP_MESSAGES.tableToolbar.removeFilter`. `Clear filters`, `Active filters`,
and the selection sentence use that same token. The component emits the key.
The application removes the filter.

### jp-pagination

Class `JpPagination`. Story:
[Primitives/Data Display/Pagination](../../libs/ui/src/lib/primitives/pagination/pagination.stories.ts).

| Input or output | Type    | Default                   |
| --------------- | ------- | ------------------------- |
| `page`          | number  | `1` (one-based)           |
| `pageSize`      | number  | `10`                      |
| `total`         | number  | `0` (record count)        |
| `disabled`      | boolean | `false`                   |
| `label`         | string  | `Table pagination`        |
| `pageChange`    | number  | a different in-range page |

Non-finite page size falls back to `10`. Page size below `1` becomes `1`.
The summary and buttons use `JP_MESSAGES.pagination`. English defaults are
`start–end of total`, `First page`, `Previous`, `Page N of M`, `Next`, and
`Last page`. The summary
is `aria-live="polite"`. The component does not slice rows. Localization of
these strings is in [the localization contract](../localization/CONTRACT.md).

## Navigation

### jp-tabs

Class `JpTabs`. Also exports `JpTab`
(`{ value: string; label: string; disabled?: boolean }`). Story:
[Primitives/Navigation/Tabs](../../libs/ui/src/lib/primitives/tabs/tabs.stories.ts).

| Input or model  | Type               | Default               |
| --------------- | ------------------ | --------------------- |
| `tabs`          | readonly `JpTab[]` | `[]`                  |
| `ariaLabel`     | string             | `Tabs`                |
| `id`            | string             | generated `jp-tabs-N` |
| `selectedValue` | model `string`     | `''`                  |

`[(selectedValue)]` and `selectedValueChange` both work. A missing or
disabled selection falls back to the first enabled tab. Project one
`<ng-template jpTabPanel="value">` per tab. Inactive panels stay in the DOM
with the `hidden` attribute. Arrow keys, Home, and End move focus and follow
writing direction. Enter or Space selects. Click selects. Values should be
unique. Pass a stable `id` when the same tabs are rendered on the server and
the client.

### jpTabPanel

Directive `JpTabPanel`, selector `ng-template[jpTabPanel]`. The
`jpTabPanel` input is the required tab value (alias of `value`).

### jp-breadcrumbs

Class `JpBreadcrumbs`. Also exports `JpBreadcrumb`
(`{ label: string; href?: string }`). Story:
[Primitives/Navigation/Breadcrumbs](../../libs/ui/src/lib/primitives/breadcrumbs/breadcrumbs.stories.ts).

| Input       | Type                      | Default      |
| ----------- | ------------------------- | ------------ |
| `items`     | readonly `JpBreadcrumb[]` | `[]`         |
| `ariaLabel` | string                    | `Breadcrumb` |

Earlier items with `href` are links. Items without `href` are text. The last
item is always text with `aria-current="page"`, including when it has
`href`.

## Feedback and overlays

Dialogs call native `showModal()` when it exists. Anchored popovers, menus,
combobox lists, and tooltips use the native popover top layer through the
private overlay helpers (not re-exported). Positioning flips and clamps to
the viewport. Escape and outside pointer dismiss the highest registered
overlay first. If `showModal` or `showPopover` throws, the component falls
back. That fallback does not claim the same clipping and inert behavior.

### jp-skeleton

Class `JpSkeleton`. Story:
[Primitives/Feedback/Skeleton](../../libs/ui/src/lib/primitives/skeleton/skeleton.stories.ts).

| Input      | Type                          | Default |
| ---------- | ----------------------------- | ------- |
| `shape`    | `text`, `rectangle`, `circle` | `text`  |
| `animated` | boolean                       | `true`  |

The host is `aria-hidden`. `circle` uses a square aspect ratio. `text` and
`rectangle` share the block styles. Size the host from the parent. Animation
is disabled under `prefers-reduced-motion`. The application sets `aria-busy`
and a named `jp-progress` or other status. The skeleton does not announce.

### jp-progress

Class `JpProgress`. Story:
[Primitives/Feedback/Progress](../../libs/ui/src/lib/primitives/progress/progress.stories.ts).

| Input       | Type             | Default                                |
| ----------- | ---------------- | -------------------------------------- |
| `label`     | string           | `Loading` (`aria-label`)               |
| `value`     | number or `null` | `null` (indeterminate)                 |
| `max`       | number           | `100`                                  |
| `valueText` | string           | `''` (`aria-valuetext` when non-empty) |

`role="progressbar"`. Non-finite or non-positive `max` becomes `100`.
Non-finite `value` is indeterminate. Finite values clamp to `0..max`.

### jp-inline-alert

Class `JpInlineAlert`. Also exports `JP_INLINE_ALERT_TONES` and
`JpInlineAlertTone`. Story:
[Primitives/Feedback/InlineAlert](../../libs/ui/src/lib/primitives/inline-alert/inline-alert.stories.ts).

| Input or output                   | Type                                  | Default                      |
| --------------------------------- | ------------------------------------- | ---------------------------- |
| `tone`                            | `info`, `success`, `warning`, `error` | `info`                       |
| `title`, `message`, `actionLabel` | string                                | `''`                         |
| `action`                          | `void`                                | emitted by the action button |

`tone="error"` uses `role="alert"`. Other tones use `role="status"`.
The action button renders only when `actionLabel` is non-empty. Extra
content can be projected. The application owns retry.

### jpFocusTrap

Directive `JpFocusTrap`, selector `[jpFocusTrap]`. No standalone story. Dialog
stories mount it. Spec: `libs/ui/src/lib/primitives/shared/focus-trap.ts`.

| Input         | Type    | Default |
| ------------- | ------- | ------- |
| `jpFocusTrap` | boolean | `true`  |

When active, Tab cycles inside the host. The directive moves focus itself so
WebKit does not skip buttons. Also exported: `JP_FOCUSABLE_SELECTOR`,
`getFocusableElements`, `focusFirstElement`, `trapTabKey`.

### jp-tooltip

Class `JpTooltip`. Story:
[Primitives/Feedback/Tooltip](../../libs/ui/src/lib/primitives/tooltip/tooltip.stories.ts).

| Input       | Type                             | Default  |
| ----------- | -------------------------------- | -------- |
| `content`   | string                           | required |
| `placement` | `top`, `bottom`, `left`, `right` | `top`    |

Wrap a trigger. Pointer enter and focus show it. It stays open while the
pointer is over the tooltip. Leave, blur, and Escape hide it. While open it
appends its id to the trigger's `aria-describedby` and removes that token on
close. Empty `content` does not open. The id is an incrementing counter.

### jp-toast

Class `JpToast`. Story:
[Primitives/Feedback/Toast](../../libs/ui/src/lib/primitives/toast/toast.stories.ts).

| Input or output | Type                                             | Default                |
| --------------- | ------------------------------------------------ | ---------------------- |
| `message`       | string                                           | required               |
| `tone`          | `neutral`, `success`, `warning`, `error`, `info` | `neutral`              |
| `dismissed`     | `void`                                           | emitted by `dismiss()` |

Host `role="status"`. Prefer `JpToastService` plus `jp-toast-outlet` for
application toasts. `jp-toast` is the presentational piece the outlet renders.

### JpToastService

`providedIn: 'root'`. Same toast story as `jp-toast`.

| Member          | Behavior                                   |
| --------------- | ------------------------------------------ |
| `items`         | readonly signal of `JpToastItem`           |
| `show(options)` | appends a toast and returns its numeric id |
| `dismiss(id)`   | removes that id                            |
| `clear()`       | removes every toast                        |

`JpToastOptions` is `{ message: string; tone?: JpToastTone; durationMs?: number }`.
`tone` defaults to `neutral`. `durationMs` defaults to `4000`. A duration
greater than `0` schedules `dismiss` with `window.setTimeout`. The timer is
skipped when `window` is undefined or when `durationMs` is not greater than
`0`.

### jp-toast-outlet

Class `JpToastOutlet`. Place one outlet near the application root. It reads
`JpToastService.items`, renders a `jp-toast` per item, and is
`aria-live="polite"`. It has no inputs.

### jp-dialog

Class `JpDialog`. Story:
[Primitives/Feedback/Dialog](../../libs/ui/src/lib/primitives/dialog/dialog.stories.ts).

| Input or output | Type      | Default                                             |
| --------------- | --------- | --------------------------------------------------- |
| `open`          | boolean   | `false`                                             |
| `openChange`    | `boolean` | emits `false` on Escape, scrim, or the close button |
| `title`         | string    | required (`aria-labelledby`)                        |
| `closeLabel`    | string    | `Close dialog`                                      |

Uses `<dialog>` with `aria-modal="true"` and `jpFocusTrap` while open.
Backdrop pointer and the `cancel` event close it. Focus returns to the
opener, including a dropdown trigger that opened the dialog. Body content is
the default slot. Actions use `[jpDialogActions]`. `titleId` is
`Math.random()` and is not an input. The dialog element is created only
while `open` is true.

### jpDialogActions

Directive `JpDialogActions`, selector `[jpDialogActions]`. Adds the actions
class. No inputs.

### jp-popover

Class `JpPopover`. Story:
[Primitives/Feedback/Popover](../../libs/ui/src/lib/primitives/popover/popover.stories.ts).

| Input or output | Type      | Default                                |
| --------------- | --------- | -------------------------------------- |
| `open`          | boolean   | `false`                                |
| `openChange`    | `boolean` | Escape, outside pointer, or `toggle()` |

`contentId` is `Math.random()`. Put `[jpPopoverTrigger]` on the anchor and
`[jpPopoverContent]` on the panel. Both directives are children of
`jp-popover` and inject it.

### jpPopoverTrigger

Directive `JpPopoverTrigger`, selector `[jpPopoverTrigger]`. Click toggles
the parent popover and stops propagation. Sets `aria-expanded` and
`aria-controls`.

### jpPopoverContent

Directive `JpPopoverContent`, selector `[jpPopoverContent]`.
`role="region"`. `hidden` while the popover is closed.

### jp-dropdown-menu

Class `JpDropdownMenu`. Story:
[Primitives/Feedback/Dropdown Menu](../../libs/ui/src/lib/primitives/dropdown-menu/dropdown-menu.stories.ts).

| Input or output | Type      | Default                                                 |
| --------------- | --------- | ------------------------------------------------------- |
| `open`          | boolean   | `false`                                                 |
| `openChange`    | `boolean` | Escape, outside pointer, item activation, or `toggle()` |

`menuId` is `Math.random()`. Opening moves focus to the first item. Closing
returns focus to the trigger when focus is still inside the menu. An outside
click does not steal focus from the element that was clicked. Arrow keys,
Home, and End move between items.

### jpDropdownTrigger

Directive `JpDropdownTrigger`, selector `[jpDropdownTrigger]`.
`aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`. Click toggles
the parent menu.

### jpDropdownMenuItem

Directive `JpDropdownMenuItem`, selector `[jpDropdownMenuItem]`. Put it on a
`button`.

| Input or output | Type    | Default                                                   |
| --------------- | ------- | --------------------------------------------------------- |
| `disabled`      | boolean | `false` (`aria-disabled`, `tabindex="-1"`, click ignored) |
| `itemSelect`    | `void`  | emitted before the menu closes                            |

Enter and Space activate the native button.

## Assistant

The service is the source of open state, context, and messages. Content is
plain text. There is no Markdown and no HTML parsing. The service does not
perform network requests. Role labels on `jp-assistant-message` come from
`JP_MESSAGES.assistant.roles`. English defaults are `You`, `Assistant`, and
`System`.

`JpAssistantContext` is
`{ label: string; description?: string; entityType?: string; entityId?: string }`.
`JpAssistantMessageRole` is `user`, `assistant`, or `system`.
Response status is `pending`, `complete`, `error`, or `cancelled`.

### JpAssistantService

`providedIn: 'root'`. Story:
[Primitives/Assistant/Panel](../../libs/ui/src/lib/primitives/assistant/assistant.stories.ts).
Also exports `JpAssistantResponseStatus` and `JpAssistantResponseMessage`.

| Member                                       | Behavior                                                                                                          |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `isOpen`, `context`, `messages`, `isPending` | readonly signals                                                                                                  |
| `open(options?)`                             | opens; `options.context` replaces context when provided; `options.clearMessages` clears history first             |
| `close()`                                    | closes                                                                                                            |
| `toggle(options?)`                           | closes when open, otherwise `open(options)`                                                                       |
| `setContext` / `clearContext`                | sets or clears context                                                                                            |
| `addMessage({ role, content })`              | appends a finished message and returns its id                                                                     |
| `clearMessages()`                            | removes every message                                                                                             |
| `beginResponse(content = '')`                | appends a pending assistant message and returns its id                                                            |
| `updateResponse(id, content)`                | replaces pending text for that id                                                                                 |
| `completeResponse(id, content?)`             | settles pending as `complete`                                                                                     |
| `failResponse(id, error?)`                   | settles pending as `error`; default error text is `The response could not be completed. Please try again.`        |
| `cancelResponse(id)`                         | settles pending as `cancelled`                                                                                    |
| `retryResponse(id)`                          | if status is `error` or `cancelled`, replaces that message with a new pending id and returns it; otherwise `null` |

Updates for an id that is not pending are ignored. That covers settled,
replaced, and cleared requests. `retryResponse` changes the id so a late
chunk from the old transport cannot overwrite the retry.

### jpAssistantTrigger

Directive `JpAssistantTrigger`, selector `[jpAssistantTrigger]`.

| Input                      | Type                           | Default |
| -------------------------- | ------------------------------ | ------- |
| `jpAssistantContext`       | `JpAssistantContext` or `null` | `null`  |
| `jpAssistantClearMessages` | boolean                        | `false` |

Click calls `open` with those values. It does not toggle closed.

### jp-assistant-message

Class `JpAssistantMessage`. Same assistant story.

| Input         | Type                          | Default     |
| ------------- | ----------------------------- | ----------- |
| `messageRole` | `user`, `assistant`, `system` | `assistant` |
| `content`     | string                        | required    |

The input is `messageRole` so a template does not set the HTML `role`
attribute to `assistant` or `system`. The visible role name defaults to
`You`, `Assistant`, or `System` and comes from
`JP_MESSAGES.assistant.roles`.

### jp-assistant-panel

Class `JpAssistantPanel`. Same assistant story. Place one panel. It reads
the root service.

| Input or output     | Type                                         | Default                                                            |
| ------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| `title`             | string                                       | `JP Assistant`                                                     |
| `closeLabel`        | string                                       | `Close assistant`                                                  |
| `clearContextLabel` | string                                       | `Clear context`                                                    |
| `composerLabel`     | string                                       | `Message the assistant`                                            |
| `sendLabel`         | string                                       | `Send`                                                             |
| `pendingLabel`      | string                                       | `Generating response`                                              |
| `cancelLabel`       | string                                       | `Stop response`                                                    |
| `retryLabel`        | string                                       | `Retry`                                                            |
| `cancelledLabel`    | string                                       | `Response stopped`                                                 |
| `emptyTitle`        | string                                       | `Ask about this surface`                                           |
| `emptyDescription`  | string                                       | `Open the assistant from a context trigger, then send a question.` |
| `placeholder`       | string                                       | `Ask a question…`                                                  |
| `messageSubmit`     | `string`                                     | trimmed composer text                                              |
| `responseCancel`    | `number`                                     | the id the user stopped                                            |
| `responseRetry`     | `{ previousId: number; responseId: number }` | emitted when `retryResponse` returns a new id                      |

Enter sends. Shift+Enter inserts a newline. Escape closes. Focus moves to
the composer on open and returns to the previous element on close. Submit is
ignored while `isPending` is true or the draft is empty. The user message is
added before `messageSubmit` emits. `responseCancel` also marks the response
cancelled in the service; abort the transport in that handler. Restart
transport with `responseId` from `responseRetry`. Desktop is a dock. At
`max-width: 48rem` the panel uses a scrim and traps focus. The composer id
is `jp-assistant-composer-N`.

The copyable transport wiring is in [Recipes](./RECIPES.md#assistant-transport).

## Deprecated

### lib-ui

Class `Ui`, selector `lib-ui`. Exported with `@deprecated`. No Storybook
story. The removal version is unassigned. New screens use the layout and
typography primitives above. Details:
[Compatibility](../governance/COMPATIBILITY.md).

## Preview component expansion

For new links, icons, disclosure, identity, structured content, form composition,
selection controls, banners, and drawers, see [the expansion API guide](../COMPONENT_EXPANSION.md).
These additions are preview APIs with explicit limits.
