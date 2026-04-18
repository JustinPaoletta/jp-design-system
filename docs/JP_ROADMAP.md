# JP Design System Roadmap

## Vision

Dark-first, precision-engineered Angular design system with controlled
accent families, strict token discipline, and Stripe/Linear-inspired
density.

---

## Current Progress (as of March 3, 2026)

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
- Story 2.1 (Layout primitives in `libs/ui`) is complete and validated.
- Story 2.2 (Playground `/phase-2-dashboard`) is complete and validated.
- Story 2.3 (Storybook primitive + composition coverage) is complete and validated.
- Story 2.4 (Chromium e2e gate for Playground dashboard) is complete and validated.
- Story 2.5 (`Ui`/`lib-ui` deprecation window) is complete and validated.
- Next milestone: Phase 3, Epic 3 (App Shell).

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
- [x] Storybook app

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

## EPIC 2 --- Layout Primitives

- [x] jp-box
- [x] jp-stack
- [x] jp-inline
- [x] jp-grid
- [x] jp-surface
- [x] jp-text
- [x] jp-heading
- [x] Storybook primitives + composition story coverage
- [x] Playground `/phase-2-dashboard` route and page
- [x] CI Playwright Chromium gate for dashboard validation
- [x] `Ui`/`lib-ui` marked deprecated for transition window

Deliverable: Layout-only dashboard using primitives. Completed.

---

# PHASE 3 --- App Shell

## EPIC 3 --- Layout System

- jp-app-shell
- Sidebar collapse
- Nav item states
- Mobile drawer behavior

Deliverable: Functional dashboard shell.

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
