# Epic 6 — Feedback & Overlays Implementation Plan

**Status:** Complete — Stories 6.0–6.7 delivered  
**Delivered:** Complete  
**Roadmap:** [JP_ROADMAP.md](./JP_ROADMAP.md) · **Principles:** [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)  
**Depends on:** Data Display complete ([DATA_DISPLAY_PLAN.md](./DATA_DISPLAY_PLAN.md))  

---

## Executive summary

Prior milestones established tokens, layout/typography, an app shell, core controls,
and data display. This epic introduces the **feedback and overlay layer**: a
reusable focus trap, tooltips, toasts, dialogs, popovers, and dropdown menus so
product surfaces can confirm actions, surface ephemeral status, and present
anchored choices without inventing one-off overlay markup.

The deliverable is not a full floating-UI / CDK Overlay product (no collision
engine, virtual scroll menus, or multi-layer portal registry). It is a **small,
opinionated set of accessible overlays** with token-driven visuals and proof in
Storybook + Showcase — enough to ship a full interaction layer inside the App Shell
shell using Controls buttons and Data Display status chips.

**Roadmap deliverable:** Full interaction layer  
**Components:** focus directive, `jp-tooltip`, `jp-toast` (+ service/outlet),
`jp-dialog`, `jp-popover`, `jp-dropdown-menu`

---

## Prerequisites

1. Data Display (PR #9) is the tip of the open delivery chain.
2. Branch from the prior tip (not from `main`
   while the chain is unmerged).
3. Confirm coverage gates remain green (`ui` / `showcase` ≥ 90%).
4. Skim [PRIMITIVES.md](./PRIMITIVES.md) conventions — this epic must match them.

---

## Problem statement

Today the design system can lay out pages, wrap them in a shell, collect form
input, and display tabular data, but it cannot express **ephemeral feedback**,
**modal confirmation**, or **anchored menus**. Any destructive action or status
toast would either:

- Duplicate overlay styles and drift from DESIGN_PRINCIPLES, or
- Pull in an external overlay kit and break the dark-first / accent-as-signal model

Without this epic, Assistant assistant surfaces have no consistent confirm/dismiss
patterns, and Showcase cannot prove a real interaction layer.

---

## Goals

| Goal                  | Success signal                                                         |
| --------------------- | ---------------------------------------------------------------------- |
| Overlay set shipped   | Focus trap, tooltip, toast, dialog, popover, dropdown exported from UI |
| Token-only visuals    | No hardcoded colors; overlay/toast tokens in `libs/tokens`             |
| Accessible by default | Focus trap, Escape dismiss, ARIA roles, keyboard menu nav              |
| Accent as signal      | Focus rings + primary actions use accent; overlays stay neutral        |
| Composable in shell   | Showcase overlays page inside `jp-app-shell`                           |
| Testable              | Unit + Storybook play + Chromium e2e; coverage gates still pass        |

---

## Non-goals (defer)

| Defer                                         | Why / where                                    |
| --------------------------------------------- | ---------------------------------------------- |
| Angular CDK Overlay / Floating UI engine      | Keep deps lean; CSS + light positioning for v1 |
| Collision / flip / shift positioning          | Product polish epic later                      |
| Nested modal stacks / focus restoration queue | Single modal at a time is enough for Showcase  |
| Toast persistence / undo history              | Apps own domain persistence                    |
| Context menus / right-click                   | Defer; dropdown covers intentional triggers    |
| Assistant panel                               | Assistant                                        |
| Visual regression baselines                   | Quality hardening                                        |

---

## Design principles applied

- **Signal, not noise** — Overlay surfaces use raised/floating elevation; accent
  appears on focus rings and primary actions only.
- **Consistency over customization** — No `class` / `style` inputs; tones and
  placements are closed enums.
- **Accessibility is default** — Dialogs trap focus; menus support arrow keys;
  tooltips expose accessible names; Escape dismisses overlays.
- **Motion** — Open/close uses existing motion tokens; honor `prefers-reduced-motion`.

---

## Architecture

### Placement

```text
libs/ui/src/lib/primitives/
  shared/focus-trap.ts          # jpFocusTrap directive + focusable helpers
  tooltip/
  toast/                        # toast, toast-outlet, toast.service
  dialog/
  popover/
  dropdown-menu/
```

Follow existing primitive patterns: standalone OnPush component, `*.ts` / `*.html` /
`*.scss` / `*.spec.ts` / `*.stories.ts`, export from `libs/ui/src/index.ts`.

### API conventions (lock these early)

| Convention     | Rule                                                                          |
| -------------- | ----------------------------------------------------------------------------- |
| Focus trap     | Attribute directive `[jpFocusTrap]="active"` on a container                   |
| Tooltip        | Wrapper `jp-tooltip` with `content` + `placement`                             |
| Toast tones    | Closed union: `neutral` \| `success` \| `warning` \| `error` \| `info`        |
| Toast API      | Imperative `JpToastService` + `<jp-toast-outlet />`                           |
| Dialog         | Controlled `open` + `openChange`; title; projected body + actions             |
| Popover        | Controlled `open` + trigger/content projection                                |
| Dropdown       | Trigger + `jp-dropdown-menu-item` children; single-select actions             |
| Positioning v1 | Relative host + absolute panel (tooltip/popover/menu); fixed for dialog/toast |

### Suggested public APIs (draft)

```html
<button type="button" [jpFocusTrap]="false">…</button>

<jp-tooltip content="Copy deployment ID" placement="top">
  <jp-button variant="secondary">Copy ID</jp-button>
</jp-tooltip>

<jp-toast-outlet />

<jp-dialog [open]="confirmOpen" title="Delete deployment?" (openChange)="confirmOpen = $event">
  <jp-text>This cannot be undone.</jp-text>
  <div jpDialogActions>
    <jp-button variant="secondary" (click)="confirmOpen = false">Cancel</jp-button>
    <jp-button variant="destructive" (click)="confirmDelete()">Delete</jp-button>
  </div>
</jp-dialog>

<jp-popover [open]="filtersOpen" (openChange)="filtersOpen = $event">
  <jp-button jpPopoverTrigger variant="secondary">Filters</jp-button>
  <div jpPopoverContent>
    <jp-text>Filter panel content</jp-text>
  </div>
</jp-popover>

<jp-dropdown-menu>
  <jp-button jpDropdownTrigger variant="secondary">Actions</jp-button>
  <button type="button" jpDropdownMenuItem (itemSelect)="onEdit()">Edit</button>
  <button type="button" jpDropdownMenuItem (itemSelect)="onDelete()">Delete</button>
</jp-dropdown-menu>
```

### Token work

Audit before coding. Likely additions (semantic only):

| Group   | Examples                                                       |
| ------- | -------------------------------------------------------------- |
| Overlay | scrim reuse; tooltip bg/fg; toast bg/fg per tone; panel border |
| Z-index | tooltip, popover, dropdown, dialog-scrim, dialog, toast        |
| Motion  | Prefer existing `motion.transition.base` / duration tokens     |

Reuse existing focus, surface, elevation, state-\*, and shell.scrim tokens
wherever possible. Run `tokens:build` / `tokens:check` in CI.

---

## Story breakdown

### Story 6.0 — Overlay tokens + API spike

**Scope:** Token gaps, shared focus helpers, locked API decisions.

**Acceptance criteria:**

- [x] Semantic overlay/toast/z-index tokens added (only what components need)
- [x] Generated artifacts rebuilt; `tokens:check` passes
- [x] Locked decisions table filled in this plan
- [x] Documented in `libs/tokens/README.md`

### Story 6.1 — Focus directive

**Acceptance criteria:**

- [x] `jpFocusTrap` traps Tab within host when active
- [x] Restores focus behavior documented for dialog consumers
- [x] Unit tests cover trap wrap-around

### Story 6.2 — `jp-tooltip`

**Acceptance criteria:**

- [x] `content` string; `placement`: `top` \| `bottom` \| `left` \| `right`
- [x] Shows on pointer enter / focus; hides on leave / blur / Escape
- [x] Accessible association (`aria-describedby` on trigger)
- [x] Unit + Storybook coverage

### Story 6.3 — `jp-toast`

**Acceptance criteria:**

- [x] `JpToastService.show({ message, tone?, durationMs? })`
- [x] `<jp-toast-outlet />` renders stacked toasts
- [x] Dismiss control + auto-dismiss; `role="status"`
- [x] Unit + Storybook coverage

### Story 6.4 — `jp-dialog`

**Acceptance criteria:**

- [x] Controlled `open` / `openChange`; required `title`
- [x] Scrim + Escape + optional close button dismiss
- [x] Focus moves into dialog; trap while open; restore on close
- [x] Actions slot via `[jpDialogActions]`
- [x] Unit + Storybook coverage

### Story 6.5 — `jp-popover`

**Acceptance criteria:**

- [x] Controlled `open` / `openChange`
- [x] Trigger via `[jpPopoverTrigger]`; content via `[jpPopoverContent]`
- [x] Escape / outside click dismiss
- [x] Unit + Storybook coverage

### Story 6.6 — `jp-dropdown-menu`

**Acceptance criteria:**

- [x] Trigger via `[jpDropdownTrigger]`
- [x] Items via `jp-dropdown-menu-item` (or attribute) with `select` output
- [x] Arrow key navigation + Enter/Space activate + Escape close
- [x] Unit + Storybook coverage

### Story 6.7 — Showcase composition + e2e

**Acceptance criteria:**

- [x] New route `/overlays` (keep prior showcase routes)
- [x] Overlays page lives inside `jp-app-shell`
- [x] Demonstrates tooltip, toast, dialog, popover, dropdown together
- [x] Root redirect points to `/overlays`
- [x] `showcase-e2e` asserts landmarks + at least one overlay interaction
- [x] Storybook `Compositions/Feedback Overlays` with accent/density toolbars
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

| Check                               | Viewports / modes   |
| ----------------------------------- | ------------------- |
| Tooltip placements + keyboard focus | 1440, neon + cobalt |
| Toast tones + auto-dismiss          | 1024                |
| Dialog focus trap / Escape / scrim  | 1024, 390           |
| Popover outside click               | 1024                |
| Dropdown arrow keys                 | Keyboard only       |
| Overlays page inside app shell      | 1440, 390           |

---

## Accessibility requirements

- Dialog: `role="dialog"`, `aria-modal="true"`, labelled by title
- Toast: `role="status"` (polite); do not steal focus
- Tooltip: associate via `aria-describedby`; do not use tooltip as sole label
- Dropdown: `role="menu"` / `menuitem`; arrow-key navigation
- Popover: labelled region; Escape dismisses
- Focus trap: Tab cycles within active dialog
- Honor `prefers-reduced-motion` on overlay transitions
- Contrast: AA for tooltip/toast/dialog text on surfaces

---

## Risks and decisions

| Decision       | Options                            | Recommendation                                        |
| -------------- | ---------------------------------- | ----------------------------------------------------- |
| Overlay engine | CDK Overlay vs lightweight CSS     | Lightweight CSS + shared focus helpers for v1         |
| Toast API      | Component-only vs service + outlet | Service + outlet (matches product usage)              |
| Dialog control | Uncontrolled vs controlled `open`  | Controlled for Showcase/testability                   |
| Menu items     | Buttons vs custom role elements    | Native buttons with menu roles                        |
| Showcase route | Replace `/data` vs add `/overlays`     | Add `/overlays`; keep `/data`; root → `/overlays` |
| PR granularity | One epic PR vs per-component       | Single epic PR chained on the prior tip       |

---

## Definition of done (Epic 6)

1. Stories 6.0–6.7 acceptance criteria checked.
2. CI gate green; coverage thresholds held.
3. [JP_ROADMAP.md](./JP_ROADMAP.md) this epic marked complete.
4. [PRIMITIVES.md](./PRIMITIVES.md) documents focus trap + overlay primitives.
5. Showcase proves feedback/overlays inside the app shell.
6. No primitive token leaks; no hardcoded colors in new SCSS.
7. the next epic was **not** started.

**Deliverable:** Full interaction layer — focus trap, tooltip, toast, dialog,
popover, and dropdown ready for product confirm/dismiss/menu surfaces on top of
App Shell through Data Display.

---

## Suggested PR sequence

| PR      | Contents                                                                  | Depends on            |
| ------- | ------------------------------------------------------------------------- | --------------------- |
| 6.0–6.7 | Tokens + focus + tooltip + toast + dialog + popover + dropdown + Showcase | Prior tip |

Single epic PR is preferred for this epic given the tightly coupled overlay set.

---

## First implementation steps

1. Branch from the prior tip.
2. Story 6.0: add overlay tokens; lock API decisions below.
3. Implement focus trap, then tooltip as the simplest overlay.
4. Implement toast service/outlet, dialog, popover, dropdown.
5. Showcase `/overlays` + composition story + e2e + docs.
6. Open PR against the prior tip.

---

## Locked decisions

| Decision           | Choice                                                                  |
| ------------------ | ----------------------------------------------------------------------- |
| Overlay engine     | No CDK; relative/fixed CSS positioning + shared focus helpers           |
| Focus API          | `[jpFocusTrap]="active"` attribute directive                            |
| Tooltip API        | Wrapper component; `content` + `placement`                              |
| Tooltip placements | `top` \| `bottom` \| `left` \| `right` (default `top`)                  |
| Toast tones        | `neutral` \| `success` \| `warning` \| `error` \| `info`                |
| Toast delivery     | `JpToastService` + `<jp-toast-outlet />`                                |
| Dialog API         | Controlled `open` / `openChange`; required `title`; `[jpDialogActions]` |
| Popover API        | Controlled `open`; `[jpPopoverTrigger]` + `[jpPopoverContent]`          |
| Dropdown API       | `[jpDropdownTrigger]` + `jpDropdownMenuItem` items                      |
| Showcase route     | `/overlays`; keep prior routes; root redirect → `/overlays`         |
| Collision / flip   | Deferred                                                                |
| Next epic            | Not started in this epic                                                |
