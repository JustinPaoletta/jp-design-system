# ui

Angular component library for the JP Design System.

## Primitives

Layout: `jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-app-shell`, `jp-app-shell-nav-item`

Typography: `jp-text`, `jp-heading`

Controls: `jp-button`, `jp-icon-button`, `jp-input`, `jp-textarea`, `jp-select`, `jp-checkbox`, `jp-switch`

Data display: `jp-badge`, `jp-empty-state`, `jp-table`

Feedback & overlays: `jpFocusTrap`, `jp-tooltip`, `jp-toast` (+ `JpToastService` / `jp-toast-outlet`), `jp-dialog`, `jp-popover`, `jp-dropdown-menu`

Assistant: `JpAssistantService`, `jpAssistantTrigger`, `jp-assistant-message`, `jp-assistant-panel`

Full API, token mappings, and design rationale:
[docs/PRIMITIVES.md](../../docs/PRIMITIVES.md)

Implementation plans:

- [docs/APP_SHELL_PLAN.md](../../docs/APP_SHELL_PLAN.md)
- [docs/CONTROLS_PLAN.md](../../docs/CONTROLS_PLAN.md)
- [docs/DATA_DISPLAY_PLAN.md](../../docs/DATA_DISPLAY_PLAN.md)
- [docs/FEEDBACK_OVERLAYS_PLAN.md](../../docs/FEEDBACK_OVERLAYS_PLAN.md)
- [docs/ASSISTANT_SYSTEM_PLAN.md](../../docs/ASSISTANT_SYSTEM_PLAN.md)

## Storybook

Component stories live in `libs/ui` (not `apps/storybook`):

```bash
npx nx run ui:storybook
```

Runs at http://localhost:4400 — browse `Primitives/Layout/*`, `Primitives/Typography/*`,
`Primitives/Controls/*`, `Primitives/Data Display/*`, `Primitives/Feedback/*`,
`Primitives/Assistant/*`, `Compositions/Layout Dashboard`,
`Compositions/App Shell Dashboard`, `Compositions/Controls Form`,
`Compositions/Data Display`, `Compositions/Feedback Overlays`, and
`Compositions/Assistant System`.

Canvas: sunken story page plus independent **Dark stage** / **Light stage** mat
(Docs uses a fixed dark stage). Manual checklist: [MANUAL_QA.md](../../MANUAL_QA.md).

## Showcase

Read-only integration app for compositions:

```bash
npx nx run showcase:serve
```

Runs at http://localhost:4200 (`/` redirects to `/assistant`)

## Tests

```bash
npx nx run ui:test
npx nx run ui:test-storybook
```
