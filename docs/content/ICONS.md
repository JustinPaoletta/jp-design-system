# Icons

Recorded October 4, 2026.

JP does not ship an icon font or an icon package. Controls, navigation, alerts, and empty states use text, CSS marks, or inline SVG. That stays the integration approach.

Do not add a third-party icon dependency. Do not copy path data from Lucide, Feather, Heroicons, Material Symbols, or any other icon family into this repo.

## License

The repository license is the MIT License (`"license": "MIT"` in `package.json`; copyright notice in `LICENSE`, Copyright (c) 2026 Justin Paoletta).

Inline SVGs authored in this repo are part of that Software and are covered by the MIT License. No third-party icon family is redistributed with JP.

Shell navigation artwork already in the showcase was placed by hand and is out of scope for this pass. The glyph follow-up below must confirm each existing path is original or replace it. Do not treat those paths as a vendored icon set.

## Sizes, stroke, color, and placement

Author new icons on one of two view boxes:

| Use                                                                            | View box    | Rendered size |
| ------------------------------------------------------------------------------ | ----------- | ------------- |
| Beside a label, inside an action, or in an alert                               | `0 0 16 16` | 16px          |
| Empty-state mark, or a nav glyph that must stay clear when the label is hidden | `0 0 20 20` | 20px          |

16px matches the existing `--jp-size-icon-lg` token (`1rem`). There is no 20px icon token; set `width="20"` and `height="20"` on that SVG.

`--jp-size-icon-sm` (8px) and `--jp-size-icon-md` (12px) are the current control-interior scale (`jp-icon-button`, checkbox, radio, switch). Leave those interiors alone in this pass. New content icons use 16 or 20, not a third stroke scale.

Draw outline icons:

- `fill="none"`
- `stroke="currentColor"`
- `stroke-width="1.5"`
- `stroke-linecap="round"` and `stroke-linejoin="round"`
- Keep geometry inset by at least half the stroke so the stroke is not clipped (in a 16 box, stay between 1.5 and 14.5)

Color comes only from `currentColor`. Do not set a hex color, a raw `rgb()`, or a primitive color on the SVG. The parent sets color with a semantic token such as `--jp-color-foreground-muted`, `--jp-color-foreground-primary`, or the foreground token of the control.

Optical alignment: put the icon and the label in a flex row with `align-items: center` and a gap of `--jp-space-xs`. Do not nudge the icon with a one-off top margin. The icon is `flex-shrink: 0`. The label is allowed to wrap or truncate; the icon is not.

Placement:

- The icon sits at the inline start of the label (before the words in left-to-right layout).
- Inside `jp-icon-button`, project the SVG and let the control size the box. Mark the SVG `aria-hidden="true"`. The button's accessible name is the `ariaLabel` input.
- In `jp-empty-state`, project the SVG onto `[jpEmptyStateIcon]`. Prefer 20px. The title carries the meaning, so the icon is decorative.
- In an alert, prefer 16px and keep it decorative when the title or message already states the status.

## Decorative and meaningful icons

If text next to the icon names the action or status, the icon is decorative:

- `aria-hidden="true"` on the SVG
- no `<title>`, no `role="img"`, no `aria-label` on the SVG

If the icon is the only content in a control, the control has the accessible name (`aria-label` or visible text). The SVG stays `aria-hidden="true"`. Do not name both the control and the SVG.

A status icon with no visible text needs a text alternative on the parent, not a tooltip as the only name.

## Direction and right-to-left layout

Mirror icons that point along the line of text or toward a side of the screen. Do not mirror icons whose shape is the symbol itself.

Add `jp-icon jp-icon--directional` to icons that should mirror, and include this rule with the consumer's styles:

```css
.jp-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}

[dir='rtl'] .jp-icon--directional {
  transform: scaleX(-1);
}
```

`scaleX(-1)` is the mirror. Use it from the `[dir="rtl"]` rule so the icon follows the document direction. An inline `style="transform: scaleX(-1)"` only fits when the consumer already knows the direction at render time and will update it when `dir` changes.

Mirror:

- Chevrons and arrows for back, forward, previous, next, expand, or collapse toward a side
- Breadcrumb separators
- The external-link arrow
- Reply or share marks that point along the line of text

Do not mirror:

- Close, plus, minus, check, search
- Alert, warning, information, and error marks
- Empty-state marks
- Chat, database, grid, and slider marks
- Brand marks

## Examples

These snippets are original geometry for consumers to copy. They are not a component.

Navigation (16px, directional, label carries the name):

```html
<a href="/data">
  <svg class="jp-icon jp-icon--directional" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 3.5 10.5 8 6 12.5" />
  </svg>
  Data
</a>
```

Action (16px, decorative beside the verb):

```html
<button type="button">
  <svg class="jp-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
    <path d="M8 3.5v9M3.5 8h9" />
  </svg>
  Add service
</button>
```

Alert (16px, decorative because the sentence states the failure):

```html
<p>
  <svg class="jp-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M8 2.5 14 13.5H2Z" />
    <path d="M8 6.5v3.5" />
    <path d="M8 12h.01" />
  </svg>
  Save failed. Check the notification email and try again.
</p>
```

Empty state (20px, decorative, placed in the empty-state icon slot):

```html
<span jpEmptyStateIcon>
  <svg class="jp-icon" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3.5" y="4.5" width="13" height="11" rx="1.5" />
    <path d="M3.5 8.5h13" />
  </svg>
</span>
```

## Follow-up for maintainers

Replacing inconsistent glyphs is follow-up work. Existing component files are frozen for this pass, so this change does not edit them.

Current marks that do not follow the convention:

- A text `×` in `toast.html`, `dialog.html`, `assistant-panel.html` (close and clear context), and `table-toolbar.html`
- CSS-drawn menu, close, and collapse marks in `app-shell.scss`
- The `◇` character on the showcase data page empty state
- Showcase shell navigation SVGs that use a 24 view box, stroke width 2, and a 16px width attribute, inside a slot sized by `--jp-size-icon-md` (12px)

When those files are open for edit, replace the marks with the 16/20 inline SVG convention above, keep decorative icons `aria-hidden`, and add `jp-icon--directional` only to the directional list.

## Shipped JP icon primitive

The preview `JpIcon` component now provides original JP outline glyphs on the
16-unit grid, with semantic size tokens and decorative/meaningful labeling.
It adds no third-party dependency. See [the component guide](../COMPONENT_EXPANSION.md).
Its default `lg` size is the default-density 16px content size; smaller sizes
serve control interiors. Existing projected SVGs remain supported, and historical
showcase artwork still needs the provenance review described above.
