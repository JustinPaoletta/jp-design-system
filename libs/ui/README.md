# ui

Angular component library for the JP Design System.

## Primitives

Layout: `jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-app-shell`, `jp-app-shell-nav-item`

Typography: `jp-text`, `jp-heading`

Controls: `jp-button`, `jp-icon-button`, `jp-input`, `jp-textarea`, `jp-select`, `jp-checkbox`, `jp-switch`

Full API, token mappings, and design rationale:
[docs/PRIMITIVES.md](../../docs/PRIMITIVES.md)

App shell implementation plan:
[docs/APP_SHELL_PLAN.md](../../docs/APP_SHELL_PLAN.md)

Controls implementation plan:
[docs/CONTROLS_PLAN.md](../../docs/CONTROLS_PLAN.md)

## Storybook

Component stories live in `libs/ui` (not `apps/storybook`):

```bash
npx nx run ui:storybook
```

Runs at http://localhost:4400 — browse `Primitives/Layout/*`, `Primitives/Typography/*`,
`Primitives/Controls/*`, `Compositions/Layout Dashboard`,
`Compositions/App Shell Dashboard`, `Compositions/Controls Form`, and
`Primitives/Layout/App Shell`.

## Showcase

Read-only integration app for compositions:

```bash
npx nx run showcase:serve
```

Runs at http://localhost:4200 (`/assistant` by default)

## Tests

```bash
npx nx run ui:test
npx nx run ui:test-storybook
```
