# Component acceptance

Use this checklist before a public component, directive, service or token change.
The [API catalog](../consumers/COMPONENTS.md) gives supported behavior.
[Maturity](MATURITY.md) gives support levels and known limits.
The inventory date is October 4, 2026.

## Release-blocking

Applicable blocking items must pass before merge.
A blocking failure on a stable or preview API stops the change.

Every public component change must keep these requirements:

- Correct API types
- Correct roles, names and reading order
- Semantic tokens
- Documented states and keyboard behavior
- Visible focus
- Unit tests for changed behavior
- A Storybook example for visual changes
- Public API documentation

Responsive layouts, new text and existing accessibility behavior are blocking
when the change affects them. Required CI includes the documented macOS
snapshots and Chromium/Firefox/WebKit checks. [Quality](../QUALITY.md) gives the commands.
RTL behavior is blocking where an API already documents it.

Manual screen-reader and real Windows high-contrast sessions remain open.
Actual Chrome zoom has [limited recorded evidence](../qa/READINESS.md#actual-zoom-inspection).
Other zoom combinations remain open.
They are not general merge gates in the current policy.

A missing session is not a pass. JAWS is outside scope unless an application
requirement names it. SSR and hydration are outside the current support rules.

## Checklist

### API — blocking

- [ ] Keep documented `jp-*` and attribute selectors.
- [ ] Use strict unions, booleans, numbers or documented object types.
- [ ] Do not add arbitrary `class` or `style` inputs.
- [ ] Keep `OnPush` change detection.
- [ ] Keep `ControlValueAccessor` for form controls.
- [ ] Keep buttons outside CVA.
- [ ] Treat new required inputs, renamed selectors and changed output/CVA types as breaks.
- [ ] Follow [Compatibility](COMPATIBILITY.md) for those breaks.
- [ ] Keep documented projection selectors and template contexts.

### Semantics — blocking

- [ ] Match the documented tag and ARIA role.
- [ ] Keep native field controls and documented dialog, switch, tab and breadcrumb behavior.
- [ ] Give each control a visible label, necessary `ariaLabel` or projected name.
- [ ] Give icon-only controls an accessible name.
- [ ] Keep heading level and body-text size rules from [Design principles](../DESIGN_PRINCIPLES.md).
- [ ] Show status through text or shape as well as color.

### Tokens — blocking

- [ ] Use semantic variables for colors, spacing, type, radius, elevation, motion and z-index.
- [ ] Do not use raw colors or primitive tokens in UI/application styles.
- [ ] Keep accent for primary actions, focus, active navigation and selection.
- [ ] Keep success, warning, error and information separate from accent.
- [ ] Keep applicable compact-density behavior.
- [ ] Add new semantic tokens in `libs/tokens/src/tokens`.
- [ ] Regenerate output with `npm run tokens:build`.
- [ ] Pass `npm run tokens:check`.

### States — blocking

- [ ] Keep documented defaults, or update the guide and maturity note with the change.
- [ ] Keep applicable disabled, read-only, invalid, loading, empty and open/closed states.
- [ ] Keep `aria-busy` or the documented status for active work.
- [ ] Keep skeleton-region status in the application.
- [ ] Respect reduced motion without layout jumps.
- [ ] Do not add bounce or spring timing.

### Keyboard — blocking

- [ ] Give keyboard access to every control.
- [ ] Keep focus visible.
- [ ] Keep each API's documented keys, including Escape and arrow behavior.
- [ ] Keep documented focus restoration to the opener.
- [ ] Close the topmost registered overlay first.

### Responsiveness — blocking when the layout is part of the contract

- [ ] Keep the shell sidebar/drawer transition at `48rem`.
- [ ] Keep the shell token `--jp-layout-shell-mobile-max` aligned with that breakpoint.
- [ ] Keep the assistant dock on wide screens and its overlay on narrow screens.
- [ ] Keep inline wrapping and table overflow behavior.
- [ ] Keep compact touch areas visible and unclipped.

### Localization — blocking for new strings

- [ ] Put new built-in text in a label input or typed `JP_MESSAGES` key.
- [ ] Give usable English defaults.
- [ ] Record fixed, unconfigurable text as a preview limit.
- [ ] Keep sentences whole.
- [ ] Do not divide translated words around bound values.
- [ ] Keep application names, counts and data content outside the library's message defaults.

Shell, pagination, table-toolbar and assistant-role text use `JP_MESSAGES`.
The [message guide](../localization/CONTRACT.md) explains overrides.
New fixed text in a stable component is blocking.

### Tests — blocking

- [ ] Add unit coverage for changed behavior.
- [ ] Run `npm exec -- nx test ui` for UI work.
- [ ] Run `npm exec -- nx test tokens` for token work.
- [ ] Keep form integration tests when the value path changes.
- [ ] Keep Storybook interaction tests for stories with `play` functions.
- [ ] Run affected browser, package and visual checks from [Quality](../QUALITY.md).

### Documentation — blocking for a public change

- [ ] Update the applicable API guide for inputs, outputs, defaults and limits.
- [ ] Update maturity for support-level changes or new limits.
- [ ] Update migration and changelog notes for breaks and deprecations.
- [ ] Update token tables for new semantic variables.
- [ ] Follow [ASD-STE100 writing rules](../content/WRITING.md).
- [ ] Pass writing, link and formatting checks.

### Evidence to attach on the PR

- [ ] Completed applicable checklist items or an explicit maintainer waiver.
- [ ] Unit-test and story paths.
- [ ] Tested accents, densities and viewports.
- [ ] Axe results and applicable snapshot results.
- [ ] Actual manual sessions, or a statement that they did not run.

## After acceptance

Passing this checklist makes an API eligible for a maturity inspection.
It does not automatically make the API stable.
Known overlay fallback differences and fixed-copy limits remain preview gaps.
Maintainers change each rating only after its specific gaps close.
