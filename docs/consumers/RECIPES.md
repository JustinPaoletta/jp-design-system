# Recipes

Showcase route `/product-recipes` is the working composition for forms,
search, selection, and destructive confirmation. `/assistant` is the
assistant surface. The narrative for both is
[PRODUCT_RECIPES.md](../PRODUCT_RECIPES.md). Serve the app with
`npx nx run showcase:serve` (http://localhost:4200). The page sources are
[`product-recipes.page.ts`](../../apps/showcase/src/app/pages/product-recipes/product-recipes.page.ts)
and
[`assistant.page.ts`](../../apps/showcase/src/app/pages/assistant/assistant.page.ts).

The recipes page simulates the network: `request()` fails the first call for
`save`, `refresh`, and `delete`, then succeeds. Replace `request()` with the
application service. Keep request state in the application.

Storybook compositions:
[Compositions/Controls Form](../../libs/ui/src/lib/primitives/controls-form.stories.ts),
[Compositions/Data Display](../../libs/ui/src/lib/primitives/data-display.stories.ts),
[Compositions/Assistant System](../../libs/ui/src/lib/primitives/assistant-system.stories.ts).

## Validated asynchronous save

`ProductRecipesPage` builds a `FormGroup` for `email`, `region`, and `plan`.
`save()` marks every control touched, returns immediately when the form is
invalid or a save is already running, then calls `request('save', ...)`.
Failure sets `saveError` and leaves the form values in place. Success clears
the error and sets `saved`.

```html
<form [formGroup]="form" (ngSubmit)="save()">
  <jp-input
    label="Notification email"
    type="email"
    name="notification-email"
    autocomplete="email"
    [required]="true"
    formControlName="email"
    [error]="
      form.controls.email.touched && form.controls.email.invalid
        ? 'Enter a valid notification email.'
        : ''
    "
  />
  <jp-combobox label="Region" [options]="regions" formControlName="region" [required]="true" />
  <jp-radio-group label="Support plan" [options]="plans" formControlName="plan" [required]="true" />
  @if (saveError()) {
  <jp-inline-alert tone="error" title="Save failed" [message]="saveError()" actionLabel="Retry save" (action)="save()" />
  }
  <jp-button type="submit" [loading]="saving()" loadingLabel="Saving settings"> Save settings </jp-button>
</form>
```

`regions` and `plans` are `{ value, label }[]`, matching `JpComboboxOption`
and `JpRadioOption`.

## Search, sort, and pagination

The page keeps `records`, `search`, `sort`, `page`, and `pageSize` (the
example uses `2`). `filtered` applies the query and the current
`JpTableSort`. `visible` slices that array with one-based `page`.
`setSearch` and `setSort` reset `page` to `1`. `jp-pagination` `total` is
`filtered().length`, the record count, not the page count.

```html
<jp-table-toolbar [activeFilters]="filters()" [selectedCount]="selected().length" (removeFilter)="setSearch('')" (clearFilters)="setSearch('')">
  <jp-input jpTableSearch label="Search services" type="search" [ngModel]="search()" (ngModelChange)="setSearch($event)" />
  <jp-button jpTableActions variant="secondary" [loading]="loading()" (click)="refresh()"> Refresh services </jp-button>
</jp-table-toolbar>
<jp-table caption="Service inventory" [columns]="columns" [rows]="visible()" [sort]="sort()" (sortChange)="setSort($event)" [selectable]="true" [selectedKeys]="selected()" (selectionChange)="selected.set($event)" emptyTitle="No matching services" emptyDescription="Clear your search or choose a different query." />
<jp-pagination [page]="page()" [pageSize]="pageSize" [total]="filtered().length" (pageChange)="page.set($event)" />
```

`columns` is `[{ key: 'name', header: 'Service', sortable: true }, ...]`.
Sort cycles ascending, descending, then `null`. The table does not reorder
`rows`. Distinguish an empty filter (`emptyTitle`) from a failed refresh
(`loadError` on `jp-inline-alert` with `actionLabel="Retry refresh"`).
During a failed refresh the page leaves `records` in place.

## Selection

`selected` is `JpTableRowKey[]`. `rowKey` defaults to `'id'`.
`selectionChange` emits the full key list, including keys that are not on
the current page. `selectPage` adds or removes only the visible page. Rows
whose key is not a string or number stay visible and cannot be selected.

Bulk actions use the `[jpTableBulkActions]` slot. The toolbar shows that
slot when `selectedCount` is greater than zero.

```html
<jp-button jpTableBulkActions variant="destructive" (click)="deleteError.set(''); dialogOpen.set(true)"> Delete selected </jp-button>
```

## Destructive recovery

`confirmDelete()` returns when a delete is running or nothing is selected.
On failure it sets `deleteError` and leaves `dialogOpen` true. On success it
removes only the selected ids, clears `selected`, sets `page` to `1`, and
closes the dialog. Cancel and the dialog's `openChange` (Escape, scrim,
close) set `dialogOpen` to false. Competing buttons use `[disabled]="deleting()"`.

```html
<jp-dialog title="Delete selected services?" [open]="dialogOpen()" (openChange)="dialogOpen.set($event)">
  <jp-text>This removes the selected records from this demonstration.</jp-text>
  @if (deleteError()) {
  <jp-inline-alert tone="error" title="Delete failed" [message]="deleteError()" />
  }
  <div jpDialogActions>
    <jp-button variant="secondary" [disabled]="deleting()" (click)="dialogOpen.set(false)"> Cancel </jp-button>
    <jp-button variant="destructive" [loading]="deleting()" loadingLabel="Deleting services" (click)="confirmDelete()"> Confirm deletion </jp-button>
  </div>
</jp-dialog>
```

## Assistant transport

Showcase `/assistant` opens the panel with `jpAssistantTrigger` and
`jpAssistantContext`. `onMessageSubmit` stores the question and appends a
finished assistant message with `addMessage`. That page does not stream.

Streaming uses `JpAssistantService` and the panel outputs. The same methods
are what [PRODUCT_RECIPES.md](../PRODUCT_RECIPES.md) specifies, and Storybook
[`Primitives/Assistant/Panel`](../../libs/ui/src/lib/primitives/assistant/assistant.stories.ts)
drives them from `beginResponse`, `updateResponse`, `completeResponse`, and
`failResponse`.

```html
<jp-assistant-panel (messageSubmit)="respond($event)" (responseCancel)="abort($event)" (responseRetry)="restart($event.responseId)" />
```

```ts
respond(question: string): void {
  this.lastQuestion = question;
  this.stream(this.assistant.beginResponse(), question);
}

restart(responseId: number): void {
  this.stream(responseId, this.lastQuestion);
}

stream(id: number, question: string): void {
  const abort = new AbortController();
  this.inflight.set(id, abort);
  void this.transport.send(question, {
    signal: abort.signal,
    onChunk: (text) => this.assistant.updateResponse(id, text),
    onDone: (text) => this.assistant.completeResponse(id, text),
    onError: (message) => this.assistant.failResponse(id, message),
  });
}

abort(id: number): void {
  this.inflight.get(id)?.abort();
}
```

The panel appends the user message before `messageSubmit`. `beginResponse`
then appends the pending assistant message and returns the id to pass into
later updates. Updates for a settled, replaced, or cleared id are ignored.
`responseCancel` means the panel already marked that id cancelled. Abort the
matching transport there. `responseRetry` emits `{ previousId, responseId }`
after `retryResponse` has replaced the old message with a new pending id.
Pass `responseId` to the next send. Do not call `beginResponse` again for
that retry. The application owns the transport, authorization, persistence,
and content policy. `this.transport.send` is that application client, not a
JP export.
