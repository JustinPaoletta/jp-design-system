# Phase 3 Epic 3 — App Shell Implementation Plan

**Status:** In progress — Stories 3.0–3.1 complete (shell tokens + `jp-app-shell`)  
**Branch:** `phase3-app-shell`  
**Roadmap:** [JP_ROADMAP.md](./JP_ROADMAP.md) · **Principles:** [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)

---

## Executive summary

Phase 2 proved that layout and typography primitives compose cleanly into a
dashboard page. Phase 3 wraps that content in a **persistent application shell**:
sidebar navigation, collapsible rail, and mobile drawer behavior.

The deliverable is not a pixel-perfect Stripe clone. It is a **token-driven,
accessible shell primitive** that every future dashboard page can slot into without
rebuilding layout chrome.

---

## Prerequisites

Complete before starting implementation:

1. ~~Merge PR #3 (`phase2Epic2` → default branch).~~ Done.
2. ~~Merge PR #4 (`standardizeApps` — Showcase rename and docs alignment).~~ Done.
3. ~~Pull latest default branch and branch from it (`phase3-app-shell`).~~ Done.

Phase 2 manual QA is archived in git history; this document is the active planning artifact.

---

## Problem statement

Today, `/phase-2-dashboard` renders dashboard content directly inside a bare
`<jp-box>`. There is no shared chrome for:

- Primary navigation and route context
- Sidebar collapse on desktop
- Off-canvas navigation on mobile
- Active / hover / focus nav affordances using accent tokens

Without a shell, every future page (Phase 4 controls, Phase 5 data tables) would
duplicate layout logic and drift from design principles.

---

## Goals

| Goal                    | Success signal                                                |
| ----------------------- | ------------------------------------------------------------- |
| Single shell primitive  | `jp-app-shell` exported from `libs/ui`                        |
| Composable content area | Dashboard content projects via `<ng-content>`                 |
| Collapsible sidebar     | Desktop rail toggles between expanded and icon-only widths    |
| Mobile drawer           | Below breakpoint, sidebar becomes off-canvas with overlay     |
| Nav state styling       | Active item uses accent signal; hover/focus meet WCAG AA      |
| Token-only styling      | No hardcoded colors; new layout tokens added to `libs/tokens` |
| Integration proof       | Showcase route + Storybook composition + e2e gate             |

---

## Non-goals (defer to later phases)

- **`jp-button` / icon buttons** — collapse trigger and drawer close use minimal
  native `<button>` styling with tokens until Phase 4 ships formal controls.
- **Router-aware nav** — shell accepts nav items as inputs or projected content;
  Angular `RouterLink` wiring lives in Showcase, not inside the primitive.
- **User menu, breadcrumbs, command palette** — out of scope.
- **Assistant panel** — Phase 7.
- **Visual regression baselines** — Phase 8.

---

## Architecture

### Component split

Keep the shell thin. Prefer composition over a monolith.

| Piece                                           | Responsibility                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| `jp-app-shell`                                  | Root grid/flex layout: sidebar region + main region; owns collapse and drawer state |
| `jp-app-shell-sidebar` (optional sub-component) | Sidebar surface, scroll, width tokens; projects nav                                 |
| `jp-app-shell-nav-item`                         | Single nav row: icon slot, label, active/hover/focus states                         |
| `jp-app-shell-main` (optional sub-component)    | Main content scroll container                                                       |

**Recommendation:** Start with `jp-app-shell` + `jp-app-shell-nav-item`. Extract
sidebar/main sub-components only if the root template exceeds ~120 lines or state
becomes hard to test.

### Public API (draft)

```html
<jp-app-shell [sidebarCollapsed]="collapsed" [mobileNavOpen]="drawerOpen" (sidebarCollapsedChange)="collapsed = $event" (mobileNavOpenChange)="drawerOpen = $event">
  <nav jpAppShellSidebar aria-label="Primary">
    <jp-app-shell-nav-item [active]="true" href="/overview"> Overview </jp-app-shell-nav-item>
    <!-- … -->
  </nav>

  <main jpAppShellMain>
    <!-- existing phase-2 dashboard composition -->
  </main>
</jp-app-shell>
```

Design constraints:

- **No `style` / `class` inputs** — same rule as Phase 2 primitives.
- **Semantic landmarks** — shell renders `<aside>` + `<main>` (or documents why not).
- **State is controllable** — collapse and drawer open are inputs with change outputs
  so Showcase and Storybook can drive state without private APIs.
- **Content projection** — sidebar and main are slots, not hard-coded nav labels.

### Layout behavior

```text
Desktop (≥ breakpoint)
┌──────────────┬─────────────────────────────┐
│   Sidebar    │         Main content        │
│  (expanded   │   (phase-2 dashboard, etc.)   │
│   or rail)   │                             │
└──────────────┴─────────────────────────────┘

Mobile (< breakpoint)
┌─────────────────────────────────────────────┐
│  [menu]  App title / context                │
├─────────────────────────────────────────────┤
│              Main content                   │
└─────────────────────────────────────────────┘

Drawer open: sidebar slides over main + scrim; focus trapped until closed.
```

Breakpoint should come from a **semantic layout token** (e.g.
`--jp-layout-shell-mobile-max`), not a magic number in SCSS.

---

## Token work (Story 3.0)

Add shell-specific semantic tokens before component SCSS. Proposed groups:

| Token group   | Examples                                                                                                                       | Notes                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Sidebar width | `--jp-size-sidebar-expanded`, `--jp-size-sidebar-collapsed`                                                                    | Collapsed = icon rail                           |
| Shell chrome  | `--jp-color-shell-sidebar-bg`, `--jp-color-shell-border`                                                                       | Map from existing surface neutrals              |
| Nav item      | `--jp-color-nav-item-text`, `--jp-color-nav-item-text-active`, `--jp-color-nav-item-bg-hover`, `--jp-color-nav-item-bg-active` | Active uses accent signal per DESIGN_PRINCIPLES |
| Motion        | `--jp-motion-duration-shell`, `--jp-motion-ease-shell`                                                                         | Reuse motion primitives                         |
| Z-index       | `--jp-z-shell-drawer`, `--jp-z-shell-scrim`                                                                                    | If not already present                          |

Run `npm run tokens:build` and `npm run tokens:check` in CI. No primitive token
usage in components.

**Status:** ✅ Complete (2026-07-10)

---

## Story breakdown

### Story 3.0 — Shell layout tokens

**Acceptance criteria:**

- [x] Sidebar width tokens (`--jp-size-sidebar-expanded`, `--jp-size-sidebar-collapsed`)
- [x] Layout breakpoint token (`--jp-layout-shell-mobile-max`)
- [x] Shell chrome and nav-item color tokens
- [x] Shell motion and z-index tokens
- [x] Generated artifacts rebuilt; `tokens:check` passes
- [x] Documented in `libs/tokens/README.md`

### Story 3.1 — Shell layout primitive

**Scope:** `jp-app-shell` with sidebar + main regions, desktop collapse, no mobile yet.

**Acceptance criteria:**

- [x] Component lives under `libs/ui/src/lib/primitives/app-shell/`
- [x] Exported from `libs/ui/src/index.ts`
- [x] Collapse toggles sidebar between expanded and collapsed widths via token
- [x] Main content reflows; no horizontal overflow at 1440 / 1024 (manual verify in Storybook)
- [x] Unit tests for collapse state and host classes
- [x] Storybook: `Primitives/Layout/App Shell` — `Default`, `Collapsed`

### Story 3.2 — Nav item primitive

**Scope:** `jp-app-shell-nav-item` with active, hover, focus-visible states.

**Acceptance criteria:**

- [ ] Renders as `<a>` or `<button>` via `as` / `href` pattern (match existing primitive conventions)
- [ ] `active` input applies accent signal (not large accent fill)
- [ ] Focus ring uses semantic focus tokens
- [ ] Storybook: `Active`, `Hover` (pseudo via forced states doc), `FocusVisible`
- [ ] Unit tests for class/state mapping

### Story 3.3 — Mobile drawer

**Scope:** Off-canvas sidebar, scrim, escape to close, focus management.

**Acceptance criteria:**

- [ ] Below layout breakpoint, sidebar hidden by default
- [ ] `mobileNavOpen` input opens drawer over content with scrim
- [ ] Escape key and scrim click set `mobileNavOpen` false
- [ ] Focus moves into drawer on open; returns to trigger on close
- [ ] `prefers-reduced-motion`: instant or minimal transition
- [ ] Storybook story at mobile viewport; Playwright viewport test in e2e

### Story 3.4 — Showcase integration

**Scope:** New route wrapping existing dashboard in the shell.

**Acceptance criteria:**

- [ ] Route `/phase-3-dashboard` (or migrate `/phase-2-dashboard` — **decide at PR open**)
- [ ] Phase 2 dashboard content unchanged inside `<main>`
- [ ] Sample nav items (static labels; one marked active)
- [ ] Root redirect updated if route name changes
- [ ] No `lib-ui` on page

### Story 3.5 — Composition story + CI gate

**Scope:** Storybook composition mirroring Showcase; extend e2e.

**Acceptance criteria:**

- [ ] `Compositions/App Shell Dashboard` story with accent/density toolbar enabled
- [ ] `npx nx run ui:test-storybook` covers shell smoke interaction
- [ ] `showcase-e2e` asserts shell landmarks, collapse toggle, mobile drawer at 390px
- [ ] Full Step 1 gate green (see below)

---

## Testing strategy

### Automated gate (run before every PR merge)

```bash
npm ci
npm run tokens:build
npm run format:check
npm run lint
npm run test
npm run build
npx nx run ui:test-storybook
npx nx run showcase-e2e:e2e -- --project=chromium
```

### Manual spot-check (once per story, not a standing doc)

| Check                                        | Viewports  |
| -------------------------------------------- | ---------- |
| Collapse / expand                            | 1440, 1024 |
| Drawer open / close / escape                 | 390        |
| Active nav accent visible in neon and cobalt | 1024       |
| Density compact tightens nav padding         | 1024       |
| Keyboard: Tab through nav, focus visible     | 1024       |

Record failures in the PR description, not a separate QA ledger.

---

## Accessibility requirements

- Sidebar: `aria-label="Primary"` (or configurable `sidebarLabel` input)
- Mobile menu button: `aria-expanded`, `aria-controls` pointing at drawer id
- Drawer: focus trap while open; inert or `aria-hidden` on main content
- Active nav: `aria-current="page"` when active
- Color contrast: nav text and active states ≥ WCAG AA on shell backgrounds

---

## Risks and decisions

| Decision             | Options                                               | Recommendation                                                     |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| Route naming         | Keep `/phase-2-dashboard` vs add `/phase-3-dashboard` | Add `/phase-3-dashboard`; keep phase-2 route until Phase 4 cleanup |
| Sub-components       | Monolith vs split                                     | Start monolith; split if complexity grows                          |
| Collapse persistence | Session-only vs `localStorage`                        | Session-only for v1; persistence is a Showcase concern             |
| Icons in nav         | Placeholder spans vs SVG                              | Text-only labels in v1; icon slot as ng-content                    |
| Breakpoint value     | 768 vs 1024                                           | 768 to align with Phase 2 responsive testing                       |

---

## Definition of done (Epic 3)

Epic 3 is complete when:

1. All Story 3.1–3.5 acceptance criteria are checked.
2. CI gate passes on the epic PR.
3. [JP_ROADMAP.md](./JP_ROADMAP.md) progress section updated.
4. [PRIMITIVES.md](./PRIMITIVES.md) documents `jp-app-shell` and nav item APIs.
5. No new hardcoded colors or primitive token leaks (existing lint scripts pass).

**Deliverable:** Functional dashboard shell — sidebar collapse, nav states, mobile
drawer — with Showcase and Storybook proof.

---

## Suggested PR sequence

| PR      | Contents                                           | Depends on     |
| ------- | -------------------------------------------------- | -------------- |
| 3.0     | Token additions for shell layout and nav           | default branch |
| 3.1–3.2 | Shell + nav item primitives, unit tests, Storybook | 3.0            |
| 3.3     | Mobile drawer + a11y                               | 3.1–3.2        |
| 3.4–3.5 | Showcase route, composition story, e2e             | 3.3            |

Single epic PR is acceptable if review size stays under ~800 lines; split if larger.

---

## First implementation steps

1. Create branch `phase3-app-shell` from merged default branch.
2. Add shell layout tokens (Story 3.0); run `tokens:build`.
3. Scaffold `libs/ui/src/lib/primitives/app-shell/` following `jp-surface` patterns
   (typed inputs, OnPush, token maps, spec + stories).
4. Wire a minimal Storybook story before Showcase — faster iteration loop.
5. Open draft PR early; attach this plan as the scope contract.
