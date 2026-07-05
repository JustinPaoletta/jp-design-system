# JP Design System

Dark-first. Precision-engineered. Token-driven.

The JP Design System is a structured Angular component library for professional dashboards and software products. It prioritizes clarity, accessibility, and long-term maintainability over visual trend cycles.

## Core Philosophy

- Precision over decoration
- Signal, not noise
- Consistency over customization
- Accessibility by default
- Controlled brand evolution
- Engineering-grade discipline

This system is opinionated by design. Customization that weakens consistency is intentionally restricted.

## Repository Docs

- `docs/DESIGN_PRINCIPLES.md`: non-negotiable design and engineering rules
- `docs/PRIMITIVES.md`: Phase 2 primitive API and typography design decisions
- `docs/JP_ROADMAP.md`: phased implementation plan
- `docs/PHASE2_EPIC2_MANUAL_TEST_PLAN.md`: manual QA checklist for Epic 2
- `docs/CI_BRANCH_PROTECTION.md`: required GitHub settings for merge-blocking CI

## Monorepo Architecture

Current workspace:

```text
/apps
  /playground          # demo app (e.g. /phase-2-dashboard)
  /playground-e2e      # Playwright e2e for playground

/libs
  /tokens              # design tokens (Style Dictionary)
  /ui                  # Angular primitives + Storybook (port 4400)
```

## Token and UI Principles

### Tokens (`libs/tokens`)

- Primitive tokens (palette, type, spacing, radius, motion)
- Semantic aliases
- Accent families (`data-jp-accent`)
- Density modes (`data-jp-density`)
- Dark-first theme

No component may use hardcoded visual values.

### UI Library (`libs/ui`)

Standalone Angular components with:

- Strict typing
- Token-based styling
- WCAG AA minimum accessibility
- Constrained API surface

## Development Standards

- Strict TypeScript
- No `any`
- No hardcoded colors in components
- Token usage for spacing, color, radius, motion
- CI-enforced lint + test + build

## Quick Start

Install dependencies:

```bash
npm ci
```

Run Playground:

```bash
npx nx run playground:serve
```

Run UI Storybook (component primitives):

```bash
npx nx run ui:storybook
```

Run baseline quality checks:

```bash
npm run format:check
npm run lint
npm run test
npm run build
```

List projects:

```bash
npx nx show projects
```

## Status

**Current milestone:** Phase 2 Epic 2 complete — layout + typography primitives,
Storybook coverage, and Playground `/phase-2-dashboard`. Manual QA in progress.
**Next:** Phase 3 App Shell (`jp-app-shell`, sidebar, mobile drawer).

Completed to date:

- Phase 0: Nx monorepo, strict TypeScript, ESLint, Prettier, CI
- Phase 1: Token system (primitives, semantic aliases, density, accent, CSS output)
- Phase 2: `jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-text`,
  `jp-heading`, layout dashboard composition, Playwright e2e gate

Quality gates:

- ESLint warnings treated as failures (`maxWarnings: 0`)
- `@typescript-eslint/no-explicit-any` enforced
- Hardcoded colors blocked (`npm run lint:colors`)
- Primitive token usage blocked in components (`npm run lint:primitives`)
- CI: lint, test, build (`.github/workflows/ci.yml`)

## License

Private (for now).
