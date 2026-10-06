# Accessibility

JP ships keyboard behavior, roles, and focus movement for its components. The application supplies names, structure, and the meaning of its data. Principles are in [Design principles](../DESIGN_PRINCIPLES.md). Per-component behavior is in [Components](./COMPONENTS.md).

Maturity and the open assistive-technology inspection are in [Maturity](../governance/MATURITY.md) and [Acceptance](../governance/ACCEPTANCE.md). Quality commands are in [QUALITY.md](../QUALITY.md). The Storybook click-through list is [MANUAL_QA.md](../../MANUAL_QA.md).

The dark theme targets WCAG AA contrast through semantic tokens. Status uses
tone plus text. Do not encode status with color alone in application content.

## What JP implements

- Visible focus, drawn from the focus-ring token, on its controls.
- Keyboard operation for buttons, fields, radio groups, combobox, switch,
  tabs, menus, dialogs, pagination, and sortable table headers.
- Labels wired to fields when the `label` input is set, with `hint` or
  `error` in `aria-describedby`. A non-empty `error` sets `aria-invalid` and
  takes precedence over the hint.
- `jp-switch` as `role="switch"` with `aria-checked`.
- `jp-progress` as `role="progressbar"` with value attributes. `value` of
  `null` is indeterminate.
- `jp-dialog` as a modal dialog: native `showModal()` when the browser
  gives it, focus trapped with `jpFocusTrap`, focus restored to the opener.
- Dropdown items as `menuitem` buttons. Arrow keys, Home, and End move inside
  the open menu.
- Tabs with manual activation: arrows move focus, Enter or Space selects.
  Horizontal arrows follow the writing direction.
- Tooltips that add their id to the trigger's `aria-describedby` while open
  and remove that token on close.
- Toasts in an `aria-live="polite"` outlet. Each toast is `role="status"`.
  An inline alert is `role="alert"` for `tone="error"` and `role="status"`
  otherwise.
- A loading button that sets `aria-busy` and uses `loadingLabel` as the
  accessible name. The projected label stays visible.
- Table captions, `aria-sort` on sortable headers, and a row checkbox name
  from `rowLabel`. The scroll frame is a focusable region.
- An empty state with `role="status"`. Skeletons are `aria-hidden`.
- Focus movement for the mobile shell drawer and assistant panel. Focus is trapped while the mobile drawer or mobile assistant panel is open.
- Reduced motion for shell and assistant transitions and for the button
  spinner.

Dialog, popover, dropdown, tooltip, and combobox positioning use the native
top layer when the browser supports it. The fallback does not establish the same
clipping and inert behavior. That limit is part of
[compatibility](../governance/COMPATIBILITY.md) and
[maturity](../governance/MATURITY.md).

Generated ids are client counters or `Math.random()` values. Server rendering
is not a contract. Pass a stable `id` on fields, radio groups, combobox, and
tabs when the page must have one. Dialog, popover, and dropdown ids are not
inputs.

## What the application owns

- The document language (`lang` on `<html>`) and a single logical `h1`.
  Heading levels follow the outline. `jp-heading` `as` sets both the tag and
  the visual size.
- Accessible names for icon-only controls (`ariaLabel` on `jp-icon-button`)
  and for fields that have no visible `label`.
- Checkbox and switch captions, projected as content.
- Which fields are required, how they are validated, and the `error` string
  after touch or submit. Keep entered values when a save fails.
- `autocomplete`, `name`, and other native field attributes that match the
  data.
- Table `caption` text, column headers, and `rowLabel` when the first column
  is not a usable name. `rowKey` values must stay stable across pages so
  selection announcements match the same records.
- `aria-busy` on a region while skeletons are showing, plus a progress
  `label` or other status text. The skeleton does not announce loading.
- Whether a message is a toast or an inline alert, and the words in that
  message. Avoid stacking several live regions that repeat the same failure.
- Dialog titles that name the decision. `title` is required and labels the
  dialog.
- Assistant transport, cancellation, and the text passed to
  `updateResponse` / `failResponse`. Message content renders as plain text.
  The panel's pending, cancel, retry, and cancelled labels have defaults and
  are inputs.
- Route-level focus after navigation. The shell restores focus when its
  drawer closes. It does not move focus to the new page's heading.
- Icon meaning. Decorative icons use `jpAppShellNavIcon` or
  `jpEmptyStateIcon`, which the components mark as hidden from the
  accessibility tree. An icon that carries meaning must have text or an
  accessible name. Icon guidance is in [Icons](../content/ICONS.md).
- Product language. Writing guidance is in [Writing](../content/WRITING.md).
  Built-in pagination, table toolbar, shell, chip removal and assistant-role
  copy is configurable through `JP_MESSAGES`. Caller-owned labels/content
  must have application translation. See the
  [message contract](../localization/CONTRACT.md).

## Preview interaction inspection

Expanded controls, trees, scheduling, reordering, carousel, charts and virtual
tables have automated keyboard/axe evidence but still must have the human inspection
in [MANUAL_QA.md](../../MANUAL_QA.md). Chart data equivalents and the virtual table's paginated mode give other ways to read and navigate data. Do a test of both with the application's screen reader. Automation does not replace this approval.
