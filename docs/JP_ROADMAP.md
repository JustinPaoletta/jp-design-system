# JP Design System Roadmap

## Vision

Dark-first, precision-engineered Angular design system with controlled
accent families, strict token discipline, and Stripe/Linear-inspired
density.

---

## Current Progress (as of July 10, 2026)

- Foundation is complete.
- Story 0.1 (Initialize Nx Workspace) is complete and QA-tested.
- Story 0.2 (Create Libraries) is complete and validated.
- Story 0.3 (Lint & Formatting) is complete and validated.
- Story 0.4 (CI Pipeline) is complete and validated.
- Tokens, Epic 1 (Token System) is complete.
- Layout, Epic 2 (Layout Primitives + Layout-Only Dashboard) is complete.
- App Shell, Epic 3 (App Shell) is complete.
- Controls, Epic 4 (Core Inputs / Controls) is complete.
- Data Display, Epic 5 (Data Display) is complete.
- Feedback & Overlays, Epic 6 (Feedback & Overlays) is complete.
- Assistant, Epic 7 (Assistant System) is complete.
- Implementation plan: [ASSISTANT_SYSTEM_PLAN.md](./ASSISTANT_SYSTEM_PLAN.md).
- Next milestone: quality hardening (tests, a11y audit, visual regression, bundle size).

---

# Milestone 0 --- Foundation & Tooling

## EPIC 0 --- Monorepo Setup

### Story 0.1 --- Initialize Nx Workspace

- [x] Angular preset
- [x] Strict TypeScript
- [x] Standalone components default
- [x] QA validation completed

### Story 0.2 --- Create Libraries

- [x] libs/tokens
- [x] libs/ui
- [x] UI Storybook target (`ui:storybook` on port 4400)
- [x] Showcase integration app (`showcase`)

### Story 0.3 --- Lint & Formatting

- [x] Strict ESLint
- [x] No `any`
- [x] No hardcoded colors
- [x] Prettier config

### Story 0.4 --- CI Pipeline

- [x] Lint
- [x] Test
- [x] Build
- [x] Block failed merges

Deliverable: Clean CI-ready repo.

---

# Milestone 1 --- Token Architecture

## EPIC 1 --- Token System

### Story 1.1 --- Primitive Tokens

- [x] Neutrals
- [x] Accent ramp
- [x] Typography
- [x] Spacing
- [x] Radius
- [x] Elevation
- [x] Motion

### Story 1.2 --- Semantic Aliases

- [x] Map primitive → semantic
- [x] Prevent direct primitive usage in components

### Story 1.3 --- Density Modes

- [x] Default
- [x] Compact (token overrides only)

### Story 1.4 --- Accent Variants

- [x] data-jp-accent attribute
- [x] Implement neon
- [x] Validate swap readiness

### Story 1.5 --- CSS Output

- [x] Style Dictionary setup
- [x] Generate tokens.css
- [x] Generate compact variant

Deliverable: Working theme + density + accent switching. Completed.

---

# Milestone 2 --- Primitives

## EPIC 2 --- Layout + Typography Primitives

Layout:

- [x] jp-box
- [x] jp-stack
- [x] jp-inline
- [x] jp-grid
- [x] jp-surface

Typography:

- [x] jp-text — body copy; `as` and `size` are independent
- [x] jp-heading — titles; `as` (h1–h6) sets both semantics and size via
 per-level tokens (`--jp-font-size-heading-h1` … `h6`). No `size` prop.

Integration:

- [x] Storybook primitives + composition story coverage
- [x] Showcase `/layout-dashboard` route and page
- [x] CI Playwright Chromium gate for dashboard validation
- [x] `Ui`/`lib-ui` marked deprecated for transition window

See [PRIMITIVES.md](./PRIMITIVES.md) for API reference and design rationale.

Deliverable: Layout-only dashboard using primitives. Completed.

---

# Milestone 3 --- App Shell

## EPIC 3 --- Layout System

Implementation plan: [APP_SHELL_PLAN.md](./APP_SHELL_PLAN.md)

- [x] Story 3.0 — Shell layout tokens
- [x] Story 3.1 — `jp-app-shell` (sidebar + main, desktop collapse)
- [x] Story 3.2 — `jp-app-shell-nav-item` (active, hover, focus)
- [x] Story 3.3 — Mobile drawer + accessibility
- [x] Story 3.4 — Showcase route integration
- [x] Story 3.5 — Composition story + e2e gate

Deliverable: Functional dashboard shell. Completed.

---

# Milestone 4 --- Controls

## EPIC 4 --- Core Inputs

Implementation plan: [CONTROLS_PLAN.md](./CONTROLS_PLAN.md)

- [x] Story 4.0 — Control tokens + API spike (locked decisions)
- [x] Story 4.1 — `jp-button`
- [x] Story 4.2 — `jp-icon-button`
- [x] Story 4.3 — `jp-input` + `jp-textarea`
- [x] Story 4.4 — `jp-select`
- [x] Story 4.5 — `jp-checkbox` + `jp-switch`
- [x] Story 4.6 — Showcase composition + e2e

Deliverable: Complete form styling. Completed.

---

# Milestone 5 --- Data Display

## EPIC 5

Implementation plan: [DATA_DISPLAY_PLAN.md](./DATA_DISPLAY_PLAN.md)

- [x] Story 5.0 — Data display tokens + API spike (locked decisions)
- [x] Story 5.1 — `jp-badge`
- [x] Story 5.2 — `jp-empty-state`
- [x] Story 5.3 — `jp-table`
- [x] Story 5.4 — Showcase composition + e2e

Deliverable: Dashboard data page.

---

# Milestone 6 --- Feedback & Overlays

## EPIC 6

Implementation plan: [FEEDBACK_OVERLAYS_PLAN.md](./FEEDBACK_OVERLAYS_PLAN.md)

- [x] Story 6.0 — Overlay tokens + API spike (locked decisions)
- [x] Story 6.1 — Focus directive (`jpFocusTrap`)
- [x] Story 6.2 — `jp-tooltip`
- [x] Story 6.3 — `jp-toast` (+ service / outlet)
- [x] Story 6.4 — `jp-dialog`
- [x] Story 6.5 — `jp-popover`
- [x] Story 6.6 — `jp-dropdown-menu`
- [x] Story 6.7 — Showcase composition + e2e

Deliverable: Full interaction layer.

---

# Milestone 7 --- Assistant System

## EPIC 7

Implementation plan: [ASSISTANT_SYSTEM_PLAN.md](./ASSISTANT_SYSTEM_PLAN.md)

- [x] Story 7.0 — Assistant tokens + API spike (locked decisions)
- [x] Story 7.1 — `JpAssistantService`
- [x] Story 7.2 — `jpAssistantTrigger`
- [x] Story 7.3 — `jp-assistant-message` (tone refinement)
- [x] Story 7.4 — `jp-assistant-panel`
- [x] Story 7.5 — Showcase composition + e2e

Deliverable: Branded assistant integration.

---

# Milestone 8 --- Quality Hardening

## EPIC 8

- Unit tests
- Accessibility audit
- Visual regression setup
- Bundle size audit

Deliverable: Production-grade stability.

---

# Milestone 9 --- Distribution

## EPIC 9

- Library build output
- Semantic versioning automation
- Private npm publish (optional)
- Documentation site

Deliverable: Releasable design system.
