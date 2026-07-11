# tokens

Token source and generated artifacts for Phase 1 Epic 1.

## Source of truth

Token JSON lives under `libs/tokens/src/tokens`:

- `primitives/*`: neutral, accent, typography, spacing, radius, elevation, motion
- `semantic/*`: semantic aliases and accent families
- `modes/*`: density overrides (`default`, `compact`)

## Typography tokens

Body scale (used by `jp-text`):

| Semantic token | CSS variable             | Size      |
| -------------- | ------------------------ | --------- |
| `caption`      | `--jp-font-size-caption` | 0.8125rem |
| `body`         | `--jp-font-size-body`    | 0.875rem  |
| `body-lg`      | `--jp-font-size-body-lg` | 1rem      |

General-purpose scale (not tied to a primitive):

| Semantic token | CSS variable             | Size     |
| -------------- | ------------------------ | -------- |
| `title`        | `--jp-font-size-title`   | 1.125rem |
| `display`      | `--jp-font-size-display` | 1.5rem   |

Heading level scale (used by `jp-heading` — one token per `h1`–`h6` level):

| Semantic token | CSS variable                | Size      |
| -------------- | --------------------------- | --------- |
| `heading-h1`   | `--jp-font-size-heading-h1` | 1.5rem    |
| `heading-h2`   | `--jp-font-size-heading-h2` | 1.25rem   |
| `heading-h3`   | `--jp-font-size-heading-h3` | 1.125rem  |
| `heading-h4`   | `--jp-font-size-heading-h4` | 1rem      |
| `heading-h5`   | `--jp-font-size-heading-h5` | 0.875rem  |
| `heading-h6`   | `--jp-font-size-heading-h6` | 0.8125rem |

Heading levels map to primitive typography sizes 700 → 200. See
[docs/PRIMITIVES.md](../../docs/PRIMITIVES.md) for how `jp-heading` uses these.

## App shell tokens (Phase 3)

| Semantic token                 | CSS variable                                | Purpose                        |
| ------------------------------ | ------------------------------------------- | ------------------------------ |
| `sidebar.expanded`             | `--jp-size-sidebar-expanded`                | Expanded sidebar width         |
| `sidebar.collapsed`            | `--jp-size-sidebar-collapsed`               | Collapsed icon rail width      |
| `shell.mobile-max`             | `--jp-layout-shell-mobile-max`              | Mobile layout breakpoint       |
| `shell.sidebar-bg`             | `--jp-color-shell-sidebar-bg`               | Sidebar background             |
| `shell.border`                 | `--jp-color-shell-border`                   | Shell chrome borders           |
| `nav-item.text`                | `--jp-color-nav-item-text`                  | Default nav label              |
| `nav-item.text-active`         | `--jp-color-nav-item-text-active`           | Active nav label               |
| `nav-item.indicator`           | `--jp-color-nav-item-indicator`             | Active accent signal           |
| `transition.shell`             | `--jp-motion-transition-shell`              | Sidebar width/transform motion |
| `shell.scrim` / `shell.drawer` | `--jp-z-shell-scrim`, `--jp-z-shell-drawer` | Mobile drawer stacking         |

## Control tokens (Phase 4)

Button:

| Semantic token                | CSS variable                             |
| ----------------------------- | ---------------------------------------- |
| `button.primary-bg`           | `--jp-color-button-primary-bg`           |
| `button.primary-bg-hover`     | `--jp-color-button-primary-bg-hover`     |
| `button.primary-fg`           | `--jp-color-button-primary-fg`           |
| `button.secondary-bg`         | `--jp-color-button-secondary-bg`         |
| `button.secondary-bg-hover`   | `--jp-color-button-secondary-bg-hover`   |
| `button.secondary-fg`         | `--jp-color-button-secondary-fg`         |
| `button.secondary-border`     | `--jp-color-button-secondary-border`     |
| `button.ghost-fg`             | `--jp-color-button-ghost-fg`             |
| `button.ghost-fg-hover`       | `--jp-color-button-ghost-fg-hover`       |
| `button.ghost-bg-hover`       | `--jp-color-button-ghost-bg-hover`       |
| `button.destructive-bg`       | `--jp-color-button-destructive-bg`       |
| `button.destructive-bg-hover` | `--jp-color-button-destructive-bg-hover` |
| `button.destructive-fg`       | `--jp-color-button-destructive-fg`       |

Field:

| Semantic token         | CSS variable                      |
| ---------------------- | --------------------------------- |
| `field.bg`             | `--jp-color-field-bg`             |
| `field.border`         | `--jp-color-field-border`         |
| `field.border-hover`   | `--jp-color-field-border-hover`   |
| `field.border-invalid` | `--jp-color-field-border-invalid` |
| `field.fg`             | `--jp-color-field-fg`             |
| `field.placeholder`    | `--jp-color-field-placeholder`    |
| `field.label`          | `--jp-color-field-label`          |
| `field.error`          | `--jp-color-field-error`          |

Selection (checkbox / switch):

| Semantic token                  | CSS variable                               |
| ------------------------------- | ------------------------------------------ |
| `selection.track`               | `--jp-color-selection-track`               |
| `selection.track-checked`       | `--jp-color-selection-track-checked`       |
| `selection.thumb`               | `--jp-color-selection-thumb`               |
| `selection.checkbox-bg`         | `--jp-color-selection-checkbox-bg`         |
| `selection.checkbox-bg-checked` | `--jp-color-selection-checkbox-bg-checked` |
| `selection.checkbox-fg`         | `--jp-color-selection-checkbox-fg`         |
| `selection.checkbox-border`     | `--jp-color-selection-checkbox-border`     |

Control heights (`sm` / `md` / `lg`) map to `--jp-size-control-*` and tighten under
`data-jp-density="compact"`.

## Generated artifacts

`npm run tokens:build` writes:

- `libs/tokens/src/generated/tokens.css`
- `libs/tokens/src/generated/tokens.compact.css`
- `libs/tokens/src/generated/tokens.json`

`tokens.css` includes:

- `:root` variables
- `data-jp-accent="neon"`
- `data-jp-accent="cobalt"`

`tokens.compact.css` includes compact overrides under:

- `data-jp-density="compact"`

## Validation

- `npm run tokens:check` verifies generated artifacts are up to date.
- `npm run lint` includes:
  - no hardcoded colors outside `libs/tokens`
  - no direct primitive token usage in `apps/*` or `libs/ui/*`

## Usage

Import generated CSS where needed:

```scss
@import '../../../libs/tokens/src/generated/tokens.css';
@import '../../../libs/tokens/src/generated/tokens.compact.css';
```

Switch accent or density on a root element:

```html
<html data-jp-accent="cobalt" data-jp-density="compact"></html>
```
