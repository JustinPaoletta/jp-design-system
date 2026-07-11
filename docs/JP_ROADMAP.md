# JP Design System Roadmap

## Vision

Dark-first, precision-engineered Angular design system with controlled
accent families, strict token discipline, and Stripe/Linear-inspired
density.

---

## Current Progress (as of July 10, 2026)

- Phase 0 is complete.
- Story 0.1 (Initialize Nx Workspace) is complete and QA-tested.
- Story 0.2 (Create Libraries) is complete and validated.
- Story 0.3 (Lint & Formatting) is complete and validated.
- Story 0.4 (CI Pipeline) is complete and validated.
- Phase 1, Epic 1 (Token System) is complete.
- Story 1.1 (Primitive Tokens) is complete and validated.
- Story 1.2 (Semantic Aliases) is complete and validated.
- Story 1.3 (Density Modes) is complete and validated.
- Story 1.4 (Accent Variants) is complete and validated.
- Story 1.5 (CSS Output) is complete and validated.
- Phase 2, Epic 2 (Layout Primitives + Layout-Only Dashboard) is complete.
- Phase 3, Epic 3 (App Shell) is complete.
- Story 2.1 (Layout primitives in `libs/ui`) is complete and validated.
- Story 2.2 (Showcase `/phase-2-dashboard`) is complete and validated.
- Story 2.3 (Storybook primitive + composition coverage) is complete and validated.
- Story 2.4 (Chromium e2e gate for Showcase dashboard) is complete and validated.
- Story 2.5 (`Ui`/`lib-ui` deprecation window) is complete and validated.
- Next milestone: Phase 4, Epic 4 (Core Inputs / Controls).

---

# PHASE 0 --- Foundation & Tooling

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

# PHASE 1 --- Token Architecture

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

# PHASE 2 --- Primitives

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
- [x] Showcase `/phase-2-dashboard` route and page
- [x] CI Playwright Chromium gate for dashboard validation
- [x] `Ui`/`lib-ui` marked deprecated for transition window

See [PRIMITIVES.md](./PRIMITIVES.md) for API reference and design rationale.

Deliverable: Layout-only dashboard using primitives. Completed.

---

# PHASE 3 --- App Shell

## EPIC 3 --- Layout System

Implementation plan: [PHASE3_EPIC3_APP_SHELL_PLAN.md](./PHASE3_EPIC3_APP_SHELL_PLAN.md)

- [x] Story 3.0 — Shell layout tokens
- [x] Story 3.1 — `jp-app-shell` (sidebar + main, desktop collapse)
- [x] Story 3.2 — `jp-app-shell-nav-item` (active, hover, focus)
- [x] Story 3.3 — Mobile drawer + accessibility
- [x] Story 3.4 — Showcase route integration
- [x] Story 3.5 — Composition story + e2e gate

Deliverable: Functional dashboard shell. Completed.

---

# PHASE 4 --- Controls

## EPIC 4 --- Core Inputs

- jp-button (primary, secondary, ghost, destructive)
- jp-icon-button
- jp-input
- jp-textarea
- jp-select
- jp-checkbox
- jp-switch

Deliverable: Complete form styling.

---

# PHASE 5 --- Data Display

## EPIC 5

- jp-table
- jp-badge
- Empty state pattern

Deliverable: Dashboard data page.

---

# PHASE 6 --- Feedback & Overlays

## EPIC 6

- Focus directive
- jp-tooltip
- jp-toast
- jp-dialog
- jp-popover
- jp-dropdown-menu

Deliverable: Full interaction layer.

---

# PHASE 7 --- Assistant System

## EPIC 7

- Assistant panel
- Context trigger API
- Tone refinement pass

Deliverable: Branded assistant integration.

---

# PHASE 8 --- Quality Hardening

## EPIC 8

- Unit tests
- Accessibility audit
- Visual regression setup
- Bundle size audit

Deliverable: Production-grade stability.

---

# PHASE 9 --- Distribution

## EPIC 9

- Library build output
- Semantic versioning automation
- Private npm publish (optional)
- Documentation site

Deliverable: Releasable design system.
