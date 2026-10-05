# Acceptance automation and remaining inspection

Recorded October 4, 2026. The five remaining expansion tasks combine automated
evidence with decisions or platform checks that people must do.

| Remaining task                         | Automated evidence                                                                                                                  | Human work still required                                                                                                                       |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Assistive technology and forced colors | axe, keyboard/focus tests, Chromium forced-colors behavior, 320/640 CSS-pixel reflow                                                | VoiceOver and NVDA sessions; Windows high contrast with real user palettes; actual 200%/400% browser zoom                                       |
| Consuming-product API inspection       | Four working Showcase consumer screens, consumer unit/browser tests, isolated Angular tarball compilation                           | Feedback from a real application and decisions about its workflow/API requirements                                                              |
| Browser compatibility                  | Chromium/WebKit functional and accessibility CI, including native `details.name` grouping and repeated keyboard toggling            | Native picker dialogs, physical touch, real browser/OS combinations outside the automated engine matrix, documented overlay fallback inspection |
| API promotion                          | Repeatable tests, stories, lint/token/type/package checks and documented contracts give acceptance evidence                         | A maintainer examines the acceptance checklist and changes each maturity rating after its specific gaps close                                   |
| Release coordination                   | Version/changelog preparation, release safety tests, package build, isolated consumer install and a manual-dispatch release dry-run | Select the version, examine notes, approve/tag the release, select distribution and decide whether a design kit is needed                       |

Passing automation does not finish the manual tasks or promote a preview API.
The supported matrix is [SUPPORT_MATRIX.md](SUPPORT_MATRIX.md), acceptance is
[ACCEPTANCE.md](../governance/ACCEPTANCE.md), and release policy is
[RELEASE.md](../../RELEASE.md).

## Environment checks

`apps/showcase-e2e/src/acceptance-environments.spec.ts` adds:

- All seven larger features through `/hierarchy`, `/scheduling`,
  `/interaction-tools`, and `/data-performance` at 640px LTR, 320px LTR, and
  320px RTL, in Chromium and WebKit. Interactions run before document-overflow
  assertions. Native tables may scroll inside their frames.
- WCAG 2.1 A/AA axe scans of each screen at 320px LTR.
- Chromium `forced-colors: active` tests exercise tree/table selection and focus, reorder pickup/drop and carousel controls. They also exercise scheduling mode/appointment activation, chart data-table fallback and virtual-table selection.
  The chart test also changes the media preference at runtime and verifies
  restoration of its canvas.

640/320 CSS pixels model the layout space of a 1280px window at 200%/400% zoom.
They do not exercise browser zoom itself, text-only zoom, magnification or
screen-reader announcements. Forced-colors checks use the default theme/density
and Chromium emulation; the four cases intentionally skip WebKit. They do not
claim Windows high-contrast conformance or inspection of every preview component.

The accordion test in `component-expansion.spec.ts` also asserts the native
`HTMLDetailsElement.name` property and exclusive opening after Enter, click,
and Space activation. It runs in both supported engines.

### axe under forced colors

The initial forced-colors scans reproduced axe 4.13's mixed foreground/background
calculation: authored pale text was compared with the forced white background.
This matches [axe-core issue #3978](https://github.com/dequelabs/axe-core/issues/3978).
The tests assert the controls, state and focus outlines with forced colors
active, then restore normal colors before the complete axe scan. No axe rule
is disabled and no violations are filtered. These scans thus do not
measure forced-color contrast; palette/readability inspection stays manual.

Run through the existing Nx target:

```sh
npm exec -- nx run showcase-e2e:e2e -- --project=chromium --project=webkit --grep="acceptance reflow|acceptance forced colors|native disclosure keyboard" --workers=1
```

The existing Linux functional CI job picks up these non-visual tests. Visual
baselines remain the separately examined macOS Chromium suite.

Local macOS verification: **30 passed, four intentional WebKit skips** in the
selection above. This comprises 24 reflow cases, four Chromium forced-colors
cases, and two strengthened native-disclosure cases.

## Release checks

`tools/release/prepare.spec.mjs` adds seven checks for the existing release tool:

- Documented SemVer/RC arguments and rejection of malformed arguments.
- Paired distributed versions, kept dependency versions and unchanged
  package identities.
- Changelog notes/history/line endings and duplicate-version rejection.
- Refusal of mismatched lockfile roots and unexpected package identities.
- Application of the planned files in an isolated temporary fixture.
- Restoration of earlier files after a later write fails.
- The real dry-run CLI leaving the repository's release files unchanged.

```sh
npm exec -- nx run packages:check-release
```

The Build CI job and Release dry-run workflow both run this target. Tests use
synthetic versions and temporary files; they do not select a release version.
Package consumer CI already builds and compiles the distributed tarballs.
The release workflow still has read-only GitHub permissions and does not tag
or publish.

Local verification: **seven release checks passed**. Current integrated CI
results and evidence revisions are recorded in [Verification](VERIFICATION.md).
