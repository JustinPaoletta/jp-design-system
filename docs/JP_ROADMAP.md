# JP Design System Roadmap

## Vision

Dark-first, precision-engineered Angular design system with controlled
accent families, strict token discipline, and Stripe/Linear-inspired
density.

---

## Current Progress (as of October 2, 2026)

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
- Product readiness additions, Angular 22.2.1 upgrade, local package distribution, and automated quality gates are implemented.
- Next: manual assistive-technology review, verify the new CI jobs on hosted runners, and decide release automation/publication.

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

Deliverable: Dashboard data page. Completed.

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

Deliverable: Full interaction layer. Completed.

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

Deliverable: Branded assistant integration. Completed.

---

# Milestone 8 --- Quality Hardening

## EPIC 8

- [x] Unit coverage and Angular form regressions
- [x] Automated axe checks on rendered Showcase routes in Chromium and WebKit
- [x] Four macOS Chromium visual baselines across both accents/densities
- [x] Production bundle and component stylesheet budgets
- [x] Dependency/source security review and runtime audit CI gate
- [ ] Manual assistive-technology review and wider bundle analysis
- [ ] Verify hosted Linux/macOS CI results for this upgrade

See [QUALITY.md](QUALITY.md) and [SECURITY_REVIEW.md](SECURITY_REVIEW.md) for scope and limits.

---

# Milestone 9 --- Distribution

## EPIC 9

- [x] Angular Package Format UI output and typed ESM/CSS/JSON token exports
- [x] Isolated tarball consumer installation and strict Angular compilation
- [ ] Semantic versioning automation
- [ ] Private npm publish (optional; no publication performed)
- [ ] Documentation site

See [DISTRIBUTION.md](DISTRIBUTION.md) for the local `0.1.0` package contract.

# Product readiness additions

Implemented: skeleton/progress/inline alert, loading buttons, assistant begin/update/complete/fail/cancel/retry lifecycle, native form attributes, indeterminate checkbox, radio group, searchable combobox, controlled table sorting/selection, toolbar/pagination, manual-activation tabs, breadcrumbs, and native top-layer overlays with viewport positioning. Showcase `/product-recipes` demonstrates successful and failed application actions with simulated transport. Authentication, backend authorization, and real transport remain consumer responsibilities.

# Component catalogue expansion

October 4, 2026: 25 preview components plus field/list-template/accessibility
directives extend the original milestone scope. Showcase `/component-expansion`
demonstrates the new APIs. See [COMPONENT_EXPANSION.md](COMPONENT_EXPANSION.md)
and the [remaining component task list](../COMPONENT_EXPANSION_PLAN.md).

The second batch adds nine preview components and an inline-code directive:
checklist, stepper/wizard recipe, slider/range, number stepper, timeline, overflow,
and code/copy controls. Showcase `/product-tools` demonstrates their composition.
Contracts and limits are in the [component guide](COMPONENT_EXPANSION.md#product-tools-second-batch).
Storybook development output is isolated per server port, with runtime checks
protecting concurrent preview/test servers; see the [regression note](qa/STORYBOOK_RELOAD_REGRESSION.md).
Manual review and maturity promotion remain open.

The remaining everyday catalogue now has working preview implementations. Larger tree, table, calendar, resizing and media features remain in [the task list](../COMPONENT_EXPANSION_PLAN.md). See [workflow APIs](WORKFLOW_COMPONENTS.md); manual accessibility and release promotion are still required.
