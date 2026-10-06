# @jp-design-system/ui

Standalone Angular components, directives, and services for the JP Design System. This is the built Angular Package Format package, with ESM bundles, declarations, and partial Angular compilation.

Requires Angular `^22.2.1` (common, core, forms) and RxJS `^7.8.0`. Chart.js 4.5.1 is included as a UI dependency and loaded by the chart after browser render. Keep Angular packages on the same version. Install this package and `@jp-design-system/tokens` using their built local `.tgz` files; registry publication is not configured by the repository build.

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

The public entry includes layout, typography, controls, tables, navigation,
feedback, overlays and assistant APIs.
Preview APIs add forms, identity, workflows, hierarchy, scheduling and data views.
They also include split panes, media, advanced tables, reordering and carousel.
Virtual tables offer a complete paginated alternative.

Field controls use ControlValueAccessor for reactive forms and `ngModel`.
The application owns validation, data operations, requests, authentication and permissions.
Import public names from `@jp-design-system/ui`.
Internal folders and bundle filenames are not supported entry points.

Accent and density use `data-jp-accent="cobalt"` and `data-jp-density="compact"` on an application root. The default token bundle already contains compact overrides. Light Storybook stage previews do not give a light component theme.

The [source repository](https://github.com/JustinPaoletta/jp-design-system)
contains `docs/README.md`, the documentation index.
It links API guides, support levels, recipes, package instructions and test evidence.
Workspace commands run in a repository checkout.
This installed package is not an Nx workspace.
