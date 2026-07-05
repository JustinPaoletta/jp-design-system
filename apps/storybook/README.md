# Storybook (placeholder app)

Minimal Angular shell generated with the workspace. **This app does not host
component stories.**

- **Component Storybook** — primitives, controls, and compositions live in
  `libs/ui`. Run:

  ```bash
  npx nx run ui:storybook
  ```

  Open http://localhost:4400.

- **Purpose of this app** — placeholder Nx application kept for workspace
  scaffolding and `storybook-e2e` wiring. The page only points you to
  `ui:storybook`.

## Run (optional)

```bash
npx nx run storybook:serve
```

This serves the placeholder shell, not the design system component explorer.

## E2E

```bash
npx nx run storybook-e2e:e2e -- --project=chromium
```
