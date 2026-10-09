# Component expansion

Implemented October 4, 2026. These additions are **preview** APIs. They have
unit tests and Storybook examples; manual assistive-technology inspection remains
pending. Remaining inspection, promotion and release work is tracked in
[COMPONENT_EXPANSION_PLAN.md](../COMPONENT_EXPANSION_PLAN.md).

Explore Showcase `/component-expansion` or the corresponding `Primitives` stories.
Import public classes and types from `@jp-design-system/ui`. Styles use existing
semantic tokens and follow the containing accent/density settings.

## Foundations and navigation

| Export / selector                         | Contract                                                                                                                                                                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JpIcon` / `jp-icon`                      | Required `name: JpIconName`; `size: sm/md/lg` defaults to `lg` (16px default-density content size); `label` defaults to empty/decorative. Original outline glyphs on a 16-unit grid; chevron-right follows RTL. |
| `JpLink` / `a[jpLink]`                    | A component on a native anchor. Keep `href`, `target`, `rel`, `download`, and Angular `RouterLink` on that same anchor; content is projected.                                                                   |
| `JpDivider` / `jp-divider`                | `orientation: horizontal/vertical` defaults to horizontal. `decorative` defaults to false; semantic separators expose orientation.                                                                              |
| `JpDisclosure` / `jp-disclosure`          | Required `title`; two-way `[(open)]` defaults to false. Uses native details/summary and Enter/Space activation. Optional `name` sets native exclusive grouping.                                                 |
| `JpAccordion` / `jp-accordion`            | Required `label`; project disclosures. `multiple` defaults to false; `id` optionally supplies a stable group name. Exclusive grouping uses native details names.                                                |
| `JpKeyboardHint` / `jp-keyboard-hint`     | Required readonly `keys` array rendered with native `kbd` elements. Presentation only; applications own shortcuts.                                                                                              |
| `JpVisuallyHidden` / `[jpVisuallyHidden]` | Hides content visually while retaining it in the accessibility tree. Do not apply to interactive controls that must be visibly focusable.                                                                       |

Icon names: `check`, `close`, `search`, `chevron-down`, `chevron-right`, `plus`,
`minus`, `info`, `warning`, `user`, `copy`, and `external-link`. Glyphs are authored
in JP and distributed under the repository's MIT license; no icon package is added.
Name icon-only actions on their button and leave their icons decorative.

```html
<a jpLink [routerLink]="['/projects']">Projects</a>
<jp-accordion id="project-settings" label="Project settings">
  <jp-disclosure title="General">General settings</jp-disclosure>
  <jp-disclosure title="Advanced">Advanced settings</jp-disclosure>
</jp-accordion>
```

Import `RouterLink` from `@angular/router` alongside `JpLink` for the first example.
A disclosure title is its native summary label; it does not assign a document
heading level. Use surrounding headings to organize longer sections.

## Identity and measurements

| Export          | Contract                                                                                                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JpAvatar`      | Required non-empty `name`; optional `src`; `size: sm/md/lg` defaults to md. Failed images fall back to first/last initials; changing `src` retries the image. No image HTML is accepted.            |
| `JpAvatarGroup` | Required `label`; `people: readonly JpAvatarPerson[]`; `max` defaults to 4, with a minimum of 1. Overflow exposes hidden people by name. `overflowLabel(count)` can localize visible overflow text. |
| `JpStatusDot`   | `tone: neutral/success/warning/error/info`, default neutral. `label` names meaningful status; empty labels make it decorative. Include visible status text when color alone would be ambiguous.     |
| `JpSpinner`     | `label` defaults to localized loading text, `size` defaults to sm. `decorative=true` suppresses its status announcement. Reduced motion stops rotation.                                             |
| `JpMeter`       | Required `label`; `value=0`, `min=0`, `max=100`; optional `valueText`. Clamps values and repairs invalid bounds. Represents a measurement, not operation progress.                                  |

`JpAvatarPerson` contains `id`, `name`, and optional `src`. IDs must be unique.
Avatars are presentation; consumers can place them inside named links or buttons.
Avatar-group overflow is informational and does not implicitly open a menu.

## Structured content

| Export               | Contract                                                                                                                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JpDescriptionList`  | Required readonly `items: JpDescriptionItem[]`, each with unique `term` and string/number `description`. Native dl/dt/dd semantics; stacks at narrow widths.                                                                      |
| `JpCard`             | Optional `title`; `headingLevel` defaults to h2. Header content projects through `[jpCardHeader]`, actions through `[jpCardActions]`, and default content into the body. Native article; no implicit click or selection behavior. |
| `JpPageHeader`       | Required `title`; optional `description`; `headingLevel` defaults to h1. Slots: `[jpPageBreadcrumbs]`, `[jpPageMeta]`, `[jpPageActions]`. Actions wrap at narrow widths.                                                          |
| `JpList`             | Required readonly `items: JpListItem[]`, each with unique `id`, `title`, optional `description`/`meta`. Keeps native ul/li structure.                                                                                             |
| `JpListItemTemplate` | Optional `ng-template[jpListItem]` projects custom list content with typed `let-item` context. The list owns the li element.                                                                                                      |

```html
<jp-card title="Project" headingLevel="h2">
  <jp-description-list [items]="projectDetails" />
  <jp-button jpCardActions>Edit project</jp-button>
</jp-card>
<jp-list [items]="projects">
  <ng-template jpListItem let-item>
    <a jpLink [href]="'/projects/' + item.id">{{ item.title }}</a>
  </ng-template>
</jp-list>
```

## Forms

| Export               | Contract                                                                                                                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JpFormField`        | Required `controlId` and `label`; optional `hint`, `error`, `required`. Exposes `describedBy()` for custom controls. Hint and error can both be described.                                                  |
| `JpFieldControl`     | Apply `[jpFieldControl]` to a native input/select/textarea inside a form field. Associates its ID, descriptions, invalid and required accessibility state. `ariaDescribedBy` adds external description IDs. |
| `JpFormSection`      | Required `legend`; optional `id`, `hint`, `error`, `disabled`. Native fieldset groups projected controls.                                                                                                   |
| `JpCheckboxGroup`    | Required `label` and readonly `options: JpChoiceOption[]`. CVA value is a readonly string array. Independent native checkboxes; flat groups only.                                                           |
| `JpSegmentedControl` | Required `label` and readonly `options: JpChoiceOption[]`. CVA value is a string. Native radio group for one form value; browser radio keyboard interaction.                                                |
| `JpMultiSelect`      | Required `label` and readonly `options: JpChoiceOption[]`. CVA value is a readonly string array. Search, chips, multi-select listbox, disabled options, loading/empty states, and top-layer positioning.    |
| `JpSearchField`      | Inherits the full JpInput API; defaults to search type and `clearable=true`. Clear updates the form value and returns focus to the input.                                                                   |
| `JpPasswordField`    | Inherits the full JpInput API; defaults to password type and `revealPassword=true`. Reveal changes visibility without altering the form value.                                                              |

`JpChoiceOption` contains unique `value`, `label`, and optional `disabled`. Groups support `id`, `hint`, `error`, and `disabled`. Multi-select additionally supports `required`, `placeholder`, `loading`, `loadingText`, and `emptyText`. Unknown selected values remain in the form value and use that value as fallback chip text.

Search text never replaces the committed selection. Arrow keys move among enabled options; Home/End jump; Enter toggles; Escape/Tab dismiss. Selection does not dismiss the listbox.

All new CVA controls work with reactive forms and ngModel. Applications own
validation and submission; use Angular validators for required multi-selection
or group constraints. These group controls do not serialize selection to native
hidden form fields. Disable Angular controls/groups to change their form-model
state; `JpFormSection.disabled` only supplies native fieldset disabling.
`JpFieldControl` supplies ARIA required state; bind native `required` separately
when browser constraint validation is intended.

Existing `JpInput` also gains `ariaDescribedBy`, `clearable`, `revealPassword`,
`clearLabel`, `showPasswordLabel`, and `hidePasswordLabel`. Existing defaults
keep search clearing and password reveal off.

```html
<jp-form-field #field controlId="email" label="Email" hint="Use your work address" [error]="emailError" required>
  <jp-input id="email" type="email" formControlName="email" [ariaDescribedBy]="field.describedBy() || ''" [invalid]="!!emailError" />
</jp-form-field>
<jp-form-field controlId="project-key" label="Project key">
  <input jpFieldControl type="text" />
</jp-form-field>
<jp-checkbox-group label="Notifications" [options]="channels" formControlName="channels" />
<jp-multi-select label="Reviewers" [options]="people" formControlName="reviewers" />
```

## Feedback and overlays

| Export           | Contract                                                                                                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JpErrorSummary` | Required readonly `errors: JpFieldError[]`, each with `controlId` and `message`. Localized `title`; optional `id`. Renders only when errors exist. Public `focus()` lets submission flows move focus deliberately. Links focus the native control or the first focusable descendant of a wrapper. |
| `JpBanner`       | Required `title`; optional `message`; info/success/warning/error `tone` defaults to info. `dismissible=false`, `announce=false`. Emits `dismissed`; the consumer removes the banner. Actions project through `[jpBannerActions]`.                                                                 |
| `JpDrawer`       | Required `title`; controlled `open`/`openChange`. Logical `side: start/end/bottom` defaults to end. Localized `closeLabel`. Actions project through `[jpDrawerActions]`.                                                                                                                          |

Drawers reuse the native top-layer dialog, focus trap, nested dismissal,
backdrop handling, and focus restoration. `JpDialog.placement` now supports
`center/start/end/bottom`; its default remains center. Drawers are modal; a
persistent non-modal side panel is a separate future pattern.

Banner announcements are optional. Persistent page notices default to named
regions; dynamic announced errors use alert, other tones use status. Error
summaries do not automatically focus on every field edit; call `focus()` after
rendering a failed submission. Avoid duplicate announcements in the surrounding
application.

Additional default copy is configurable through `provideJpMessages`:
`forms.errorSummary`, `forms.clearSearch`, `forms.showPassword`,
`forms.hidePassword`, `banner.dismiss`, and `drawer.close`.

## Verification and remaining limits

- Unit suites cover forms, disabled/touched state, selection, descriptions,
  focus targets, image recovery, measurement bounds, and controlled dismissal.
- Storybook includes defaults and relevant disabled/error/loading variants.
- Showcase exercises compositions outside Storybook. Its component expansion
  route is lazy-loaded; the recipes page is also lazy-loaded to keep the initial bundle within its existing budget.
- Browser regressions cover Chromium/Firefox/WebKit keyboard flows, validation recovery,
  drawer focus, multi-selection, rendered/open-state axe checks, and mobile RTL.
- Eight macOS Chromium visual baselines cover accents/densities, mobile LTR/RTL,
  and desktop/mobile drawer layouts.
- The isolated package consumer imports every new component and compiles
  templates and form bindings from built tarballs.
- Manual screen-reader inspection and Windows forced-colors inspection remain pending.
  Native exclusive disclosure grouping uses native details-name behavior in the
  supported browser versions. SSR/hydration support is not introduced here.

## Product tools: second batch

These nine components and the inline-code directive are preview APIs owned by
JP maintainers. Showcase `/product-tools` contains a working consumer
composition; all classes and types below are exported from the UI package.

| Export / selector                       | Inputs and behavior                                                                                                                                                                                                                                                                |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JpChecklist` / `jp-checklist`          | Required `label` and readonly `items: JpChecklistItem[]`. CVA value: readonly array of **leaf IDs**. Nested native lists and checkboxes; completed count considers leaf tasks only.                                                                                                |
| `JpStepper` / `jp-stepper`              | Required `label`, readonly `steps: JpStep[]`, and `currentId`. `navigable=false`; when true, enabled native buttons emit `stepSelected(id)`. The consumer updates currentId.                                                                                                       |
| `JpNumberStepper` / `jp-number-stepper` | Required `label`. CVA value: `number \| null`. Native number field, plus/minus buttons, `min/max=null`, `step=1`, `readonly/disabled=false`, `id/name/hint/error=''`.                                                                                                              |
| `JpSlider` / `jp-slider`                | Required `label`. Numeric CVA. Same numeric inputs as number stepper; unset min/max produce 0–100. `showNumberInput=true` supplies an exact-value alternative. `valueText(value)` defaults to String(value).                                                                       |
| `JpRangeSlider` / `jp-range-slider`     | Required `label`. CVA value: readonly tuple `JpRangeValue = [number, number]`. Defaults min=0, max=100, step=1. Localizable `lowerLabel/upperLabel`; `showNumberInputs=true`; `valueText(value)`, `id/hint/error`, disabled/readonly.                                              |
| `JpTimeline` / `jp-timeline`            | Required `label` and readonly `events: JpTimelineEvent[]`. Keeps supplied order. Optional emptyText. No sorting, fetching, or live announcements.                                                                                                                                  |
| `JpOverflowChip` / `jp-overflow-chip`   | Required `label` and readonly `items: JpOverflowItem[]`. Displays +N, opens a named popover with every hidden item, closes on Escape/outside pointer, and restores focus if it was inside the closing panel. Empty items omit the action. `moreLabel(count)` localizes the action. |
| `JpCopyButton` / `jp-copy-button`       | Required plain `text`. Optional disabled and label/pendingLabel/successLabel/failureLabel. Emits copied or copyFailed after the clipboard promise settles. Prevents duplicate pending requests.                                                                                    |
| `JpCodeBlock` / `jp-code-block`         | Required plain `code` and `label`; optional language; copyable=true. Renders escaped text in pre/code, with keyboard scrolling and selectable source. No syntax highlighter dependency or HTML input.                                                                              |
| `JpInlineCode` / `code[jpInlineCode]`   | Token typography and surface on a native inline code element; project escaped text.                                                                                                                                                                                                |

Checklist item shape: unique `id`, `label`, optional `description`, `disabled`,
and readonly `children`. A parent checks all enabled descendant leaves.
Disabled descendants keep their current completion, including when a parent
toggles; a disabled parent disables its whole subtree. A parent is checked only
when every descendant leaf is complete, and mixed when some are complete.
Unknown external IDs are kept in the form value but do not count as tasks.
`summaryLabel({ completed, total })` and emptyText are localizable.

Step shape: unique `id`, `label`, optional description, disabled, and state
`upcoming/complete/error`. The current step uses aria-current=step; completed
and error states include text, with configurable completeLabel/errorLabel.
The consumer owns step validation, which steps can be visited, and asynchronous
save behavior. The Showcase wizard blocks invalid progression, focuses an
error summary, keeps values on Back, and focuses the new step heading.

Number stepper button actions align to a grid anchored at min (or zero), clamp
to bounds, and avoid visible floating-point artifacts for ordinary decimals.
From an empty value, either button starts at zero clamped to the available
bounds. Typed out-of-range values remain available for validation; clearing
produces null. Applications supply Angular required/min/max/custom validators.
Native number entry follows the browser's numeric editing rules; the component
does not parse localized grouped numbers, currencies, or units.

Sliders use native range keyboard and pointer/touch behavior. Number alternatives commit on change/blur. Display and user changes snap to the step grid anchored at min; an off-grid max resolves to the last full step. External values normalize for display without silently mutating the Angular form model.

Missing slider values display min; missing range values display the full valid interval. Reversed external range endpoints sort for display; user changes cannot cross the other endpoint. Handles remain separately labeled and tab into both controls. The range is two native tracks, not an overlapping graphical track.

Invalid bounds/steps fall back to usable defaults. Each control supports CVA disabled/touched state. Read-only slider tracks are disabled; numeric alternatives remain readable.

Timeline event shape: unique id, title, optional description, timeLabel, dateTime.
The app formats visible times with its own locale and time zone. An ISO dateTime
renders a native time element; relative labels without dateTime render text.
Overflow items contain unique id, label, and optional href; the app owns URLs
and permissions. This component does not measure row fit automatically: the
consumer supplies the items it decided to hide.

Copying uses the browser Clipboard API in a secure context. Denied or unavailable
access produces visible, polite failure feedback and lets the user try again. The library
does not request permissions, emulate clipboard writes, or claim success after
failure. Keep code selectable for manual copying. Changing text resets feedback
and suppresses stale completion. Syntax highlighting, line numbers, and executable
code demos are outside this preview API.

Use `provideJpMessages` to configure these additional message defaults:

- `checklist.completed` and `checklist.empty`
- `stepper.complete` and `stepper.error`
- `numberStepper.increase` and `numberStepper.decrease`
- `rangeSlider.lower` and `rangeSlider.upper`
- `timeline.empty`
- `copy.action`, `copy.pending`, `copy.success` and `copy.failure`
- `overflow.more`

Use `valueText` and application-formatted timeline labels for numbers and dates in the selected locale.

```html
<jp-checklist label="Release tasks" [items]="tasks" [formControl]="completed" />
<jp-number-stepper label="Seats" [min]="1" [max]="10" [formControl]="seats" />
<jp-range-slider label="Budget" lowerLabel="From" upperLabel="To" [formControl]="budget" />
<jp-code-block label="Install" language="Shell" code="npm install @jp-design-system/ui" />
```

Chromium, Firefox and WebKit tests exercise wizard recovery, native slider keys, range boundaries, nested completion and overflow focus. They include WCAG 2.1 A/AA checks for closed, open and error states. Clipboard denial/retry uses a controlled boundary in browser
tests; manual permission behavior remains browser-owned. Manual screen-reader
and physical touch-device inspection remain pending.

## Third batch — everyday workflows

Thirteen further components and `JpAnnouncer` implement the remaining everyday-product entries. See [the complete contracts](WORKFLOW_COMPONENTS.md) and [verification](qa/VERIFICATION.md). Native date/time UI, transport ownership and manual accessibility limits are explicit.
