# Icons

`JpIcon` is a preview component containing original JP outline glyphs on a
16-unit grid. It ships in `@jp-design-system/ui`, adds no icon font or
third-party icon dependency, and is covered by the repository MIT license.
Existing projection slots also accept consumer-authored inline SVG.

## Built-in glyphs

Names: `check`, `close`, `search`, `chevron-down`, `chevron-right`, `plus`,
`minus`, `info`, `warning`, `user`, `copy`, `external-link`, `play`, `pause`. The typed
`JpIconName` and `JP_ICON_PATHS` exports define the inventory. See
[the icon API](../COMPONENT_EXPANSION.md) and
[original source](../../libs/ui/src/lib/primitives/icon/icon.ts).

Sizes use semantic tokens: `sm`, `md` and `lg`. The default is `lg`.
The sizes are 16px, 20px and 24px in both densities.
The SVG viewBox remains a 16-unit grid.

Keep icons inside the control's size limits.
Use the size tokens instead of custom dimensions.
Colors come from `currentColor` and semantic parent tokens.

```html
<jp-button>
  <jp-icon name="plus" />
  Add service
</jp-button>

<jp-icon-button ariaLabel="Search players">
  <jp-icon name="search" />
</jp-icon-button>
```

## Accessible meaning

An empty `label` makes `JpIcon` decorative. Name an icon-only action on its
containing control; do not name both the icon and button. For a standalone
meaningful image, supply `label`. A status also must have understandable text,
rather than relying on a tooltip or color alone.

Projected decorative SVG uses `aria-hidden="true"` without a redundant title
or image role. Keep the projection marker expected by the component,
such as `[jpEmptyStateIcon]` or `[jpAppShellNavIcon]`.

## Authored SVG and licensing

Prefer the built-in glyph when it represents the action. For additional
geometry, use a 16-unit view box, `fill="none"`, `stroke="currentColor"`,
stroke width 1.5 and rounded caps/joins. Keep strokes inside the view box.
Align icons and labels through flex alignment and semantic gaps; let the label wrap without shrinking the icon.

Do not copy paths from another icon family into JP without an explicit
licensing and dependency decision. New glyphs must have known authorship and
license; the built-in JP set does not establish provenance for unrelated
consumer or historical Showcase artwork.

## Direction

The built-in `chevron-right` mirrors automatically under an RTL ancestor. Other glyphs do not automatically mirror. Mirror additional projected directional arrows for previous/next/back through consumer styles, for example a wrapper with `:dir(rtl) { transform: scaleX(-1); }`. Avoid double-mirroring the built-in chevron.

Do not mirror close, plus, minus, check, search, status symbols or brand marks. Keep sort arrows vertical. A direction change must update any directional styling along with document `dir`.
