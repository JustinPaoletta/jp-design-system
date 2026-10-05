# Accessibility findings

Recorded October 4, 2026. No screen reader or Windows high-contrast session
was performed.

## Resolved: open combobox options failed WCAG 2.1 AA contrast

- **Where:** `libs/ui/src/lib/primitives/combobox/combobox.scss`. Open panels
  receive `popover="manual"` from `overlay-manager.ts`.
- **Behavior:** On Showcase `/product-recipes`, Settings, focusing Region opened
  the list. axe-core 4.13 reported `color-contrast` on each option button:
  foreground `#000000`, background `#0c111c`, ratio **1.11:1**, expected
  **4.5:1**. The native popover user-agent `color` (CanvasText) was used
  because the popup did not set a text color and the options inherited it.
- **Fix:** The popup and options now use `--jp-color-field-fg` on
  `--jp-color-field-bg`. `a11y state coverage › combobox results meet WCAG AA`
  covers the open list.

## Small and compact controls are below 24 CSS pixels

- **Where:** `libs/tokens/src/generated/tokens.css` (`--jp-size-control-sm` is
  `1.25rem` / 20px; `[data-jp-density="compact"]` sets `--jp-size-control-md`
  to `1.25rem` / 20px). Icon buttons use that control size in
  `libs/ui/src/lib/primitives/icon-button/icon-button.scss`.
- **Behavior:** WCAG 2.2 Success Criterion 2.5.8 Target Size (Minimum) expects
  a 24×24 CSS pixel target, with a spacing exception. Default medium controls
  are `1.5rem` (24px). Small controls, and medium controls in compact density,
  are 20px before any spacing exception is applied.
- **Why it is not release-blocking for the current gate:** Showcase axe does
  not claim WCAG 2.2. axe-core 4.13.0 ships the only `wcag22aa` rule,
  `target-size`, with `enabled: false`, and the Showcase tag list does not
  turn it on. This pass did not enable the rule, so this is not a confirmed
  violation. It becomes relevant if the target moves to WCAG 2.2 AA.

## Forced-colors styles and scoped automation; Windows review remains pending

- **Where:** expansion components now include forced-colors rules for borders,
  selection and focus. Charts hide the canvas and open an equivalent native
  data table. The earlier note saying there were no media queries is superseded.
- **Automation:** `acceptance-environments.spec.ts` asserts the seven larger
  features with Chromium forced-colors emulation. It does not cover every
  preview component or real Windows palettes.
- **Tool limitation:** axe's forced-colors contrast calculation mixed authored
  text-fill colors with forced background colors in the local run. The full
  axe scan runs after restoring normal colors; no rules or violations are
  suppressed. See [ACCEPTANCE_AUTOMATION.md](ACCEPTANCE_AUTOMATION.md).
- **Still open:** Windows high-contrast readability and platform review remain
  manual. Emulation does not establish that those checks passed.

## Resolved: expansion labels, contrast, and focus timing

- Static `id` inputs on `jp-input` and `jp-multi-select` duplicated the native
  control ID on the custom host. Host bindings now reserve that ID for the native
  control, restoring label association and error-summary focus links. Search
  and password wrappers inherit the fix.
- New banners and error summaries now pair primary text with a dark semantic
  surface. Disabled chip labels retain readable contrast rather than fading
  the entire host.
- Cobalt primary buttons previously paired `#070b13` text with `#4674d0`
  (4.38:1) and a darker hover surface (2.90:1). Cobalt now uses white text
  on `#426fcb` and the existing `#3158a8` hover surface. Token tests require
  at least 4.5:1 for both accents and both button states.
- Submission summaries and multi-select removal restore focus after Angular
  renders, avoiding focus races with newly created or removed elements.
