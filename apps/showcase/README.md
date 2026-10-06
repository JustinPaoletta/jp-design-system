# Showcase

A lazy-routed Angular integration app demonstrating JP tokens, forms,
application state and component compositions outside Storybook.

```sh
npm exec -- nx run showcase:serve
```

Open http://localhost:4200 (`/` redirects to `/assistant`). Theme controls
set `data-jp-accent` and `data-jp-density` on `<html>`.

| Routes                                                                             | Demonstrations                                                                                                   |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/layout-dashboard`, `/app-shell`, `/controls`, `/data`, `/overlays`, `/assistant` | Core compositions, native overlays and assistant request lifecycle                                               |
| `/product-recipes`                                                                 | Validated forms, async save/retry, search/sort/pagination, bulk selection and destructive recovery               |
| `/component-expansion`, `/product-tools`, `/workflows`                             | Expanded forms/selection, wizard/checklist, numeric controls, commands, upload, native pickers and notifications |
| `/advanced-layout`                                                                 | Resizable panes, media and advanced table controls                                                               |
| `/hierarchy`, `/scheduling`, `/interaction-tools`, `/data-performance`             | Trees, scheduling, reorder/carousel, charts and virtualized/paginated tables                                     |

Responses and saves use local demonstrations. Application consumers own real
transport, persistence, validation and authorization. All feature pages load
lazily so the initial bundle remains within the configured production budget.

Use [Quality verification](../../docs/QUALITY.md) for the complete
Chromium/WebKit functional suite and macOS visual commands. The full grep
selection there keeps platform-specific screenshots out of Linux checks.
Contracts are indexed in [Documentation](../../docs/README.md); integration
wiring is in [Product recipes](../../docs/PRODUCT_RECIPES.md).
