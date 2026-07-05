# Showcase

Read-only Angular host app for viewing JP compositions in a real application
context.

- **Not editable** — no controls, toggles, or prop editing. Use Storybook for
  that (`npx nx run ui:storybook`).
- **Purpose** — prove primitives and compositions render correctly outside
  Storybook (routing, tokens, real Angular bootstrap).

## Run

```bash
npx nx run showcase:serve
```

Open http://localhost:4200/phase-2-dashboard (root `/` redirects here).

## E2E

```bash
npx nx run showcase-e2e:e2e -- --project=chromium
```
