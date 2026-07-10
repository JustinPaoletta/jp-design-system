# ui

Angular component library for the JP Design System.

## Primitives

Layout: `jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-app-shell`

Typography: `jp-text`, `jp-heading`

Full API, token mappings, and design rationale:
[docs/PRIMITIVES.md](../../docs/PRIMITIVES.md)

Phase 3 implementation plan:
[docs/PHASE3_EPIC3_APP_SHELL_PLAN.md](../../docs/PHASE3_EPIC3_APP_SHELL_PLAN.md)

## Storybook

Component stories live in `libs/ui` (not `apps/storybook`):

```bash
npx nx run ui:storybook
```

Runs at http://localhost:4400 — browse `Primitives/Layout/*`, `Primitives/Typography/*`,
`Compositions/Layout Dashboard`, and `Primitives/Layout/App Shell`.

## Showcase

Read-only integration app for compositions:

```bash
npx nx run showcase:serve
```

Runs at http://localhost:4200

## Tests

```bash
npx nx run ui:test
npx nx run ui:test-storybook
```
