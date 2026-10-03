# Product recipes

Open Showcase `/product-recipes` for working application compositions. The API transport is deliberately simulated: each action fails once so failure recovery is repeatable, then retry succeeds. Replace `request()` with your application service and keep request state owned by the consumer.

## Validated asynchronous save

Use Angular reactive forms, bind `formControlName` to the JP controls implementing ControlValueAccessor, and supply `error` only after touch or submission. Required/native attributes are forwarded to the inner input; validation remains an application concern. `jp-radio-group` and `jp-combobox` implement ControlValueAccessor just like the existing fields. A loading button prevents duplicate submit, preserves its accessible name with `loadingLabel`, and retains the form values on failure. Render an inline alert with a Retry action; a successful retry clears the error.

## Searchable paginated table

Keep source rows, query, sort, page and selected keys in the consumer. `jp-table` emits sort and selection changes; it does not fetch or mutate application data. Provide a stable `rowKey`. Sorting/query changes reset the page. Selection includes off-page keys, allowing bulk actions across pages. `jp-pagination` uses one-based page numbers and total record count. The toolbar projects search, filter and bulk-action controls. Distinguish zero matches from failed requests; keep previous data visible during refresh failure.

## Destructive confirmation

Open a dialog from selection, disable competing actions during the request, and keep confirmation open if deletion fails. Remove only confirmed selected rows after success; reset selection and pagination then. The example permits a second attempt after its simulated failure.

## Assistant transport integration

Call `beginResponse()` to obtain a request ID, `updateResponse(id, accumulatedText)` for streaming, then `completeResponse(id)` or `failResponse(id, readableError)`. Listen to panel `responseCancel` to abort your transport. `responseRetry` emits `{ previousId, responseId }`: restart transport using `event.responseId`. Updates to old/settled/cleared requests are ignored. Transport, persistence, authorization and content policy belong to the consuming application.

## Navigation and layout

Tabs use manual activation: arrows/Home/End move focus; Enter/Space selects. Supply stable tab IDs for server rendering and one `ng-template jpTabPanel` per value. Breadcrumbs render the final item as current-page text. Keep semantic tokens and density attributes at the document root; a Light stage in Storybook is a preview mat, not a light component theme.
