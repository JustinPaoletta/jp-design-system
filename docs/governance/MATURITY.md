# Maturity

Support level for every public export in `libs/ui/src/index.ts` and for the
`@jp-design-system/tokens` package entries.

Inventory date: October 4, 2026. Owner for every row: **JP maintainers**.
The repository does not name a per-component owner.

Evidence rule used here:

- A rendered `jp-*` component is `stable` only when a unit spec and a Storybook
  story both exist, and this file does not record a preview gap.
- A behavior directive may be `stable` with a unit spec and no standalone story
  when a host story already mounts it. `JpFocusTrap` is that case: `focus-trap.spec.ts`
  covers it, and dialog stories mount it.
- Token helpers and generated CSS are `stable` when a unit spec or
  `npm run tokens:check` covers them.
- An export with neither a spec nor a story is not `stable`.

`preview` in this file means a recorded gap. Those classes still have a spec
and a story.

---

## Levels

### experimental

Public, and allowed to change or disappear in any pre-1.0 release. A changelog
note is still required if a consumer could have imported it. The deprecation
window in [COMPATIBILITY.md](./COMPATIBILITY.md) does not apply until the export
is promoted.

Use this level when a spec or a story is missing, or when the API is still being
proven. **Count today: 0.**

### preview

Supported for product use. Spec and story exist. Breaking changes follow the
deprecation window.

Use this level when the library itself withholds a behavior claim, or when
user-visible copy is fixed in the template and is not an input.

### stable

The supported contract. Spec and story exist for visual classes. Defaults and
limitations in [PRIMITIVES.md](../PRIMITIVES.md) are the API. Pre-1.0 breaks
still follow [COMPATIBILITY.md](./COMPATIBILITY.md).

### deprecated

Scheduled for removal under the window in [COMPATIBILITY.md](./COMPATIBILITY.md).
Still exported. Do not use it in new templates.

---

## Summary

Public **classes** (components, directives, services) from `libs/ui/src/index.ts`:

| Maturity     | Classes |
| ------------ | ------: |
| stable       |      36 |
| preview      |      74 |
| experimental |       0 |
| deprecated   |       1 |
| **Total**    | **111** |

Token package design entries (`libs/tokens/package.distribution.json`):

| Maturity     | Entries |
| ------------ | ------: |
| stable       |       4 |
| preview      |       0 |
| experimental |       0 |
| deprecated   |       0 |

The four token entries are `.`, `./tokens.css`, `./tokens.compact.css`, and
`./tokens.json`. `./package.json` is package metadata, not a token API.

Supporting consts, functions, and types are listed below. They share the
maturity of the class or package entry they belong to. Tooltip placement types
and `JpComboboxOption` / `JpTableFilter` are `preview`. The shared layout,
type, control, toast, and assistant vocabulary is `stable`.

---

## Stable classes

Limitations are boundaries already in the source or in
[PRIMITIVES.md](../PRIMITIVES.md). They are not unfinished tests.

| Export               | Spec                         | Story                                       | Limitation                                                                                                                                                                                                                                     |
| -------------------- | ---------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JpBox`              | `box.spec.ts`                | `box.stories.ts`                            | Padding and max-width only. No border or background.                                                                                                                                                                                           |
| `JpStack`            | `stack.spec.ts`              | `stack.stories.ts`                          | Vertical flex only.                                                                                                                                                                                                                            |
| `JpInline`           | `inline.spec.ts`             | `inline.stories.ts`                         | `wrap` defaults to `true`.                                                                                                                                                                                                                     |
| `JpGrid`             | `grid.spec.ts`               | `grid.stories.ts`                           | Columns are `1`, `2`, `3`, `4`, `6`.                                                                                                                                                                                                           |
| `JpSurface`          | `surface.spec.ts`            | `surface.stories.ts`                        | Elevation is token tone, not a heavy shadow.                                                                                                                                                                                                   |
| `JpText`             | `text.spec.ts`               | `text.stories.ts`                           | `as` and `size` are independent. Truncation needs a bounded container.                                                                                                                                                                         |
| `JpHeading`          | `heading.spec.ts`            | `heading.stories.ts`                        | No `size` input. Level sets tag and scale.                                                                                                                                                                                                     |
| `JpAppShellNavItem`  | `app-shell-nav-item.spec.ts` | `app-shell-nav-item.stories.ts`             | `href` null on an anchor falls back to `#`. Disabled is non-interactive. Icon slot `[jpAppShellNavIcon]` is not its own class. Also exports `JP_APP_SHELL_NAV_ITEM_TAGS`, `JpAppShellNavItemTag`.                                              |
| `JpButton`           | `button.spec.ts`             | `button.stories.ts`                         | Not a CVA control. `loadingLabel` defaults to `Loading` and is an input.                                                                                                                                                                       |
| `JpIconButton`       | `icon-button.spec.ts`        | `icon-button.stories.ts`                    | `ariaLabel` is required. Glyph is projected.                                                                                                                                                                                                   |
| `JpInput`            | `input.spec.ts`              | `input.stories.ts`                          | CVA value is `string`. Generated id uses a module counter (`jp-input-N`). Pass `id` when a stable id is required. SSR is not a current contract.                                                                                               |
| `JpTextarea`         | `textarea.spec.ts`           | `textarea.stories.ts`                       | Same id counter pattern as input (`jp-textarea-N`).                                                                                                                                                                                            |
| `JpSelect`           | `select.spec.ts`             | `select.stories.ts`                         | Native `<select>`. Also exports `JpSelectOption`. Id counter `jp-select-N`.                                                                                                                                                                    |
| `JpCheckbox`         | `checkbox.spec.ts`           | `checkbox.stories.ts`                       | `indeterminate` sets the native mixed state. The form value stays boolean.                                                                                                                                                                     |
| `JpSwitch`           | `switch.spec.ts`             | `switch.stories.ts`                         | `role="switch"`. Id counter `jp-switch-N`.                                                                                                                                                                                                     |
| `JpRadioGroup`       | `radio-group.spec.ts`        | `radio-group.stories.ts`                    | Native radios. Also exports `JpRadioOption`. Id counter `jp-radio-group-N`. Disabled options cannot be selected.                                                                                                                               |
| `JpBadge`            | `badge.spec.ts`              | `badge.stories.ts`                          | Presentational. Not a button.                                                                                                                                                                                                                  |
| `JpEmptyState`       | `empty-state.spec.ts`        | `empty-state.stories.ts`                    | Host is `role="status"`. Icon slot `[jpEmptyStateIcon]` is not its own class.                                                                                                                                                                  |
| `JpTable`            | `table.spec.ts`              | `table.stories.ts`                          | Does not sort, filter, or fetch. Consumers own rows. `sort` cycles asc → desc → null. Also exports `JpTableCellDef`, `JpTableRowKey`, `JpTableSort`, `JpSortableTableColumn`, `JpTableCellContext`. Cell template: `ng-template[jpTableCell]`. |
| `JpTableCellDef`     | `table.spec.ts`              | `table.stories.ts`                          | Directive on `ng-template[jpTableCell]`.                                                                                                                                                                                                       |
| `JpToast`            | `toast.spec.ts`              | `toast.stories.ts`                          | Presentational `role="status"`.                                                                                                                                                                                                                |
| `JpToastOutlet`      | `toast.spec.ts`              | `toast.stories.ts`                          | Place once near the app root.                                                                                                                                                                                                                  |
| `JpToastService`     | `toast.spec.ts`              | `toast.stories.ts`                          | `providedIn: 'root'`. Auto-dismiss uses `window.setTimeout` (default 4000ms) and is skipped when `window` is undefined. `clear()` exists.                                                                                                      |
| `JpSkeleton`         | `skeleton.spec.ts`           | `skeleton.stories.ts`                       | Decorative `aria-hidden`. The app sets `aria-busy` and a status.                                                                                                                                                                               |
| `JpProgress`         | `progress.spec.ts`           | `progress.stories.ts`                       | `role="progressbar"`. `value` null is indeterminate. `label` defaults to `Loading` and is an input.                                                                                                                                            |
| `JpInlineAlert`      | `inline-alert.spec.ts`       | `inline-alert.stories.ts`                   | Error is `role="alert"`; other tones are `role="status"`. The app owns retry. Also exports `JP_INLINE_ALERT_TONES`, `JpInlineAlertTone`.                                                                                                       |
| `JpTabs`             | `tabs.spec.ts`               | `tabs.stories.ts`                           | Manual activation. Inactive panels stay instantiated. Horizontal arrows follow RTL. Id counter `jp-tabs-N`. Also exports `JpTab`.                                                                                                              |
| `JpTabPanel`         | `tabs.spec.ts`               | `tabs.stories.ts`                           | `ng-template[jpTabPanel]`.                                                                                                                                                                                                                     |
| `JpBreadcrumbs`      | `breadcrumbs.spec.ts`        | `breadcrumbs.stories.ts`                    | The last item is always current-page text. Also exports `JpBreadcrumb`.                                                                                                                                                                        |
| `JpAssistantService` | `assistant.spec.ts`          | `assistant.stories.ts`                      | No network, persistence, or Markdown. Plain text only. Also exports `JpAssistantResponseStatus`, `JpAssistantResponseMessage`.                                                                                                                 |
| `JpAssistantTrigger` | `assistant.spec.ts`          | `assistant.stories.ts`                      | Attribute `[jpAssistantTrigger]`. Opens through the service.                                                                                                                                                                                   |
| `JpAssistantPanel`   | `assistant.spec.ts`          | `assistant.stories.ts`                      | Label defaults (`JP Assistant`, `Send`, `Stop response`, and the others in [PRIMITIVES.md](../PRIMITIVES.md)) are inputs. Desktop dock, mobile scrim. Composer id uses a module counter.                                                       |
| `JpFocusTrap`        | `focus-trap.spec.ts`         | Used by dialog stories; no standalone story | Attribute `[jpFocusTrap]`. Tab moves programmatically because WebKit can skip buttons. Also exports `JP_FOCUSABLE_SELECTOR`, `getFocusableElements`, `focusFirstElement`, `trapTabKey`.                                                        |
| `JpPagination`       | `pagination.spec.ts`         | `pagination.stories.ts`                     | Built-in labels and summaries come from `JP_MESSAGES`. `label` still overrides the nav name. The consumer owns fetching.                                                                                                                       |
| `JpTableToolbar`     | `table-toolbar.spec.ts`      | `table-toolbar.stories.ts`                  | Built-in copy comes from `JP_MESSAGES`. Slots `[jpTableSearch]`, `[jpTableFilters]`, `[jpTableActions]`, `[jpTableBulkActions]` are not exported directives. Also exports `JpTableFilter`.                                                     |
| `JpAssistantMessage` | `assistant.spec.ts`          | `assistant.stories.ts`                      | Role names come from `JP_MESSAGES.assistant.roles`. `messageRole` is intentionally not the HTML `role` attribute. Content is interpolated plain text.                                                                                          |

Paths sit under `libs/ui/src/lib/primitives/` unless noted. `JpFocusTrap` is
under `primitives/shared/`.

---

## Preview classes

Each row has a spec and a story. The gap is why it is not `stable`.

| Export               | Spec                    | Story                      | Why preview                                                                                                                                                                                                                                                                                                                                                  |
| -------------------- | ----------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `JpAppShell`         | `app-shell.spec.ts`     | `app-shell.stories.ts`     | Chrome strings come from `JP_MESSAGES`. The mobile query is the literal `(max-width: 48rem)` in `app-shell.ts`, parallel to `--jp-layout-shell-mobile-max`, not read from the token. `sidebarId` is the fixed string `jp-app-shell-sidebar` (two shells on one page collide). Slots `[jpAppShellSidebar]` and `[jpAppShellMain]` are selectors, not classes. |
| `JpDialog`           | `dialog.spec.ts`        | `dialog.stories.ts`        | Native `<dialog>` and `showModal()`. The spec covers backdrop dismissal, the `cancel` event, and `showModal` races. [PRIMITIVES.md](../PRIMITIVES.md) states that browsers without the native top layer use a fallback and that full clipping and inert parity is not claimed. `titleId` is `Math.random()` and there is no id input.                        |
| `JpDialogActions`    | `dialog.spec.ts`        | `dialog.stories.ts`        | Slot directive `[jpDialogActions]`. Same support boundary as `JpDialog`.                                                                                                                                                                                                                                                                                     |
| `JpPopover`          | `popover.spec.ts`       | `popover.stories.ts`       | Positioning goes through `positionOverlay`, which sets `popover="manual"` and falls back to fixed coordinates if `showPopover` fails. Same parity limit as dialog. `contentId` is `Math.random()`.                                                                                                                                                           |
| `JpPopoverTrigger`   | `popover.spec.ts`       | `popover.stories.ts`       | `[jpPopoverTrigger]`.                                                                                                                                                                                                                                                                                                                                        |
| `JpPopoverContent`   | `popover.spec.ts`       | `popover.stories.ts`       | `[jpPopoverContent]` with `role="region"`.                                                                                                                                                                                                                                                                                                                   |
| `JpDropdownMenu`     | `dropdown-menu.spec.ts` | `dropdown-menu.stories.ts` | Same native popover positioning. `menuId` is `Math.random()`.                                                                                                                                                                                                                                                                                                |
| `JpDropdownTrigger`  | `dropdown-menu.spec.ts` | `dropdown-menu.stories.ts` | `[jpDropdownTrigger]`, `aria-haspopup="menu"`.                                                                                                                                                                                                                                                                                                               |
| `JpDropdownMenuItem` | `dropdown-menu.spec.ts` | `dropdown-menu.stories.ts` | `button[jpDropdownMenuItem]`. Enter and Space use native button activation.                                                                                                                                                                                                                                                                                  |
| `JpTooltip`          | `tooltip.spec.ts`       | `tooltip.stories.ts`       | Same `positionOverlay` path. Shows on pointer enter and focus; Escape dismisses. `aria-describedby` is added while open. Id uses an incrementing counter. Also uses `JP_TOOLTIP_PLACEMENTS` and `JpTooltipPlacement` (defined in `primitive-types.ts`, maturity follows this row).                                                                           |
| `JpCombobox`         | `combobox.spec.ts`      | `combobox.stories.ts`      | List popup uses `positionOverlay`. Filtering is local; the app owns async loading. `open`, `query`, and `activeIndex` are not inputs. Placeholder, loading, and empty strings are inputs. Also exports `JpComboboxOption`. Id counter `jp-combobox-N`.                                                                                                       |
| `JpChip`             | `chip.spec.ts`          | `chip.stories.ts`          | Removable filter. The remove name is `JP_MESSAGES.chip.remove`. Also exports `JP_CHIP_SIZES` and `JpChipSize`. Not yet listed in [PRIMITIVES.md](../PRIMITIVES.md). Showcase filters still use secondary buttons.                                                                                                                                            |

---

## Deprecated

| Export | Spec                                                         | Story | Removal                                                                                                    |
| ------ | ------------------------------------------------------------ | ----- | ---------------------------------------------------------------------------------------------------------- |
| `Ui`   | `libs/ui/src/lib/ui/ui.spec.ts` (creates the component only) | none  | Stays exported. Selector `lib-ui`. Removal version unassigned. See [COMPATIBILITY.md](./COMPATIBILITY.md). |

`libs/ui/src/index.ts` re-exports it with `@deprecated`. The replacement is the
layout and typography primitives.

---

## Stable supporting exports

Defined in `libs/ui/src/lib/primitives/shared/primitive-types.ts` and
`token-maps.ts`, both re-exported from `libs/ui/src/index.ts`. Specs:
`token-maps.spec.ts` plus the component specs that consume the unions. No
standalone stories; these are not visual components.

Const and type pairs: `JP_SPACE_TOKENS`, `JpSpaceToken`, `JP_RADIUS_TOKENS`,
`JpRadiusToken`, `JP_LAYOUT_TAGS`, `JpLayoutTag`, `JP_BOX_MAX_WIDTHS`,
`JpBoxMaxWidth`, `JP_ALIGN_ITEMS`, `JpAlignItems`, `JP_JUSTIFY_CONTENT`,
`JpJustifyContent`, `JP_GRID_COLUMNS`, `JpGridColumns`, `JP_GRID_MODES`,
`JpGridMode`, `JP_GRID_MIN_COLUMNS`, `JpGridMinColumn`, `JP_SURFACE_TONES`,
`JpSurfaceTone`, `JP_BORDER_TONES`, `JpBorderTone`, `JP_ELEVATION_TOKENS`,
`JpElevationToken`, `JP_TEXT_TAGS`, `JpTextTag`, `JP_TEXT_SIZES`, `JpTextSize`,
`JP_TEXT_TONES`, `JpTextTone`, `JP_FONT_WEIGHTS`, `JpFontWeight`,
`JP_HEADING_TAGS`, `JpHeadingTag`, `JP_CONTROL_SIZES`, `JpControlSize`,
`JP_BUTTON_VARIANTS`, `JpButtonVariant`, `JP_BUTTON_TYPES`, `JpButtonType`,
`JP_INPUT_TYPES`, `JpInputType`, `JP_BADGE_TONES`, `JpBadgeTone`,
`JP_BADGE_SIZES`, `JpBadgeSize`, `JP_TABLE_ALIGNS`, `JpTableAlign`,
`JpTableCellValue`, `JpTableColumn`, `JP_TOAST_TONES`, `JpToastTone`,
`JpToastOptions`, `JpToastItem`, `JP_ASSISTANT_MESSAGE_ROLES`,
`JpAssistantMessageRole`, `JpAssistantContext`, `JpAssistantMessageItem`,
`JpAssistantOpenOptions`, `JpAssistantAddMessageOptions`.

`JP_TOOLTIP_PLACEMENTS` and `JpTooltipPlacement` are the exception: `preview`,
with `JpTooltip`.

Token-map functions (`token-maps.spec.ts`): `createStringUnionTransform`,
`createOptionalStringUnionTransform`, `createNumberUnionTransform`,
`spaceTokenToCssVar`, `radiusTokenToCssVar`, `maxWidthToCssVar`,
`alignItemsToCssValue`, `justifyContentToCssValue`, `surfaceToneToCssVar`,
`borderToneToCssValue`, `elevationToCssVar`, `textToneToCssVar`,
`textSizeToCssVar`, `headingLevelToCssVar`, `fontWeightToCssVar`,
`gridMinColumnToCssVar`, `controlSizeToCssVar`.

---

## Token package

Source catalog: `libs/tokens/README.md`. Consumer entry map:
`libs/tokens/package.distribution.json`. Specs: `libs/tokens/src/lib/tokens.spec.ts`
and `libs/tokens/src/lib/token-build-script.spec.ts`.

| Entry                  | Maturity | What consumers get                                                                                                                                                                                                                                                                                   | Limitation                                                                                |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `.`                    | stable   | `JP_ACCENT_ATTRIBUTE`, `JP_DENSITY_ATTRIBUTE`, `JP_ACCENT_FAMILIES`, `JpAccentFamily`, `JP_DENSITY_MODES`, `JpDensityMode`, `JP_DEFAULT_ACCENT` (`neon`), `JP_DEFAULT_DENSITY` (`default`), `JP_GENERATED_TOKEN_FILES`, `getAccentSelector`, `getDensitySelector`, `isAccentFamily`, `isDensityMode` | Helpers do not touch the DOM and do not inject CSS.                                       |
| `./tokens.css`         | stable   | `:root` semantic variables, `data-jp-accent="neon"`, `data-jp-accent="cobalt"`, and compact overrides                                                                                                                                                                                                | Dark-first. No light component theme. The Storybook light stage is a mat behind the page. |
| `./tokens.compact.css` | stable   | Compact overrides alone                                                                                                                                                                                                                                                                              | Does not replace `tokens.css`.                                                            |
| `./tokens.json`        | stable   | Resolved token document, including primitive palettes and semantic aliases                                                                                                                                                                                                                           | Renaming a JSON key is a break. UI code must keep using semantic CSS variables.           |

Semantic groups in the token README (shell, button, field, selection, badge,
table, overlay, tooltip, toast, assistant, typography, z-index) are part of the
`stable` CSS entry. Empty state has no dedicated color tokens; it reuses surface
and foreground tokens.

Accent families: `neon` (default), `cobalt`. Density: `default`, `compact`
under `data-jp-density="compact"`.

---

## Not public

These exist in the repo and are not exports of `libs/ui/src/index.ts`:

- `registerOverlay`, `claimOverlayEvent`, `positionOverlay`
- Composition stories (`controls-form`, `data-display`, `feedback-overlays`,
  `layout-dashboard`, `app-shell-dashboard`, `assistant-system`)
- Showcase pages under `apps/showcase`

---

## Open follow-ups

Recorded October 4, 2026. They do not change the ratings above until the code
changes.

- `JpPagination`, `JpTableToolbar`, and `JpAssistantMessage` use
  `JP_MESSAGES` and are stable. `JpAppShell` copy uses the same token and
  stays preview because the mobile query is the literal `(max-width: 48rem)`
  and `sidebarId` is `jp-app-shell-sidebar`.
- Promote `JpChip` after [PRIMITIVES.md](../PRIMITIVES.md) documents it.
  Showcase filters still use toolbar buttons.
- Re-rate dialog, popover, dropdown, tooltip, and combobox after a browser note
  in `docs/qa/` records top-layer behavior and the fallback. The parity sentence
  in [PRIMITIVES.md](../PRIMITIVES.md) is still in force.
- Assign a `Ui` removal version only after `CHANGELOG.md` starts the window in
  [COMPATIBILITY.md](./COMPATIBILITY.md).
- Manual assistive-technology review is still open for the whole library
  (workstream 2). It is not a per-component maturity downgrade while
  [ACCEPTANCE.md](./ACCEPTANCE.md) keeps that review off the merge gate.
- Visual baselines cover the recipe page, not every component state. See
  [QUALITY.md](../QUALITY.md).
- Server rendering is not a contract. Generated ids (`Math.random()` on dialog,
  popover, and dropdown; module counters on fields) are unsafe to treat as
  stable across requests.

## Component expansion preview inventory

The October 4 expansion adds 25 rendered components and three supporting
classes, all `preview`, owned by JP maintainers. API details and limits live in
[COMPONENT_EXPANSION.md](../COMPONENT_EXPANSION.md). Unit/Storybook/browser/package
checks are part of this change; manual assistive-technology review is pending.

Components: `JpIcon`, `JpLink`, `JpDivider`, `JpDisclosure`, `JpAccordion`,
`JpAvatar`, `JpAvatarGroup`, `JpStatusDot`, `JpSpinner`, `JpMeter`,
`JpKeyboardHint`, `JpDescriptionList`, `JpCard`, `JpPageHeader`, `JpList`,
`JpFormField`, `JpFormSection`, `JpErrorSummary`, `JpBanner`, `JpDrawer`,
`JpCheckboxGroup`, `JpSegmentedControl`, `JpMultiSelect`, `JpSearchField`,
and `JpPasswordField`.

Supporting directives: `JpFieldControl`, `JpListItemTemplate`, and `JpVisuallyHidden`.
Their story/spec coverage comes from the field, list, and spinner hosts.
Supporting types/constants share preview status: `JpIconName`, `JP_ICON_PATHS`,
`JpAvatarPerson`, `JpDescriptionItem`, `JpListItem`, `JpFieldError`, and `JpChoiceOption`.
Existing `JpInput` search/password helpers and `JpDialog` edge placements are new
preview extensions; their established default contracts remain as documented.

The second batch adds nine more preview components: `JpChecklist`, `JpStepper`,
`JpNumberStepper`, `JpSlider`, `JpRangeSlider`, `JpTimeline`, `JpOverflowChip`,
`JpCopyButton`, and `JpCodeBlock`, plus supporting directive `JpInlineCode`.
Supporting types `JpChecklistItem`, `JpStep`, `JpRangeValue`, `JpTimelineEvent`,
and `JpOverflowItem` share preview status. JP maintainers own these APIs.
Native range handles use separate tracks; exact number entry is provided.
Clipboard permission behavior, physical touch, and manual assistive-technology
review remain open. The [API guide](../COMPONENT_EXPANSION.md#product-tools-second-batch)
records all contracts and limits.

## Everyday workflows preview inventory

The third batch adds `JpCommandPalette`, `JpContextMenu`, `JpDatePicker`, `JpDateRangePicker`, `JpTimePicker`, `JpFileUpload`, `JpNotificationList`, `JpButtonGroup`, `JpToggleButton`, `JpSplitButton`, `JpInlineEdit`, `JpSkipLink`, `JpLiveAnnouncer` and supporting `JpAnnouncer`, all preview and owned by JP maintainers. See [contracts](../WORKFLOW_COMPONENTS.md) and [verification limits](../qa/WORKFLOWS.md). No maturity promotion or release is implied.

## Advanced layout and data preview inventory

`JpSplitPane`, `JpMedia`, `JpTableRowDetail`, the table-preference helpers/types,
and optional table visibility, resizing, pinning and expansion are preview,
owned by JP maintainers. Existing table defaults retain their established
contract. See [API contracts](../ADVANCED_LAYOUT_COMPONENTS.md) and
[verification limits](../qa/ADVANCED_LAYOUT.md). Manual review and promotion
remain open.

## Larger feature preview inventory

`JpTreeView`, `JpTreeTable`, `JpSchedulingCalendar`, `JpReorder`, `JpCarousel`,
`JpChart`, and `JpVirtualTable`, plus supporting `JpReorderContent` and
`JpCarouselSlide`, are preview APIs owned by JP maintainers. Their exported
interfaces/helpers share preview status. The summary includes earlier expansion
batches and all nine new classes; no maturity promotion is implied.

Contracts: [hierarchy](../HIERARCHY_COMPONENTS.md),
[scheduling](../SCHEDULING_CALENDAR.md), [interactions](../INTERACTION_COMPONENTS.md),
and [charts/virtual tables](../DATA_PERFORMANCE_COMPONENTS.md).
[Verification](../qa/LARGE_FEATURES.md) distinguishes automated evidence from
manual assistive-technology, forced-colors, consumer review and release work.
