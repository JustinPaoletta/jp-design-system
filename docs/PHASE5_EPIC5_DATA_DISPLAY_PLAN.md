# Phase 5 Epic 5 — Data Display Implementation Plan

**Status:** Complete — Stories 5.0–5.4 delivered  
**Branch:** `phase5-data-display`  
**Roadmap:** [JP_ROADMAP.md](./JP_ROADMAP.md) · **Principles:** [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)  
**Depends on:** Phase 4 Core Controls complete ([PHASE4_EPIC4_CONTROLS_PLAN.md](./PHASE4_EPIC4_CONTROLS_PLAN.md))  
**PR base:** `phase4-controls` (PR #8) until that chain merges to `main`

---

## Executive summary

Phases 1–4 established tokens, layout/typography primitives, an app shell, and
core controls. Phase 5 introduces the **data display layer**: status badges, a
token-driven table, and a reusable empty-state pattern so dashboards can show
structured records without inventing one-off markup.

The deliverable is not a full data-grid product (no virtualization, column
resize, or server-driven sort). It is a **small, opinionated set of presentational
primitives** with accessible defaults and proof in Storybook + Showcase — enough
to ship a dashboard data page inside the Phase 3 shell using Phase 4 buttons for
actions.

**Roadmap deliverable:** Dashboard data page  
**Components:** `jp-badge`, `jp-table` (+ optional cell template), `jp-empty-state`

---

## Prerequisites

1. Phase 4 (`phase4-controls` / PR #8) is the tip of the open phase chain.
2. Branch `phase5-data-display` from `phase4-controls` (not from `main` while the
   chain is unmerged).
3. Confirm coverage gates remain green (`ui` / `showcase` ≥ 90%).
4. Skim [PRIMITIVES.md](./PRIMITIVES.md) conventions — Phase 5 must match them.

---

## Problem statement

Today the design system can lay out pages, wrap them in a shell, and collect
form input, but it cannot express **tabular data**, **status chips**, or a
consistent **empty** affordance. Any deployments/list page would either:

- Duplicate table/badge styles and drift from DESIGN_PRINCIPLES, or
- Pull in an external data-grid kit and break the dark-first / accent-as-signal model

Without Phase 5, Phase 6 overlays have nothing consistent to annotate or confirm
against, and Showcase cannot prove a real dashboard data surface.

---

## Goals

| Goal                     | Success signal                                                      |
| ------------------------ | ------------------------------------------------------------------- |
| Data display set shipped | Badge, table, empty-state exported from `libs/ui`                   |
| Token-only visuals       | No hardcoded colors; badge/table tokens in `libs/tokens`            |
| Accessible by default    | Semantic `<table>`, caption, empty region announced                 |
| Accent as signal         | Accent badge tone is a chip signal — never a large accent wash      |
| Density-aware            | Compact mode tightens cell padding via tokens                       |
| Composable in shell      | Showcase data page inside `jp-app-shell` with badges + empty toggle |
| Testable                 | Unit + Storybook play + Chromium e2e; coverage gates still pass     |

---

## Non-goals (defer)

| Defer                                      | Why / where                                      |
| ------------------------------------------ | ------------------------------------------------ |
| Sortable / filterable / resizable columns  | Product data-grid epic later                     |
| Virtualized rows / infinite scroll         | Performance epic; not needed for Showcase proof  |
| Row selection / bulk actions chrome        | Apps compose with Phase 4 checkbox + button      |
| Editable cells                             | Forms stay on Phase 4 controls                   |
| Toast / dialog / popover                   | Phase 6                                          |
| Visual regression baselines                | Phase 8                                          |
| Replacing Phase 4 Showcase as root forever | Root redirects to Phase 5 for the milestone only |

---

## Design principles applied

- **Signal, not noise** — Badge accent tone uses soft accent fill + strong text;
  table hover is a subtle surface shift, not an accent slab.
- **Consistency over customization** — No `class` / `style` inputs; tones and
  sizes are closed enums.
- **Accessibility is default** — Real `<table>` / `<th scope="col">` / caption;
  empty state is a clear status region, not decorative whitespace.
- **Density** — Cell padding maps to space tokens; compact density tightens via
  existing density CSS where table tokens override.
- **Motion** — Row hover uses existing motion tokens; honor `prefers-reduced-motion`.

---

## Architecture

### Placement

```text
libs/ui/src/lib/primitives/
  badge/
  empty-state/
  table/
```

Follow existing primitive patterns: standalone OnPush component, `*.ts` / `*.html` /
`*.scss` / `*.spec.ts` / `*.stories.ts`, export from `libs/ui/src/index.ts`.

### API conventions (lock these early)

| Convention  | Rule                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------- |
| Badge tones | Closed union: `neutral` \| `accent` \| `success` \| `warning` \| `error` \| `info`          |
| Badge sizes | `sm` \| `md`                                                                                |
| Table data  | `columns: JpTableColumn[]` + `rows: Record<string, JpTableCellValue>[]`                     |
| Cell values | `string` \| `number` \| `null` \| `undefined` (rendered as text; empty string for nullish)  |
| Rich cells  | Optional `ng-template[jpTableCell]="columnKey"` for projected cell content (e.g. badges)    |
| Empty state | `jp-empty-state` with `title` + optional `description`; action via content projection       |
| Table empty | When `rows.length === 0`, table body is replaced by projected `jp-empty-state` (or default) |
| Density     | Inherit document density; table cell padding uses semantic table space tokens               |

### Suggested public APIs (draft)

```html
<jp-badge tone="success" size="sm">Healthy</jp-badge>

<jp-empty-state title="No deployments" description="Create a deployment to see it listed here.">
  <jp-button variant="primary">New deployment</jp-button>
</jp-empty-state>

<jp-table caption="Recent deployments" [columns]="columns" [rows]="rows" [striped]="true">
  <ng-template jpTableCell="status" let-value>
    <jp-badge [tone]="statusTone(value)">{{ value }}</jp-badge>
  </ng-template>
  <jp-empty-state title="No deployments" description="Nothing matches the current filters.">
    <jp-button variant="secondary">Clear filters</jp-button>
  </jp-empty-state>
</jp-table>
```

### Token work

Audit before coding. Likely additions (semantic only):

| Group       | Examples                                                                           |
| ----------- | ---------------------------------------------------------------------------------- |
| Badge       | soft bg + fg per tone (`neutral`, `accent`, `success`, `warning`, `error`, `info`) |
| Table       | header bg/fg, row hover, row border, cell fg, striped bg                           |
| Empty state | Prefer reuse of surface/text tokens; add only if a gap appears                     |

Reuse existing focus, foreground, surface, state-\*, and space tokens wherever
possible. Run `tokens:build` / `tokens:check` in CI.

---

## Story breakdown

### Story 5.0 — Data display tokens + API spike

**Scope:** Token gaps, shared table/badge SCSS patterns, locked API decisions.

**Acceptance criteria:**

- [x] Semantic badge/table tokens added (only what components need)
- [x] Generated artifacts rebuilt; `tokens:check` passes
- [x] Locked decisions table filled in this plan
- [x] Documented in `libs/tokens/README.md`

### Story 5.1 — `jp-badge`

**Acceptance criteria:**

- [x] Tones: `neutral`, `accent`, `success`, `warning`, `error`, `info`
- [x] Sizes: `sm`, `md`
- [x] Projected label content; no interactive role by default
- [x] Unit tests + Storybook (all tones; sizes)
- [x] Accent toolbar meaningful on accent tone

### Story 5.2 — `jp-empty-state`

**Acceptance criteria:**

- [x] `title` required (or strongly recommended string input)
- [x] Optional `description`
- [x] Optional action slot via projection
- [x] Optional icon slot via `[jpEmptyStateIcon]`
- [x] Unit + Storybook coverage

### Story 5.3 — `jp-table`

**Acceptance criteria:**

- [x] Semantic table markup with caption, column headers, body rows
- [x] `columns` + `rows` inputs; string/number cell rendering
- [x] Optional `jpTableCell` templates for rich cells
- [x] Empty rows → projected `jp-empty-state` (or built-in fallback copy)
- [x] `striped` boolean; hover row affordance
- [x] Unit + Storybook (populated + empty)

### Story 5.4 — Showcase composition + e2e

**Acceptance criteria:**

- [x] New route `/phase-5-data` (keep prior phase routes)
- [x] Data page lives inside `jp-app-shell` with sample nav
- [x] Demonstrates table + badges + empty-state toggle (or dual sections)
- [x] Root redirect points to `/phase-5-data`
- [x] `showcase-e2e` asserts landmarks, table caption/headers, and a badge
- [x] Storybook `Compositions/Data Display` with accent/density toolbars
- [x] Coverage gates still ≥ 90% on `ui` / `showcase`
- [x] PRIMITIVES.md + CHANGELOG + roadmap + README updated

---

## Testing strategy

### Automated (merge gate)

```bash
npm ci
npm run tokens:build
npm run format:check
npm run lint
npm run test          # includes coverage thresholds
npm run build
npx nx run ui:test-storybook
npx nx run showcase-e2e:e2e -- --project=chromium
```

### Manual spot-check (once per story)

| Check                                       | Viewports / modes   |
| ------------------------------------------- | ------------------- |
| All badge tones + sizes                     | 1440, neon + cobalt |
| Table headers / zebra / hover               | 1024                |
| Empty state with and without action         | 1024                |
| Compact density cell padding                | 1024                |
| Keyboard focus on empty-state action button | Keyboard only       |
| Data page inside app shell (no overflow)    | 1440, 390           |

---

## Accessibility requirements

- Table: use native `<table>`, `<thead>`, `<th scope="col">`, `<caption>`
- Do not use layout-only div grids pretending to be tables for the primary API
- Empty state: clear heading/title; description is supplementary text
- Badge: not a button; if used as status, prefer visible text (not color alone)
- Contrast: AA for badge text on soft fills and table header/body text
- Honor `prefers-reduced-motion` on row hover transitions

---

## Risks and decisions

| Decision          | Options                                   | Recommendation                                          |
| ----------------- | ----------------------------------------- | ------------------------------------------------------- |
| Table API         | Markup projection vs columns/rows data    | columns/rows for v1 + optional cell templates           |
| Rich cells        | Strings only vs templates                 | `jpTableCell` templates for badges in Showcase          |
| Empty composition | Separate page section vs table-integrated | Both: table hosts empty; Showcase also shows standalone |
| Sort/filter       | Build now vs defer                        | Defer                                                   |
| Showcase route    | Replace phase-4 vs add phase-5            | Add `/phase-5-data`; keep phase-4; root → phase-5       |
| PR granularity    | One epic PR vs per-component              | Single epic PR chained on `phase4-controls`             |

---

## Definition of done (Epic 5)

1. Stories 5.0–5.4 acceptance criteria checked.
2. CI gate green; coverage thresholds held.
3. [JP_ROADMAP.md](./JP_ROADMAP.md) Phase 5 marked complete.
4. [PRIMITIVES.md](./PRIMITIVES.md) documents badge, table, empty-state.
5. Showcase proves data display inside the app shell.
6. No primitive token leaks; no hardcoded colors in new SCSS.

**Deliverable:** Dashboard data page — badges, table, and empty state ready for
product list/detail surfaces on top of the Phase 3 shell and Phase 4 controls.

---

## Suggested PR sequence

| PR      | Contents                                                 | Depends on        |
| ------- | -------------------------------------------------------- | ----------------- |
| 5.0–5.4 | Tokens + badge + empty-state + table + Showcase/e2e/docs | `phase4-controls` |

Single epic PR is preferred for Phase 5 given the small component count.

---

## First implementation steps

1. Branch `phase5-data-display` from `phase4-controls`.
2. Story 5.0: add badge/table tokens; lock API decisions below.
3. Implement `jp-badge` end-to-end as the reference chip other stories reuse.
4. Implement `jp-empty-state`, then `jp-table` with empty integration.
5. Showcase `/phase-5-data` + composition story + e2e + docs.
6. Open PR with base `phase4-controls`.

---

## Locked decisions

| Decision               | Choice                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| Badge tones            | `neutral` \| `accent` \| `success` \| `warning` \| `error` \| `info`                             |
| Badge sizes            | `sm` \| `md`                                                                                     |
| Badge interactivity    | Presentational only (no button role); apps wrap in controls if needed                            |
| Table API              | `columns` + `rows` inputs; native semantic table markup                                          |
| Cell value types       | `string` \| `number` \| `null` \| `undefined`                                                    |
| Rich cells             | Optional `ng-template[jpTableCell]="key"`                                                        |
| Striped rows           | `striped` boolean input (default `false`)                                                        |
| Empty integration      | Project `jp-empty-state` into `jp-table`; fallback title when none projected                     |
| Empty-state API        | `title` + optional `description`; icon slot `[jpEmptyStateIcon]`; actions via default projection |
| Showcase route         | `/phase-5-data`; keep prior routes; root redirect → phase-5                                      |
| Sort / filter / select | Deferred                                                                                         |
