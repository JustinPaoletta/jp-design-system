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
- **Accent toolbar:** Disabled on layout and typography primitive stories. Accent
 tokens apply on composition stories (e.g. Layout Dashboard) and Showcase pages.
- **Semantic `as` props:** Set the rendered HTML tag for accessibility. Behavior
 differs by primitive — see typography section below.

---

## Layout primitives

### `jp-box`

Structural wrapper — padding and max-width only. No border or background. Use
`jp-surface` for visual panels.

| Input | Values | Default |
| ---------- | ----------------------------------------------------------------------- | ------- |
| `as` | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div` |
| `padding` | space tokens | `none` |
| `paddingX` | space token or `null` (overrides horizontal; use `none` to clear) | `null` |
| `paddingY` | space token or `null` (overrides vertical; use `none` to clear) | `null` |
| `maxWidth` | `none`, `narrow`, `wide` | `none` |

`paddingX` / `paddingY` axis overrides: `null` inherits the base `padding` value on
that axis; `'none'` explicitly clears padding on that axis (e.g.
`padding="lg" paddingX="none"` keeps vertical `lg` and zeroes horizontal padding).

### `jp-stack`

Vertical flex layout.

| Input | Values | Default |
| --------- | ----------------------------------------------------------------------- | --------- |
| `as` | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div` |
| `gap` | space tokens | `md` |
| `align` | `start`, `center`, `end`, `stretch` | `stretch` |
| `justify` | `start`, `center`, `end`, `between` | `start` |

### `jp-inline`

Horizontal flex layout.

| Input | Values | Default |
| --------- | ----------------------------------------------------------------------- | -------- |
| `as` | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div` |
| `gap` | space tokens | `sm` |
| `align` | `start`, `center`, `end`, `stretch` | `center` |
| `justify` | `start`, `center`, `end`, `between` | `start` |
| `wrap` | boolean | `true` |

### `jp-grid`

CSS grid layout.

| Input | Values | Default |
| ----------- | ----------------------------------------------------------------------- | ------- |
| `as` | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div` |
| `columns` | `1`, `2`, `3`, `4`, `6` | `3` |
| `gap` | space tokens | `md` |
| `mode` | `fixed`, `auto-fit` | `fixed` |
| `minColumn` | `sm`, `md`, `lg` | `md` |

### `jp-surface`

Visual panel — background, border, elevation, radius, padding.

| Input | Values | Default |
| ----------- | ----------------------------------------------------------------------- | --------- |
| `as` | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `section` |
| `tone` | `canvas`, `sunken`, `subtle`, `raised`, `emphasis` | `raised` |
| `padding` | space tokens | `lg` |
| `border` | `none`, `subtle`, `default`, `strong` | `default` |
| `elevation` | `none`, `raised`, `floating`, `overlay` | `raised` |
| `radius` | radius tokens | `lg` |

### `jp-app-shell`

Application chrome — sidebar + main content regions with desktop collapse and
mobile drawer.

| Input / output | Type | Default | Notes |
| ------------------------ | --------- | ----------- | -------------------------------------------- |
| `sidebarCollapsed` | `boolean` | `false` | Collapses sidebar to icon rail width |
| `sidebarCollapsedChange` | `output` | — | Emits when the toolbar toggle is clicked |
| `mobileNavOpen` | `boolean` | `false` | Opens the off-canvas drawer below breakpoint |
| `mobileNavOpenChange` | `output` | — | Emits on menu toggle, scrim click, or Escape |
| `sidebarLabel` | `string` | `'Primary'` | `aria-label` for the sidebar landmark |

**Content projection:**

- `[jpAppShellSidebar]` — primary navigation slot (renders inside `<aside>`)
- `[jpAppShellMain]` — page content slot

**Behavior:**

- Desktop (≥ `--jp-layout-shell-mobile-max` / `48rem`): sidebar visible; collapse
 toggles expanded vs icon-rail widths.
- Mobile (`< 48rem`): sidebar hidden by default; menu button opens drawer +
 scrim; Escape / scrim / close button dismiss; focus moves into the drawer and
 returns to the menu trigger on close; main is `inert` while open.

### `jp-app-shell-nav-item`

Single navigation row for use inside the shell sidebar.

| Input | Values | Default | Notes |
| ---------- | ---------------- | ------- | --------------------------------------------------------- |
| `as` | `a`, `button` | `a` | Rendered interactive element |
| `href` | string or `null` | `null` | Used when `as="a"` (falls back to `#`) |
| `active` | boolean | `false` | Accent indicator + `aria-current="page"` |
| `disabled` | boolean | `false` | Non-interactive; muted chrome (demo stubs, unavailable) |

Optional icon slot: project into `[jpAppShellNavIcon]`. Labels are visually
hidden when the parent shell is collapsed.

---

## Typography primitives

### Design split: `jp-text` vs `jp-heading`

| Concern | `jp-text` | `jp-heading` |
| ------------------ | ---------------------------------------------- | -------------------------------------------- |
| Purpose | Body copy, labels, inline emphasis | Page and section titles |
| Semantic tags | `p`, `span`, `label`, `small`, `strong`, `em` | `h1`–`h6` |
| Size control | **`size` prop** (`caption`, `body`, `body-lg`) | **`as` prop only** — no `size` |
| Tag vs visual size | Independent — `as` and `size` are separate | Coupled — each level has a fixed token scale |

**Why `jp-heading` has no `size` prop:** Heading levels carry both semantic
meaning and visual hierarchy. A separate size override would fight the level
system and invite inconsistency. Pick the correct `h*` level instead. For
non-heading copy at a specific scale, use `jp-text`.

### `jp-text`

| Input | Values | Default |
| ---------- | --------------------------------------------- | --------- |
| `as` | `p`, `span`, `label`, `small`, `strong`, `em` | `p` |
| `size` | `caption`, `body`, `body-lg` | `body` |
| `tone` | `primary`, `secondary`, `muted`, `disabled` | `primary` |
| `weight` | `regular`, `medium`, `semibold`, `bold` | `regular` |
| `truncate` | boolean | `false` |
| `mono` | boolean | `false` |
| `forId` | string or `null` (for `label`) | `null` |

**Truncate behavior:** When `true`, text stays on one line and shows `…` when the
**container** is narrower than the content. The host applies `min-width: 0` and
`max-width: 100%` so truncation works inside flex layouts. When `false`, text
wraps normally.

**Inline behavior:** `span`, `label`, `small`, `strong`, and `em` render inline
(the host sets `display: inline`). `p` renders as block.

### `jp-heading`

| Input | Values | Default |
| -------- | ------------------------------------------- | ---------- |
| `as` | `h1`, `h2`, `h3`, `h4`, `h5`, `h6` | `h2` |
| `tone` | `primary`, `secondary`, `muted`, `disabled` | `primary` |
| `weight` | `regular`, `medium`, `semibold`, `bold` | `semibold` |

**Level → size mapping** (via `--jp-font-size-heading-h*` tokens):

| Level | Token | Default size |
| ----- | --------------------------- | ------------ |
| `h1` | `--jp-font-size-heading-h1` | 1.5rem |
| `h2` | `--jp-font-size-heading-h2` | 1.25rem |
| `h3` | `--jp-font-size-heading-h3` | 1.125rem |
| `h4` | `--jp-font-size-heading-h4` | 1rem |
| `h5` | `--jp-font-size-heading-h5` | 0.875rem |
| `h6` | `--jp-font-size-heading-h6` | 0.8125rem |

Each step down in level produces a visibly smaller heading. Changing `as` updates
both the HTML tag and font size.

---

## Control primitives

Controls. No `class` / `style` inputs. Field controls implement
`ControlValueAccessor`. Buttons do not.

### `jp-button`

| Input | Values | Default |
| ---------- | ---------------------------------------------- | --------- |
| `variant` | `primary`, `secondary`, `ghost`, `destructive` | `primary` |
| `size` | `sm`, `md`, `lg` | `md` |
| `type` | `button`, `submit`, `reset` | `button` |
| `disabled` | boolean | `false` |

Label content is projected. Primary uses accent tokens; destructive uses
state-error tokens.

### `jp-icon-button`

| Input | Values | Default | Notes |
| ----------- | --------------------------- | -------- | ------------------------------ |
| `ariaLabel` | string (required) | — | Accessible name for the button |
| `size` | `sm`, `md`, `lg` | `md` | Square control size |
| `type` | `button`, `submit`, `reset` | `button` | Native button type |
| `disabled` | boolean | `false` | |

Icon glyph is projected content. Default styling is ghost-like.

### `jp-input`

| Input | Values | Default | Notes |
| ------------- | ------------------------------------------------------------- | --------- | ---------------------------------------------------------- |
| `label` | string | `''` | Associated via `for` / `id` |
| `hint` | string | `''` | Linked with `aria-describedby` when no error |
| `error` | string | `''` | Linked with `aria-describedby`; takes precedence over hint |
| `type` | `text`, `email`, `password`, `search`, `tel`, `url`, `number` | `text` | |
| `size` | `sm`, `md`, `lg` | `md` | |
| `disabled` | boolean | `false` | |
| `readonly` | boolean | `false` | |
| `invalid` | boolean | `false` | Sets `aria-invalid` + invalid border |
| `placeholder` | string | `''` | |
| `id` | string or unset | generated | |

CVA value type: `string`.

### `jp-textarea`

Same field chrome as `jp-input`, plus:

| Input | Values | Default |
| ------ | ------ | ------- |
| `rows` | number | `4` |

CVA value type: `string`.

### `jp-select`

Native `<select>` styled with field tokens.

| Input | Values | Default | Notes |
| ---------- | ------------------------------------ | --------- | ----- |
| `label` | string | `''` | |
| `hint` | string | `''` | |
| `error` | string | `''` | |
| `size` | `sm`, `md`, `lg` | `md` | |
| `disabled` | boolean | `false` | |
| `invalid` | boolean | `false` | |
| `options` | `{ value: string; label: string }[]` | `[]` | |
| `id` | string or unset | generated | |

CVA value type: `string`.

### `jp-checkbox`

| Input | Values | Default | Notes |
| ---------- | --------------- | --------- | ----- |
| `disabled` | boolean | `false` | |
| `invalid` | boolean | `false` | |
| `id` | string or unset | generated | |

Label is projected content. CVA value type: `boolean`. No indeterminate state in v1.

### `jp-switch`

| Input | Values | Default | Notes |
| ---------- | --------------- | --------- | ----- |
| `disabled` | boolean | `false` | |
| `invalid` | boolean | `false` | |
| `id` | string or unset | generated | |

Uses `role="switch"` and `aria-checked`. Track uses accent when on. Label is
projected content. CVA value type: `boolean`.

---

## Data display primitives

Data display. No `class` / `style` inputs. Table is presentational (no
sort/filter/selection chrome).

### `jp-badge`

| Input | Values | Default |
| ------ | ---------------------------------------------------------- | --------- |
| `tone` | `neutral`, `accent`, `success`, `warning`, `error`, `info` | `neutral` |
| `size` | `sm`, `md` | `md` |

Label content is projected. Presentational only (not a button). Accent tone uses
soft accent fill as a signal chip — not a large accent wash.

### `jp-empty-state`

| Input | Values | Default | Notes |
| ------------- | ------ | ------- | ------------------------ |
| `title` | string | — | Required |
| `description` | string | `''` | Optional supporting copy |

Host has `role="status"`. Optional icon via `[jpEmptyStateIcon]`. Actions via
default content projection (typically `jp-button`).

### `jp-table`

| Input | Values | Default | Notes |
| ------------------ | ------------------------------------ | ----------- | ---------------------------------------- |
| `caption` | string | `''` | Renders `<caption>` when non-empty |
| `columns` | `JpTableColumn[]` | `[]` | `key`, `header`, optional `align` |
| `rows` | `Record<string, JpTableCellValue>[]` | `[]` | Cell values: string \| number \| nullish |
| `striped` | boolean | `false` | Alternating row background |
| `emptyTitle` | string | `'No data'` | Fallback when no projected empty state |
| `emptyDescription` | string | `''` | Fallback description |

`JpTableColumn.align`: `start` \| `center` \| `end` (default `start`).

Rich cells: project `ng-template[jpTableCell]="columnKey"` with
`let-value` (also `value`, `row`, `column` in context).

Empty rows: project `jp-empty-state` into the table; otherwise the fallback
title/description render.

---

## Feedback & overlay primitives

Feedback and overlays. No `class` / `style` inputs. Positioning is
lightweight CSS (no CDK Overlay). Focus management uses `jpFocusTrap`.

### `jpFocusTrap`

Attribute directive that traps Tab within the host when active.

| Input | Values | Default | Notes |
| ------------- | ------- | ------- | --------------------- |
| `jpFocusTrap` | boolean | `true` | Disable to pause trap |

### `jp-tooltip`

| Input | Values | Default | Notes |
| ----------- | -------------------------------- | ------- | --------------------- |
| `content` | string | — | Required tooltip text |
| `placement` | `top`, `bottom`, `left`, `right` | `top` | |

Wraps a trigger. Shows on pointer enter / focus; hides on leave / blur / Escape.
Sets `aria-describedby` on the trigger while open.

### `jp-toast` / `JpToastService` / `jp-toast-outlet`

| Piece | Role |
| ----------------- | -------------------------------------------------- |
| `JpToastService` | `show({ message, tone?, durationMs? })`, `dismiss` |
| `jp-toast-outlet` | Fixed stack host; place once near app root |
| `jp-toast` | Presentational toast (`role="status"`) |

Toast tones: `neutral` \| `success` \| `warning` \| `error` \| `info`.

### `jp-dialog`

| Input / output | Type | Default | Notes |
| -------------- | -------- | ---------------- | ------------------------------- |
| `open` | boolean | `false` | Controlled visibility |
| `openChange` | `output` | — | Emits on Escape / scrim / close |
| `title` | string | — | Required; labels the dialog |
| `closeLabel` | string | `'Close dialog'` | Close button accessible name |

Uses `role="dialog"` + `aria-modal="true"`, focus trap while open, and restores
focus on close. Actions slot: `[jpDialogActions]`.

### `jp-popover`

| Input / output | Type | Default | Notes |
| -------------- | -------- | ------- | ---------------------- |
| `open` | boolean | `false` | Controlled |
| `openChange` | `output` | — | Escape / outside click |

Trigger: `[jpPopoverTrigger]`. Content: `[jpPopoverContent]` (`role="region"`).

### `jp-dropdown-menu`

| Input / output | Type | Default | Notes |
| -------------- | -------- | ------- | ----------------------------- |
| `open` | boolean | `false` | Controlled |
| `openChange` | `output` | — | Escape / outside click / item |

Trigger: `[jpDropdownTrigger]` (`aria-haspopup="menu"`). Items:
`button[jpDropdownMenuItem]` with `(itemSelect)` output. Arrow keys move between
items; Enter/Space activate via native button behavior.

---

## Assistant primitives

Branded assistant integration. No `class` / `style` inputs. Panel
delivery follows the toast pattern: imperative service + panel host.

### Tone refinement

| Surface | Rule |
| ----------------- | -------------------------------------------------------------- |
| Panel chrome | Neutral raised/subtle surfaces — never accent wash backgrounds |
| Context chip | Compact accent signal (soft fill + strong text) |
| User message | Subtle surface bubble; primary text |
| Assistant message | Sunken/calm bubble; primary text; no brand-color fill |
| System message | Muted caption text, no bubble |
| Send action | Primary button (accent as action signal) |

### `JpAssistantService`

| Method / signal | Role |
| ------------------------------ | ----------------------------------------- |
| `isOpen` | Readonly open signal |
| `context` | Readonly `JpAssistantContext \| null` |
| `messages` | Readonly `JpAssistantMessageItem[]` |
| `open(options?)` | Open; optional `context`, `clearMessages` |
| `close()` | Close panel |
| `toggle()` | Toggle open state |
| `setContext` / `clearContext` | Manage entity context |
| `addMessage` / `clearMessages` | Append or reset message list |

`JpAssistantContext`: `{ label, description?, entityType?, entityId? }`.

Message roles: `user` \| `assistant` \| `system`.

### `jpAssistantTrigger`

Attribute directive. Click opens the panel via `JpAssistantService`.

| Input | Type | Default | Notes |
| -------------------------- | ---------------------------- | ------- | ------------- |
| `jpAssistantContext` | `JpAssistantContext \| null` | `null` | Set on open |
| `jpAssistantClearMessages` | boolean | `false` | Clear history |

### `jp-assistant-message`

| Input | Values | Default | Notes |
| --------- | ----------------------------- | ----------- | ------------ |
| `role` | `user`, `assistant`, `system` | `assistant` | Tone classes |
| `content` | string | — | Required |

### `jp-assistant-panel`

| Input / output | Type | Default | Notes |
| --------------------- | -------- | ------------------- | --------------------------- |
| `title` | string | `'JP Assistant'` | Labels complementary region |
| `closeLabel` | string | `'Close assistant'` | Close control name |
| `messageSubmit` | `output` | — | Emits user message text |
| composer / empty copy | strings | sensible defaults | Overridable labels |

Reads open/context/messages from `JpAssistantService`. Escape closes. Focus moves
to the composer on open. Desktop: fixed right dock. Mobile: scrim + overlay.
Host apps respond to `messageSubmit` by calling `addMessage({ role: 'assistant', … })`.

---

## Storybook

Component stories live in `libs/ui`:

```bash
npx nx run ui:storybook
```

Open http://localhost:4400 — browse `Primitives/Layout/*`, `Primitives/Typography/*`,
`Primitives/Controls/*`, `Primitives/Data Display/*`, `Primitives/Feedback/*`, `Primitives/Assistant/*`,
`Compositions/Layout Dashboard`, `Compositions/App Shell Dashboard`,
`Compositions/Controls Form`, `Compositions/Data Display`,
`Compositions/Feedback Overlays`, and `Compositions/Assistant System`.

---

## Showcase

Read-only Angular host app for viewing compositions in a real app context (not
editable — use Storybook for controls and accent/density toggles):

```bash
npx nx run showcase:serve
```

Open http://localhost:4200/assistant (also `/overlays`,
`/data`, `/controls`, `/app-shell`, `/layout-dashboard`).
