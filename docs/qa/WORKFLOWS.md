# Everyday workflows verification

Recorded October 4, 2026. Thirteen components and `JpAnnouncer` remain preview,
owned by JP maintainers. [API contracts](../WORKFLOW_COMPONENTS.md) and
[remaining work](../../COMPONENT_EXPANSION_PLAN.md) describe their scope.

The lazy-loaded Showcase `/workflows` covers commands, contextual actions,
button combinations, native scheduling fields, inline editing, local file
queue states and notifications. It is linked from Product tools.
The production initial bundle remains under the existing 500 kB warning
budget; no dependency or token palette was added.

## Automated evidence

- UI/Showcase lint and typecheck pass. UI: 345 tests in 86 suites; Showcase:
  34 tests in five suites. UI coverage is 98.49% statements and 92.47% branches.
  These checks cover CVAs, Gregorian leap days,
  date/time bounds and steps, range order, command chords, menu keyboard/focus,
  file constraints/action intents, notification focus, stale inline saves,
  cancellation/destruction, skip targets and repeated announcements.
- Storybook includes thirteen new suites and 38 new checks: 269 checks across
  88 suites pass in both static and live modes. Live tests keep the user's normal preview on 4400 active,
  with [compiler/runtime isolation guards](STORYBOOK_RELOAD_REGRESSION.md).
- All 126 Chromium/WebKit functional/accessibility checks pass. They cover
  command search/selection and editable-field shortcuts,
  context-menu pointer/keyboard/visible invocation, toggle/split keys,
  inline failure/retry/cancel, native temporal validation and error-summary
  focus, file reject/progress/cancel/retry/remove, inbox filtering/read/removal,
  skip focus and mobile RTL.
- Axe checks include both accents/densities in closed, command-dialog and
  context-menu states, using WCAG 2.1 A/AA tags.
- Ten new macOS Chromium visual baselines cover four accent/density states,
  mobile LTR/RTL, commands, context menu, failed inline saving and failed uploads.
  Eight Product tools baselines include its new page link. Sixteen existing
  recipe/component baselines retain their expected rendering.
  All 34 visual comparisons pass without updating snapshots.
  All four visual suites are included in macOS CI and excluded from Linux
  functional runs.
- Isolated Angular 22.2.1 tarball compilation passes and exercises all new exports, public
  form types, ngModel bindings, the save callback and announcer service.

## Review limits

Native date/time picker dialogs and native file selection dialogs remain
platform-owned; DOM axe and screenshots do not validate their accessibility.
Their locale/display UI is intentionally outside JP's pixel contract.
Files stay local in the Showcase demo; real transport behavior belongs to
the consumer. The inline-save demo uses a controlled local asynchronous boundary.

Manual VoiceOver/NVDA, physical touch-device, Windows forced-colors, 200%/400%
zoom, alternate browser locales, Firefox and SSR/hydration review remain
pending. No release or maturity promotion is implied by these local checks.
