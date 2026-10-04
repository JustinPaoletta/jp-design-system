# Product tools verification

Recorded October 4, 2026. Nine components and an inline-code directive remain
preview APIs, owned by JP maintainers. See their
[contracts and limits](../COMPONENT_EXPANSION.md#product-tools-second-batch)
and [remaining catalogue](../../COMPONENT_EXPANSION_PLAN.md).

Showcase `/product-tools` demonstrates a validated wizard, nested checklist,
numeric/range controls, timeline, hidden reviewers, and code copying. The page
is lazy-loaded and the production initial bundle remains under its existing
500 kB warning budget. No dependency or token palette is added.

## Automated checks

- UI and Showcase lint/typecheck pass. UI: 320 tests across 73 suites, with
  98.66% statement and 92.26% branch coverage. Showcase: 31 tests in four suites.
- Storybook: 231 checks across 75 suites passed in static and live modes. The
  live run keeps the normal preview on 4400 active and checks both runtime hashes.
  See [the reload regression](STORYBOOK_RELOAD_REGRESSION.md).
- Chromium/WebKit: 102 functional/accessibility checks pass, including existing
  flows. New scenarios cover wizard focus/recovery and Back preservation,
  nested completion and disabled leaves, slider keys and exact entry, range
  boundaries, overflow focus, and mobile RTL reflow.
- Axe checks use WCAG 2.1 A/AA tags across both accents/densities and the open
  overflow and invalid-submission states.
- Eight new macOS Chromium baselines cover both accents/densities, mobile LTR/RTL,
  invalid submission, and open overflow. Sixteen existing baselines retain the
  new navigation entry. All 24 visual comparisons pass. The open-overflow capture
  uses a viewport that fits the trigger and panel, avoiding a full-page viewport
  resize while a native top-layer panel is positioned. CI includes all three visual suites in its macOS job
  and excludes them from Linux functional runs.
- An isolated Angular 22.2.1 consumer compiles the new public exports and ngModel
  bindings from package tarballs, without workspace aliases/symlinks. Temporary
  installation cleanup now precedes report writing, so a report-write failure
  cannot strand the installation on a full disk.

## Review limits

Clipboard denial/retry uses a controlled browser boundary; actual permission
behavior remains browser-owned. Source stays selectable for manual copying.
Unit tests also verify escaped code and suppression of stale copy completion.

WebKit uses Option+Tab for native link navigation in this macOS setup. Its
overflow test follows that convention and verifies Escape focus restoration.
The library does not override normal Tab behavior.

RTL review added bidi isolation for summaries, overflow counts, and timestamps.
Source code uses left-to-right presentation. Checklist visuals reuse selection
tokens and original outline glyphs without decorative motion.

Manual screen-reader, physical touch-device, zoom, and Windows forced-colors
reviews remain pending. There is no SSR/hydration claim or maturity promotion.
