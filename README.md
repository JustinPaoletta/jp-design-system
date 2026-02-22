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
- `docs/JP_ROADMAP.md`: phased implementation plan
- `docs/CI_BRANCH_PROTECTION.md`: required GitHub settings for merge-blocking CI

## Monorepo Architecture

Current workspace:

```text
/apps
  /playground
  /storybook

/libs
  /tokens
  /ui
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

Run local app:

```bash
npx nx serve playground
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

Phase 0, Story 0.4 is complete:

- Nx Angular monorepo initialized
- Angular 21 configured
- Strict TypeScript enabled
- Standalone defaults configured
- `libs/tokens` scaffolded
- `libs/ui` scaffolded
- Storybook app scaffolded (`apps/storybook`)
- UI Storybook configured (`npx nx storybook ui`)
- ESLint warns are treated as failures (`maxWarnings: 0`)
- `@typescript-eslint/no-explicit-any` is enforced as `error`
- Hardcoded colors are blocked by `npm run lint:colors`
- Prettier formatting scripts are available (`format`, `format:check`)
- CI workflow is configured in `.github/workflows/ci.yml` (`Lint`, `Test`, `Build` jobs)
- Branch protection setup is documented in `docs/CI_BRANCH_PROTECTION.md`

Next milestone: Phase 1, Story 1.1 (Primitive Tokens).

## License

Private (for now).
