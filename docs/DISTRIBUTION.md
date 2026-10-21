# Local package distribution

The repository builds two local npm packages and distributes them as tarballs. Private npm publication is not configured.

| Package                    | Output                 | Public entry points                                                                       |
| -------------------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| `@jp-design-system/ui`     | `dist/packages/ui`     | Angular components, directives, services, and types from `libs/ui/src/index.ts`           |
| `@jp-design-system/tokens` | `dist/packages/tokens` | Typed token utilities; `fonts.css`, `tokens.css`, `tokens.compact.css`, and `tokens.json` |

The package scope is `@jp-design-system`, which is the scope already used by those package names. There is no registry, no `publishConfig`, and no publish credential. Consumers install the `.tgz` files produced from the workspace build. They do not install from npm.

UI uses Angular Package Format, ESM bundles, declarations, and partial Angular compilation through `ng-packagr`. Component styles are bundled with the components. Tokens are emitted as native ES modules with declarations and explicit stylesheet exports. Distribution metadata is separate from the existing workspace token metadata. Dedicated `README.package.md` guides are copied into the built packages, so installed consumers receive public import examples instead of workspace-relative documentation links.

The UI peer contract is Angular `^22.2.1` and RxJS `^7.8.0`. Keep Angular packages on the same version in an application. Angular 21 compatibility is not claimed. Use the supported project Node version documented in the repository before installing or building. Chart.js 4.5.1 is an MIT-licensed UI dependency, dynamically imported by `JpChart` after browser render; other UI imports do not eagerly register it.

## Build and validate

```sh
npm exec -- nx run packages:build
npm exec -- playwright install chromium
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
It imports token types, the font stylesheet and both token stylesheets.
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
It also opens date, date-range and time panels through the installed packages.
Keyboard selection, cancellation and focus restoration are checked.
Open and closed states run the WCAG 2.1 A/AA axe selection.

The default local browser is Chromium.
Install its Playwright binary before the smoke check.
On Linux, add `--with-deps` to the browser installation command.
CI and the release dry-run use Chromium, Firefox and WebKit across all three accents and both densities.

```sh
npm exec -- playwright install chromium firefox webkit
CONSUMER_BROWSERS=chromium,firefox,webkit npm exec -- nx run packages:smoke
```

Read [Readiness](qa/READINESS.md#package-consumer) for the fixture, reports and remaining product inspection.

## Candidate archives

Run `npm exec -- nx run packages:pack` to build and pack both packages.
The output is `dist/packages/archives/<version>/`.
It contains two `.tgz` files and `manifest.json`.
The manifest records names, paired versions, byte counts, SHA-256 hashes and npm integrity hashes.
Packing disables package lifecycle scripts and verifies archive integrity.
It does not publish packages.

The CI Build job uploads these files as `package-archives`.
The release dry-run uploads them with evidence as `release-candidate-evidence`.
Use the artifact from the exact commit you intend to inspect.
The workflow input does not replace the checked-out package versions.

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
@import '@jp-design-system/tokens/fonts.css';
@import '@jp-design-system/tokens/tokens.css';
@import '@jp-design-system/tokens/tokens.compact.css';
```

`fonts.css` loads the included Inter font from local files.
The package includes the font license in `fonts/LICENSE.txt`.
The font comes from the [official Inter repository](https://github.com/rsms/inter/tree/353b61b9f4430d5f420d56605a6e7993e0941470).
Omit the font import if your application supplies its own font.
Set `--jp-font-family-base` to the application font.

Import standalone components from the public UI entry point:

```ts
import { JpButton, JpInput } from '@jp-design-system/ui';
import { JP_DEFAULT_ACCENT, type JpAccentFamily } from '@jp-design-system/tokens';
```

Apply `data-jp-accent="cobalt"` or `data-jp-density="compact"` on the relevant application container to change token modes. The default bundle already contains compact overrides; the separate compact stylesheet is optional. Include default tokens even when compact density is used. Avoid imports from `libs/`, generated bundle filenames, or internal component folders; those paths are not part of the distribution API.

## Versions

UI and tokens release together with the same version.
Builds use the versions in `libs/ui/package.json` and `libs/tokens/package.distribution.json`.
Building a local tarball does not create a tagged release.
The [release procedure](../RELEASE.md#version-relationship) defines version preparation, approval, tagging and GitHub Release creation.

## Failed-release recovery

Install the previous UI and token tarballs together to restore the previous version.
Follow the [release recovery procedure](../RELEASE.md#failed-release-recovery) for tags, changelog notes and GitHub Releases.
Registry publication and unpublication are not configured.
