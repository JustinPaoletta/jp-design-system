# JP Design System

A token-driven Angular design-system monorepo for internal dashboards and product UIs, focused on precision, accessibility, and long-term consistency.

## Status

- Type: private component-library monorepo
- Current version: `0.0.0`
- Maturity: pre-1.0 foundations with Phase 0 complete
- Release model: manual changelog + release branch flow documented in [RELEASE.md](./RELEASE.md)

## Quick Links

- Changelog: [CHANGELOG.md](./CHANGELOG.md)
- Release process: [RELEASE.md](./RELEASE.md)
- Roadmap: [docs/JP_ROADMAP.md](./docs/JP_ROADMAP.md)
- Design principles: [docs/DESIGN_PRINCIPLES.md](./docs/DESIGN_PRINCIPLES.md)
- CI and branch protection: [docs/CI_BRANCH_PROTECTION.md](./docs/CI_BRANCH_PROTECTION.md)

## What The Project Does

- Provides primitive and semantic design tokens through `libs/tokens`.
- Provides standalone Angular UI components through `libs/ui`.
- Uses opinionated rules to prevent hardcoded colors, primitive-token misuse, and inconsistent UI patterns.
- Includes a playground app and Storybook surfaces for development and review.

## Tech Stack

- Angular 21
- Nx 22
- TypeScript
- Storybook 10
- Jest and Playwright
- Style Dictionary

## Repository Layout

- `apps/playground` local consumer app for component development
- `apps/storybook` Storybook host app
- `libs/tokens` design-token source and build pipeline
- `libs/ui` reusable Angular components
- `tools/` custom lint and token-check scripts
- `docs/` design principles, roadmap, CI, and release/process docs

## Prerequisites

- Node.js 20 or newer
- npm

## Local Setup

1. Install dependencies with `npm ci`.
2. Inspect the workspace with `npx nx show projects`.
3. Start the playground with `npx nx serve playground`.
4. Start Storybook with `npx nx storybook ui`.

## Common Commands

- `npm run format:check` verifies Prettier formatting.
- `npm run lint` runs Nx lint plus custom token and color guards.
- `npm run test` runs the configured test targets.
- `npm run build` builds the workspace targets.
- `npm run tokens:build` regenerates token outputs.
- `npm run tokens:check` validates the token pipeline.

## Environment & Configuration

- This repo does not currently depend on an application-style environment variable matrix.
- The main configuration surface is the token system, Nx workspace config, and the custom lint rules under `tools/`.

## Testing & Quality Gates

- Local baseline: `npm run format:check`, `npm run lint`, `npm run test`, and `npm run build`.
- Component or token releases should include manual Storybook and playground review for the affected surfaces.

## Release Process

- Keep `CHANGELOG.md` updated under `## [Unreleased]`.
- Cut release branches as `release/vX.Y.Z` from the protected default branch.
- Until package publishing is introduced, treat releases as repository-level releases rather than per-library npm releases.
- Follow the full checklist in [RELEASE.md](./RELEASE.md).

## Additional Docs

- [docs/DESIGN_PRINCIPLES.md](./docs/DESIGN_PRINCIPLES.md)
- [docs/JP_ROADMAP.md](./docs/JP_ROADMAP.md)
- [docs/CI_BRANCH_PROTECTION.md](./docs/CI_BRANCH_PROTECTION.md)

## License

MIT.
