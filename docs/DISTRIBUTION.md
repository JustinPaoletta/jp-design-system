# Local package distribution

The repository builds two local npm packages and distributes them as tarballs. Private npm publication is not configured.

| Package                    | Output                 | Public entry points                                                             |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| `@jp-design-system/ui`     | `dist/packages/ui`     | Angular components, directives, services, and types from `libs/ui/src/index.ts` |
| `@jp-design-system/tokens` | `dist/packages/tokens` | Typed token utilities; `tokens.css`, `tokens.compact.css`, and `tokens.json`    |

The package scope is `@jp-design-system`, which is the scope already used by those package names. There is no registry, no `publishConfig`, and no publish credential. Consumers install the `.tgz` files produced from the workspace build. They do not install from npm.

UI uses Angular Package Format, ESM bundles, declarations, and partial Angular compilation through `ng-packagr`. Component styles are bundled with the components. Tokens are emitted as native ES modules with declarations and explicit stylesheet exports. Distribution metadata is separate from the existing workspace token metadata. Dedicated `README.package.md` guides are copied into the built packages, so installed consumers receive public import examples instead of workspace-relative documentation links.

The UI peer contract is Angular `^22.2.1` and RxJS `^7.8.0`. Keep Angular packages on the same version in an application. Angular 21 compatibility is not claimed. Use the supported project Node version documented in the repository before installing or building. Chart.js 4.5.1 is an MIT-licensed UI dependency, dynamically imported by `JpChart` after browser render; other UI imports do not eagerly register it.

## Build and validate

```sh
npm exec -- nx run packages:build
npm exec -- nx run packages:smoke
```

`packages:build` runs `tools/build-packages.mjs`.
It regenerates tokens and writes `dist/packages/tokens` and `dist/packages/ui`.
It does not publish packages.

`packages:smoke` runs `tools/consumer-smoke.mjs`.
The script creates tarballs with `npm pack`.
It makes sure declarations and token CSS exist.
It also makes sure stories, tests and source files are excluded.
Then it installs the tarballs in a separate temporary Angular application.
That application has no workspace aliases or package symlinks.

The application uses exact dependency versions from the installed workspace.
Installation tries the npm cache first, then the official registry if necessary.
Registry access installs application dependencies; it does not publish JP.

The application compiles with strict Angular templates.
It reuses the installed workspace build tools, whose versions appear in the report.
Runtime packages come from the temporary application installation.
It imports token types and both exported stylesheets.
It compiles `ngModel`, reactive forms with `FormGroup`, controls, tables and projected tabs.
It also compiles expansion, workflow, hierarchy, scheduling, interaction and data-performance APIs.

The check makes sure token CSS reaches build output.
It imports token helpers through native Node ESM.
`dist/packages/consumer-smoke.json` records the result.
A failed result is not a pass.

The temporary application is removed after success or failure; only artifacts created by the smoke script are removed. To keep the application for diagnosis:

```sh
KEEP_CONSUMER_SMOKE=1 npm exec -- nx run packages:smoke
```

The built consumer also runs in a browser.
It exercises invalid forms, save failure/retry, pending controls, table sorting/selection and confirmation dialogs.
Open and closed states run the WCAG 2.1 A/AA axe selection.
The default local browser is Chromium.
CI and the release dry-run use Chromium, Firefox and WebKit across both accents and densities.

```sh
CONSUMER_BROWSERS=chromium,firefox,webkit npm exec -- nx run packages:smoke
```

Read [Readiness](qa/READINESS.md#package-consumer) for the fixture, reports and remaining product inspection.

## Use in another Angular application

Tarball installation is the distribution channel. From a checkout of the commit you intend to install, build the packages and pack them (the tarball names contain the package version):

```sh
npm exec -- nx run packages:build
npm pack ./dist/packages/tokens --pack-destination /tmp
npm pack ./dist/packages/ui --pack-destination /tmp
```

Install both resulting `.tgz` files in the application:

```sh
npm install /absolute/path/to/jp-design-system-tokens-X.Y.Z.tgz /absolute/path/to/jp-design-system-ui-X.Y.Z.tgz
```

Do not install directly from `libs/ui` or `libs/tokens`. Those directories are source, and `libs/tokens/package.json` is private workspace metadata rather than the distributed package.

Import the token styles once from application global styles:

```css
@import '@jp-design-system/tokens/tokens.css';
@import '@jp-design-system/tokens/tokens.compact.css';
```

Import standalone components from the public UI entry point:

```ts
import { JpButton, JpInput } from '@jp-design-system/ui';
import { JP_DEFAULT_ACCENT, type JpAccentFamily } from '@jp-design-system/tokens';
```

Apply `data-jp-accent="cobalt"` or `data-jp-density="compact"` on the relevant application container to change token modes. The default bundle already contains compact overrides; the separate compact stylesheet is optional. Include default tokens even when compact density is used. Avoid imports from `libs/`, generated bundle filenames, or internal component folders; those paths are not part of the distribution API.

## Versions

UI and tokens release together. `libs/ui/package.json` and `libs/tokens/package.distribution.json` stay on the same version. The root `package.json` version is the repository version and may differ during `0.0.0` development. A release pull request sets the root package version, the root lockfile version, and both distribution package versions to the same `X.Y.Z`.

`tools/release/prepare.mjs` plans that bump and moves `## [Unreleased]` in `CHANGELOG.md`. Dry-run does not write. The release workflow in `.github/workflows/release.yml` only dry-runs that script, then builds packages and runs consumer smoke. It does not tag, publish, or upload a GitHub Release. The process is documented in [RELEASE.md](../RELEASE.md).

The first tagged release is not cut. Building tarballs from the current branch produces local packages at the versions already committed in the package metadata. It is not a tagged release.

## Failed-release recovery

Do not delete a tag that has been pushed. Mark a bad GitHub Release replaced in `CHANGELOG.md` and on the GitHub Release, and point consumers at the previous tag.

Rollback is reinstalling the previous UI and tokens tarballs with `npm install` of those `.tgz` files. There is no registry unpublish flow, because these packages are not published to a registry.
