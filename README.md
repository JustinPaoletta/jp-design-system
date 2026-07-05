# JP Design System

Dark-first. Precision-engineered. Token-driven.

The JP Design System is a structured Angular component library for professional dashboards and software products. It prioritizes clarity, accessibility, and long-term maintainability over visual trend cycles.

## Status

- Type: private component-library monorepo
- Current version: `0.0.0`
- **Current milestone:** Phase 2 Epic 2 complete — layout + typography primitives, Storybook coverage, and Showcase `/phase-2-dashboard`
- **Next:** Phase 3 App Shell — see [PHASE3_EPIC3_APP_SHELL_PLAN.md](./docs/PHASE3_EPIC3_APP_SHELL_PLAN.md)
- Release model: manual changelog + release branch flow in [RELEASE.md](./RELEASE.md)

## Quick Links

- Changelog: [CHANGELOG.md](./CHANGELOG.md)
- Release process: [RELEASE.md](./RELEASE.md)
- Roadmap: [docs/JP_ROADMAP.md](./docs/JP_ROADMAP.md)
- Design principles: [docs/DESIGN_PRINCIPLES.md](./docs/DESIGN_PRINCIPLES.md)
- Primitive API: [docs/PRIMITIVES.md](./docs/PRIMITIVES.md)
- CI and branch protection: [docs/CI_BRANCH_PROTECTION.md](./docs/CI_BRANCH_PROTECTION.md)

## Core Philosophy

- Precision over decoration
- Signal, not noise
- Consistency over customization
- Accessibility by default
- Controlled brand evolution
- Engineering-grade discipline

This system is opinionated by design. Customization that weakens consistency is intentionally restricted.

## Monorepo Architecture

```text
/apps
  /showcase            # read-only integration app (e.g. /phase-2-dashboard)
  /showcase-e2e        # Playwright e2e for showcase
  /storybook           # placeholder Angular shell (not the component Storybook)
  /storybook-e2e       # Playwright scaffold for the storybook app

/libs
  /tokens              # design tokens (Style Dictionary)
  /ui                  # Angular primitives + Storybook target (port 4400)
```

**Showcase vs Storybook:** `npx nx run ui:storybook` is the interactive primitive explorer (controls, accent/density toolbar). Showcase is a read-only Angular host app that proves compositions render correctly outside Storybook. The `apps/storybook` project is a minimal Angular shell only — it does not host component stories.

## Tech Stack

- Angular 21
- Nx 22
- TypeScript
- Storybook 10
- Jest and Playwright
- Style Dictionary

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

Run Showcase (read-only composition host):

```bash
npx nx run showcase:serve
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

## Common Commands

- `npm run tokens:build` regenerates token outputs
- `npm run tokens:check` validates the token pipeline

## Testing & Quality Gates

Local baseline: `npm run format:check`, `npm run lint`, `npm run test`, and `npm run build`.

Quality gates:

- ESLint warnings treated as failures (`maxWarnings: 0`)
- `@typescript-eslint/no-explicit-any` enforced
- Hardcoded colors blocked (`npm run lint:colors`)
- Primitive token usage blocked in components (`npm run lint:primitives`)
- Token artifact drift blocked (`npm run tokens:check`)
- CI: lint, test (unit + Storybook interaction + Showcase e2e), build (`.github/workflows/ci.yml`)

Component or token releases should include manual Storybook and Showcase review for affected surfaces.

## Release Process

- Keep `CHANGELOG.md` updated under `## [Unreleased]`
- Cut release branches as `release/vX.Y.Z` from the protected default branch
- Until package publishing is introduced, treat releases as repository-level releases rather than per-library npm releases
- Follow the full checklist in [RELEASE.md](./RELEASE.md)

## Completed Milestones

- Phase 0: Nx monorepo, strict TypeScript, ESLint, Prettier, CI
- Phase 1: Token system (primitives, semantic aliases, density, accent, CSS output)
- Phase 2: `jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-text`, `jp-heading`, layout dashboard composition, Playwright e2e gate

## License

MIT.
