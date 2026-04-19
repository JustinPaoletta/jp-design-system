# Phase 2 Epic 2 Manual Test Plan

## Purpose

Use this checklist to manually validate the Phase 2 layout primitives and the
dashboard composition added on the `phase2Epic2` branch.

Primary goals:

1. Confirm each primitive renders with the expected semantic tag and token-based styling.
2. Confirm the Storybook dashboard composition is built entirely from Phase 2 primitives.
3. Confirm the Playground dashboard route works end to end.
4. Confirm accent and density token switching works in Storybook and Playground.
5. Confirm the legacy `Ui` / `lib-ui` compatibility path remains intentionally limited.

---

## Branch Artifacts

Before starting manual QA, confirm the branch includes these artifacts:

```bash
rg -n "Compositions/Phase 2/Layout Dashboard|Primitives/Layout/Box|Primitives/Typography/Text" libs/ui/src
rg -n "phase-2-dashboard" apps/playground/src/app
```

Expect:

1. Primitive stories exist under `libs/ui/src/lib/primitives`.
2. `libs/ui/src/lib/primitives/phase2-layout-dashboard.stories.ts` exists.
3. `apps/playground/src/app/pages/phase-2-dashboard/` exists.
4. `apps/playground/src/app/app.routes.ts` registers `/phase-2-dashboard`.

---

## Prerequisites

1. Install dependencies:

```bash
npm ci
```

2. Build and validate tokens:

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

## Fast Preflight

Run this before the manual matrix:

```bash
npm run format:check
npm run lint
npm run test
npx nx run ui:test-storybook
npx nx run playground-e2e:e2e -- --project=chromium
npm run build
```

Expect:

1. All commands pass.
2. If any command fails, stop manual QA and resolve it first.

---

## Manual Test Matrix

Keep DevTools open during testing:

1. `Console` tab for runtime errors and warnings.
2. `Elements` and `Computed` tabs for rendered tags and computed styles.

### A. Storybook Primitive Validation

Open these stories in Storybook:

1. `Primitives/Layout/Box`
2. `Primitives/Layout/Stack`
3. `Primitives/Layout/Inline`
4. `Primitives/Layout/Grid`
5. `Primitives/Layout/Surface`
6. `Primitives/Typography/Text`
7. `Primitives/Typography/Heading`

For every primitive:

1. Load the story with defaults.
2. Confirm the component renders visibly.
3. Confirm the Storybook console stays clean while changing controls.
4. Confirm computed styles resolve through `var(--jp-...)` tokens where applicable.

#### A1. `jp-box`

1. Change `as` through `section`, `article`, `main`, and `nav`.
2. Expect the rendered root tag to match the selected semantic tag.
3. Change `padding` through `none`, `md`, and `xl`.
4. Expect internal spacing to change with token size.
5. Set `padding="lg"` and `paddingX="none"`.
6. Expect horizontal padding to clear while vertical padding remains `lg`.
7. Set `padding="lg"` and `paddingY="none"`.
8. Expect vertical padding to clear while horizontal padding remains `lg`.
9. Set `maxWidth="narrow"` and then `maxWidth="wide"`.
10. Expect the width cap to expand for `wide`.

#### A2. `jp-stack`

1. Change `gap` through `sm`, `md`, and `xl`.
2. Expect vertical space between children to increase in that order.
3. Change `align` to `start`, `center`, `end`, and `stretch`.
4. Expect cross-axis alignment to update accordingly.
5. Change `justify` to `start`, `center`, `end`, and `between`.
6. Expect vertical distribution to update accordingly.

#### A3. `jp-inline`

1. Toggle `wrap` between `true` and `false`.
2. Expect wrapping behavior to change accordingly.
3. Set `justify="between"`.
4. Expect children to spread across the available row width.
5. Set `as="nav"`.
6. Expect the rendered root tag to become `<nav>`.

#### A4. `jp-grid`

1. In the default story, change `columns` to `1`, `2`, `3`, `4`, `6`, and `12`.
2. Expect the fixed grid track count to follow the selected value.
3. Open the `AutoFit` story.
4. Resize the viewport from desktop to mobile widths.
5. Expect cards to reflow down to fewer columns without horizontal overflow.
6. Change `minColumn` through `sm`, `md`, and `lg`.
7. Expect the computed grid template to reflect the matching column-min token.

#### A5. `jp-surface`

1. Confirm the default semantic tag is `section`.
2. Change `tone`.
3. Expect background styling to change.
4. Change `border`.
5. Expect border visibility and strength to change.
6. Change `elevation`.
7. Expect the shadow treatment to change.
8. Change `radius` and `padding`.
9. Expect corner radius and internal spacing to change.

#### A6. `jp-text`

1. Change `size`, `tone`, `weight`, `truncate`, and `mono`.
2. Expect font size, tone, weight, truncation, and mono font behavior to update accordingly.
3. Change `as` through `span`, `small`, `strong`, `em`, and `label`.
4. Expect the rendered tag to match the selected inline tag.
5. Place the rendered text inside a sentence or inline row and confirm it remains inline.
6. Expect inline tags not to introduce forced line breaks or block layout.
7. Inspect margins.
8. Expect the rendered text element margin to be `0`.

#### A7. `jp-heading`

1. Change `as` through `h1` to `h6`.
2. Expect the rendered heading tag to match the selected value.
3. Keep `size="auto"` and test `h1` and `h2`.
4. Expect auto sizing to resolve to `display`.
5. Keep `size="auto"` and test `h3` through `h6`.
6. Expect auto sizing to resolve to `title`.
7. Set `size="display"` while `as="h6"`.
8. Expect the explicit size to override auto mapping.
9. Inspect margins.
10. Expect the rendered heading element margin to be `0`.

### B. Storybook Composition Validation

Open `Compositions/Phase 2/Layout Dashboard`.

1. Confirm the dashboard loads with no runtime errors.
2. Confirm the page header, KPI cards, Activity block, Insights block, and Recent Events block all render.
3. Inspect the Storybook iframe DOM.
4. Expect the composition to use only `jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-text`, and `jp-heading`.
5. Expect no `lib-ui` usage in the composition.
6. Toggle the Storybook toolbar `accent` between `neon` and `cobalt`.
7. Expect accent-driven values to update.
8. Toggle `density` between `default` and `compact`.
9. Expect spacing and density to tighten in compact mode.

### C. Playground Route Validation

Open `http://localhost:4200/`.

1. Confirm the root path redirects to `/phase-2-dashboard`.
2. Load `http://localhost:4200/phase-2-dashboard` directly.
3. Confirm the route loads without console errors.
4. Confirm the main heading `Phase 2 Layout Dashboard` is visible.
5. Confirm the KPI cards, Activity, Insights, and Recent Events sections are visible.
6. Inspect the DOM.
7. Expect the page to use the same Phase 2 primitives as the Storybook composition.
8. Expect no `lib-ui` usage on the page.

### D. Responsive Behavior

Test widths `1440`, `1024`, `768`, and `390`.

At each width:

1. Reload `/phase-2-dashboard`.
2. Confirm there is no horizontal page overflow.
3. Confirm the auto-fit KPI grid reflows naturally as the viewport narrows.
4. Confirm the two-column content grid remains readable and does not overflow.
5. Confirm typography remains legible and hierarchy stays clear.

### E. Token and Theme Behavior

In Storybook:

1. Use the toolbar to switch `accent` between `neon` and `cobalt`.
2. Use the toolbar to switch `density` between `default` and `compact`.
3. Confirm visible token-driven changes occur.

In Playground DevTools:

```js
document.documentElement.setAttribute('data-jp-accent', 'cobalt');
document.documentElement.setAttribute('data-jp-density', 'compact');
```

Then inspect:

```js
({
  accentSolid: getComputedStyle(document.documentElement).getPropertyValue('--jp-color-accent-solid').trim(),
  spaceMd: getComputedStyle(document.documentElement).getPropertyValue('--jp-space-md').trim(),
  controlMd: getComputedStyle(document.documentElement).getPropertyValue('--jp-size-control-md').trim(),
});
```

Expect:

1. Accent and density values change from the default token set.
2. Resetting the attributes returns the default values.

### F. Deprecation and Regression Checks

Run:

```bash
rg -n "deprecated|lib-ui|selector: 'lib-" libs/ui/src libs/ui/eslint.config.mjs
rg -n "selector:\\s*'lib-" libs/ui/src/lib/primitives
rg --files libs/ui/src/lib | rg "ui\\.stories\\.ts"
rg -n "input\\([^)]*(style|class)|@Input\\(\\)\\s*(style|class)" libs/ui/src/lib/primitives
rg -n "display:\\s*contents" libs/ui/src
```

Expect:

1. `Ui` remains exported only as an explicitly deprecated compatibility surface.
2. `lib-ui` remains the only allowed legacy selector exception.
3. No new primitives use the `lib-*` namespace.
4. No legacy `Ui` story remains in the primitive story set.
5. No primitive exposes arbitrary `style` or `class` passthrough inputs.
6. No primitive relies on `display: contents`.

### G. Defect Logging

If any step fails, capture:

1. Story or route URL.
2. Control values used.
3. Screenshot.
4. Console stack trace.
5. Observed behavior versus expected behavior.

---

## Sign-Off Template

```md
## Phase 2 Epic 2 Manual QA Result

- Date:
- Tester:
- Environment:

- Storybook primitives: PASS/FAIL
- Storybook dashboard composition: PASS/FAIL
- Playground route: PASS/FAIL
- Responsive behavior: PASS/FAIL
- Accent and density switching: PASS/FAIL
- Deprecation and regression checks: PASS/FAIL

### Issues Found

1.
2.
3.

### Final Decision

- READY / NOT READY
```
