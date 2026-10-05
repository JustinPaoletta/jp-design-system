# Manual QA checklist

Updated October 4, 2026. Automated results are in
[Verification](docs/qa/VERIFICATION.md), with supported platforms and limits in
[Support matrix](docs/qa/SUPPORT_MATRIX.md). This checklist records remaining
human review; it does not claim those sessions have passed.

## Outstanding review

| Review                                             | Status                                              |
| -------------------------------------------------- | --------------------------------------------------- |
| VoiceOver on macOS                                 | Not reviewed                                        |
| NVDA on Windows                                    | Not reviewed                                        |
| Windows high contrast with real user palettes      | Not reviewed                                        |
| Actual 200%/400% browser zoom and text-only zoom   | Not reviewed                                        |
| Physical touch and native date/time picker dialogs | Not reviewed                                        |
| JAWS                                               | Out of scope unless a consumer requirement names it |

Chromium forced-colors emulation and 320/640 CSS-pixel reflow are automated
for the seven larger features. They are partial evidence, not completion of
the Windows/zoom review. SSR and hydration are outside the current contract.

## Prepare a review

```sh
npm exec -- nx run ui:storybook
npm exec -- nx run showcase:serve
```

Use Storybook at http://localhost:4400 for isolated states and Showcase at
http://localhost:4200 for application flows. Record the tested commit,
OS/browser/reader versions, accent, density, direction and viewport/zoom.
Repeat applicable checks in neon/cobalt, default/compact and LTR/RTL. Use
real browser zoom rather than shrinking the viewport alone.

## Shared checks

- [ ] Headings, landmarks and reading order match the visible structure.
- [ ] Every control has a useful accessible name; labels, hints and errors
      are associated with the native field.
- [ ] Keyboard and screen-reader navigation reach all actions; focus remains
      visible and restores sensibly after close, remove, save or retry.
- [ ] State changes announce once, including pending, failure, completion,
      selection counts and context changes.
- [ ] Content remains usable at 200%/400% and with text-only zoom; horizontal
      table overflow stays inside its labeled region.
- [ ] Windows high contrast preserves borders, selection, focus, validation
      and chart equivalents with different user palettes.
- [ ] Reduced motion stops unnecessary transitions/rotation; content and
      task completion do not depend on animation.
- [ ] Touch targets are reachable and do not overlap in compact density.

## Component and flow checks

| Area                 | Human review focus                                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Forms/selection      | Required/disabled/invalid states, summaries and recovery; password reveal/search clear names; checkbox/multi-select/segmented state; slider/range/number announcements                          |
| Navigation/hierarchy | Disclosure grouping, tabs, menus/command palette, lazy-loading tree feedback, tree-table relationships and selection                                                                            |
| Overlays/shell       | Native dialog/popover plus fallback limits, nested Escape, focus containment/restoration, mobile drawer and assistant navigation                                                                |
| Data/feedback        | Table sort/selection/details, pinned/resized regions, loading/empty/error distinction, meter/progress meaning and notification actions                                                          |
| Workflow             | Wizard step/completion announcements, checklist count, upload rejection/retry/remove, date-range validation and native picker dialogs                                                           |
| Scheduling           | Day/week/agenda reading order, appointment names/overlaps, time-zone/DST labels, all-day events, empty/error recovery and narrow-screen alternatives                                            |
| Reorder/carousel     | Move controls plus pickup/drop/cancel announcements, pointer/touch operation, final focus, slide position and optional-rotation pause/reduced-motion behavior                                   |
| Charts/virtual table | Equivalent chart data and keyboard inspection, high-contrast presentation, logical table indices, paginated accessibility mode, sorting/selection across pages and focus after viewport changes |
| Product recipes      | Failed save keeps values, retries/cancellation work, destructive confirmation names the outcome, bulk selection persists, assistant transport errors recover                                    |

Inspect small/compact targets against the consumer's accessibility requirements.
The automated target is WCAG 2.1 A/AA; existing 20px controls have no blanket
WCAG 2.2 target-size claim. Record any defect in
[QA findings](docs/qa/FINDINGS.md) using the [triage policy](docs/governance/TRIAGE.md).

## Review record template

```text
Commit:
Date and reviewer:
OS / browser / assistive technology versions:
Route or Storybook story / tested state:
Accent / density / direction / viewport / zoom / color preference:
Expected behavior:
Observed behavior and reproduction steps:
Pass / failure / unsupported behavior:
Evidence location and issue reference:
Retest commit and result:
```

Mark a review complete only with an actual session record and resolved blocking
findings. Update the [remaining task list](COMPONENT_EXPANSION_PLAN.md) and
individual [maturity entries](docs/governance/MATURITY.md) through the
[acceptance process](docs/governance/ACCEPTANCE.md). Preserve the
[Storybook isolation requirement](docs/qa/STORYBOOK_RELOAD_REGRESSION.md) when
changing preview/test infrastructure.
