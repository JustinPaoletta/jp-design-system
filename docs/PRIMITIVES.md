# Primitives

Reference for layout, typography, shell, control, data-display, feedback, and
assistant primitives in `libs/ui`. All primitives use design tokens, strict typed
inputs, and OnPush change detection.

See also: [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md), [JP_ROADMAP.md](./JP_ROADMAP.md),
[ASSISTANT_SYSTEM_PLAN.md](./ASSISTANT_SYSTEM_PLAN.md).

---

## Conventions

- **Selectors:** `jp-*` (e.g. `jp-box`, `jp-heading`). Legacy `lib-ui` is deprecated.
- **No style/class inputs:** Visual values come from token-backed props only.
- **Accent toolbar:** Available globally (stories default to Neon). Layout and
  typography primitives have little/no accent-driven UI, so Neon → Cobalt may look
  unchanged there. Accent is meaningful on controls, accent badges, active shell
  nav, assistant chrome, composition stories, and Showcase pages.
- **Semantic `as` props:** Set the rendered HTML tag for accessibility. Behavior
  differs by primitive — see typography section below.

---

## Layout primitives

### `jp-box`

Structural wrapper — padding and max-width only. No border or background. Use
`jp-surface` for visual panels.

| Input      | Values                                                                  | Default |
| ---------- | ----------------------------------------------------------------------- | ------- |
| `as`       | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div`   |
| `padding`  | space tokens                                                            | `none`  |
| `paddingX` | space token or `null` (overrides horizontal; use `none` to clear)       | `null`  |
| `paddingY` | space token or `null` (overrides vertical; use `none` to clear)         | `null`  |
| `maxWidth` | `none`, `narrow`, `wide`                                                | `none`  |

`paddingX` / `paddingY` axis overrides: `null` inherits the base `padding` value on
that axis; `'none'` explicitly clears padding on that axis (e.g.
`padding="lg" paddingX="none"` keeps vertical `lg` and zeroes horizontal padding).

### `jp-stack`

Vertical flex layout.

| Input     | Values                                                                  | Default   |
| --------- | ----------------------------------------------------------------------- | --------- |
| `as`      | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div`     |
| `gap`     | space tokens                                                            | `md`      |
| `align`   | `start`, `center`, `end`, `stretch`                                     | `stretch` |
| `justify` | `start`, `center`, `end`, `between`                                     | `start`   |

### `jp-inline`

Horizontal flex layout.

| Input     | Values                                                                  | Default  |
| --------- | ----------------------------------------------------------------------- | -------- |
| `as`      | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div`    |
| `gap`     | space tokens                                                            | `sm`     |
| `align`   | `start`, `center`, `end`, `stretch`                                     | `center` |
| `justify` | `start`, `center`, `end`, `between`                                     | `start`  |
| `wrap`    | boolean                                                                 | `true`   |

### `jp-grid`

CSS grid layout.

| Input       | Values                                                                  | Default |
| ----------- | ----------------------------------------------------------------------- | ------- |
| `as`        | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div`   |
| `columns`   | `1`, `2`, `3`, `4`, `6`                                                 | `3`     |
| `gap`       | space tokens                                                            | `md`    |
| `mode`      | `fixed`, `auto-fit`                                                     | `fixed` |
| `minColumn` | `sm`, `md`, `lg`                                                        | `md`    |

### `jp-surface`

Visual panel — background, border, elevation, radius, padding.

| Input       | Values                                                                  | Default   |
| ----------- | ----------------------------------------------------------------------- | --------- |
| `as`        | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `section` |
| `tone`      | `canvas`, `sunken`, `subtle`, `raised`, `emphasis`                      | `raised`  |
| `padding`   | space tokens                                                            | `lg`      |
| `border`    | `none`, `subtle`, `default`, `strong`                                   | `default` |
| `elevation` | `none`, `raised`, `floating`, `overlay`                                 | `raised`  |
| `radius`    | radius tokens                                                           | `lg`      |

### `jp-app-shell`

Application chrome — sidebar + main content regions with desktop collapse and
mobile drawer.

| Input / output           | Type      | Default     | Notes                                        |
| ------------------------ | --------- | ----------- | -------------------------------------------- |
| `sidebarCollapsed`       | `boolean` | `false`     | Collapses sidebar to icon rail width         |
| `sidebarCollapsedChange` | `output`  | —           | Emits when the toolbar toggle is clicked     |
| `mobileNavOpen`          | `boolean` | `false`     | Opens the off-canvas drawer below breakpoint |
| `mobileNavOpenChange`    | `output`  | —           | Emits on menu toggle, scrim click, or Escape |
| `sidebarLabel`           | `string`  | `'Primary'` | `aria-label` for the sidebar landmark        |

**Content projection:**

- `[jpAppShellSidebar]` — primary navigation slot (renders inside `<aside>`)
- `[jpAppShellMain]` — page content slot

**Behavior:**

- Desktop (> `--jp-layout-shell-mobile-max` / `48rem`): sidebar visible; collapse
  toggles expanded vs icon-rail widths.
- Mobile (`≤ 48rem`): sidebar hidden by default; menu button opens drawer +
  scrim; Escape / scrim / close button dismiss; focus moves into the drawer and
  returns to the menu trigger on close; main is `inert` while open.

### `jp-app-shell-nav-item`

Single navigation row for use inside the shell sidebar.

| Input      | Values           | Default | Notes                                                   |
| ---------- | ---------------- | ------- | ------------------------------------------------------- |
| `as`       | `a`, `button`    | `a`     | Rendered interactive element                            |
| `href`     | string or `null` | `null`  | Used when `as="a"` (falls back to `#`)                  |
| `active`   | boolean          | `false` | Accent indicator + `aria-current="page"`                |
| `disabled` | boolean          | `false` | Non-interactive; muted chrome (demo stubs, unavailable) |

Optional icon slot: project into `[jpAppShellNavIcon]`. Labels are visually
hidden when the parent shell is collapsed.

---

## Typography primitives

### Design split: `jp-text` vs `jp-heading`

| Concern            | `jp-text`                                      | `jp-heading`                                 |
| ------------------ | ---------------------------------------------- | -------------------------------------------- |
| Purpose            | Body copy, labels, inline emphasis             | Page and section titles                      |
| Semantic tags      | `p`, `span`, `label`, `small`, `strong`, `em`  | `h1`–`h6`                                    |
| Size control       | **`size` prop** (`caption`, `body`, `body-lg`) | **`as` prop only** — no `size`               |
| Tag vs visual size | Independent — `as` and `size` are separate     | Coupled — each level has a fixed token scale |

**Why `jp-heading` has no `size` prop:** Heading levels carry both semantic
meaning and visual hierarchy. A separate size override would fight the level
system and invite inconsistency. Pick the correct `h*` level instead. For
non-heading copy at a specific scale, use `jp-text`.

### `jp-text`

| Input      | Values                                        | Default   |
| ---------- | --------------------------------------------- | --------- |
| `as`       | `p`, `span`, `label`, `small`, `strong`, `em` | `p`       |
| `size`     | `caption`, `body`, `body-lg`                  | `body`    |
| `tone`     | `primary`, `secondary`, `muted`, `disabled`   | `primary` |
| `weight`   | `regular`, `medium`, `semibold`, `bold`       | `regular` |
| `truncate` | boolean                                       | `false`   |
| `mono`     | boolean                                       | `false`   |
| `forId`    | string or `null` (for `label`)                | `null`    |

**Truncate behavior:** When `true`, text stays on one line and shows `…` when the
**container** is narrower than the content. The host applies `min-width: 0` and
`max-width: 100%` so truncation works inside flex layouts. When `false`, text
wraps normally.

**Inline behavior:** `span`, `label`, `small`, `strong`, and `em` render inline
(the host sets `display: inline`). `p` renders as block.

### `jp-heading`

| Input    | Values                                      | Default    |
| -------- | ------------------------------------------- | ---------- |
| `as`     | `h1`, `h2`, `h3`, `h4`, `h5`, `h6`          | `h2`       |
| `tone`   | `primary`, `secondary`, `muted`, `disabled` | `primary`  |
| `weight` | `regular`, `medium`, `semibold`, `bold`     | `semibold` |

**Level → size mapping** (via `--jp-font-size-heading-h*` tokens):

| Level | Token                       | Default size |
| ----- | --------------------------- | ------------ |
| `h1`  | `--jp-font-size-heading-h1` | 1.5rem       |
| `h2`  | `--jp-font-size-heading-h2` | 1.25rem      |
| `h3`  | `--jp-font-size-heading-h3` | 1.125rem     |
| `h4`  | `--jp-font-size-heading-h4` | 1rem         |
| `h5`  | `--jp-font-size-heading-h5` | 0.875rem     |
| `h6`  | `--jp-font-size-heading-h6` | 0.8125rem    |

Each step down in level produces a visibly smaller heading. Changing `as` updates
both the HTML tag and font size.

---

## Control primitives

Controls. No `class` / `style` inputs. Field controls implement
`ControlValueAccessor`. Buttons do not.

### `jp-button`

| Input      | Values                                         | Default   |
| ---------- | ---------------------------------------------- | --------- |
| `variant`  | `primary`, `secondary`, `ghost`, `destructive` | `primary` |
| `size`     | `sm`, `md`, `lg`                               | `md`      |
| `type`     | `button`, `submit`, `reset`                    | `button`  |
| `disabled` | boolean                                        | `false`   |

`loading` defaults to `false` and disables the inner native button while setting `aria-busy`. `loadingLabel` defaults to `'Loading'`; use a meaningful action-specific label. An empty loading label preserves the projected name.

Label content is projected. Primary uses accent tokens; destructive uses
state-error tokens.

### `jp-icon-button`

| Input       | Values                      | Default  | Notes                          |
| ----------- | --------------------------- | -------- | ------------------------------ |
| `ariaLabel` | string (required)           | —        | Accessible name for the button |
| `size`      | `sm`, `md`, `lg`            | `md`     | Square control size            |
| `type`      | `button`, `submit`, `reset` | `button` | Native button type             |
| `disabled`  | boolean                     | `false`  |                                |

Icon glyph is projected content. Default styling is ghost-like.

### `jp-input`

| Input         | Values                                                        | Default   | Notes                                                      |
| ------------- | ------------------------------------------------------------- | --------- | ---------------------------------------------------------- |
| `label`       | string                                                        | `''`      | Associated via `for` / `id`                                |
| `hint`        | string                                                        | `''`      | Linked with `aria-describedby` when no error               |
| `error`       | string                                                        | `''`      | Linked with `aria-describedby`; takes precedence over hint |
| `type`        | `text`, `email`, `password`, `search`, `tel`, `url`, `number` | `text`    |                                                            |
| `size`        | `sm`, `md`, `lg`                                              | `md`      |                                                            |
| `disabled`    | boolean                                                       | `false`   |                                                            |
| `readonly`    | boolean                                                       | `false`   |                                                            |
| `invalid`     | boolean                                                       | `false`   | Sets `aria-invalid` + invalid border                       |
| `placeholder` | string                                                        | `''`      |                                                            |
| `id`          | string or unset                                               | generated |                                                            |

CVA value type: `string`.

### `jp-textarea`

Field inputs: `label`, `hint`, `error`, `size`, `disabled`, `readonly`, `invalid`, `placeholder`, and `id`, plus:

| Input  | Values | Default |
| ------ | ------ | ------- |
| `rows` | number | `4`     |

CVA value type: `string`.

### `jp-select`

Native `<select>` styled with field tokens.

| Input      | Values                               | Default   | Notes |
| ---------- | ------------------------------------ | --------- | ----- |
| `label`    | string                               | `''`      |       |
| `hint`     | string                               | `''`      |       |
| `error`    | string                               | `''`      |       |
| `size`     | `sm`, `md`, `lg`                     | `md`      |       |
| `disabled` | boolean                              | `false`   |       |
| `invalid`  | boolean                              | `false`   |       |
| `options`  | `{ value: string; label: string }[]` | `[]`      |       |
| `id`       | string or unset                      | generated |       |

CVA value type: `string`.

### `jp-checkbox`

| Input      | Values          | Default   | Notes |
| ---------- | --------------- | --------- | ----- |
| `disabled` | boolean         | `false`   |       |
| `invalid`  | boolean         | `false`   |       |
| `id`       | string or unset | generated |       |

Label is projected content. CVA value type: `boolean`. Additional inputs: `indeterminate` (`false`), `name`, `ariaLabel`, `hint`, `error` (all empty strings), and `required` (`false`). Indeterminate affects native mixed state; the form value remains boolean.

### `jp-switch`

| Input      | Values          | Default   | Notes |
| ---------- | --------------- | --------- | ----- |
| `disabled` | boolean         | `false`   |       |
| `invalid`  | boolean         | `false`   |       |
| `id`       | string or unset | generated |       |

Uses `role="switch"` and `aria-checked`. Track uses accent when on. Label is
projected content. CVA value type: `boolean`.

---

### Native field attributes

`jp-input`, `jp-textarea`, and `jp-select` forward `ariaLabel`, `name`, `autocomplete` (empty strings), and `required` (`false`) to their inner native controls. Input/textarea also forward nullable `minLength` and `maxLength`. Input additionally forwards nullable `min`, `max`, `step`, and empty-string `pattern` and `inputMode`. Use the named Angular input casing (for example `[minLength]`). Error text implies invalid state and overrides hint in `aria-describedby`.

CVA controls integrate with reactive forms and `ngModel`; validation rules and when errors appear belong to the consumer. Native constraints supplement those rules. Stable explicit `id` values are recommended for server rendering. Checkbox and radio groups forward `name`/`required`; combobox uses a named hidden input for the selected value.

### `jp-radio-group`

String CVA with native radios. Inputs: `options: readonly JpRadioOption[]` (default `[]`, each `{ value: string, label: string, disabled?: boolean }`), `label`, `ariaLabel`, `hint`, `error`, `name` (empty strings), optional `id` (generated), and `required`, `disabled`, `invalid` (all `false`). Disabled options cannot be selected. Provide a visible label or accessible name.

### `jp-combobox`

Searchable string CVA with listbox options. Inputs match radio group fields, using `readonly JpComboboxOption[]` with the same option shape, plus `placeholder` (`'Search options'`), `loading` (`false`), `loadingText` (`'Loading options…'`), and `emptyText` (`'No results found.'`). `error` renders field/request error text; there is no separate request-error input.

Arrows/Home/End navigate enabled matches; Enter selects; Escape/Tab/blur close. Loading prevents selection. Filtering uses option labels locally; applications own asynchronous loading. `open`, `query`, `activeIndex`, and `value` are implementation state, not binding inputs. Provide a stable `id` for server rendering and distinguish empty results from request failure.

---

## Data display primitives

Table sort/selection are controlled. Consumers own rows, filtering, fetching, sorting, and pagination.

### `jp-badge`

| Input  | Values                                                     | Default   |
| ------ | ---------------------------------------------------------- | --------- |
| `tone` | `neutral`, `accent`, `success`, `warning`, `error`, `info` | `neutral` |
| `size` | `sm`, `md`                                                 | `md`      |

Label content is projected. Presentational only (not a button). Accent tone uses
soft accent fill as a signal chip — not a large accent wash.

### `jp-empty-state`

| Input         | Values | Default | Notes                    |
| ------------- | ------ | ------- | ------------------------ |
| `title`       | string | —       | Required                 |
| `description` | string | `''`    | Optional supporting copy |

Host has `role="status"`. Optional icon via `[jpEmptyStateIcon]`. Actions via
default content projection (typically `jp-button`).

### `jp-table`

| Input              | Values                               | Default     | Notes                                         |
| ------------------ | ------------------------------------ | ----------- | --------------------------------------------- |
| `caption`          | string                               | `''`        | Renders `<caption>` when non-empty            |
| `columns`          | `JpSortableTableColumn[]`            | `[]`        | `key`, `header`, optional `align`, `sortable` |
| `rows`             | `Record<string, JpTableCellValue>[]` | `[]`        | Cell values: string \| number \| nullish      |
| `striped`          | boolean                              | `false`     | Alternating row background                    |
| `emptyTitle`       | string                               | `'No data'` | Fallback when no projected empty state        |
| `emptyDescription` | string                               | `''`        | Fallback description                          |

`JpTableColumn.align`: `start` \| `center` \| `end` (default `start`).

Additional table inputs:

| Input/output      | Type                              | Default/behavior                                     |
| ----------------- | --------------------------------- | ---------------------------------------------------- |
| `sort`            | `JpTableSort \| null`             | `null`; `{ key, direction: 'asc' \| 'desc' }`        |
| `sortChange`      | output                            | asc → desc → null; rows are not automatically sorted |
| `selectable`      | boolean                           | `false`                                              |
| `selectedKeys`    | readonly `(string \| number)[]`   | `[]`                                                 |
| `selectionChange` | output                            | complete selected key array, retaining off-page keys |
| `rowKey`          | field name or row-to-key function | `'id'`; keys must be unique/stable for selection     |
| `rowLabel`        | row-to-string function            | first-column text for the row checkbox name          |

Columns enable sorting through `sortable: true`; headers expose `aria-sort`. Rows without a valid string/number key remain displayable but are not selectable.

Rich cells: project `ng-template[jpTableCell]="columnKey"` with
`let-value` (also `value`, `row`, `column` in context).

Empty rows: project `jp-empty-state` into the table; otherwise the fallback
title/description render.

---

### `jp-table-toolbar`

Inputs: `label` (`'Table controls'`), `activeFilters: readonly JpTableFilter[]` (`[]`, `{ key: string, label: string }`), `selectedCount` (`0`), `disabled` (`false`). Outputs: `removeFilter` (key string), `clearFilters` (void). Project controls using `[jpTableSearch]`, `[jpTableFilters]`, `[jpTableActions]`, and `[jpTableBulkActions]`; these are projection attributes, not exported directives. The consumer removes filters and executes actions.

### `jp-pagination`

Inputs: `page` (`1`), `pageSize` (`10`), `total` (`0`, record count), `disabled` (`false`), `label` (`'Table pagination'`). `pageChange` emits a one-based number bounded by available pages; the consumer updates the page and rows.

## Navigation primitives

### `jp-tabs` and `jpTabPanel`

Inputs: `tabs: readonly JpTab[]` (`[]`, `{ value: string, label: string, disabled?: boolean }`), `ariaLabel` (`'Tabs'`), `id` (generated). `selectedValue` is a string model (`''`), supporting `[(selectedValue)]` and `selectedValueChange`; an absent/disabled selection falls back to the first enabled tab.

Import `JpTabs` and `JpTabPanel`. Project `<ng-template jpTabPanel="value">…</ng-template>` for each value. Panels stay instantiated and hidden while inactive. Activation is manual: arrows/Home/End move focus, Enter/Space selects. Horizontal arrows respect RTL and skip disabled tabs. Use a stable explicit `id` for server rendering.

### `jp-breadcrumbs`

Inputs: `items: readonly JpBreadcrumb[]` (`[]`, `{ label: string, href?: string }`) and `ariaLabel` (`'Breadcrumb'`). Earlier items with `href` are links; the final item always renders current-page text with `aria-current="page"`.

---

## Feedback & overlay primitives

Feedback and overlays use semantic tokens and shared focus/dismissal coordination. Dialogs call native `showModal()`; anchored popovers, menus, combobox lists, and tooltips use the native popover top layer. Positioning flips/clamps to the viewport and updates on scrolling, resizing, and visual-viewport changes. Resources are cleaned up on close/destroy. Escape/outside click dismiss the highest registered overlay first. Browsers without native top-layer APIs use a fallback; full clipping/inert parity is not claimed.

### `jp-skeleton`

Decorative `aria-hidden` placeholder. Inputs: `shape` (`'text'`, `'rectangle'`, `'circle'`, default `'text'`) and `animated` (`true`). Set `aria-busy` on the loading content region and provide separate status/progress information.

### `jp-progress`

Named `role="progressbar"`. Inputs: `label` (`'Loading'`), `value: number | null` (`null` for indeterminate), `max` (`100`), `valueText` (`''`). Values are clamped to zero/max; invalid max falls back to 100 and nonfinite values become indeterminate.

### `jp-inline-alert`

Inputs: `tone` (`'info'`, `'success'`, `'warning'`, `'error'`, default `'info'`), `title`, `message`, `actionLabel` (all `''`). Also supports projected content. `action` emits void. Error uses `role="alert"`; other tones use `role="status"`. Application code owns retries and request state.

### `jpFocusTrap`

Attribute directive that traps Tab within the host when active.

| Input         | Values  | Default | Notes                 |
| ------------- | ------- | ------- | --------------------- |
| `jpFocusTrap` | boolean | `true`  | Disable to pause trap |

### `jp-tooltip`

| Input       | Values                           | Default | Notes                 |
| ----------- | -------------------------------- | ------- | --------------------- |
| `content`   | string                           | —       | Required tooltip text |
| `placement` | `top`, `bottom`, `left`, `right` | `top`   |                       |

Wraps a trigger. Shows on pointer enter / focus and remains open while the pointer moves into the tooltip. Leave/blur/Escape dismiss. Its `aria-describedby` token is appended/removed while preserving existing descriptions.
Sets `aria-describedby` on the trigger while open.

### `jp-toast` / `JpToastService` / `jp-toast-outlet`

| Piece             | Role                                               |
| ----------------- | -------------------------------------------------- |
| `JpToastService`  | `show({ message, tone?, durationMs? })`, `dismiss` |
| `jp-toast-outlet` | Fixed stack host; place once near app root         |
| `jp-toast`        | Presentational toast (`role="status"`)             |

Toast tones: `neutral` \| `success` \| `warning` \| `error` \| `info`.

### `jp-dialog`

| Input / output | Type     | Default          | Notes                           |
| -------------- | -------- | ---------------- | ------------------------------- |
| `open`         | boolean  | `false`          | Controlled visibility           |
| `openChange`   | `output` | —                | Emits on Escape / scrim / close |
| `title`        | string   | —                | Required; labels the dialog     |
| `closeLabel`   | string   | `'Close dialog'` | Close button accessible name    |

Uses native `<dialog>` with `showModal()`, `aria-modal="true"`, focus trap while open, backdrop dismissal, and opener focus restoration on close. Actions slot: `[jpDialogActions]`.

### `jp-popover`

| Input / output | Type     | Default | Notes                  |
| -------------- | -------- | ------- | ---------------------- |
| `open`         | boolean  | `false` | Controlled             |
| `openChange`   | `output` | —       | Escape / outside click |

Trigger: `[jpPopoverTrigger]`. Content: `[jpPopoverContent]` (`role="region"`).

### `jp-dropdown-menu`

| Input / output | Type     | Default | Notes                         |
| -------------- | -------- | ------- | ----------------------------- |
| `open`         | boolean  | `false` | Controlled                    |
| `openChange`   | `output` | —       | Escape / outside click / item |

Trigger: `[jpDropdownTrigger]` (`aria-haspopup="menu"`). Items:
`button[jpDropdownMenuItem]` with `(itemSelect)` output. Arrow keys move between
items; Enter/Space activate via native button behavior.

---

## Assistant primitives

Branded assistant integration. No `class` / `style` inputs. Panel
delivery follows the toast pattern: imperative service + panel host.

### Tone refinement

| Surface           | Rule                                                           |
| ----------------- | -------------------------------------------------------------- |
| Panel chrome      | Neutral raised/subtle surfaces — never accent wash backgrounds |
| Context chip      | Compact accent signal (soft fill + strong text)                |
| User message      | Subtle surface bubble; primary text                            |
| Assistant message | Sunken/calm bubble; primary text; no brand-color fill          |
| System message    | Muted caption text, no bubble                                  |
| Send action       | Primary button (accent as action signal)                       |

### `JpAssistantService`

| Method / signal                | Role                                      |
| ------------------------------ | ----------------------------------------- |
| `isOpen`                       | Readonly open signal                      |
| `context`                      | Readonly `JpAssistantContext \| null`     |
| `messages`                     | Readonly `JpAssistantMessageItem[]`       |
| `open(options?)`               | Open; optional `context`, `clearMessages` |
| `close()`                      | Close panel                               |
| `toggle()`                     | Toggle open state                         |
| `setContext` / `clearContext`  | Manage entity context                     |
| `addMessage` / `clearMessages` | Append or reset message list              |

`JpAssistantContext`: `{ label, description?, entityType?, entityId? }`.

Message roles: `user` \| `assistant` \| `system`. Assistant content renders as plain text, without Markdown or trusted HTML.

Response lifecycle:

| Method/signal                         | Contract                                      |
| ------------------------------------- | --------------------------------------------- |
| `isPending`                           | readonly pending-state signal                 |
| `beginResponse(content = '')`         | returns a new numeric response ID             |
| `updateResponse(id, accumulatedText)` | replaces accumulated pending content          |
| `completeResponse(id, content?)`      | settles a pending response                    |
| `failResponse(id, error?)`            | settles with readable error text              |
| `cancelResponse(id)`                  | settles as cancelled                          |
| `retryResponse(id)`                   | returns a new ID or `null` when not retryable |

Messages may expose `responseStatus: 'pending' | 'complete' | 'error' | 'cancelled'`. Updates to settled, stale, or cleared IDs are ignored. The consumer owns transport cancellation and persistence.

### `jpAssistantTrigger`

Attribute directive. Click opens the panel via `JpAssistantService`.

| Input                      | Type                         | Default | Notes         |
| -------------------------- | ---------------------------- | ------- | ------------- |
| `jpAssistantContext`       | `JpAssistantContext \| null` | `null`  | Set on open   |
| `jpAssistantClearMessages` | boolean                      | `false` | Clear history |

### `jp-assistant-message`

| Input         | Values                        | Default     | Notes                          |
| ------------- | ----------------------------- | ----------- | ------------------------------ |
| `messageRole` | `user`, `assistant`, `system` | `assistant` | Tone classes (not HTML `role`) |
| `content`     | string                        | —           | Required                       |

### `jp-assistant-panel`

| Input / output      | Type     | Default                                                              | Notes                       |
| ------------------- | -------- | -------------------------------------------------------------------- | --------------------------- |
| `title`             | string   | `'JP Assistant'`                                                     | Labels complementary region |
| `closeLabel`        | string   | `'Close assistant'`                                                  | Close control name          |
| `clearContextLabel` | string   | `'Clear context'`                                                    | Context chip dismiss name   |
| `composerLabel`     | string   | `'Message the assistant'`                                            | Composer accessible name    |
| `sendLabel`         | string   | `'Send'`                                                             | Send button label           |
| `emptyTitle`        | string   | `'Ask about this surface'`                                           | Empty-state title           |
| `emptyDescription`  | string   | `'Open the assistant from a context trigger, then send a question.'` | Empty-state description     |
| `placeholder`       | string   | `'Ask a question…'`                                                  | Composer placeholder        |
| `messageSubmit`     | `output` | —                                                                    | Emits user message text     |

Reads open/context/messages from `JpAssistantService`. Escape closes. Focus moves
to the composer on open. Desktop: fixed right dock. Mobile: scrim + overlay.
Host apps can append a synchronous message with `addMessage`, or use the response lifecycle for asynchronous transport. Additional label inputs: `pendingLabel` (`'Generating response'`), `cancelLabel` (`'Stop response'`), `retryLabel` (`'Retry'`), `cancelledLabel` (`'Response stopped'`). `responseCancel` emits the cancelled numeric ID; `responseRetry` emits `{ previousId: number, responseId: number }`. Abort/restart your transport in these handlers; the service does not make network requests.

---

## Storybook

Component stories live in `libs/ui`:

```bash
npx nx run ui:storybook
```

Open http://localhost:4400 — browse `Primitives/Layout/*`, `Primitives/Typography/*`,
`Primitives/Controls/*`, `Primitives/Data Display/*`, `Primitives/Feedback/*`, `Primitives/Navigation/*`, `Primitives/Assistant/*`,
`Compositions/Layout Dashboard`, `Compositions/App Shell Dashboard`,
`Compositions/Controls Form`, `Compositions/Data Display`,
`Compositions/Feedback Overlays`, and `Compositions/Assistant System`.

Stories wrap in `.jp-storybook-page` (sunken page fill). Canvas adds a **Dark stage** /
**Light stage** toolbar (plus grid) for the mat behind the page; Docs keeps a fixed
dark stage with no stage control. Manual checklist: [MANUAL_QA.md](../MANUAL_QA.md).

---

## Showcase

Interactive Angular host app for compositions and simulated product workflows. Use Storybook for primitive prop controls and accent/density toolbars:

```bash
npx nx run showcase:serve
```

The preview catalogue extends these APIs with checklist, stepper, numeric/range,
timeline, overflow, and code/copy controls. See
[COMPONENT_EXPANSION.md](COMPONENT_EXPANSION.md#product-tools-second-batch) for
their full contracts, and Showcase `/product-tools` for the validated wizard
and combined examples.

Open http://localhost:4200/assistant (also `/product-recipes`, `/overlays`,
`/data`, `/controls`, `/app-shell`, `/layout-dashboard`).

Showcase pages show live `accent` / `density` readouts from `data-jp-accent` and
`data-jp-density` on `<html>` (handy when toggling those attributes in DevTools).

## Everyday workflow primitives

Command palette, context menu, native date/range/time fields, file upload queue, notification inbox, button group/toggle/split, inline editing, skip link and announcement outlet/service are documented in [WORKFLOW_COMPONENTS.md](WORKFLOW_COMPONENTS.md). All are preview exports.

Advanced layout preview APIs: [split panes, resilient images, and table extensions](ADVANCED_LAYOUT_COMPONENTS.md).

## Larger preview features

- [Tree view and hierarchical tables](HIERARCHY_COMPONENTS.md)
- [Scheduling calendar](SCHEDULING_CALENDAR.md)
- [Reordering and carousel](INTERACTION_COMPONENTS.md)
- [Charts and large flat datasets](DATA_PERFORMANCE_COMPONENTS.md)

[Verification and limits](qa/LARGE_FEATURES.md) describe the supported contracts and outstanding promotion reviews.
