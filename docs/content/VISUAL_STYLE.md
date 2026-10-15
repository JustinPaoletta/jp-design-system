# Visual style

Use the supplied October 2026 dashboard references for the component appearance.
The system uses charcoal surfaces and a warm gold accent.

## Surfaces and controls

- Use semantic surface and border tokens.
- Use small corners for cards, controls and badges.
- Keep circular avatars and status dots.
- Use low shadows for raised surfaces.
- Keep headings clear and body text readable.
- Keep status colors separate from the accent.

## Selection and focus

Mark the selected navigation item with a background change.
Do not add a vertical accent line.
Keep the visible keyboard focus outline.
Selection and focus must have separate states.

## Motion

Do not animate layout changes for decoration.
Keep chart animation disabled.
Use short color transitions for hover states.
Honor the reduced-motion setting.

Keep the Storybook runtime files separate for each server port.
A preview server must not share generated runtime files with a test server.
See the [Storybook reload report](../qa/STORYBOOK_RELOAD_REGRESSION.md).

## Themes

The default accent is `gold`.
The `neon` and `cobalt` accents remain available through `data-jp-accent`.
All accents use the same surface, corner and shadow tokens.
Storybook examples must follow the theme toolbar.
Do not force an accent in a story unless that story tests the specific accent.

## Inspection

Compare the rendered interface with the references in Chrome.
Check desktop, collapsed sidebar and mobile layouts.
Check controls, tables, overlays and status text.
Inspect changed visual baselines before accepting them.
Run the interaction and accessibility checks after a visual change.
