# Consumer documentation

Recorded October 4, 2026. Owner: **JP maintainers**.

## Audience

The primary audience is Angular application developers who install the built
`@jp-design-system/ui` and `@jp-design-system/tokens` packages.

The secondary audience is contributors changing those packages. Contribution,
maturity, and compatibility rules live under
[governance](../governance/README.md).

## Navigation

This tree is the consumer guide. Live examples are Storybook
(`npm exec -- nx run ui:storybook`, http://localhost:4400). Working application
compositions are the Showcase app (`npm exec -- nx run showcase:serve`,
http://localhost:4200).

| Guide                                   | Use it to                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [Getting started](./GETTING_STARTED.md) | Install the tarballs, load token CSS, import standalone components, set accent and density, and bind forms |
| [Components](./COMPONENTS.md)           | Look up every public component, directive, and service                                                     |
| [Selection](./SELECTION.md)             | Select between related components                                                                          |
| [Accessibility](./ACCESSIBILITY.md)     | See what JP implements and what the application owns                                                       |
| [Layout](./LAYOUT.md)                   | Plan responsive shell, table overflow, theme, and density                                                  |
| [Recipes](./RECIPES.md)                 | Copy product flows for forms, tables, deletion, and assistant transport                                    |
| [Composition](./COMPOSITION.md)         | Assemble headers, validation, empty states, and dashboards                                                 |
| [Releases](./RELEASES.md)               | Find the changelog, release process, maturity, and migration notes                                         |

Related references:

- [Design principles](../DESIGN_PRINCIPLES.md)
- [Primitive API reference](../PRIMITIVES.md)
- [Product recipes](../PRODUCT_RECIPES.md)
- [Distribution](../DISTRIBUTION.md)
- [Maturity](../governance/MATURITY.md)
- [Compatibility and migration](../governance/COMPATIBILITY.md)
- [Acceptance checklist](../governance/ACCEPTANCE.md)
- [Localization contract](../localization/CONTRACT.md)

## Hosting

These pages are GitHub-rendered Markdown in the repository. A pull request runs
[`.github/workflows/docs.yml`](../../.github/workflows/docs.yml), which checks
out the branch, installs dependencies with `npm ci`, and runs
`node tools/docs/check-links.mjs` and `node tools/docs/check-writing.mjs`.
The rendered pull request is the preview.

This guide does not add a documentation framework or an Angular docs
application.
