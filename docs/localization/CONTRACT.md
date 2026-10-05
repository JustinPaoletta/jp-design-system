# Message contract

Import `JP_MESSAGES`, `JP_DEFAULT_MESSAGES`, `provideJpMessages`, `JpMessages`
and `JpMessagesOverride` from `@jp-design-system/ui`. The typed
[message source](../../libs/ui/src/lib/i18n/messages.ts) is the complete
key/default inventory. JP uses Angular injection rather than
`@angular/localize`, ICU or a third-party translation runtime.

`JP_MESSAGES` is an `InjectionToken<JpMessages>` with root English defaults.
`provideJpMessages(overrides)` merges partial groups onto the parent token,
or onto defaults if no parent exists. Nested providers accumulate. A supplied
component label input wins for that instance; labels without an input are
configured through the provider. For example, pagination sentences, toast
dismiss text, shell navigation labels and assistant role names use the token.

## Message groups

| Area                     | Groups                                                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core UI                  | `pagination`, `dialog`, `toast`, `table`, `tableToolbar`, `combobox`, `assistant`, `appShell`, `button`, `progress`, `breadcrumbs`, `tabs`, `chip` |
| Forms/content/feedback   | `forms`, `banner`, `drawer`, `checklist`, `stepper`, `numberStepper`, `rangeSlider`, `timeline`, `copy`, `overflow`                                |
| Workflows                | `actions`, `dates`, `commands`, `inlineEdit`, `upload`, `notifications`                                                                            |
| Advanced/larger features | `media`, `tree`, `calendar`, `reorder`, `carousel`, `chart`, `virtualTable`                                                                        |

The source inventory avoids duplicating dozens of defaults here. API guides
name relevant label inputs and groups. The application translates its tooltip content, empty-state titles, alert bodies, option labels and data cells. It also translates event names, notification content and assistant responses.

## Sentences, plurals and numbers

Sentence-shaped values are functions receiving names, counts or structured
arguments. Translate the whole sentence, allowing word order to change.
Defaults interpolate raw numbers; they do not automatically apply localized
number or plural rules.

```ts
import { provideJpMessages } from '@jp-design-system/ui';

const numbers = new Intl.NumberFormat('de-DE');

export const appConfig = {
  providers: [
    provideJpMessages({
      pagination: {
        next: 'Nächste Seite',
        range: ({ start, end, total }) => `Einträge ${numbers.format(start)} bis ${numbers.format(end)} von insgesamt ${numbers.format(total)} Einträgen`,
      },
      tableToolbar: {
        selected: (count) => (count === 1 ? '1 Element ausgewählt' : `${numbers.format(count)} Elemente ausgewählt`),
      },
    }),
  ],
};
```

If the language has additional plural categories, use `Intl.PluralRules` inside an override.
`aria-sort` values (`ascending`, `descending`, `none`)
are standardized state values and must not be translated. The optional table
sort phrase keys append localized copy to the column button name.

## Locale, dates and time zones

Applications select locale/time zone. Native pickers keep ISO civil-string
values while the browser owns their display. Timeline and scheduling format
with `Intl.DateTimeFormat`; scheduling keeps Gregorian civil dates. Chart
numbers use `Intl.NumberFormat`. Configure the relevant API inputs or
formatting callbacks, and format other application content in the app. See
[workflow](../WORKFLOW_COMPONENTS.md), [scheduling](../SCHEDULING_CALENDAR.md)
and [data-performance](../DATA_PERFORMANCE_COMPONENTS.md) contracts.

Providers capture overrides when the injector is created. They do not watch a
later locale mutation; create a new provider scope when changing those token
values. Update component locale inputs where available as well.

## Language and direction

Set `lang` and `dir="rtl"` on `<html>` or an ancestor of the relevant
components. Message overrides do not set direction. Logical styles and
`:dir(rtl)` follow document direction; directional icon behavior follows
[Icons](../content/ICONS.md).

Storybook `Primitives/Data Display/Pagination` → `TranslatedRtl` demonstrates
long Arabic provider strings inside a narrow RTL rail. Runtime/browser,
native-overlay and SSR boundaries are in [Support](SUPPORT.md).
