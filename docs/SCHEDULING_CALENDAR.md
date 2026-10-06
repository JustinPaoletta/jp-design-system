# Scheduling calendar (preview)

`JpSchedulingCalendar` shows appointments by day or week.
Native buttons activate appointments. The application owns details, edits,
recurrence, permissions, reminders and server data.

The `/scheduling` example includes overlapping, all-day and overnight appointments.
It also shows retry, time-zone changes and repeated clock hours.

```html
<jp-scheduling-calendar label="Team appointments" [(date)]="selectedDate" [(view)]="view" [events]="appointments" timeZone="America/New_York" locale="en-US" [today]="todayInSelectedZone" (eventActivated)="openDetails($event)" />
```

## Inputs and outputs

| API                       | Meaning                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `label`                   | This required value names the calendar region.                                                                                         |
| `date` / `dateChange`     | The required model is a Gregorian civil date, `YYYY-MM-DD`. Day view uses that date. Week view shows its week.                         |
| `events`                  | This required array contains `JpCalendarEvent` values. Each event must have a unique, non-empty ID and a non-empty title.              |
| `view` / `viewChange`     | Values are `day` or `week`. The default is `week`.                                                                                     |
| `layout` / `layoutChange` | Values are `schedule` or `agenda`. The default is `schedule`. Visible controls change the model.                                       |
| `today`                   | The application supplies today's date in the selected zone. Empty or invalid values hide Today. The component does not read the clock. |
| `timeZone`                | This value sets the Intl time zone. The default is `UTC`.                                                                              |
| `locale`                  | This value sets the Intl locale. The default is `en-US`.                                                                               |
| `weekStartsOn`            | Sunday is `0`; Saturday is `6`. The default is Monday, `1`. Values stay within that range. Non-integers use Monday.                    |
| `loading`                 | This input removes appointment buttons and shows busy/loading status.                                                                  |
| `error`                   | The application supplies failure text. The component shows an alert and retry control.                                                 |
| `eventActivated`          | This output sends the original event when its native button activates.                                                                 |
| `retry`                   | This output asks the application to load appointments again.                                                                           |

`JpCalendarEvent` has `id`, `title`, `start` and `end`.
Optional fields are `allDay` and `description`.
Timed values are ISO strings with `Z` or a numeric offset.
For example: `2026-10-05T09:00:00-04:00`.
All-day values contain dates only.

Every end is exclusive. For example,
`{ start: '2026-10-07', end: '2026-10-09', allDay: true }`
appears on October 7 and 8.

## Dates, time zones, and overlap

Timed appointments are instants. The selected locale and zone determine their
display and day through
[Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).
The browser's default zone does not change the schedule.

The component rejects:

- Local timestamps without offsets
- Invalid Gregorian dates
- Zero or negative durations
- Empty IDs or titles
- Duplicate IDs after the first valid event with that ID

A translated count identifies rejected events. Supported years are 0100–9999.
Navigation stays in that range. A date without a following day boundary shows
invalid-input feedback.

A zoned day starts at its first actual instant and ends at the next civil day.
Clock changes can produce 23-hour or 25-hour days.
Repeated clock labels include the UTC offset.
The repeated appointments occupy different elapsed-time positions.
All-day dates stay civil dates in every zone.

Historically skipped dates show invalid-input feedback.
For example, Pacific/Apia skipped December 30, 2011.
The component does not invent a 24-hour day for that date.
Date inputs and date arithmetic use the Gregorian calendar.

### Appointment positions

An event across midnight appears in each affected day.
Its visible slot stops at the day boundary.
Activation still sends the original event.
Overlapping events use equal-width lanes.
A lane becomes available at an event's exclusive end.

Short events have a minimum 2rem visible slot.
Overlap detection includes that visible size.
Short slots at the day end stay inside the day.
For slots under one elapsed hour, schedule view shows the title without secondary time text.
The accessible name and tooltip keep exact timestamps.
Agenda and mobile rows show the full time range.

Slot positions help users read the schedule.
They do not permit edits or drag movement.

### Date helpers

`buildJpCalendarLayout` returns `JpCalendarLayout`, `JpCalendarDay` and
`JpCalendarPlacement` data. `isJpCalendarDate` validates civil dates.
`addJpCalendarDays` moves through bounded Gregorian dates.
The layout helper validates zones and locales.
Invalid configuration gives an error result instead of an exception.

## Keyboard, narrow screens, and status

Calendar controls use [native buttons](https://www.w3.org/WAI/ARIA/apg/patterns/button/).
Tab moves between controls. Enter and Space activate them.
Days and appointments stay in chronological DOM order.
Each appointment name includes title, date, time range and UTC offset.
All-day names include the all-day label.

There is no composite grid role or custom arrow-key focus model.
Activation keeps focus on the native control.
The application manages focus for any details panel or dialog.

### Layout

At container widths up to 56rem, appointments use chronological agenda rows.
Titles do not truncate, and the timeline does not use horizontal scroll.
The Agenda control gives this view at any width.

Week columns have at least 12rem for each concurrent lane.
Three overlapping events use a 36rem column.
If the week is wider than its frame, scroll stays inside the frame.
Native focus scrolling reveals appointment buttons.
Day view fills the available width.

Schedule view limits the scroll frame height but keeps all appointments in the DOM.
Day headings stay fixed during scroll.
Logical inline positions follow RTL.

### States

Loading removes stale appointment buttons.
Failure shows an alert and retry control.
An empty period keeps navigation and shows a translated empty message.
A date change announces the period and unique appointment count.
An all-day or multi-day event counts once per period.

## Tokens, motion, and localization

Styles use existing semantic tokens.
There is no new palette or runtime style dependency.
There are no entrance, scroll or layout animations.
Forced-colors rules keep appointment borders and selected mode outlines visible.
Manual accessibility and Windows inspection remain necessary for approval as stable APIs.

`JP_MESSAGES.calendar` supplies navigation, modes, states, all-day labels and counts.
Use `provideJpMessages` for translations.
Its `events` and `invalidEvents` functions produce translated count sentences.
The application translates titles, descriptions, region labels and errors.
The application also calculates `today`.

## Verification and scope

Unit tests cover dates, exclusive ends, lanes, short slots, zones and clock changes.
They also cover rejected dates, translated errors, navigation, activation and retry.
Storybook shows schedule, agenda, loading, empty, error and repeated-hour states.
Chromium/WebKit tests cover navigation, activation, positions, RTL, zones, agenda and axe scans.
Both accents and densities have test coverage.
[Verification](qa/VERIFICATION.md) records results.

The component shows all supplied appointments in the period.
The named scroll frame can receive focus, including when the period is empty.
The component does not virtualize schedules or supply recurrence, resource or invitation services.
It does not convert ambiguous local input into instants.
The application expands recurrence and enforces data and permission rules before it supplies events.
These APIs remain preview until application and manual accessibility inspections finish.
