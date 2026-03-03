# tokens

Token source and generated artifacts for Phase 1 Epic 1.

## Source of truth

Token JSON lives under `libs/tokens/src/tokens`:

- `primitives/*`: neutral, accent, typography, spacing, radius, elevation, motion
- `semantic/*`: semantic aliases and accent families
- `modes/*`: density overrides (`default`, `compact`)

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
