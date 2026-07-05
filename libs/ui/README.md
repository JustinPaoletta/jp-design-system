# ui

Angular component library for the JP Design System.

## Primitives (Phase 2)

Layout: `jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`

Typography: `jp-text`, `jp-heading`

Full API, token mappings, and design rationale:
[docs/PRIMITIVES.md](../../docs/PRIMITIVES.md)

## Storybook

Component stories live in `libs/ui` (not `apps/storybook`):

```bash
npx nx run ui:storybook
```

Runs at http://localhost:4400 — browse `Primitives/Layout/*`, `Primitives/Typography/*`,
and `Compositions/Layout Dashboard`.

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
