# Component acceptance

Checklist for a change to a public JP component, directive, service, or token.
Use it before merging work that ships in `@jp-design-system/ui` or
`@jp-design-system/tokens`.

Inventory date for the related maturity ratings: October 4, 2026.
Principles: [DESIGN_PRINCIPLES.md](../DESIGN_PRINCIPLES.md).
API reference: [PRIMITIVES.md](../PRIMITIVES.md).

---

## Release-blocking

**Blocking** items must pass before merge when the change touches that surface.
A blocking failure on a `stable` or `preview` export stops the change.

These are blocking for every public component change:

- API shape and typing
- Semantics (role, name, reading order)
- Token usage
- Documented states
- Documented keyboard behavior and visible focus
- Unit tests for the change
- A Storybook story for a visual change
- Public-API documentation

These are blocking only when the change affects them:

- Responsiveness at a breakpoint the component already documents
- A new user-visible string
- Accessibility behavior already covered by axe or by [MANUAL_QA.md](../../MANUAL_QA.md)

These are not merge gates on October 4, 2026. Record the gap; do not treat a
missing run as a pass:

- VoiceOver, NVDA, and JAWS
- Windows high contrast / forced colors
- 200% and 400% zoom
- RTL (no RTL contract is declared)
- Server rendering and hydration
- Visual snapshots other than the four recipe baselines named in
  [QUALITY.md](../QUALITY.md)

---

## Checklist

### API — blocking

- [ ] Selector stays `jp-*`, or the attribute selector already documented in
      [PRIMITIVES.md](../PRIMITIVES.md) (`jpFocusTrap`, `jpPopoverTrigger`,
      `jpTabPanel`, and the other attribute directives).
- [ ] Inputs are strict unions, booleans, numbers, or documented object types.
      No `class` or `style` input.
- [ ] Change detection stays `OnPush`.
- [ ] Field controls that integrate with forms keep `ControlValueAccessor`.
      Buttons stay outside CVA.
- [ ] A new required input, a renamed selector, a changed output type, or a
      changed CVA value type is handled as a breaking change in
      [COMPATIBILITY.md](./COMPATIBILITY.md).
- [ ] Content-projection selectors stay stable. Examples already in the library:
      `[jpAppShellSidebar]`, `[jpAppShellMain]`, `[jpAppShellNavIcon]`,
      `[jpEmptyStateIcon]`, `[jpTableSearch]`, `[jpTableFilters]`,
      `[jpTableActions]`, `[jpTableBulkActions]`, `[jpDialogActions]`,
      `[jpPopoverTrigger]`, `[jpPopoverContent]`, `[jpDropdownTrigger]`,
      `[jpDropdownMenuItem]`, `ng-template[jpTableCell]`,
      `ng-template[jpTabPanel]`.

### Semantics — blocking

- [ ] The rendered element matches the documented tag or role (`as` on layout
      and type, native controls for fields, `role="switch"` on `jp-switch`,
      dialog modal semantics, tab and breadcrumb patterns).
- [ ] The accessible name comes from a visible label, a required `ariaLabel`,
      or projected text. Icon-only controls do not ship without a name.
- [ ] `jp-heading` level and `jp-text` size stay independent, per principle 8.
- [ ] Status is not color alone. Badge, toast, inline alert, and invalid fields
      keep a text or shape cue.

### Tokens — blocking

- [ ] Color, space, type, radius, elevation, motion, and z-index come from
      semantic custom properties.
- [ ] No raw color in `libs/ui`. No direct primitive token use in `libs/ui` or
      `apps/*`. Both rules already run under `npm run lint`.
- [ ] Accent stays a signal (primary action, focus, active nav, selection).
      Semantic success, warning, error, and info do not follow the accent swap.
- [ ] Density, when it applies, responds to `data-jp-density="compact"`.
- [ ] New semantic tokens are added under `libs/tokens/src/tokens` and generated
      with `npm run tokens:build`. `npm run tokens:check` passes.

### States — blocking

- [ ] Defaults in [PRIMITIVES.md](../PRIMITIVES.md) still hold, or the doc and
      the maturity note change with the code.
- [ ] Disabled, read-only, invalid, loading, empty, and open/closed states that
      the component already has still work.
- [ ] Loading and busy UI sets `aria-busy` or an equivalent status where the
      component already does (`jp-button` loading, `jp-progress`, skeleton
      regions owned by the app).
- [ ] Reduced motion does not leave a layout jump. The library does not add
      bounce or spring timing.

### Keyboard — blocking

- [ ] Every control is reachable and operable by keyboard.
- [ ] Focus is visible.
- [ ] Documented keys still match the implementation: dialog and overlay Escape,
      menu arrows, tabs (arrows move focus, Enter/Space selects), combobox
      arrows/Home/End/Enter/Escape, shell drawer Escape.
- [ ] Focus returns to the opener where that is already specified (dialog,
      mobile shell drawer).
- [ ] Nested overlays dismiss the topmost layer first (`registerOverlay` /
      `claimOverlayEvent` in the private overlay helper).

### Responsiveness — blocking when the layout is part of the contract

- [ ] `jp-app-shell` keeps the desktop sidebar and the drawer at the shell
      breakpoint (`48rem`, `--jp-layout-shell-mobile-max`).
- [ ] `jp-assistant-panel` stays a dock on wide viewports and a scrim overlay
      on narrow ones.
- [ ] `jp-inline` wrap and `jp-table` horizontal overflow still behave as
      documented. Table overflow is intentional.
- [ ] Touch targets and hit areas are not clipped when density is compact.

### Localization — blocking for new strings

- [ ] New built-in user-visible copy is a label input or a typed `JP_MESSAGES`
      key with a usable default. Any unconfigurable copy must be recorded as
      a preview gap in [MATURITY.md](./MATURITY.md).
- [ ] Defaults stay usable in English. The library does not ship empty labels
      to force configuration.
- [ ] Sentences are whole strings. Do not split "Page", a number, and "of"
      into separate translation fragments if you add a new sentence.
- [ ] Counts and names that the consumer owns (table cells, toast `message`,
      assistant `content`, option labels) stay out of the library.

Shell chrome, pagination sentences, table-toolbar filter chrome and assistant
role names now use `JP_MESSAGES`. See the [localization contract](../localization/CONTRACT.md).
Adding unconfigurable built-in copy to a `stable` component is blocking.

### Tests — blocking

- [ ] The unit spec next to the component covers the behavior you changed.
- [ ] `npm exec -- nx test ui` passes for UI work. Token work passes
      `npm exec -- nx test tokens` and `npm run tokens:check`.
- [ ] Form controls still prove CVA or `ngModel` behavior when their value
      path changes.
- [ ] Storybook interaction coverage stays intact when the story has a `play`
      function. Commands are in [QUALITY.md](../QUALITY.md).

### Documentation — blocking for a public change

- [ ] [PRIMITIVES.md](../PRIMITIVES.md) matches inputs, outputs, defaults, and
      limitations.
- [ ] [MATURITY.md](./MATURITY.md) matches maturity and known limitations.
- [ ] A breaking or deprecating change updates the changelog path described in
      [COMPATIBILITY.md](./COMPATIBILITY.md).
- [ ] Token README tables in `libs/tokens/README.md` match any new semantic
      variable.

### Evidence to attach on the PR

- [ ] Acceptance checklist, with blocking items checked or an explicit waiver
      from JP maintainers.
- [ ] Spec path and story path.
- [ ] Visual note: accent (neon/cobalt), density (default/compact), and
      viewport if layout moved. Recipe-page visual changes follow
      [QUALITY.md](../QUALITY.md).
- [ ] Accessibility note: axe result for the touched story, plus any manual
      path from [MANUAL_QA.md](../../MANUAL_QA.md).

---

## After acceptance

A component that passes this list is eligible for the maturity rating in
[MATURITY.md](./MATURITY.md). Passing the list does not by itself make an
export `stable`. Native overlay fallbacks and fixed non-input copy stay
`preview` until those gaps close.
