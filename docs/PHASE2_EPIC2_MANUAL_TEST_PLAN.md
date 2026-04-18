# Phase 2 Epic 2 Manual Test Plan (Expanded)

## Purpose

Use this guide to manually validate Phase 2 Epic 2 end-to-end with explicit actions and expected outcomes.

Primary goals:

1. Confirm every layout/typography primitive behaves correctly in Storybook.
2. Confirm the dashboard composition is fully built from Phase 2 primitives.
3. Confirm token-driven theming (`accent`, `density`) works in Storybook and Playground.
4. Confirm semantics/accessibility smoke requirements are met.
5. Confirm legacy `Ui`/`lib-ui` deprecation behavior remains intentional and safe.

---

## Scope Under Test

### Primitives (`libs/ui`)

1. `jp-box`
2. `jp-stack`
3. `jp-inline`
4. `jp-grid`
5. `jp-surface`
6. `jp-text`
7. `jp-heading`

### Integration Surfaces

1. Storybook primitive stories
2. Storybook composition story (`Compositions/Phase 2/Layout Dashboard`)
3. Playground route (`/phase-2-dashboard`)
4. CI contract checks (Chromium + Storybook/Playwright jobs)

---

## Test Environment

Recommended:

1. Browser: latest Chromium/Chrome
2. OS: any supported local dev OS
3. Viewports used in this plan: `1440`, `1024`, `768`, `390`

Keep DevTools open throughout testing:

1. `Console` tab: watch for runtime errors/warnings.
2. `Elements` + `Computed` tabs: inspect rendered tags and computed styles.

---

## Prerequisites

1. Install dependencies:

```bash
npm ci
```

2. Build/check tokens:

```bash
npm run tokens:build
npm run tokens:check
```

3. Start Storybook:

```bash
npx nx run ui:storybook
```

4. Start Playground:

```bash
npx nx run playground:serve
```

---

## Fast Preflight (Must Be Green First)

Run:

```bash
npm run format:check
npm run lint
npm run test
npx nx run ui:test-storybook
npx nx run playground-e2e:e2e -- --project=chromium
npm run build
```

Expectation:

1. All commands pass.
2. If any command fails, stop manual QA and resolve first.

---

## Manual Test Matrix

## A. Storybook Primitive Validation

Open Storybook and test these stories:

1. `Primitives/Layout/Box`
2. `Primitives/Layout/Stack`
3. `Primitives/Layout/Inline`
4. `Primitives/Layout/Grid`
5. `Primitives/Layout/Surface`
6. `Primitives/Typography/Text`
7. `Primitives/Typography/Heading`

For each primitive story, always do this baseline check first:

1. Action: Load story with defaults.
2. Expect: Component renders visibly (not collapsed).
3. Expect: No Storybook console errors when changing controls.
4. Expect: No horizontal overflow in canvas.
5. Expect: Inline/computed style values map to token vars (`var(--jp-...)`) where applicable.

### A1. `jp-box`

1. Action: Open `Primitives/Layout/Box` with defaults.
2. Expect: Root element is `div.jp-box__root`.
3. Action: Set `as=section`, then `article`, then `main`, then `nav`.
4. Expect: Root tag changes to exactly the selected semantic tag each time.
5. Action: Set `padding=none`, then `md`, then `xl`.
6. Expect: Inner spacing increases with larger token values.
7. Action: Set `padding=none`, `paddingX=lg`, `paddingY=sm`.
8. Expect: Horizontal spacing is larger than vertical spacing.
9. Action: Set `maxWidth=narrow`, then `wide`.
10. Expect: Width cap changes; `wide` visibly allows a larger max width than `narrow`.
11. Note: `jp-box` has no color styling APIs, so accent changes may have no obvious visual effect here.

### A2. `jp-stack`

1. Action: Open `Primitives/Layout/Stack`.
2. Action: Change `gap` through `sm`, `md`, `xl`.
3. Expect: Vertical space between children increases in that order.
4. Action: Change `align` to `start`, `center`, `end`, `stretch`.
5. Expect: Cross-axis alignment updates accordingly.
6. Action: Change `justify` to `start`, `center`, `end`, `between`.
7. Expect: Vertical distribution changes accordingly (`between` pushes first/last apart).
8. Action: Set `as=nav`.
9. Expect: Root tag becomes `<nav>`.

### A3. `jp-inline`

1. Action: Open `Primitives/Layout/Inline`.
2. Action: Toggle `wrap=true` then `wrap=false`.
3. Expect: `wrap=true` allows line wrapping; `wrap=false` keeps one line and may clip/compress.
4. Action: Set `justify=between`.
5. Expect: Children spread across available row width.
6. Action: Set `as=nav`.
7. Expect: Root tag becomes `<nav>`.

### A4. `jp-grid`

1. Action: Open `Primitives/Layout/Grid` story `Fixed`.
2. Action: Set `columns` to `1`, `2`, `3`, `4`, `6`, `12`.
3. Expect: Grid track count updates to the selected value.
4. Action: Switch to story `Auto Fit`.
5. Action: Resize viewport (at least `1440` then `390`).
6. Expect: Cards reflow to fewer columns at smaller width, never dropping below one column.
7. Action: In `Auto Fit`, set `minColumn=sm`, `md`, `lg`.
8. Expect: Inline style/computed template uses `--jp-size-column-min-sm/md/lg` respectively.

### A5. `jp-surface`

1. Action: Open `Primitives/Layout/Surface`.
2. Expect: Default root semantic tag is `section`.
3. Action: Change `tone` (for example `raised` to `subtle`).
4. Expect: Background color changes.
5. Action: Change `border` (`none`, `subtle`, `default`, `strong`).
6. Expect: Border visibility/strength changes.
7. Action: Change `elevation` (`none`, `raised`, `floating`, `overlay`).
8. Expect: Box shadow changes.
9. Action: Change `radius` (`sm` to `xl`) and `padding` (`sm` to `xl`).
10. Expect: Corner roundness and internal spacing both change.

### A6. `jp-text`

1. Action: Open `Primitives/Typography/Text`.
2. Action: Change `size` (`caption`, `body`, `body-lg`).
3. Expect: Font size changes and maps to semantic text-size tokens.
4. Action: Change `tone` (`primary`, `secondary`, `muted`, etc.).
5. Expect: Text color changes and maps to semantic text tokens.
6. Action: Change `weight` (`regular`, `medium`, `semibold`, `bold`).
7. Expect: Font weight changes.
8. Action: Set `truncate=true`.
9. Expect: Ellipsis behavior active (`white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`).
10. Action: Set `mono=true`.
11. Expect: Mono font token applied (`--jp-font-family-mono`).
12. Action: Inspect margins.
13. Expect: Text root margin is `0`.

### A7. `jp-heading`

1. Action: Open `Primitives/Typography/Heading`.
2. Action: Change `as` through `h1`..`h6`.
3. Expect: Actual rendered heading tag matches selected value.
4. Action: Keep `size=auto`, test `as=h1/h2`.
5. Expect: Auto maps to `display` size for `h1/h2`.
6. Action: Keep `size=auto`, test `as=h3/h4/h5/h6`.
7. Expect: Auto maps to `title` size for `h3..h6`.
8. Action: Set explicit `size=display` while `as=h6`.
9. Expect: Explicit size overrides auto mapping.
10. Action: Inspect margins.
11. Expect: Heading root margin is `0`.

---

## B. Storybook Composition Validation

Open story: `Compositions/Phase 2/Layout Dashboard`.

1. Action: Load story at default globals.
2. Expect: No runtime errors.
3. Expect: Header section appears with title and supporting text.
4. Expect: KPI card row appears (Active sessions, Error rate, Avg response).
5. Expect: Activity and Insights blocks appear.
6. Expect: Recent Events block appears with multiple rows.

Primitive composition checks:

1. Action: Inspect DOM in Storybook iframe.
2. Expect: Composition uses Phase 2 primitives (`jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-text`, `jp-heading`).
3. Expect: No `lib-ui` usage.

Global theming checks:

1. Action: Toggle Storybook toolbar `accent` from `neon` to `cobalt`.
2. Expect: Accent-driven values update (notably accent color token consumers).
3. Action: Toggle `density` from `default` to `compact`.
4. Expect: Spacing/control density tightens across layout.
5. Note: Some text labels may be informational snapshots; prioritize actual style/token changes.

---

## C. Playground Route + Composition Validation

Open `http://localhost:4200/`.

1. Action: Load root path.
2. Expect: Redirect to `/phase-2-dashboard`.
3. Action: Load `http://localhost:4200/phase-2-dashboard` directly.
4. Expect: Route loads directly without errors.

Page-content checks:

1. Expect: Main heading `Phase 2 Layout Dashboard` visible.
2. Expect: KPI section + Activity + Insights + Recent Events sections all visible.
3. Expect: No browser console runtime errors.

Composition checks:

1. Action: Inspect DOM.
2. Expect: Uses the same Phase 2 primitives as Storybook composition.
3. Expect: No `lib-ui` usage.

---

## D. Responsive + Layout Behavior

Test widths: `1440`, `1024`, `768`, `390`.

At each width:

1. Action: Reload `/phase-2-dashboard`.
2. Expect: No horizontal page overflow.
3. Expect: Auto-fit grid reflows naturally (fewer columns at narrower widths).
4. Expect: Fixed two-column grid remains stable (2 columns) and does not overflow.
5. Expect: Typography remains readable and heading hierarchy remains visually clear.

Practical expectations by size:

1. `1440`: spacious layout, auto-fit typically shows more columns.
2. `1024`: still desktop/tablet-friendly with balanced spacing.
3. `768`: tighter layout; auto-fit should reduce columns.
4. `390`: mobile-tight; no horizontal scroll; content remains legible.

---

## E. Token + Theme Behavior (Manual)

On Playground (`/phase-2-dashboard`), run in DevTools console:

```js
document.documentElement.setAttribute('data-jp-accent', 'cobalt');
document.documentElement.setAttribute('data-jp-density', 'compact');
```

Verify with token reads:

```js
({
  accentSolid: getComputedStyle(document.documentElement)
    .getPropertyValue('--jp-color-accent-solid')
    .trim(),
  spaceMd: getComputedStyle(document.documentElement)
    .getPropertyValue('--jp-space-md')
    .trim(),
  controlMd: getComputedStyle(document.documentElement)
    .getPropertyValue('--jp-size-control-md')
    .trim(),
});
```

Expected values:

1. Default (no attrs):
   - `--jp-color-accent-solid` = `#22c7bd` (neon)
   - `--jp-space-md` = `1rem`
   - `--jp-size-control-md` = `1.5rem`
2. With `data-jp-accent="cobalt"` + `data-jp-density="compact"`:
   - `--jp-color-accent-solid` = `#4674d0`
   - `--jp-space-md` = `0.75rem`
   - `--jp-size-control-md` = `1.25rem`

Reset:

```js
document.documentElement.removeAttribute('data-jp-accent');
document.documentElement.removeAttribute('data-jp-density');
```

Expectation after reset: values return to default set.

---

## F. Semantics + Accessibility Smoke

1. Action: Inspect heading structure.
2. Expect: Exactly one meaningful `h1`; lower levels (`h2+`) used logically.
3. Action: Inspect landmark usage.
4. Expect: Landmark tags are semantically appropriate (`section`, optional `nav`, etc.), and no invalid duplication of page-level landmarks.
5. Action: Check text contrast in default theme.
6. Expect: Text remains clearly readable against backgrounds.
7. Action: Check label wiring (`label[for]`) if present.
8. Expect: No invalid `for` references and no duplicate/invalid label associations introduced by primitives.

Note: This epic is layout/typography-focused and mostly non-interactive; accessibility checks are structural/style smoke checks.

---

## G. Deprecation Path Validation (`Ui` / `lib-ui`)

Run:

```bash
rg -n "deprecated|lib-ui|selector: 'lib-" libs/ui/src libs/ui/eslint.config.mjs
```

Expect:

1. `Ui` export still exists in `libs/ui/src/index.ts` and is explicitly deprecated.
2. `Ui` component (`lib-ui`) remains explicitly deprecated in source.
3. Lint config includes a narrow selector exception for the legacy `lib-ui` component only.

Run:

```bash
rg -n "selector:\s*'lib-" libs/ui/src/lib/primitives
```

Expect:

1. No matches (no new primitive uses legacy `lib-*` namespace).

Run:

```bash
rg --files libs/ui/src/lib | rg "ui\.stories\.ts"
```

Expect:

1. No legacy `Ui` story in canonical primitive story set.

---

## H. Regression Checks for Locked Decisions

### H1. Token-only API surfaces

Run:

```bash
rg -n "input\([^)]*(style|class)|@Input\(\)\s*(style|class)" libs/ui/src/lib/primitives
```

Expect:

1. No arbitrary style passthrough inputs (`style`, `class`, etc.) on primitives.

### H2. Semantic `as` rendering

Action:

1. In Storybook, switch `as` across primitives that support it.

Expect:

1. Rendered DOM tag changes to selected semantic value.

### H3. No `display: contents` baseline

Run:

```bash
rg -n "display:\s*contents" libs/ui/src
```

Expect:

1. No usage in baseline primitive architecture.

### H4. Dashboard present in both surfaces

Expect files exist and are in use:

1. Storybook composition story: `libs/ui/src/lib/primitives/phase2-layout-dashboard.stories.ts`
2. Playground page: `apps/playground/src/app/pages/phase-2-dashboard/phase-2-dashboard.page.*`

### H5. CI includes Chromium validation path

Run:

```bash
rg -n "playwright install --with-deps chromium|ui:test-storybook|playground-e2e:e2e -- --project=chromium" .github/workflows/ci.yml
```

Expect:

1. CI workflow includes browser install and Chromium-based Storybook/Playwright checks.

---

## Defect Logging Guidance

If any step fails, capture:

1. Story/route URL
2. Control values used
3. Screenshot
4. Console error stack
5. Observed vs expected behavior

---

## Pass/Fail Sign-Off Template

```md
## Phase 2 Epic 2 Manual QA Result

- Date:
- Tester:
- Environment (OS/Browser):

- Storybook primitives: PASS/FAIL
- Storybook dashboard composition: PASS/FAIL
- Playground /phase-2-dashboard route: PASS/FAIL
- Responsive behavior (1440/1024/768/390): PASS/FAIL
- Accent + density token switching: PASS/FAIL
- Semantics/accessibility smoke: PASS/FAIL
- `Ui`/`lib-ui` deprecation checks: PASS/FAIL
- Locked decision regression checks: PASS/FAIL

### Issues Found

1.
2.
3.

### Final Decision

- READY / NOT READY
```
