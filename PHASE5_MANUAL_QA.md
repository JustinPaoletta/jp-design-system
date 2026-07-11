# Phase 5 — Manual Test Checklist

Use this after automated gates are green (`lint`, unit tests + coverage, Storybook
interaction tests, Showcase Chromium e2e). Record failures in the PR description;
do not create a separate QA ledger.

**Related:** [docs/PHASE5_EPIC5_DATA_DISPLAY_PLAN.md](./docs/PHASE5_EPIC5_DATA_DISPLAY_PLAN.md) ·
[docs/PRIMITIVES.md](./docs/PRIMITIVES.md) · Phase 5 PR (`phase5-data-display`) · depends on
[PR #8](https://github.com/JustinPaoletta/jp-design-system/pull/8) (`phase4-controls`)

---

## What you are validating

Phase 5 delivers the data display layer inside the Phase 3 app shell:

| Piece            | What it should do                                            |
| ---------------- | ------------------------------------------------------------ |
| `jp-badge`       | Soft status chips; tones + sizes; accent as signal           |
| `jp-empty-state` | Title/description/status region; optional icon + actions     |
| `jp-table`       | Semantic table; caption; striped/hover; empty integration    |
| Showcase         | `/phase-5-data` deployments table inside `jp-app-shell`      |
| Storybook        | Data-display primitive stories + `Compositions/Data Display` |

**Not in Phase 5 (do not file as bugs):** sortable/filterable columns, row
selection chrome, virtualization, editable cells, toast/dialog/popover (Phase 6),
visual regression baselines (Phase 8).

---

## Setup

### Showcase

```bash
npx nx run showcase:serve
```

Open http://localhost:4200

### Storybook

```bash
npx nx run ui:storybook
```

Open http://localhost:4400

Use browser DevTools device mode for mobile checks (390×844 is the reference).
Spot-check both **neon** and **cobalt** accents where noted.

---

## 1. Showcase — routing and shell composition

| #   | Action                     | Expect                                                          |
| --- | -------------------------- | --------------------------------------------------------------- |
| 1.1 | Visit `/`                  | Redirects to `/phase-5-data`                                    |
| 1.2 | Read the page              | Heading **Phase 5 Data Display**; badge row + deployments table |
| 1.3 | Inspect chrome             | App shell sidebar + main; **Data** nav item active              |
| 1.4 | Nav links                  | Controls / Phase 3 / Phase 2 links present                      |
| 1.5 | Visit `/phase-4-controls`  | Phase 4 form still works                                        |
| 1.6 | Visit `/phase-3-dashboard` | Phase 3 shell dashboard still works                             |
| 1.7 | Visit `/phase-2-dashboard` | Phase 2 layout-only page still works (no shell)                 |
| 1.8 | Accent / density meta      | Page shows `accent:` and `density:` from document attributes    |

---

## 2. Badges (`jp-badge`)

On `/phase-5-data` and Storybook **Primitives → Data Display → Badge**.

| #   | Action                    | Expect                                                            |
| --- | ------------------------- | ----------------------------------------------------------------- |
| 2.1 | Inspect tone row          | Neutral / accent / success / warning / error / info chips visible |
| 2.2 | Accent tone               | Soft accent fill + strong accent text (not a large accent wash)   |
| 2.3 | Success / warning / error | Soft state fills with readable status text                        |
| 2.4 | Storybook sizes sm / md   | Padding/type scale coherent; no clipping                          |
| 2.5 | Accent neon → cobalt      | Accent badge follows accent family; state tones stay state tokens |
| 2.6 | Density → compact         | Badge padding tightens via space tokens without clipping labels   |

---

## 3. Table (`jp-table`)

| #   | Action                | Expect                                            |
| --- | --------------------- | ------------------------------------------------- |
| 3.1 | Inspect caption       | “Recent deployments” above headers                |
| 3.2 | Inspect headers       | Service / Environment / Status / Region           |
| 3.3 | Inspect status cells  | Badges inside status column                       |
| 3.4 | Hover a row           | Subtle surface hover (not accent fill)            |
| 3.5 | Striped rows          | Alternating row backgrounds visible               |
| 3.6 | Region column         | End-aligned                                       |
| 3.7 | Compact density       | Cell padding tightens; headers remain readable    |
| 3.8 | Narrow viewport (390) | Table scrolls horizontally inside frame if needed |

---

## 4. Empty state (`jp-empty-state`)

| #   | Action                      | Expect                                             |
| --- | --------------------------- | -------------------------------------------------- |
| 4.1 | Toggle **Show empty state** | Table body replaced by empty state                 |
| 4.2 | Read empty copy             | Title + description; `role="status"`               |
| 4.3 | Click **Clear filters**     | Returns to populated table                         |
| 4.4 | Standalone empty section    | Icon + title + primary action below the table card |
| 4.5 | Storybook Empty table story | Projected empty state with secondary action        |

---

## 5. Keyboard / accessibility smoke

| #   | Action                           | Expect                                          |
| --- | -------------------------------- | ----------------------------------------------- |
| 5.1 | Tab to empty-state action button | Visible focus ring                              |
| 5.2 | Inspect table semantics          | Real `<table>`, `<th scope="col">`, `<caption>` |
| 5.3 | Badge is not focusable           | Status text conveys meaning (not color alone)   |
| 5.4 | Screen reader (optional)         | Empty state announced as status                 |

---

## 6. Storybook composition

| #   | Action                               | Expect                                 |
| --- | ------------------------------------ | -------------------------------------- |
| 6.1 | Open **Compositions / Data Display** | Shell + badges + table                 |
| 6.2 | Toggle accent / density toolbars     | Tokens update without layout collapse  |
| 6.3 | Toggle show-empty switch             | Empty state appears inside table frame |

---

## Sign-off

| Gate                        | Pass? |
| --------------------------- | ----- |
| Automated unit + coverage   |       |
| Storybook interaction tests |       |
| Showcase Chromium e2e       |       |
| Manual checks above         |       |

Tester: **\*\***\_\_**\*\*** Date: **\*\***\_\_**\*\***
