`libs/ui/src/index.ts` exports `./lib/i18n`. Import `JP_MESSAGES`, `JP_DEFAULT_MESSAGES`, and `provideJpMessages` from `@jp-design-system/ui`.

# Message contract

JP does not use `@angular/localize` or a third-party i18n library. Built-in copy is an `InjectionToken<JpMessages>` named `JP_MESSAGES`. English defaults live on `JP_DEFAULT_MESSAGES` and are registered with `providedIn: 'root'`.

`provideJpMessages(overrides)` merges a partial onto the parent token (or onto the English defaults when there is no parent). Nested `providers: [provideJpMessages(...)]` accumulate. A component input that the template sets wins over the token for that input. Strings that are not inputs (pagination control labels, the toast dismiss name, shell navigation names, table selection copy, toolbar sentences) come only from the token.

## Inventory

Tooltip `content` is always supplied by the caller. `JpEmptyState.title` is required; the component has no default title. `JpInlineAlert` title, message, and action label are caller-supplied. There is no built-in date formatting.

| Group        | Key                                               | English default                                                  |
| ------------ | ------------------------------------------------- | ---------------------------------------------------------------- |
| pagination   | `label`                                           | Table pagination                                                 |
| pagination   | `first`                                           | First page                                                       |
| pagination   | `previous`                                        | Previous                                                         |
| pagination   | `next`                                            | Next                                                             |
| pagination   | `last`                                            | Last page                                                        |
| pagination   | `range({ start, end, total })`                    | `{start}–{end} of {total}`                                       |
| pagination   | `page({ page, pageCount })`                       | `Page {page} of {pageCount}`                                     |
| dialog       | `close`                                           | Close dialog                                                     |
| toast        | `dismiss`                                         | Dismiss notification                                             |
| table        | `regionLabel`                                     | Data table                                                       |
| table        | `selectAll`                                       | Select all rows on this page                                     |
| table        | `selectRow(label)`                                | `Select {label}`                                                 |
| table        | `emptyTitle`                                      | No data                                                          |
| table        | `sortAscending`, `sortDescending`, `sortNone`     | `''` (no extra phrase; `aria-sort` carries state)                |
| tableToolbar | `label`                                           | Table controls                                                   |
| tableToolbar | `activeFilters`                                   | Active filters                                                   |
| tableToolbar | `clearFilters`                                    | Clear filters                                                    |
| tableToolbar | `selected(count)`                                 | `{count} selected`                                               |
| tableToolbar | `removeFilter(label)`                             | `Remove filter: {label}`                                         |
| combobox     | `placeholder`                                     | Search options                                                   |
| combobox     | `loading`                                         | Loading options…                                                 |
| combobox     | `empty`                                           | No results found.                                                |
| assistant    | `title`                                           | JP Assistant                                                     |
| assistant    | `close`                                           | Close assistant                                                  |
| assistant    | `clearContext`                                    | Clear context                                                    |
| assistant    | `composerLabel`                                   | Message the assistant                                            |
| assistant    | `send`                                            | Send                                                             |
| assistant    | `pending`                                         | Generating response                                              |
| assistant    | `cancel`                                          | Stop response                                                    |
| assistant    | `retry`                                           | Retry                                                            |
| assistant    | `cancelled`                                       | Response stopped                                                 |
| assistant    | `emptyTitle`                                      | Ask about this surface                                           |
| assistant    | `emptyDescription`                                | Open the assistant from a context trigger, then send a question. |
| assistant    | `placeholder`                                     | Ask a question…                                                  |
| assistant    | `responseFailed`                                  | Response failed                                                  |
| assistant    | `roles.user` / `roles.assistant` / `roles.system` | You / Assistant / System                                         |
| appShell     | `sidebarLabel`                                    | Primary                                                          |
| appShell     | `openNavigation`                                  | Open navigation                                                  |
| appShell     | `closeNavigation`                                 | Close navigation                                                 |
| appShell     | `expandSidebar`                                   | Expand sidebar                                                   |
| appShell     | `collapseSidebar`                                 | Collapse sidebar                                                 |
| button       | `loading`                                         | Loading                                                          |
| progress     | `loading`                                         | Loading                                                          |
| breadcrumbs  | `label`                                           | Breadcrumb                                                       |
| tabs         | `label`                                           | Tabs                                                             |
| chip         | `remove(label)`                                   | `Remove {label}`                                                 |

Sort arrows (↑ ↓ ↕) are not sentences. `aria-sort` stays `ascending`, `descending`, or `none` and must not be translated. Set the sort phrase fields to append a translated accessible name; leave them empty to keep the button name equal to the column header.

## Sentences, plurals, numbers, dates

Range, page, selection, filter-removal, and chip-removal copy are functions. Translate the whole sentence inside the function. Do not split a sentence around a binding in the template.

Plural rules belong in the function. It receives the count:

```ts
provideJpMessages({
  tableToolbar: {
    selected: (count) => (count === 1 ? `${count} item selected` : `${count} items selected`),
  },
});
```

Defaults interpolate the number with an ordinary string conversion. They do not call `Intl.NumberFormat`, so existing English text stays `1–10 of 42`. Format grouping or other numeral systems inside the override:

```ts
const count = new Intl.NumberFormat('de-DE');
provideJpMessages({
  pagination: {
    range: ({ start, end, total }) => `Einträge ${count.format(start)} bis ${count.format(end)} von insgesamt ${count.format(total)} Einträgen`,
  },
});
```

JP does not format dates or times. The consuming application owns locale and time zone for those values.

## Providing messages and direction

```ts
import { provideJpMessages } from '@jp-design-system/ui';

export const appConfig = {
  providers: [
    provideJpMessages({
      pagination: {
        next: 'الانتقال إلى الصفحة التالية',
        range: ({ start, end, total }) => `عرض السجلات من ${start} إلى ${end} من أصل ${total} سجلًا`,
        page: ({ page, pageCount }) => `الصفحة ${page} من أصل ${pageCount} صفحات`,
      },
    }),
  ],
};
```

Set `dir="rtl"` on `<html>` or on an ancestor of the components that should follow that direction. Logical CSS and `:dir(rtl)` use that directionality. A per-instance input such as `closeLabel`, `label`, or `loadingText` still overrides the token when the template sets it.

`Primitives/Data Display/Pagination` → `TranslatedRtl` renders pagination inside `dir="rtl"` with long Arabic strings in a 22rem rail.

Runtime support, SSR, and bundle notes are in [SUPPORT.md](./SUPPORT.md).

## Everyday workflow messages

`actions`, `dates`, `commands`, `inlineEdit`, `upload` and `notifications` supply the new built-in text through `provideJpMessages`. Upload rejection messages are functions receiving the original file name. Consumer labels/content and native browser picker UI are separately owned. Calendar/time values remain ISO/local strings; browser locale controls native presentation and the consumer owns time zones. See [workflow contracts](../WORKFLOW_COMPONENTS.md).
