# Visual style

Use the supplied October 2026 dashboard references for the component appearance.
The system uses charcoal surfaces and a warm gold accent.

## Surfaces and controls

- Use semantic surface and border tokens.
- Use 8px corners for controls, 12px for cards and 16px for larger overlays.
- Keep circular avatars and status dots.
- Use flat surfaces for cards. Reserve stronger shadows for floating panels.
- Keep headings clear and body text readable.
- Keep status colors separate from the accent.

## Size and hierarchy

Default controls use 32px, 40px and 48px heights for `sm`, `md` and `lg`.
Compact controls use 28px, 32px and 40px heights.
Icons use 16px, 20px and 24px sizes in both densities.
Selection boxes use 20px. Their marks use 16px.
Do not use a button height to size a checkbox or switch.

Body text uses 16px. Dense interface text uses `--jp-font-size-body-sm` at 14px.
Captions use 13px. Heading sizes start at 32px, 24px, 20px and 16px.
Use 600 weight for headings and 500 weight for labels.

Card titles use 16px, independent of their heading level.
The user approved the Card reference on October 19, 2026.
Use `JpCard` for composed panels when its slots fit the content.
Keep its 24px inset, 14px body text and separated action footer.

Use the approved direction across related components. Inspect each changed group in Chrome.
Coordinate independent groups in parallel when their files do not overlap.
Do not require another design approval for each use of the same direction.

Routine button labels use 14px and 500 weight. Primary buttons use 600 weight.
Use a 1.5 line height for descriptions and body text.

The examples load the included Inter font through `libs/tokens/src/fonts.css`.
Confirm that the font loads before inspecting screenshots.
A font name in a CSS list does not install that font.
Applications can import `@jp-design-system/tokens/fonts.css` or supply their own font.

Use `jp-heading` `as` for the document outline.
Use its optional `size` input when a different visual size is necessary.

| Surface token | Purpose          | Default color |
| ------------- | ---------------- | ------------- |
| `canvas`      | Page background  | `#0b1117`     |
| `subtle`      | Card background  | `#131c24`     |
| `raised`      | Raised panel     | `#1a2631`     |
| `overlay`     | Floating overlay | `#223240`     |

## Examples

Use JP controls for actions and fields in component examples.
A projected HTML button does not receive JP button styles automatically.
Keep Save as the main action. Put destructive actions in a separate section.

Use one heading and one panel boundary for each task.
Keep example settings in a separate disclosure or Storybook controls.
Do not show token values as product content.
Align the application name with the main toolbar.
For narrow calendar lanes, use event rows to keep titles and times readable.
Use the [baseball examples](BASEBALL_EXAMPLES.md) for consistent names and product text.

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

## Screenshot states

Set the browser viewport before taking a mobile screenshot.
Use 390px width for the phone examples and 1440px for desktop examples.
A story name does not change the viewport of a direct iframe URL.

Wait for the story interaction checks to finish.
Then inspect the final visible state before saving the screenshot.
An open-overlay example must show its overlay.
Failure and streaming examples must retain those states after their checks.
Keep separate examples for recovery actions that change the visible state.

Inspect page overflow, focus, labels and console errors with each changed layout.
Keep screenshot files outside Git unless they are reviewed regression baselines.

For a component with a scroll frame, check its scroll position before and after a full-page capture.
If Chromium resets the frame, increase viewport height to the measured page height before capture.
Check that the component retains its initial scroll position.
