# JP Design System

A dark-first Angular component library for dashboards and software products.
Components use semantic tokens, constrained APIs and explicit accessibility
contracts. The private Nx workspace produces local UI and token packages.

## Current status

Repository version: `0.0.0`. UI and distributed token package versions: `0.1.0`.
No tagged release has been cut. The public class inventory is 36 stable,
76 preview and one deprecated export; [maturity](docs/governance/MATURITY.md)
records the contracts and limits.

The accessibility target is WCAG 2.1 A/AA.
Automated checks cover the documented routes and states.
Manual assistive-technology inspection remains open.

The [remaining task list](COMPONENT_EXPANSION_PLAN.md) contains five inspection,
promotion and release items. Feature implementation and automated acceptance
coverage are recorded in the [documentation index](docs/README.md) and
[verification reference](docs/qa/VERIFICATION.md).
The [maintainer handoff](docs/qa/READINESS.md) records completed readiness work and the remaining inspection and release steps.

## Getting started

Use Node `24.21.0` from `.nvmrc` (`nvm install`, then `nvm use`) and npm 11.
Install workspace dependencies and start either explorer:

```sh
npm ci
npm exec -- nx run ui:storybook
npm exec -- nx run showcase:serve
```

UI Storybook runs at http://localhost:4400. Showcase runs at
http://localhost:4200 and redirects `/` to `/assistant`. Showcase demonstrates
forms, workflows, hierarchy, scheduling, reordering, carousel, charts and
virtual tables with local application state. `apps/storybook` is a placeholder
Angular shell; component stories live under `libs/ui`.

Application consumers install the built tarballs and load token CSS. See
[consumer setup](docs/consumers/GETTING_STARTED.md) and
[distribution](docs/DISTRIBUTION.md).

## Workspace

| Location                               | Purpose                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `libs/tokens`                          | Style Dictionary sources, generated semantic CSS/JSON and typed helpers |
| `libs/ui`                              | Standalone Angular components, directives, services and Storybook       |
| `apps/showcase`                        | Lazy-routed integration screens and product recipes                     |
| `apps/showcase-e2e`                    | Chromium/Firefox/WebKit functional and axe checks; macOS visual checks  |
| `apps/storybook`, `apps/storybook-e2e` | Placeholder Angular app and scaffolded checks                           |
| `tools`                                | Documentation, package, release and token validation tools              |

Workspace versions: Angular 22.2.1, Nx 23.2.1, TypeScript 6.0.3 and Storybook
10.6.1. Jest and Playwright verify behavior. Charts use a browser-loaded
Chart.js dependency. Runtime peer ranges are documented in
[support](docs/localization/SUPPORT.md).

## Development and verification

```sh
npm run format:check
npm run lint
npm run test
npm run typecheck
npm run build
npm exec -- nx run packages:check-release
node tools/docs/check-links.mjs
node tools/docs/check-writing.mjs
node --test tools/docs/check-writing.spec.mjs
```

Use [Quality verification](docs/QUALITY.md) for Storybook, browser and visual
commands. `npm run tokens:build` regenerates token output;
`npm run tokens:check` checks drift. UI/application lint targets enforce zero
warnings; inferred e2e lint targets currently keep existing warnings.
Semantic-token guards reject hardcoded colors and primitive tokens in UI code.

Storybook infrastructure changes must keep
[per-port development output isolation](docs/governance/CONTRIBUTING.md#keep-live-storybook-previews-isolated).
The [reload incident](docs/qa/STORYBOOK_RELOAD_REGRESSION.md) explains the
regression and its automated prevention.

## References

- [Documentation and API guides](docs/README.md)
- [ASD-STE100 writing rules](docs/content/WRITING.md)
- [Design principles](docs/DESIGN_PRINCIPLES.md)
- [Consumer guide](docs/consumers/README.md)
- [Accessibility/browser support](docs/qa/SUPPORT_MATRIX.md)
- [Contribution and acceptance policy](docs/governance/README.md)
- [Dependency security inspection](docs/SECURITY_REVIEW.md)
- [CI and branch protection](docs/CI_BRANCH_PROTECTION.md)
- [Changelog](CHANGELOG.md) and [release process](RELEASE.md)
