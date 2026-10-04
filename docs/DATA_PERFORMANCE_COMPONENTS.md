# Charts and virtual tables

These APIs are preview. `/data-performance` combines team delivery analytics and
10,000 services in a consumer screen. Consumers own fetching, sorting, selection,
errors, persistence, and business decisions.

## Chart integration

`JpChart` uses Chart.js 4.5.1 (MIT), registered with only bar/line controllers,
category/linear scales, their elements and tooltip. The engine is dynamically
imported after browser rendering; importing another UI component does not eagerly
load or register it. No Angular chart wrapper, date adapter, or canvas dependency
is required. Engine instances are destroyed on teardown and input/theme changes;
stale asynchronous imports cannot create a chart after teardown.

This integration follows the official
[bundle integration guidance](https://www.chartjs.org/docs/latest/getting-started/integration.html).
Chart.js canvas contents require an accessible alternative, as described in its
[accessibility guidance](https://www.chartjs.org/docs/latest/general/accessibility.html).

```html
<jp-chart id="delivery" label="Completed work" description="Monthly team totals." [labels]="months" [series]="teams" type="line" locale="en-US" [formatOptions]="{ maximumFractionDigits: 0 }" />
```

- `id` is document-unique and `label` is required. `description` is optional.
- `labels` are category strings; `series: JpChartSeries[]` contain unique `id`,
  `label`, and one finite number or explicit `null` for each category.
- The supported contract is up to 500 categories and four series. Mismatched
  lengths, duplicate/blank series identifiers, invalid numbers, and unsupported
  types show a localized diagnostic instead of silently changing the dataset.
  Empty labels/series show an empty state. Aggregate larger datasets first.
- `type` is `bar` or `line`. `locale` and `formatOptions` apply to ticks, tooltips,
  inspection values and the native data table. Invalid Intl configuration falls
  back to en-US with two maximum fraction digits.
- `hiddenSeries`/`hiddenSeriesChange` control legend visibility. Native pressed
  buttons toggle series; hidden series remain available in the data table.
- `activeIndex`/`activeIndexChange` control a native category select. Its readout
  exposes tooltip-equivalent formatted values to keyboard and screen-reader users.
- `loading`, `error`, and `retry` cover consumer data states. An engine failure
  leaves the native data controls usable.
- The canvas has an image label; the native details/table provides all values,
  including explicit missing values. Forced colors automatically opens the data
  table and suppresses the canvas.
- Chart.js animation is always disabled. Series have consistent numbered legend
  swatches, distinct line dashes/point shapes, and semantic series colors.
- Semantic tokens `color.chart.series-1` through `series-4`, `axis`, and `grid`
  come from existing accent/neutral primitives. The first two series swap across
  neon/cobalt so they remain distinct. Theme and density attributes inherited
  from ancestors are observed to redraw with current resolved CSS values.
- Built-in copy is supplied through `provideJpMessages({ chart: … })`.

Not included: stacked/pie/time/scatter charts, arbitrary Chart.js configuration,
streaming, zooming, financial plotting, exporting, or hundreds of series. Those
need a product requirement and their own accessibility/formatting contract.

## Fixed-height virtual table

`JpVirtualTable` is an optional separate component. Existing `JpTable` behavior is
unchanged. Use normal table pagination for small or variable-height datasets;
virtualization is intended for large flat datasets that need continuous browsing.

```html
<jp-virtual-table label="Service inventory" [columns]="columns" [rows]="services" rowKey="id" [height]="360" [rowHeight]="48" [overscan]="6" selectable [selectedKeys]="selected" (selectionChange)="selected = $event" [sort]="sort" (sortChange)="sort = $event" />
```

- `rows` use the existing flat table cell vocabulary. `rowKey` is a unique finite
  number/string property or accessor; missing/duplicate keys and duplicate column
  keys show a diagnostic. `columns` use `JpSortableTableColumn`.
- `height` defaults to 360 px, clamped to 120–1200. `rowHeight` defaults to 48 px,
  clamped to 40–160 and rounded to the nearest whole CSS pixel. The component and
  exported range helper use the same rounded value to avoid accumulated subpixel
  drift across large datasets. Text is single-line with an ellipsis and native title. Row
  geometry stays fixed across density modes; changing rowHeight recalculates it.
- `overscan` defaults to six rows each side, clamped to 0–50. `rangeChange` emits
  `JpVirtualRange`: zero-based start and exclusive end, plus total. The exported
  `jpVirtualRange` helper calculates the same bounded window. Partial boundary
  rows are included even with zero overscan; at the beginning of the dataset,
  the mounted window compensates for unavailable preceding overscan rows.
- The scroll region is labeled and keyboard focusable. Its native table has a
  sticky 40 px header, full `aria-rowcount`/`aria-colcount`, and original row/column
  indices; inert spacer rows are excluded from accessibility semantics.
- Selection is consumer-controlled and survives window changes. Sorting emits
  the existing three-state sort request; the consumer supplies the reordered rows.
- If scrolling would recycle the focused checkbox row, focus moves to the labeled
  scroll region before that row is removed. Input-driven sorting, filtering,
  removal and selection-control changes use the same recovery before DOM updates.
  Dataset shrink clamps the scroll offset.
- `virtual`/`virtualChange` allow an explicit native paginated alternative. In
  paginated mode `page`/`pageChange` and `pageSize` (default 50, maximum 500) expose
  every row through existing table and pagination components. This alternative
  avoids relying on assistive technology navigating a partially mounted table.
  Selecting the already-active mode preserves its scroll position and page.
- `loading`, `error`, and `retry` are consumer-owned. Copy uses
  `provideJpMessages({ virtualTable: … })`, plus existing table/pagination messages.
- Styling uses table, text, border, focus, spacing, typography and control tokens.
  No scroll, row entrance or reorder animation is introduced.

Not supported in the virtual mode: variable-height cells, projected interactive
cell templates, row-detail panels, tree rows, pinned columns, or column resizing.
Compose those with the normal table or propose a measured extension first.

## Measurement and verification

The browser regression uses the real 10,000-service consumer screen and asserts
fewer than 30 mounted data rows, exact 48 px row geometry, access to the last row,
selection across distant windows, sorting, and complete paginated access. It also
attaches a reproducible full native-table construction/layout measurement for
10,000 rows and three columns. That baseline is native DOM, **not an Angular
rendering benchmark**; elapsed times are diagnostic and have no flaky speed gate.
Actual per-browser results are recorded in [QA evidence](qa/LARGE_FEATURES.md).

The native table semantics follow the
[W3C table guidance](https://www.w3.org/WAI/ARIA/apg/patterns/table/).
Unit, Storybook, browser, axe, visual and packaged-consumer checks cover the
implemented contract. Manual assistive-technology/forced-colors review and
consumer API feedback remain promotion requirements.
