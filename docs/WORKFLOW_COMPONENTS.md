# Everyday workflow components

Thirteen preview components and the `JpAnnouncer` service complete nine more
entries in [the root task list](../COMPONENT_EXPANSION_PLAN.md).
Showcase `/workflows` is lazy-loaded and linked from `/product-tools`.
All exports are available from `@jp-design-system/ui`.

## Commands and context actions

`JpCommandPalette` takes a controlled `open` value, emits `openChange`, and
accepts a flat registry of `JpCommand`: stable unique `id`, `label`, optional
`description`, `section`, `keywords`, `shortcut`, and `disabled`.
Section order follows first appearance. Search matches label, description,
and keywords using the browser's locale-aware lowercase operation. Consumers
own translated strings, fuzzy-search requirements, routing, and execution.
Selecting a command emits its id; the component never evaluates command code.

The modal reuses `JpDialog` for dismissal, containment and focus restoration.
Focus enters the search input. Arrow keys wrap across enabled results;
Home/End jump and Enter selects. Results use a combobox/listbox with an active
descendant, and pointer selection retains input focus.

`shortcutEnabled` defaults to false. Opting in enables Control/Command + K
and declared modifier chords while closed, ignoring editable fields and
already-handled events. `shortcut: ['Mod', 'Shift', 'D']` invokes the first
enabled matching command and displays the same keys. Mod means Control or
Meta; aliases Ctrl/Control, Command/Meta, Option/Alt and Shift are accepted.
Unmodified letter keys and key sequences are not registered. Set platform
labels/shortcuts deliberately and install one active palette per document;
the library does not arbitrate multiple command registries or persistence.

`JpContextMenu` accepts a required `label` and `JpMenuAction[]`
(`id`, `label`, optional `disabled`). Project the contextual region.
Right-click opens at the pointer; ContextMenu or Shift + F10 opens from
the focused region. A persistent, labelled More actions button supplies
touch and visible keyboard access. Editable descendants keep native context
menus. Menus stay inside the viewport via the existing top-layer positioning
helper, skip disabled actions, support arrows/Home/End and single-character
typeahead, and emit `actionSelected`. Escape restores the invoker. Tab exits;
outside clicks preserve their destination's focus. Nested submenus are out
of scope. IDs must be unique.

## Native dates and times

`JpDatePicker` and `JpTimePicker` preserve the existing input label/hint/error,
id/name, required, readonly/disabled and CVA contract. They add Angular
validators through `NG_VALIDATORS`; changing required/min/max/step requests
revalidation. Visual error strings remain consumer-owned; an invalid form
value does not automatically invent a sentence.

Date values are empty strings or Gregorian `YYYY-MM-DD`, years 0001–9999.
Min/max use the same strings. Invalid dates, leap days, reversed bounds,
missing required values and step mismatches have explicit errors
(`date`, `dateBounds`, `minDate`, `maxDate`, `required`, `dateStep`,
`stepDate`). Step defaults to one day, is anchored to min or 1970-01-01,
and accepts a positive number or `'any'`.

`JpDateRangePicker` takes a required group label and has a
`JpDateRangeValue = readonly [string, string]` CVA value. Start/end labels
default to localized messages and can be overridden. Both native controls
retain independently entered values, including invalid ordering; there is
no automatic swapping or timezone conversion. Validation distinguishes
`dateRange`, `dateRangeIncomplete`, `dateOrder` and `required`.
Min/max are common to both endpoints. An optional range is empty only when
both endpoints are empty. Dates may be equal.

Time values are empty strings or `HH:mm[:ss[.sss]]` in the 00:00–23:59 range.
Min/max are local wall times; overnight intervals are rejected as
`timeBounds` and must be modeled by the product. Step is seconds, defaults
to 60, is anchored to min or midnight, and accepts positive values or
`'any'`. Errors include `time`, `timeBounds`, `minTime`, `maxTime`,
`timeStep`, `stepTime` and `required`.

Browser-native picker UI and display order follow the user's platform and
locale; these components do not offer a custom JP calendar grid, a fixed
date display format, scheduling calendar, or time-zone selector.
Time zones, parsing other formats and server-side validation belong to the
consumer. On supported native pickers, keyboard and touch operation remain
browser-owned; the dark color scheme keeps native picker icons legible.
Native dialogs are not covered by DOM axe or pixel baselines.

```ts
readonly dates = new FormControl<JpDateRangeValue>(['2026-10-10', '2026-10-14']);
readonly time = new FormControl('09:00');
```

```html
<jp-date-range-picker label="Event dates" [formControl]="dates" min="2026-10-01" max="2026-10-31" required /> <jp-time-picker label="Start time" [formControl]="time" min="09:00" max="17:00" [step]="900" />
```

## File selection and upload queue

`JpFileUpload` requires a label and accepts `items: JpUploadItem[]`.
Each item has a unique id, a browser `File`, a status
(`ready | uploading | complete | error`), optional progress and error text.
The picker accepts `accept`, `multiple` (true), `maxFiles` (10),
`maxBytes` (null/unlimited), hint/error, id, and disabled. Negative limits
are clamped to zero; a non-finite file count falls back to ten.

Selection validates case-insensitive extensions, exact MIME types or MIME
wildcards, size, and remaining capacity including existing queue items.
Valid files emit `filesSelected`; rejected files emit
`filesRejected: JpUploadRejection[]` and stay visible as translated errors.
Valid and rejected files can coexist in one selection. The native input
resets so the same file can be selected again. No previews, object URLs,
file-content reads, network calls, hidden drop targets or fake progress
are created.

Upload progress uses the existing progressbar, including indeterminate
progress when omitted. `action: JpUploadAction` emits remove/cancel/retry
intents; cancel exists only while uploading, retry only after failure,
and removal while uploading is blocked. The consuming product owns queue
updates, upload transport, cancellation, retries, deduplication, actual
progress, post-action focus and server validation. The accept filter and
client limits are user feedback, not a server security boundary.
The Showcase example uses local queue states and explicitly keeps files
on the device.

## Notifications and button combinations

`JpNotificationList` requires a label and accepts `JpNotification[]`
with unique id, title, optional description/group/unread/href/timeLabel/dateTime.
Groups preserve first appearance; items preserve order within each group.
Read/unread state is explicit text rather than color alone. The All/Unread
filter is internal; item state stays consumer-owned. Named native links
remain links.

Read actions emit `readChange: {id, unread}`; dismiss, mark-all and retry
emit `dismissRequested`, `markAllRequested` and `retryRequested`.
Loading, error, empty and empty-unread views are distinct. Do not send a
live announcement for every arriving notification by default; announce
only meaningful changes for the product. The component recovers focus to
a remaining row action or selected filter when a synchronous controlled
update removes its focused row, and preserves outside focus.
Consumers manage remote pagination, refresh, persistence, delayed removals,
and custom destinations. The Showcase demonstrates dismissal to the inbox region.

`JpButtonGroup` names a native group and wraps projected controls; horizontal
(default) and vertical layouts are supported. It uses normal Tab behavior,
not a toolbar or roving-tabindex contract.
`JpToggleButton` has a stable required label, boolean CVA value,
`aria-pressed`, disabled state and `pressedChange` output.
`JpSplitButton` has a required primary label, `primary` output, alternatives
as `JpMenuAction[]`, and `actionSelected` output. Its separate menu trigger
uses the existing dropdown behavior, including disabled action handling,
Escape and focus restoration. With no alternatives, the trigger is disabled.

## Inline editing and announcements

`JpInlineEdit` has a controlled string `value`/`valueChange`, required label
and required async `save: JpInlineSave` callback. The callback receives
`(nextValue, AbortSignal)` and resolves only after a successful save.
Edit focuses the labelled native input; Enter submits and Escape cancels.
Required/maxLength and an optional `validate(value) => errorText` hook run
before the callback. Pending work makes the field readonly and blocks
duplicate submits while retaining Cancel. Failure preserves the draft and
focuses the field for retry. Success emits the value and restores Edit focus.
All default action/status text has per-instance overrides.

Cancel, external value changes, disabling and destruction abort pending
work and suppress stale success/failure. Consumers must pass the supplied
signal to their transport to cancel underlying work; ignoring it cannot
undo a request already accepted by a server. Update the controlled value
when `valueChange` emits. A successful save of an unchanged value is allowed.

Place one `JpLiveAnnouncer` outlet in the app and inject `JpAnnouncer`.
`announce(text, 'polite' | 'assertive')` clears both persistent regions
before reinserting the message on the next short timer, so repeated
identical messages are eligible for announcement. The latest pending
message replaces an older pending one. `clear()` cancels/clears; service
destruction cancels the timer. Actual screen-reader delivery still needs
manual review. Default to polite; reserve assertive for urgent errors.

Place `JpSkipLink` before repeated navigation; provide `target` as an element
id without '#'. The native link appears on focus, moves focus/scroll to the
target, and removes only the temporary tabindex it added, on blur or teardown.
Modified clicks and missing targets keep native link behavior. The target
must exist and be focusable or support tabindex. The Showcase page includes
a component example; consuming app shells should install the link at the
start of their page, ahead of navigation.

All these APIs remain preview. See [verification and review limits](qa/WORKFLOWS.md)
before claiming browser, assistive-technology, SSR or hydration support.
