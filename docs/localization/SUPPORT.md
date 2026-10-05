# Runtime and browser support

Verified against repository configuration on October 4, 2026. Built-in copy
and translation providers are documented in [Message contract](CONTRACT.md).

## Versions and platforms

| Area               | Contract and tested version                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular            | UI peers on `^22.2.1`; workspace and isolated consumer smoke use 22.2.1. The peer range permits later 22.x versions, which are not all independently tested.     |
| RxJS               | UI peers on `^7.8.0`; workspace dependency is `~7.8.0`.                                                                                                          |
| Node/npm           | Development uses Node 24.21.0 from `.nvmrc` and npm 11. Root engines allow Node `^24.15.0` and npm `>=11 <12`.                                                   |
| Browsers           | Chromium/WebKit functional and axe checks on macOS locally and Linux CI; macOS Chromium visual baselines. Firefox is configured but outside the verified matrix. |
| Direction/language | Set `dir` and `lang` on an ancestor. Logical CSS follows direction; individual keyboard/placement behavior is defined by each API.                               |

The [QA support matrix](../qa/SUPPORT_MATRIX.md) records accessibility,
forced-colors, zoom and assistive-technology boundaries.

## Native dialog and popover

`JpDialog`/`JpDrawer` use native `<dialog>.showModal()` after browser render.
If it throws, the component sets the `open` attribute. Native `cancel` is
prevented so the overlay stack decides which registered layer closes.

Menus, popovers, tooltips and combobox use
[the overlay manager](../../libs/ui/src/lib/primitives/shared/overlay-manager.ts).
It sets `popover="manual"` and calls `showPopover()` for the native top layer.
If unsupported or rejected, it removes the popover attribute and uses a
fixed-position panel measured from the anchor. Pixel coordinates are geometry,
not theme tokens. The fallback does not promise identical clipping or page
inertness. See individual APIs before relying on those differences.

Native date/time picker appearance, keyboard conventions and popup UI belong
to the browser/OS. Automated tests cover control values and validation;
manual native-picker review remains open. Repeated `details.name` grouping
is tested in the declared Chromium/WebKit matrix.

## SSR and hydration

Server rendering and hydration are outside the current contract. Browser-only
guards avoid some crashes but do not establish hydration support. Overlays
measure layout and manage focus after render; shell/assistant behavior reads
`matchMedia` and document focus. Generated IDs include random values and
module counters that are not guaranteed to match across server/client runs.
Explicit field/tab IDs support repeated client instances and focus links;
they do not make the whole library hydration-safe.

## Directional layout

Shell, assistant, toast, forms and table layouts use logical edges where
appropriate. Off-canvas `translateX` motion is mirrored under `:dir(rtl)`.
Tab horizontal arrows follow writing direction; radio-group ArrowRight moves
to the next enabled option in DOM order. Overlay measurement writes physical
viewport `left`/`top`; tooltip `left`/`right` placements are physical.
Vertical sort arrows are not mirrored. See [icon direction](../content/ICONS.md).

## Locale and formatting

`JP_MESSAGES` provides built-in copy, not automatic locale detection or ICU.
Applications supply message overrides, `lang`/`dir`, and locale/time-zone
inputs. Providers merge with the parent token when their injector is created;
they do not watch later locale changes.

Native date/time fields exchange ISO civil strings and use browser-local
presentation. Timeline and scheduling use `Intl.DateTimeFormat` with their
locale/time-zone inputs; scheduling uses a Gregorian date model. Charts use
`Intl.NumberFormat` and their formatting options. Caller-owned table cells,
messages, titles and labels remain application content. Message count
functions use ordinary string interpolation by default; override them for
plural rules or localized number formatting.

## Packages and bundle measurement

The UI package sets `sideEffects: false`; consumer bundlers can remove unused
exports. Chart.js 4.5.1 is a package dependency loaded by the chart in the
browser. No isolated one-component tree-shaking benchmark has been recorded.
The full UI entry size is not the cost of importing one component.
Showcase production budgets and current build evidence are in
[Quality](../QUALITY.md) and [Verification](../qa/VERIFICATION.md).
