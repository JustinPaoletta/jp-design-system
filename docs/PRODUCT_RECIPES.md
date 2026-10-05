# Product recipes

Showcase `/product-recipes` demonstrates application compositions.
The simulated API makes each action fail once and then succeed on retry.
This makes failure recovery repeatable.
Replace `request()` with your application service.
Keep request state in the application.

## Validated asynchronous save

1. Use Angular reactive forms.
2. Bind `formControlName` to JP controls that implement ControlValueAccessor.
3. After touch or submission, supply the applicable `error`.
4. On failure, render an inline alert with a Retry action.

Required/native attributes pass to the inner input.
The application controls validation.
`jp-radio-group` and `jp-combobox` implement ControlValueAccessor, like the existing fields.
A loading button prevents duplicate submission and keeps its accessible name through `loadingLabel`.
It keeps form values on failure.
A successful retry clears the error.

## Searchable paginated table

Keep source rows, query, sort, page and selected keys in the application.
`jp-table` emits sort and selection changes.
It does not fetch or change application data.
Give a stable `rowKey`.
When sort or query changes, reset the page.

Selection includes keys from other pages, which permits bulk actions across pages.
`jp-pagination` uses one-based page numbers and the total record count.
The toolbar projects search, filter and bulk-action controls.
Show separate states for zero matches and failed requests.
During a failed refresh, keep previous data visible.

## Destructive confirmation

1. Open a dialog for the selected items.
2. During the request, disable competing actions.
3. If deletion fails, keep the confirmation open.
4. After success, remove only the selected rows whose deletion succeeded.
5. Reset selection and pagination.

The example lets the user try again after its simulated failure.

## Assistant transport integration

1. Call `beginResponse()` to obtain a request ID.
2. For streaming, call `updateResponse(id, accumulatedText)`.
3. To finish, call `completeResponse(id)` or `failResponse(id, readableError)`.
4. To abort the transport, listen to panel `responseCancel`.
5. When `responseRetry` emits, restart the transport with `event.responseId`.

`responseRetry` emits `{ previousId, responseId }`.
The service ignores updates to old, settled or cleared requests.
The application controls transport, saved state, authorization and content policy.

## Navigation and layout

Tabs use manual activation.
Arrows/Home/End move focus; Enter/Space selects.
For repeated instances or application focus links, supply explicit tab IDs.
Supply one `ng-template jpTabPanel` for each value.
SSR/hydration are outside the current support contract.
Breadcrumbs render the final item as current-page text.

Keep semantic tokens and density attributes at the document root.
A Light stage in Storybook changes the preview background.
The components keep the dark theme.
