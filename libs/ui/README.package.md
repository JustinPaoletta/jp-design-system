# @jp-design-system/ui

Standalone Angular components, directives, and services for the JP Design System. This is the built Angular Package Format package, with ESM bundles, declarations, and partial Angular compilation.

Requires Angular `^22.2.1` (common, core, forms) and RxJS `^7.8.0`. Keep Angular packages on the same version. Install this package and `@jp-design-system/tokens` using their built local `.tgz` files; registry publication is not configured by the repository build.

Import global token styles once:

```css
@import '@jp-design-system/tokens/tokens.css';
```

Import standalone primitives in your Angular component:

```ts
import { Component } from '@angular/core';
import { JpButton } from '@jp-design-system/ui';

@Component({
  selector: 'app-save',
  imports: [JpButton],
  template: '<jp-button type="submit">Save</jp-button>',
})
export class SaveComponent {}
```

The public entry point includes layout/typography, shell, native/form controls, radio group/combobox, badges/table/toolbar/pagination, tabs/breadcrumbs, feedback/native overlays, and assistant primitives. Field controls implement ControlValueAccessor for reactive forms and `ngModel`. Consumers own validation, table data operations, transport, authentication, and authorization. Import public names from `@jp-design-system/ui`; internal source folders and bundle filenames are not supported entry points.

Accent and density use `data-jp-accent="cobalt"` and `data-jp-density="compact"` on an application root. The default token bundle already contains compact overrides. Light Storybook stage previews do not provide a light component theme.

The [source repository](https://github.com/JustinPaoletta/jp-design-system) contains the current API reference (`docs/PRIMITIVES.md`), working recipes (`docs/PRODUCT_RECIPES.md`), distribution instructions (`docs/DISTRIBUTION.md`), and quality/security review. Workspace build/test commands belong in a repository checkout; this installed package is not an Nx workspace.
