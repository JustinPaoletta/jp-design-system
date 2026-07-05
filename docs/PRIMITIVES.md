# Phase 2 Primitives

Reference for layout and typography primitives in `libs/ui`. All primitives use
design tokens, strict typed inputs, and OnPush change detection.

See also: [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md), [JP_ROADMAP.md](./JP_ROADMAP.md).

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

| Input      | Values                                                                 | Default |
| ---------- | ---------------------------------------------------------------------- | ------- |
| `as`       | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div`   |
| `padding`  | space tokens                                        | `none`  |
| `paddingX` | space token or `null` (overrides horizontal)        | `null`  |
| `paddingY` | space token or `null` (overrides vertical)          | `null`  |
| `maxWidth` | `none`, `narrow`, `wide`                            | `none`  |

### `jp-stack`

Vertical flex layout.

| Input     | Values                                                                 | Default |
| --------- | ---------------------------------------------------------------------- | ------- |
| `as`      | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div`   |
| `gap`     | space tokens                                                           | `md`    |
| `align`   | `start`, `center`, `end`, `stretch` | `stretch` |
| `justify` | `start`, `center`, `end`, `between` | `start` |

### `jp-inline`

Horizontal flex layout.

| Input     | Values                                                                 | Default |
| --------- | ---------------------------------------------------------------------- | ------- |
| `as`      | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div`   |
| `gap`     | space tokens                                                           | `sm`    |
| `align`   | `start`, `center`, `end`, `stretch`                                    | `center` |
| `justify` | `start`, `center`, `end`, `between`                                    | `start` |
| `wrap`    | boolean                                                                | `true`  |

### `jp-grid`

CSS grid layout.

| Input       | Values                                                                 | Default    |
| ----------- | ---------------------------------------------------------------------- | ---------- |
| `as`        | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `div`      |
| `columns`   | `1`, `2`, `3`, `4`, `6`                                                | `3`        |
| `gap`       | space tokens              | `md`       |
| `mode`      | `fixed`, `auto-fit`       | `fixed`    |
| `minColumn` | `sm`, `md`, `lg`          | `md`       |

### `jp-surface`

Visual panel — background, border, elevation, radius, padding.

| Input       | Values                                                                 | Default  |
| ----------- | ---------------------------------------------------------------------- | -------- |
| `as`        | `div`, `section`, `article`, `aside`, `main`, `header`, `footer`, `nav` | `section`|
| `tone`      | `canvas`, `sunken`, `subtle`, `raised`, `emphasis`                     | `raised` |
| `padding`   | space tokens                                                           | `lg`     |
| `border`    | `none`, `subtle`, `default`, `strong`                                  | `default`|
| `elevation` | `none`, `raised`, `floating`, `overlay`                                | `raised` |
| `radius`    | radius tokens                                                          | `lg`     |

---

## Typography primitives

### Design split: `jp-text` vs `jp-heading`

| Concern            | `jp-text`                         | `jp-heading`                      |
| ------------------ | --------------------------------- | --------------------------------- |
| Purpose            | Body copy, labels, inline emphasis | Page and section titles           |
| Semantic tags      | `p`, `span`, `label`, `small`, `strong`, `em` | `h1`–`h6`              |
| Size control       | **`size` prop** (`caption`, `body`, `body-lg`) | **`as` prop only** — no `size` |
| Tag vs visual size | Independent — `as` and `size` are separate | Coupled — each level has a fixed token scale |

**Why `jp-heading` has no `size` prop:** Heading levels carry both semantic
meaning and visual hierarchy. A separate size override would fight the level
system and invite inconsistency. Pick the correct `h*` level instead. For
non-heading copy at a specific scale, use `jp-text`.

### `jp-text`

| Input      | Values                                              | Default   |
| ---------- | --------------------------------------------------- | --------- |
| `as`       | `p`, `span`, `label`, `small`, `strong`, `em`       | `p`       |
| `size`     | `caption`, `body`, `body-lg`                        | `body`    |
| `tone`     | `primary`, `secondary`, `muted`, `disabled`         | `primary` |
| `weight`   | `regular`, `medium`, `semibold`, `bold`             | `regular` |
| `truncate` | boolean                                             | `false`   |
| `mono`     | boolean                                             | `false`   |
| `forId`    | string or `null` (for `label`)                      | `null`    |

**Truncate behavior:** When `true`, text stays on one line and shows `…` when the
**container** is narrower than the content. The host applies `min-width: 0` and
`max-width: 100%` so truncation works inside flex layouts. When `false`, text
wraps normally.

**Inline behavior:** `span`, `label`, `small`, `strong`, and `em` render inline
(the host sets `display: inline`). `p` renders as block.

### `jp-heading`

| Input    | Values                                      | Default    |
| -------- | ------------------------------------------- | ---------- |
| `as`     | `h1`, `h2`, `h3`, `h4`, `h5`, `h6`         | `h2`       |
| `tone`   | `primary`, `secondary`, `muted`, `disabled` | `primary`  |
| `weight` | `regular`, `medium`, `semibold`, `bold`     | `semibold` |

**Level → size mapping** (via `--jp-font-size-heading-h*` tokens):

| Level | Token                     | Default size |
| ----- | ------------------------- | ------------ |
| `h1`  | `--jp-font-size-heading-h1` | 1.5rem     |
| `h2`  | `--jp-font-size-heading-h2` | 1.25rem    |
| `h3`  | `--jp-font-size-heading-h3` | 1.125rem   |
| `h4`  | `--jp-font-size-heading-h4` | 1rem       |
| `h5`  | `--jp-font-size-heading-h5` | 0.875rem   |
| `h6`  | `--jp-font-size-heading-h6` | 0.8125rem  |

Each step down in level produces a visibly smaller heading. Changing `as` updates
both the HTML tag and font size.

---

## Storybook

Component stories live in `libs/ui`:

```bash
npx nx run ui:storybook
```

Open http://localhost:4400 — browse `Primitives/Layout/*`, `Primitives/Typography/*`,
and `Compositions/Layout Dashboard`.

---

## Showcase

Read-only Angular host app for viewing compositions in a real app context (not
editable — use Storybook for controls and accent/density toggles):

```bash
npx nx run showcase:serve
```

Open http://localhost:4200/phase-2-dashboard
