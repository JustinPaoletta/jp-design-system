# Everyday workflow components

Thirteen preview components and `JpAnnouncer` supply the workflow APIs described here.
Showcase `/workflows` loads on demand and has a link from `/product-tools`.
Import these APIs from `@jp-design-system/ui`.

## Commands and context actions

`JpCommandPalette` displays application commands in a modal search panel.
It takes a controlled `open` value and emits `openChange`.
It accepts a flat registry of `JpCommand`.
Each command must have a stable unique `id` and a `label`.
Optional fields are `description`, `section`, `keywords`, `shortcut` and `disabled`.

Sections follow their first appearance in the registry.
Search matches labels, descriptions and keywords through the browser's locale-aware lowercase operation.
The application supplies translated text, routing, command execution and any fuzzy-search behavior.
Selection emits the command ID.
The component does not execute command code.

The palette uses `JpDialog` for dismissal, focus containment and focus restoration.
Focus starts in the search input.
Results use a combobox/listbox with an active descendant.
Pointer selection keeps input focus.

| Key        | Result                                                       |
| ---------- | ------------------------------------------------------------ |
| Arrow keys | Focus moves through enabled results and wraps at either end. |
| Home / End | Focus moves to the first or last enabled result.             |
| Enter      | The focused command is selected.                             |

`shortcutEnabled` defaults to false.
When enabled, it registers Control/Command + K and declared modifier chords while the palette is closed.
It ignores editable fields and events already handled.
`shortcut: ['Mod', 'Shift', 'D']` calls the first enabled matching command and displays those keys.
Unmodified letter keys and key sequences are not registered.

| Shortcut token | Accepted meaning or aliases |
| -------------- | --------------------------- |
| Mod            | Control or Meta             |
| Ctrl / Control | Control                     |
| Command / Meta | Meta                        |
| Option / Alt   | Alt                         |
| Shift          | Shift                       |

Set labels and shortcuts for the target platform.
Install one active palette per document.
The library does not coordinate multiple command registries or saved state.

`JpContextMenu` accepts a required `label` and `JpMenuAction[]`.
Each action must have `id` and `label`; `disabled` is optional.
Project the application region into the component.
A persistent More actions button gives touch and visible keyboard access.
Editable descendants keep their native context menus.

| Action or key              | Result                                                    |
| -------------------------- | --------------------------------------------------------- |
| Right-click                | The menu opens at the pointer.                            |
| ContextMenu / Shift + F10  | The menu opens from the focused region.                   |
| Arrow keys / Home / End    | Focus moves between enabled actions.                      |
| Single-character typeahead | Focus moves to a matching action.                         |
| Escape                     | The menu closes and focus returns to the opener.          |
| Tab                        | Focus leaves the menu.                                    |
| Outside click              | The menu closes and focus stays at the click destination. |

The top-layer helper keeps the menu inside the viewport.
Selection emits `actionSelected`.
IDs must be unique.
Nested submenus are not supported.

## Native dates and times

`JpDatePicker` and `JpTimePicker` use native controls with the existing label, hint, error and CVA behavior.
They accept id/name, required, readonly and disabled values.
They supply Angular validators through `NG_VALIDATORS`.
Changes to required/min/max/step request validation again.
The application supplies visible error text; an invalid form value does not create that text automatically.

Date values are empty strings or Gregorian `YYYY-MM-DD`, with years from 0001 to 9999.
Min/max use the same format.
Step defaults to one day and starts from min or 1970-01-01.
It accepts a positive number or `'any'`.

Invalid dates, leap days, reversed bounds, missing required values and step mismatches have explicit errors:
`date`, `dateBounds`, `minDate`, `maxDate`, `required`, `dateStep` and `stepDate`.

`JpDateRangePicker` must have a group label.
Its CVA value is `JpDateRangeValue = readonly [string, string]`.
Start/end labels use message defaults and accept overrides.
Both controls keep independently entered values, including reversed dates.
The component does not swap values or convert time zones.

Validation distinguishes `dateRange`, `dateRangeIncomplete`, `dateOrder` and `required`.
Min/max apply to both endpoints.
An optional range is empty only when both endpoints are empty.
Equal dates are allowed.

Time values are empty strings or `HH:mm[:ss[.sss]]`, from 00:00 to 23:59.
Min/max are local wall times.
Overnight intervals produce `timeBounds`; the application must model those intervals separately.
Step uses seconds, defaults to 60 and starts from min or midnight.
It accepts a positive value or `'any'`.
Time errors are `time`, `timeBounds`, `minTime`, `maxTime`, `timeStep`, `stepTime` and `required`.

The native picker interface and display order follow the user's platform and locale.
These components have no custom JP calendar grid, fixed date display format, scheduling calendar or time-zone selector.
The application controls time zones, other input formats and server-side validation.
The browser controls native keyboard and touch behavior.
The dark color scheme keeps native picker icons readable.
DOM axe and pixel baselines do not cover native dialogs.

```ts
readonly dates = new FormControl<JpDateRangeValue>(['2026-10-10', '2026-10-14']);
readonly time = new FormControl('09:00');
```

```html
<jp-date-range-picker label="Event dates" [formControl]="dates" min="2026-10-01" max="2026-10-31" required /> <jp-time-picker label="Start time" [formControl]="time" min="09:00" max="17:00" [step]="900" />
```

## File selection and upload queue

`JpFileUpload` must have a label and accepts `items: JpUploadItem[]`.
Each item must have a unique ID, a browser `File` and a status.
Status values are `ready | uploading | complete | error`.
Progress and error text are optional.

| Picker input             | Default or behavior          |
| ------------------------ | ---------------------------- |
| `accept`                 | The file type filter.        |
| `multiple`               | `true`                       |
| `maxFiles`               | `10`                         |
| `maxBytes`               | `null`, with no size limit.  |
| hint/error, id, disabled | The existing field behavior. |

Negative limits become zero.
A non-finite file count uses the default of ten.
Selection validates case-insensitive extensions, exact MIME types or MIME wildcards, size and available queue capacity.
Existing queue items count toward capacity.
Valid files emit `filesSelected`.
Rejected files emit `filesRejected: JpUploadRejection[]` and remain visible as translated errors.

One selection can include valid and rejected files.
The native input resets so the same file can be selected again.
The component creates no previews, object URLs, file-content reads, network calls, hidden drop targets or simulated progress.
The Showcase example uses local queue states and keeps files on the device.

Upload progress uses the existing progressbar.
Without a progress value, it shows indeterminate progress.
`action: JpUploadAction` emits remove, cancel or retry requests.
Cancel is available only during upload.
Retry is available only after failure.
Removal during upload is blocked.

The application controls queue updates, upload transport, cancellation, retries, duplicate files, actual progress, post-action focus and server validation.
The accept filter and client limits give feedback; they do not replace server security checks.

## Notifications and button combinations

`JpNotificationList` must have a label and accepts `JpNotification[]`.
Each notification must have a unique ID and a title.
Optional fields are description/group/unread/href/timeLabel/dateTime.
Groups follow first appearance; items keep their order within each group.
Read/unread state uses explicit text as well as color.
The component controls the All/Unread filter; the application controls item state.

Named native links keep link behavior.
Read actions emit `readChange: {id, unread}`.
Dismiss, mark-all and retry actions emit `dismissRequested`, `markAllRequested` and `retryRequested`.
Loading, error, empty and empty-unread states have separate views.

If a synchronous application update removes the focused row, focus moves to a remaining row action or the selected filter.
Focus outside the list stays in place.
The application controls remote pagination, refresh, saved state, delayed removals and custom destinations.
Showcase demonstrates dismissal with focus at the inbox region.

Announce only changes that matter to the task.
Do not announce every new notification by default.

`JpButtonGroup` names a native group of projected controls.
It supports horizontal (default) and vertical layouts.
It uses normal Tab behavior, without a toolbar or roving-tabindex contract.

`JpToggleButton` must have a stable label.
It has a boolean CVA value, `aria-pressed`, disabled state and `pressedChange` output.

`JpSplitButton` must have a primary label and emits `primary` for the main action.
It accepts alternatives as `JpMenuAction[]` and emits `actionSelected` for their selection.
The separate menu trigger uses the existing dropdown behavior, including disabled actions, Escape and focus restoration.
Without alternatives, the menu trigger is disabled.

## Inline editing and announcements

`JpInlineEdit` has a controlled string `value`/`valueChange`.
It must have a label and an asynchronous `save: JpInlineSave` callback.
The callback receives `(nextValue, AbortSignal)` and resolves only after a successful save.
Edit focuses the labeled native input.
Enter submits; Escape cancels.
Required/maxLength and an optional `validate(value) => errorText` function run before the callback.

While a save is pending, the field is readonly and duplicate submissions are blocked.
Cancel remains available.
Failure keeps the draft and focuses the field for retry.
Success emits the value and restores Edit focus.
All default action/status text accepts per-instance overrides.
An unchanged value can be saved successfully.

Cancel, external value changes, disabling and destruction abort pending work and ignore stale results.
Pass the supplied signal to the transport to cancel the underlying work.
Without that signal, cancellation cannot undo a request already accepted by a server.
When `valueChange` emits, update the controlled value.

Place one `JpLiveAnnouncer` outlet in the application.
Inject `JpAnnouncer`.
`announce(text, 'polite' | 'assertive')` clears both persistent regions.
It then inserts the message on the next short timer.
This lets repeated identical messages qualify for announcement.
The latest pending message replaces an older pending message.

`clear()` cancels the pending announcement and clears the regions.
Service destruction cancels the timer.
Actual screen-reader delivery must have manual inspection.
Use polite announcements by default.
Use assertive announcements only for urgent errors.

Place `JpSkipLink` before repeated navigation.
Give `target` as an element ID without '#'.
The native link appears on focus and moves focus/scroll to the target.
On blur or teardown, it removes only the temporary tabindex it added.
Modified clicks and missing targets keep native link behavior.
The target must exist and be focusable or accept tabindex.

Showcase includes a component example.
In an application shell, place the link at the start of the page before navigation.

All these APIs remain preview.
See [verification and inspection limits](qa/VERIFICATION.md) for browser, assistive-technology, SSR and hydration support.
