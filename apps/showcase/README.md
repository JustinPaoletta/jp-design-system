# Showcase

Interactive Angular host app that proves JP compositions work outside Storybook with real routing, tokens, forms, and application state. Storybook remains the primitive prop explorer. Theme readouts display `data-jp-accent` and `data-jp-density` from `<html>`.

```sh
npx nx run showcase:serve
```

Open http://localhost:4200 (`/` redirects to `/assistant`). Routes include `/product-recipes`, `/assistant`, `/overlays`, `/data`, `/controls`, `/app-shell`, and `/layout-dashboard`.

`/product-recipes` demonstrates validated forms, async save/retry, searchable paginated tables, bulk selection, destructive confirmation, and assistant response recovery. Its API is simulated locally; it does not connect to a backend or LLM service.

Run Chromium and WebKit functional/accessibility checks:

```sh
npx nx run showcase-e2e:e2e -- --project=chromium --project=webkit --grep-invert="recipes visual"
```

See [Product recipes](../../docs/PRODUCT_RECIPES.md) and [Quality verification](../../docs/QUALITY.md) for integration contracts and macOS visual baseline commands.
