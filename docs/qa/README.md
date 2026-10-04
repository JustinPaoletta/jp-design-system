# QA notes

Active Storybook manual QA lives at the repo root:

- [MANUAL_QA.md](../../MANUAL_QA.md) — Storybook checklist, plus the October 4, 2026 automation log
- [SUPPORT_MATRIX.md](SUPPORT_MATRIX.md) — WCAG 2.1 A/AA automated target, browsers, and assistive-technology limits
- [FINDINGS.md](FINDINGS.md) — gaps that were not patched in component source
- [STORYBOOK_RELOAD_REGRESSION.md](STORYBOOK_RELOAD_REGRESSION.md) — shared development bundles caused continuous reloads; prevention and two-server verification
- [PRODUCT_TOOLS.md](PRODUCT_TOOLS.md) — second batch, browser/package checks, and review limits

Epic plan docs under `docs/` also include acceptance criteria used during delivery.
Historical empty capture folders under `phase2-epic2/` are unused; prefer `MANUAL_QA.md`.

## What automation covers

Showcase axe uses tags `wcag2a`, `wcag2aa`, `wcag21a`, and `wcag21aa` only.
That is WCAG 2.1 A/AA, not WCAG 2.2. VoiceOver, NVDA, JAWS, Windows forced
colors, and 200%/400% zoom are outside that automation. JAWS is out of scope
until a consumer requirement names it. VoiceOver and NVDA are the intended
readers and were **not** reviewed on October 4, 2026.

Functional and axe checks are supported on macOS Chromium and WebKit, and in
CI on Linux Chromium and WebKit. Visual baselines are macOS Chromium only.
The recipe page runs for neon and cobalt at default and compact density.
Mobile shell, open dialog, assistant response, and settings validation error
are neon / default density only. The expanded component page adds both accents/densities, mobile LTR/RTL, and desktop/mobile drawer baselines. Details and commands are in
[SUPPORT_MATRIX.md](SUPPORT_MATRIX.md) and [QUALITY.md](../QUALITY.md).

## Local execution (October 4, 2026)

macOS. Playwright via `npx nx`. No manual screen reader pass.

Commands and results are filled in [MANUAL_QA.md](../../MANUAL_QA.md) under
"Accessibility matrix and local automation".

[Everyday workflows verification](WORKFLOWS.md) records the third batch, native-picker limits, visual matrix, and remaining manual review.
