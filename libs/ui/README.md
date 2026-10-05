# JP UI library

Standalone Angular components, directives and services using semantic JP
styles and typed inputs. The public entry is `src/index.ts`; consumers import
from `@jp-design-system/ui` after installing a built tarball.

[Core API](../../docs/PRIMITIVES.md) documents layout, typography, controls,
tables, navigation, overlays, feedback and the assistant lifecycle. The
[component catalog](../../docs/consumers/COMPONENTS.md) links additional form,
workflow, hierarchy, scheduling, interaction and data-performance APIs.
[Maturity](../../docs/governance/MATURITY.md) records support levels; new
expansion APIs remain preview.

## Development

```sh
npm exec -- nx run ui:storybook
npm exec -- nx run showcase:serve
npm exec -- nx run ui:test
npm exec -- nx run ui:test-storybook
npm exec -- nx run ui:test-storybook-dev
```

Component Storybook runs at http://localhost:4400. Stories live in this
library, rather than `apps/storybook`. The independent Dark/Light stage mat
does not change the dark component theme. Showcase runs at
http://localhost:4200 and redirects `/` to `/assistant`.

Static and live Storybook test targets use port 4500; run them sequentially.
Development output is isolated per port to prevent shared runtime/HMR reloads.
Preserve [the contributor guard](../../docs/governance/CONTRIBUTING.md#keep-live-storybook-previews-isolated)
when changing that infrastructure.

## Distribution and verification

```sh
npm exec -- nx run packages:build
npm exec -- nx run packages:smoke
```

Install generated APF tarballs and load the token stylesheet; do not install
this source directory. Angular peers, the Chart.js dependency, stylesheet
exports and isolated consumer validation are in
[Distribution](../../docs/DISTRIBUTION.md).
[Quality](../../docs/QUALITY.md) provides browser/visual commands and
[manual QA](../../MANUAL_QA.md) records the outstanding human checks.
