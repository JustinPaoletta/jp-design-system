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
