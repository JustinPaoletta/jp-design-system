# Advanced layout and data APIs

October 4, 2026. These additions are **preview**, owned by JP maintainers.
Existing `JpTable` defaults retain their established contract; the optional
features below require consumer review before promotion. See the
[remaining task list](../COMPONENT_EXPANSION_PLAN.md),
[maturity inventory](governance/MATURITY.md), and
[verification evidence](qa/VERIFICATION.md).

## Split panes

`JpSplitPane` / `jp-split-pane` projects `[jpSplitPrimary]` and
`[jpSplitSecondary]`. Supply a document-unique `id`, `primaryLabel`, and
`secondaryLabel`. The primary panel id is `<id>-primary`; the labelled,
focusable separator controls it. Both panels are labelled native sections.

`size` and `collapsed` are two-way models. `size` is the primary pane's
percentage of the space remaining after the separator. `min`/`max` default to
15/85 and are normalized to 0–100; nonfinite inputs use defaults, and reversed
bounds clamp to the minimum. The default size is 40. `step` defaults to one
percentage point. `collapsible` defaults to true. Collapse preserves the
previous size; restoring does not overwrite it. Arrow resizing restores a
collapsed primary pane and adjusts its saved size.

Horizontal layout means side-by-side panels with a vertical separator.
`orientation="vertical"` stacks panels with a horizontal separator; consumers
must give that layout a definite block size. The splitter uses pointer capture
for mouse, pen and touch. Matching pointer cancellation/lost capture stops
resizing; the last emitted size remains applied.

Keyboard: horizontal arrows resize in the visual direction, including RTL;
vertical arrows resize stacked panels. Shift accelerates the configured step
tenfold. Home/End apply minimum/maximum; Enter toggles collapse when enabled.
Focus moves to the separator before collapse hides a focused primary child.
At viewport widths up to 48rem both panels are visible in source order, resizing
and collapse are inactive, and the separator is removed from the focus/accessibility
order. A focused separator moves focus to the primary panel after it renders.
There are no resizing transitions or entrance animations.

Persist `sizeChange` in the consuming application, with a versioned storage key
and error handling. The component does not access storage. The Showcase
`/advanced-layout` demonstrates restoration, bounded values, reset, and denied
storage recovery. `collapsed` is session state in that example.

```html
<jp-split-pane id="workspace" primaryLabel="Overview" secondaryLabel="Inventory" [(size)]="overviewSize" [(collapsed)]="overviewCollapsed" [min]="20" [max]="70">
  <section jpSplitPrimary>Overview content</section>
  <section jpSplitSecondary>Inventory content</section>
</jp-split-pane>
```

The keyboard and separator semantics follow the
[WAI-ARIA window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/).
Manual assistive-technology and physical touch review remain pending.

## Resilient images

`JpMedia` / `jp-media` requires `src` and explicit `alt`. Use `alt=""` only for
an image that is decorative in its consuming context. Optional `caption` uses
native `figure`/`figcaption`; it does not replace image alt text.

`aspectRatio` is a positive numeric ratio, default 16/9; invalid values fall back
to that ratio. The frame reserves space through loading and failure. `fit` is
`cover` (default) or `contain`; `loading` is `lazy` (default) or `eager`. `srcset`
and `sizes` pass through to the native image for responsive source selection;
decoding is asynchronous. `loaded` and `failed` emit native result intents.
Changing `src` resets loading/failure state. Events from a superseded source
are ignored. Browser selection of a different `srcset` candidate uses the same
native image contract.

Loading copy appears in an `aria-busy` frame. On failure, the broken native image
is hidden and a fallback keeps meaningful image semantics and the supplied
alt; a decorative fallback stays hidden from assistive technology. `loadingLabel`
and `errorLabel` default to `JP_MESSAGES.media` and can be overridden. Recovery
is consumer-owned: replace `src` or provide an external reload action. Captions
and fallback copy wrap without expanding the page.

This is a static image primitive. Audio/video playback, streaming, embeds and
captions/subtitles for playable media remain consumer-owned native elements.
No source fetch, transcoding, autoplay, or image-generation service is included.

## Table visibility and persistence

`visibleColumnKeys: readonly string[] | null` is controlled: null shows all
columns, keys are resolved in schema order, and unknown keys are omitted.
An empty/invalid key set falls back to the first schema column. `columnChooser`
adds a native disclosure containing localized checkboxes; it prevents hiding
the final column. `visibleColumnKeysChange` requests the next schema-ordered
key set. Hidden headers/cells leave the DOM. `aria-colcount` and original
`aria-colindex` values preserve the full schema positions, including optional
selection/detail-control columns.

`JpTablePreferences` is version 1 with `visibleColumnKeys` and `columnWidths`.
`normalizeJpTablePreferences(unknown, columns)` and
`parseJpTablePreferences(string | null, columns)` validate persisted values:
obsolete columns and duplicate keys disappear, widths are finite/bounded,
malformed JSON/old versions reset, and at least one available column remains.
The helpers have no browser/storage dependencies. Consumers own the storage
key, permissions, profile/screen scope, restoration and reset. Do not persist
selection or detail expansion with column preferences. The Showcase tolerates
denied storage and continues with session preferences.

## Table resizing and sticky regions

`resizable` enables controlled `columnWidths` (key to pixel width) and
`columnWidthsChange`. Columns accept `width`, `minWidth` and `maxWidth`.
Defaults are 180px, 80px and 960px. Minimum widths cannot fall below 80px;
maximum bounds never fall below the minimum. Numeric widths are rounded and
clamped. Resizable tables use fixed column layout and horizontal overflow;
content wraps within each cell. Utility columns reserve 48px each.

Headers provide pointer handles; the Columns disclosure provides labelled
native number fields for exact entry and keyboard resizing. Changes commit
when the number field changes/blurs. Nonfinite edits are ignored. Pointer
capture supports RTL and stops at pointer-up/cancel/lost capture. Resizing
preserves sort, visibility, selection and row details.

`stickyHeader` pins headers in the table's scroll frame. Set `maxHeight` to
constrain vertical scrolling. `stickyFirstColumn` pins the first visible data
column and leading selection/detail controls, with logical RTL offsets and
layering at header intersections. Below a frame width of 28rem, horizontal
pinning is disabled so the scrollable data remains reachable; vertical header
pinning still applies. Consumers should bound the first column to leave room
for other columns at their chosen desktop pane widths. The Showcase caps its
first column at 480px.

## Table details

Project `ng-template[jpTableRowDetail]` to enable row details, and supply a
nonempty document-unique table `id` plus unique `rowKey` values. Rows without
valid string/number keys cannot expand. `expandedKeys` is controlled, and
`expandedKeysChange` preserves keys from other pages. Template context supplies
`$implicit`/`row`; the details occupy a following native table row whose cell
spans the currently rendered columns. Each row has a labelled native button
with expansion state and an open-panel relationship. Panel ids encode the key
and its type so they survive sorting/reordering and distinguish string/number
identities. On a requested collapse, focus inside the detail moves to its
trigger before the panel is removed.

The table remains a [native table with independent controls](https://www.w3.org/WAI/ARIA/apg/patterns/table/).
It does not implement spreadsheet cell navigation, hierarchical/tree-grid
semantics, row virtualization or drag-and-drop. Those are distinct task-list
items. Expansion and selection are independent; consumers own sort, filters,
paging and asynchronous detail data.

```html
<jp-table id="inventory" caption="Services" [columns]="columns" [rows]="rows" columnChooser resizable stickyHeader stickyFirstColumn maxHeight="24rem" [(visibleColumnKeys)]="visibleColumns" [(columnWidths)]="widths" [(expandedKeys)]="expandedRows" rowKey="id">
  <ng-template jpTableRowDetail let-row>
    <p>Deployment owner: {{ row.owner }}</p>
  </ng-template>
</jp-table>
```

All new built-in table phrases come from `JP_MESSAGES.table`: columns, details,
show/hide row details, and width labels. Labels/captions/content belong to the
consumer. Colors, typography, space, control size, borders, radii and focus
rings use semantic JP tokens; there is no new palette or dependency.
