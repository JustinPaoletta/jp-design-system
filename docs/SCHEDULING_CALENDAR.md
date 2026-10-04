# Scheduling calendar (preview)

`JpSchedulingCalendar` renders appointments in day or week views. Native buttons activate events; the consumer owns event details, editing, recurrence, permissions, reminders, and backend synchronization. The `/scheduling` showcase includes three overlapping appointments, a two-day release, overnight maintenance, loading/retry states, time-zone switching, and a repeated-hour example.

```html
<jp-scheduling-calendar label="Team appointments" [(date)]="selectedDate" [(view)]="view" [events]="appointments" timeZone="America/New_York" locale="en-US" [today]="todayInSelectedZone" (eventActivated)="openDetails($event)" />
```

## Inputs and outputs

| API                       | Meaning                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `label`                   | Required accessible name of the calendar region.                                                                                   |
| `date` / `dateChange`     | Required controlled Gregorian civil date, `YYYY-MM-DD`. Day view uses that date; week view starts on its containing week.          |
| `events`                  | Required readonly array of `JpCalendarEvent`. Supply stable, unique nonempty IDs and titles.                                       |
| `view` / `viewChange`     | `day` or `week`; default `week`.                                                                                                   |
| `layout` / `layoutChange` | `schedule` or `agenda`; default `schedule`. The visible controls change this model.                                                |
| `today`                   | Consumer-supplied civil date in the selected time zone. Empty/invalid hides the Today button. The component never reads the clock. |
| `timeZone`                | Explicit Intl time zone; default `UTC`.                                                                                            |
| `locale`                  | Explicit Intl locale; default `en-US`.                                                                                             |
| `weekStartsOn`            | Gregorian weekday number, Sunday `0` through Saturday `6`; default Monday `1`. Values clamp and nonintegers fall back to Monday.   |
| `loading`                 | Removes appointment controls and exposes busy/loading status.                                                                      |
| `error`                   | Consumer-supplied failure text; renders an alert and retry control.                                                                |
| `eventActivated`          | Emits the original event when its native button is activated.                                                                      |
| `retry`                   | Requests that the consumer reload appointments.                                                                                    |

`JpCalendarEvent` has `id`, `title`, `start`, `end`, optional `allDay`, and optional consumer-owned `description`. Timed events require ISO strings with an explicit `Z` or numeric offset, such as `2026-10-05T09:00:00-04:00`. All-day events require date-only values. Every end is exclusive: `{ start: '2026-10-07', end: '2026-10-09', allDay: true }` appears on October 7 and 8.

## Dates, time zones, and overlap

Timed appointments are instants. Formatting and day membership use the supplied time zone through [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), with explicit locale and zone. The browser's default time zone cannot silently change the schedule. Local timestamps without offsets, invalid Gregorian dates, zero/negative durations, empty IDs/titles, and duplicate IDs are rejected with a visible localized count; the first valid occurrence of an ID wins. Dates from years 0100 through 9999 are supported, with navigation bounded to that range; a date without a following day boundary displays invalid-input feedback.

A zoned day starts at its first actual instant and ends at the next civil day boundary. Spring and autumn clock changes therefore produce 23- and 25-hour schedules where applicable. Repeated local clock labels include the UTC offset on appointments, and the two occurrences occupy different elapsed-time positions. All-day dates remain civil dates regardless of the selected zone. Historically skipped dates, such as December 30, 2011 in Pacific/Apia, produce invalid-input feedback rather than a fabricated 24-hour day. Consumer-supplied civil dates and calendar arithmetic use the Gregorian calendar.

Cross-midnight events appear in each intersected day, clipped to that day's timeline. Activation still emits the original event. Collision groups use equal-width lanes and release lanes at exclusive ends. A short event receives a minimum 2rem visual slot; collision detection includes that display footprint, and end-of-day short slots stay inside the day. Slots shorter than one elapsed hour preserve a readable title line and omit the secondary visible time in schedule mode. Exact timestamps remain available in the accessible name and tooltip; agenda and mobile rows restore the full visible time range. Display positions are a presentation aid, not an editing or drag-to-reschedule contract.

The exported pure helper `buildJpCalendarLayout` returns `JpCalendarLayout`, `JpCalendarDay`, and `JpCalendarPlacement` data. `isJpCalendarDate` and `addJpCalendarDays` provide strict civil-date validation and bounded Gregorian navigation. The helper validates time zones/locales and reports invalid configuration without throwing.

## Keyboard, narrow screens, and status

Navigation, mode changes, retries, and appointments are [native button interactions](https://www.w3.org/WAI/ARIA/apg/patterns/button/): Tab moves through controls; Enter or Space activates them. Days and appointments retain chronological DOM order, and every appointment name contains its title, visible date, and offset-bearing time range. All-day appointment names include the all-day label. There is no composite grid role or custom arrow-key focus model. Focus remains on native controls after activation; consumer-owned details should use the appropriate inline or dialog focus pattern.

At calendar container widths of 56rem or less, appointments become readable chronological agenda rows, without horizontal timeline scrolling or truncated titles. The Agenda control provides the same presentation at any width. Dense schedules can use agenda rows to read full titles and times. Week columns reserve at least 12rem per concurrent appointment lane: three overlapping events give that day a 36rem minimum column. If a week needs more space, horizontal scrolling stays inside the calendar frame, and native focus scrolling reveals appointment buttons as users tab through them. Day view fills the available width. In schedule mode, the scroll frame bounds long days while preserving every appointment in the DOM. Day headings remain sticky, and collision placement uses logical inline positions for RTL.

Loading removes stale appointment buttons; errors expose an alert and Retry output; empty periods keep navigation and display a localized empty message. Changing the date announces the period and the unique appointment count. An all-day or multi-day appointment is counted once per period.

## Tokens, motion, and localization

Styles use existing foreground, surface, border, focus, spacing, typography, radius, and control-size tokens. No palette or runtime styling dependency is added. There are no entrance, scroll, or reflow animations. Forced-colors styles preserve appointment borders and pressed mode outlines. Manual assistive-technology and forced-colors review remains part of maturity promotion.

`JP_MESSAGES.calendar` supplies previous/next/today, day/week, schedule/agenda, empty/loading/invalid/failure/retry, all-day, count, and rejected-event copy. Provide translations with `provideJpMessages`; `events` and `invalidEvents` are functions so translations can reorder counts. Event titles/descriptions, accessible region label, consumer errors, and today-date calculation belong to the consumer.

## Verification and scope

Unit coverage exercises strict dates, exclusive boundaries, lanes, short slots, zones, repeated/skipped dates, 23/25-hour days, localized diagnostics, model navigation, activation, retry, and example composition. Storybook includes day/week, agenda, empty/loading/error, navigation, and repeated-hour states. Browser cases cover Chromium/WebKit navigation, activation, actual lane geometry, RTL, time-zone conversion, responsive agenda, retry, and axe checks across both accents and densities. Root integration runs these targets against the complete feature batch.

The component renders all supplied appointments for the period. Its scroll frame is a named, keyboard-focusable region even for empty periods, so native keyboard scrolling remains available without appointment descendants. It does not virtualize large schedules, implement recurrence rules, manage resources, edit invitations, resolve ambiguous local input into instants, or supply a calendar service. Consumers should expand recurrence and enforce data/permission rules before passing events. APIs remain preview until consumer and manual accessibility reviews are complete.
