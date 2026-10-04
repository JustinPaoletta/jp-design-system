# Getting started

Install `@jp-design-system/ui` and `@jp-design-system/tokens` into a separate
Angular application from local tarballs. The repository does not publish these
packages to an npm registry. Package outputs, peers, and the distribution
decision are in [DISTRIBUTION.md](../DISTRIBUTION.md). The installed package
guides are `libs/ui/README.package.md` and `libs/tokens/README.package.md`.

Use Node `24.21.0`, the version in [`.nvmrc`](../../.nvmrc). The UI peer
contract is Angular `^22.2.1` (`@angular/common`, `@angular/core`,
`@angular/forms`) and RxJS `^7.8.0`. Keep every Angular package on the same
version. Angular 21 is outside the contract.

## Verified installation

The isolated consumer is `tools/consumer-smoke.mjs`. From a checkout of the
commit you intend to install, run:

```sh
npx nx run packages:smoke
```

That Nx target depends on `packages:build` (`tools/build-packages.mjs`), which
writes `dist/packages/ui` and `dist/packages/tokens`. The smoke script then
does all of the following:

1. `npm pack --json --pack-destination <temporary-consumer>` with the working
   directory set to `dist/packages/tokens`, then the same command for
   `dist/packages/ui`.
2. Writes a private Angular application whose dependencies are
   `"file:./<filename>"` for each packed tarball. The filename comes from the
   `filename` field of `npm pack --json`. At package version `0.1.0` those
   names are `jp-design-system-tokens-0.1.0.tgz` and
   `jp-design-system-ui-0.1.0.tgz`.
3. Runs `npm install --offline --no-audit --no-fund --registry=https://registry.npmjs.org`
   in that application. If the cache is incomplete, it runs the same install
   without `--offline`. The registry lookup is for Angular, RxJS, and the
   other consumer dependencies. It does not publish JP.
4. Builds the application with its own Angular application builder and
   `strictTemplates`. There are no workspace path aliases or symlinks.

`dist/packages/consumer-smoke.json` records the result. A failed result is not
a pass. To keep the temporary application:

```sh
KEEP_CONSUMER_SMOKE=1 npx nx run packages:smoke
```

Repeat that pack and `file:` install in an application you keep. Do not install
from `libs/ui` or `libs/tokens`. `libs/tokens/package.json` is private
workspace metadata. The distributed token package is the tarball built from
`libs/tokens/package.distribution.json`.

The smoke application pins the workspace's installed versions of
`@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`,
`@angular/platform-browser`, `rxjs`, and `tslib`, plus the Angular build
tooling it needs to compile.

## Token CSS

The smoke application global stylesheet is:

```css
@import '@jp-design-system/tokens/tokens.css';
@import '@jp-design-system/tokens/tokens.compact.css';
```

Point the Angular `styles` option at that file, the way the smoke
`angular.json` points `styles` at `src/styles.css`. Import the styles once.

`tokens.css` already contains `:root` tokens, both accent families, and the
compact overrides. The package guide treats
`@jp-design-system/tokens/tokens.compact.css` as an optional second export.
The smoke consumer imports both, and that is the verified stylesheet pair.
Include `tokens.css` even when the page uses compact density. The compact
file does not replace the default stylesheet.

Token helpers do not inject CSS:

```ts
import { JP_DEFAULT_ACCENT, type JpAccentFamily } from '@jp-design-system/tokens';
```

The smoke check imports `JP_DEFAULT_ACCENT` from `@jp-design-system/tokens` in
native Node ESM and requires the value `"neon"`.

## Standalone imports

Import public symbols from `@jp-design-system/ui`. The smoke application
imports `JpButton`, `JpInput`, `JpCheckbox`, `JpRadioGroup`, `JpCombobox`,
`JpProgress`, `JpTable`, `JpTabs`, and `JpTabPanel`.

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

Deep imports from `libs/`, generated bundle filenames, and internal component
folders are not entry points.

## Accent and density

`JP_DEFAULT_ACCENT` is `'neon'`. Accent families are `'neon'` and `'cobalt'`.
Density modes are `'default'` and `'compact'`.

The smoke root binds the accent attribute:

```html
<main [attr.data-jp-accent]="accent"></main>
```

```ts
import { JP_DEFAULT_ACCENT, type JpAccentFamily } from '@jp-design-system/tokens';

accent: JpAccentFamily = JP_DEFAULT_ACCENT;
```

`:root` already carries the neon accent and the default density. Set
`data-jp-accent="cobalt"` to switch accent. Set `data-jp-density="compact"`
to tighten spacing and control sizes. Custom properties inherit, so the
attributes belong on `<html>` or on a container that wraps the JP UI.
`data-jp-density="default"` does not select a separate block; omit the
attribute for default density.

The Storybook light stage is a preview mat behind the story page. It is not a
light component theme. See [Layout](./LAYOUT.md).

## Forms

Field controls implement `ControlValueAccessor`. The smoke application
compiles template-driven `ngModel` and a reactive `FormGroup` with
`Validators`. Import `FormsModule` and `ReactiveFormsModule` from
`@angular/forms`.

`jp-input`, `jp-radio-group`, and `jp-combobox` take a `label` input.
`jp-checkbox` and `jp-switch` take the visible label as projected content.
The smoke template also puts a static `label` attribute on `jp-checkbox`;
that attribute is not a component input and does not render the caption.
Project the caption:

```html
<jp-input label="Template-driven name" [(ngModel)]="name" />
<jp-checkbox [(ngModel)]="accepted" [indeterminate]="true"> Accept terms </jp-checkbox>

<form [formGroup]="form">
  <jp-input label="Project name" formControlName="project" required autocomplete="organization" />
  <jp-radio-group label="Visibility" formControlName="visibility" [options]="visibilityOptions" required />
  <jp-combobox label="Owner" formControlName="owner" [options]="ownerOptions" [loading]="false" required />
  <jp-checkbox formControlName="notifications">Notifications</jp-checkbox>
  <jp-button type="submit" [loading]="saving" loadingLabel="Saving project" [disabled]="form.invalid"> Save </jp-button>
</form>
```

`JpRadioOption` and `JpComboboxOption` are
`{ value: string; label: string; disabled?: boolean }`. Checkbox and switch
values are booleans. The other fields above are strings.

`required`, `autocomplete`, `name`, and the other native attributes listed in
[Components](./COMPONENTS.md) are component inputs. Bind numeric limits with
the input name, for example `[minLength]`. Validation rules, and when `error`
text appears, belong to the application. Supply `error` after touch or
submit. A non-empty `error` marks the control invalid and replaces `hint` in
`aria-describedby`.

`loading` disables the button, sets `aria-busy`, and uses `loadingLabel` as
the accessible name while the request is in flight. The projected label stays
visible. Keep the form values when the request fails. The
[async form recipe](./RECIPES.md#validated-asynchronous-save) shows the retry
pattern from Showcase `/product-recipes`.

## Next

- [Components](./COMPONENTS.md) for selectors, defaults, and limitations
- [Recipes](./RECIPES.md) for the Showcase product flows
- [Releases](./RELEASES.md) for version and migration notes
