# Support

Recorded October 4, 2026, from this repository. Message wiring is described in [CONTRACT.md](./CONTRACT.md).

## Supported

|           |                                                                                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Angular   | 22.2.x. The workspace depends on 22.2.1. `@jp-design-system/ui` peers on `^22.2.1`.                                                                                                                                                                    |
| RxJS      | 7.8. The workspace depends on `~7.8.0`. The UI package peers on `^7.8.0`.                                                                                                                                                                              |
| Node      | 24.21.0, from `.nvmrc`.                                                                                                                                                                                                                                |
| Browsers  | Evergreen Chromium and WebKit, the pair installed and run in `.github/workflows/ci.yml` (`npx playwright install` for `chromium` and `webkit`, then `showcase-e2e` with `--project=chromium` and `--project=webkit`). Firefox is not part of that job. |
| Direction | `dir` / `lang` on an ancestor. Logical properties follow that direction. Off-canvas motion uses `:dir(rtl)` because CSS has no logical `translateX`.                                                                                                   |

## Native dialog and popover

`jp-dialog` opens a native `<dialog>` with `showModal()` inside `afterRenderEffect`. If `showModal` throws, the panel sets the `open` attribute and continues. Escape and scrim dismissal go through the overlay stack; the native `cancel` event is prevented so the stack, not the user agent, decides which layer closes.

Menus, popovers, tooltips, and the combobox popup call `positionOverlay` in `libs/ui/src/lib/primitives/shared/overlay-manager.ts`. That helper sets `popover="manual"` and calls `showPopover()` so the panel uses the top layer. If `showPopover` is missing or throws, it removes the `popover` attribute and keeps a `position: fixed` panel measured from the anchor. Both paths are in the support contract for the Chromium and WebKit versions CI runs.

## SSR and hydration

Server rendering and hydration are **outside** the current contract. This pass does not add them.

The reason is the overlay and shell code, not a general policy:

- `positionOverlay` returns immediately when there is no `window`. When it runs, it reads `getBoundingClientRect`, `visualViewport`, and `ResizeObserver`, then writes pixel `left` and `top`. Tooltip, combobox, and dialog start that work from `afterRenderEffect` / `afterNextRender`. A server document has no layout to measure, and the coordinates are applied after the first render, so server HTML would not match the hydrated client.
- Dialog title ids use `Math.random()`. Combobox, tabs, tooltip, and assistant ids use module-level counters. Those values are not stable across a server render and a later client render.
- The app shell and assistant panel read `matchMedia` and `document.activeElement`. They skip `matchMedia` when `window` is missing, which avoids a crash. That guard is not a hydration implementation: drawer state, focus restore, and overlay coordinates still run only in the browser.

## Directional layout

Converted to logical properties where the inline edge should follow writing direction:

- App shell: sidebar `border-inline-end`, mobile drawer `inset-inline-start`, active nav indicator `inset-inline-start`. The collapse chevron stays a physical border glyph and is mirrored with `scale: -1 1` under `:dir(rtl)`. The closed drawer uses `translateX`; `:dir(rtl)` flips the sign. Grid column 1 is already the start column, so the rail moves to the right in RTL without a separate rule.
- Dropdown menu and popover: panel origin is `inset-inline-start` / `inset-block-start`. Menu item text is `text-align: start`. After `positionOverlay` runs, placement is viewport pixels (`style.left` / `style.top` from `getBoundingClientRect`), not a logical inset. Tooltip `left` and `right` stay physical because they implement the `placement` input (`left` | `right`), including the centered `left: 50%` rules.
- Toast outlet: `inset-inline-end` and `inset-block-end`.
- Assistant panel: docks with `inset-inline-end` and `border-inline-start`. Closed `translateX(100%)` flips under `:dir(rtl)`. User and assistant bubbles already use `align-self: flex-end` / `flex-start` on a column, so the cross axis follows direction.
- Table toolbar already used `margin-inline-start: auto`. Pagination had no physical inline edges; summaries use `overflow-wrap: anywhere` so a long translation can wrap. Tabs had no physical inline edges. Tab arrow keys already compare `ArrowRight` with `getComputedStyle(element).direction`.

Sort arrows are vertical and are not mirrored. Radio groups still treat ArrowRight as the next option in DOM order; that interaction was not part of this pass.

## Bundle

`npx nx run packages:build` on October 4, 2026 wrote `dist/packages/ui/fesm2022/jp-design-system-ui.mjs` at 404,576 bytes (46,065 bytes gzipped). That file is the whole `@jp-design-system/ui` entry, including component styles inlined by ng-packagr. It is not a localization-only delta and not a tree-shaken application bundle.

`libs/ui/package.json` sets `"sideEffects": false`. Standalone components are separate classes, so a production application bundler is expected to drop unused components imported from the package entry. This pass did not build a sample application that imports one component, so there is no measured shaken size.

## Limitations

- No `@angular/localize`, ICU message format, or locale data loading. Plural and number formatting are the override function's job.
- JP does not format dates or times.
- Tooltip text, empty-state titles on `jp-empty-state`, and inline-alert copy are caller content. They are not keys on `JP_MESSAGES`.
- A set component input overrides the token for that instance. Pagination control labels and the other template sentences have no per-instance input; scope them with `provideJpMessages` on a parent injector.
- `provideJpMessages` replaces the token in that injector. It merges onto the parent value. It does not watch for later locale changes. Provide a new value if the locale changes at runtime.
- Overlay coordinates are physical viewport pixels. RTL does not re-anchor a measured menu to the inline-start edge after `positionOverlay` runs.
- SSR and hydration are outside the contract, as described above.
- No bundle-budget CI job is added here. Workflows are owned by another workstream.
