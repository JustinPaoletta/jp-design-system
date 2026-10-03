# Local package distribution

The repository builds two local npm packages:

| Package                    | Output                 | Public entry points                                                             |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| `@jp-design-system/ui`     | `dist/packages/ui`     | Angular components, directives, services, and types from `libs/ui/src/index.ts` |
| `@jp-design-system/tokens` | `dist/packages/tokens` | Typed token utilities; `tokens.css`, `tokens.compact.css`, and `tokens.json`    |

UI uses Angular Package Format, ESM bundles, declarations, and partial Angular compilation through `ng-packagr`. Component styles are bundled with the components. Tokens are emitted as native ES modules with declarations and explicit stylesheet exports. Distribution metadata is separate from the existing workspace token metadata. Dedicated `README.package.md` guides are copied into the built packages, so installed consumers receive public import examples instead of workspace-relative documentation links.

The UI peer contract is Angular `^22.2.1` and RxJS `^7.8.0`. Keep Angular packages on the same version in a consuming application. Angular 21 compatibility is not claimed. Use the supported project Node version documented in the repository before installing or building.

## Build and validate

```sh
npm exec nx run packages:build
npm exec nx run packages:smoke
```

The build target regenerates tokens before compiling packages. These commands do not publish anything. The smoke target creates tarballs with `npm pack`, checks that declarations and token CSS are present and stories/tests/source files are excluded, and installs those tarballs in a separate temporary Angular application. There are no workspace path aliases or package symlinks in that application.

The consumer uses exact versions from the installed workspace dependencies. npm tries the local cache first, then the official npm registry when the cache is incomplete. The application builds with strict Angular templates and imports token types and both exported token stylesheets. It compiles template-driven `ngModel` controls and a reactive `FormGroup` using input, checkbox, radio group, and combobox value accessors, plus loading button, progress, selectable/sortable table, and projected tab panel APIs. The check also verifies token CSS reaches the output and token utilities import in native Node ESM. Results are recorded in `dist/packages/consumer-smoke.json`. A failed result is not a validation pass.

The temporary application is removed after success or failure; only artifacts created by the smoke script are removed. To retain the application for diagnosis:

```sh
KEEP_CONSUMER_SMOKE=1 npm exec nx run packages:smoke
```

This is a package installation and compilation check. Interactive browser behavior and accessibility are covered by the component and application checks, not by this consumer build.

## Use in another Angular application

Create local tarballs (the tarball names contain the package version):

```sh
npm pack ./dist/packages/tokens --pack-destination /tmp
npm pack ./dist/packages/ui --pack-destination /tmp
```

Install both resulting `.tgz` files in the consuming application using `npm install /absolute/path/to/package.tgz`. The generated package metadata supports local installation; registry publication requires a separate release decision. Do not install directly from `libs/ui` or `libs/tokens`, which are source directories.

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

## Release boundary

The package version starts at `0.1.0`. UI metadata lives in `libs/ui/package.json`; token distribution metadata lives in `libs/tokens/package.distribution.json`. Change both intentionally for a coordinated release. The scripts perform no registry publication, Git commits, remote pushes, deployment, or automatic version changes. A release should pass unit, accessibility, visual, application build, and isolated consumer checks before any separately authorized publication.
