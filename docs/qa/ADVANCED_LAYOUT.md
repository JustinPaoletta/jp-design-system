# Advanced layout verification

Recorded October 4, 2026. `JpSplitPane`, `JpMedia`, row-detail templates,
table-preference helpers and optional table extensions remain preview.
JP maintainers own these APIs. [Contracts](../ADVANCED_LAYOUT_COMPONENTS.md)
and [remaining work](../../COMPONENT_EXPANSION_PLAN.md) describe their scope.

The lazy Showcase `/advanced-layout` composes a service workspace with bounded,
persisted split size, versioned column preferences, exact/pointer widths,
selection, expandable details, pinned regions, and image recovery. It is linked
from Data Display. The existing Data Display page is also loaded on demand.
The production initial bundle is 470.22 kB, below the existing 500 kB warning
budget. The table stylesheet also fits its existing 6 kB warning budget.
No dependency or token palette was added.

## Automated evidence

- UI/Showcase lint and Angular template/type checks pass. UI: 362 tests in
  89 suites; Showcase: 37 tests in six suites. UI coverage is 98.32% statements
  and 91.88% branches; both projects pass their existing coverage thresholds.
  Tests include invalid bounds, keyboard direction, pointer identity/cancellation,
  controlled expansion, focus recovery, malformed/obsolete preferences,
  denied storage, responsive image fallback, and stale source events.
- Storybook: 276 interaction checks in 90 suites pass in both static and live modes, with the
  normal preview on 4400 left running. The compiler/runtime isolation guards
  pass before and after the test run. Seven new stories cover split layouts,
  keyboard resizing, loaded/decorative/failed images and advanced table controls.
- All 24 new Chromium/WebKit functional and accessibility checks pass. They
  include LTR/RTL pointer resizing and pinning geometry, exact widths,
  preference persistence/restoration/reset, expansion independent of selection,
  mobile stacking/focus recovery, image errors/recovery, and axe in both accents
  and densities with the settings disclosure and row detail open. Axe targets
  WCAG 2.1 A/AA; it does not certify manual assistive-technology behavior.
- Isolated Angular 22.2.1 tarball compilation passes with the new components,
  projected panels/detail template, preference helper and public bindings.
- Desktop/mobile visual baselines are reviewed for the advanced workspace,
  LTR/RTL, neon/cobalt, default/compact, open controls/details and image failure.

All 42 macOS Chromium visual comparisons pass without refreshing any existing
baseline. The eight new baselines cover this workspace; all 34 existing recipe,
component, product-tool and workflow comparisons retain their expected rendering.
All 150 Chromium/WebKit functional and accessibility regressions pass, including
the 24 new checks and all 126 existing checks. Mobile LTR/RTL also verifies
that the first data column scrolls horizontally in a narrow frame. Hosted CI is available on
[draft PR #13](https://github.com/JustinPaoletta/jp-design-system/pull/13).
The first draft commit passed Linux lint/build/unit/Storybook/browser/package/
security checks and macOS visual checks in
[CI run 37232963568](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37232963568).
The final expanded head requires its own successful run.

## Review limits

Manual VoiceOver/NVDA, physical touch devices, Windows forced colors,
200%/400% browser zoom, Firefox and SSR/hydration remain pending. Browser pointer
simulation and DOM axe do not replace those checks. CSS has a forced-colors
fallback for the separator and table borders, without a manual platform pass.

Persistence belongs to the consumer; the Showcase uses local storage with
bounded/versioned restoration and catches denied storage. No synchronized
profile or server persistence is claimed. The media component displays static
images, with native responsive source selection. Playable audio/video remain
native consumer-owned elements. Native number-field behavior belongs to the
browser. Narrow table frames disable horizontal pinning; consumers must bound
wide pinned columns for their chosen desktop pane widths. These additions do
not promote the APIs or release a package.
