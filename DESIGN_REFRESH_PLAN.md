# Design refresh

Use the supplied dashboard images as the visual reference.
Remove the vertical line from the selected navigation item.

## Changes

- [x] Use charcoal surfaces, small corners and low shadows across the shared tokens.
- [x] Add the `gold` accent and make it the default.
- [x] Keep the `neon` and `cobalt` accents available.
- [x] Mark the selected navigation item with a background change.
- [x] Update the dashboard examples in Storybook and Showcase.
- [x] Keep chart animation disabled and keep native data controls.
- [x] Check components in Chrome at desktop and mobile widths.
- [x] Run source, documentation, Storybook and browser checks.
- [x] Update the visual baselines after image inspection.

## Acceptance

Components must use the shared semantic tokens.
Keep public control behavior, keyboard operation and visible focus.
Keep error and status text readable.
Do not add a decorative navigation line or a layout animation.

The default accent change affects applications that do not set `data-jp-accent`.
Set `data-jp-accent="neon"` to keep the previous accent.
The new surface and corner values apply to all accents.

The dashboard uses real chart data and controls.
Its data controls remain visible, although the reference images do not show them.
The images specify appearance; they do not replace accessibility requirements.

See [the visual style](docs/content/VISUAL_STYLE.md) and [the design inspection](design-qa.md).
