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

- `DESIGN_PRINCIPLES.md`: non-negotiable design and engineering rules
- `JP_ROADMAP.md`: phased implementation plan
- `QA_STORY_0_1_CHECKLIST.md`: QA pass criteria for Story 0.1

## Monorepo Architecture

Current workspace:

```text
/apps
  /playground

/libs
  (planned: /tokens, /ui)
```

Planned additions:

```text
/apps
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
npx nx run-many -t lint test build -p playground --parallel=3
```

List projects:

```bash
npx nx show projects
```

## Status

Phase 0, Story 0.1 is complete:

- Nx Angular monorepo initialized
- Angular 21 configured
- Strict TypeScript enabled
- Standalone defaults configured

Next milestone: Phase 0, Story 0.2 (`libs/tokens`, `libs/ui`, Storybook app).

## License

Private (for now).
