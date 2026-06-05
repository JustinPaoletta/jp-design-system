# Phase 2 Epic 2 Test Checklist

Use this to verify the Phase 2 primitives, the dashboard composition, and the
Playground route.

## Setup

Run:

```bash
npm ci
npm run tokens:build
npm run tokens:check
npx nx run ui:storybook
npx nx run playground:serve
```

## Stop Here If These Fail

Run:

```bash
npm run format:check
npm run lint
npm run test
npx nx run ui:test-storybook
npx nx run playground-e2e:e2e -- --project=chromium
npm run build
```

Expected:

1. Every command passes.
2. If any command fails, fix that first.

## Storybook: Primitive Stories

Open these stories:

1. `Primitives/Layout/Box`
2. `Primitives/Layout/Stack`
3. `Primitives/Layout/Inline`
4. `Primitives/Layout/Grid`
5. `Primitives/Layout/Surface`
6. `Primitives/Typography/Text`
7. `Primitives/Typography/Heading`

For every story:

1. It renders.
2. The console stays clean.
3. Control changes apply immediately.
4. Token-based styles resolve correctly.

Note:

1. The `accent` toolbar is intentionally disabled on primitive-only stories.
2. Test `accent` on the dashboard story and Playground route instead.

### Box

1. Change `as` to `section`, `article`, `main`, and `nav`.
2. Expected: the root tag matches the selected value.
3. Change `padding` to `none`, `md`, and `xl`.
4. Expected: inner spacing changes.
5. Set `padding="lg"` and `paddingX="none"`.
6. Expected: only horizontal padding clears.
7. Set `padding="lg"` and `paddingY="none"`.
8. Expected: only vertical padding clears.
9. Set `maxWidth="narrow"` and `maxWidth="wide"`.
10. Expected: the width cap changes.

### Stack

1. Change `gap` to `sm`, `md`, and `xl`.
2. Expected: space between items increases.
3. Change `align` to `start`, `center`, `end`, and `stretch`.
4. Expected: items shift or stretch correctly.
5. Change `justify` to `start`, `center`, `end`, and `between`.
6. Expected: items redistribute vertically.

### Inline

1. Toggle `wrap`.
2. Expected: wrapping turns on and off.
3. Set `justify="between"`.
4. Expected: items spread across the row.
5. Set `as="nav"`.
6. Expected: the root tag becomes `<nav>`.

### Grid

1. In the default story, change `columns` to `1`, `2`, `3`, `4`, and `6`.
2. Expected: the grid column count updates each time.
3. Open the `AutoFit` story.
4. Resize from desktop to mobile.
5. Expected: cards reflow without horizontal overflow.
6. Change `minColumn` to `sm`, `md`, and `lg`.
7. Expected: the minimum card width changes.

### Surface

1. Confirm the default root tag is `section`.
2. Change `tone`.
3. Expected: the background changes.
4. Change `border`.
5. Expected: border visibility and strength change.
6. Change `elevation`.
7. Expected: shadow depth changes.
8. Change `radius` and `padding`.
9. Expected: corner radius and internal spacing change.

### Text

1. Change `size`, `tone`, `weight`, `truncate`, and `mono`.
2. Expected: each visual change applies correctly.
3. Change `as` to `span`, `small`, `strong`, `em`, and `label`.
4. Expected: the rendered tag matches the selected value.
5. Expected: inline tags stay inline.
6. Expected: margin remains `0`.

### Heading

1. Change `as` from `h1` through `h6`.
2. Expected: the rendered heading tag matches.
3. Keep `size="auto"` and test `h1` and `h2`.
4. Expected: auto size resolves to `display`.
5. Keep `size="auto"` and test `h3` through `h6`.
6. Expected: auto size resolves to `title`.
7. Set `size="display"` while `as="h6"`.
8. Expected: explicit size overrides auto sizing.
9. Expected: margin remains `0`.

## Storybook: Dashboard Composition

Open `Compositions/Phase 2/Layout Dashboard`.

1. Confirm the story loads cleanly.
2. Confirm the header, KPI cards, Activity, Insights, and Recent Events render.
3. Confirm the composition uses only the Phase 2 primitives.
4. Toggle `accent` between `neon` and `cobalt`.
5. Expected: accent-driven elements update.
6. Toggle `density` between `default` and `compact`.
7. Expected: spacing tightens in compact mode.

## Playground Route

Test `http://localhost:4200/phase-2-dashboard`.

1. Open `/`.
2. Expected: it redirects to `/phase-2-dashboard`.
3. Open `/phase-2-dashboard` directly.
4. Expected: the page loads with no console errors.
5. Confirm the main heading and all dashboard sections render.
6. Confirm the page uses the same Phase 2 primitives as Storybook.
7. Confirm there is no legacy `lib-ui` usage on the page.

## Responsive Check

Test widths: `1440`, `1024`, `768`, `390`.

At each width:

1. Reload `/phase-2-dashboard`.
2. Confirm there is no horizontal overflow.
3. Confirm the KPI grid reflows cleanly.
4. Confirm the two-column content area stays readable.
5. Confirm typography stays legible.

## Accent and Density Check

In Storybook:

1. Test `accent` and `density` on `Compositions/Phase 2/Layout Dashboard`.
2. Expected: `accent` changes accent-only elements.
3. Expected: `density` tightens spacing in compact mode.

In Playground DevTools:

```js
document.documentElement.setAttribute('data-jp-accent', 'cobalt');
document.documentElement.setAttribute('data-jp-density', 'compact');
```

Expected:

1. Accent-driven elements switch to cobalt.
2. Spacing tightens.

Reset:

```js
document.documentElement.removeAttribute('data-jp-accent');
document.documentElement.removeAttribute('data-jp-density');
```

## Regression Check

Run:

```bash
rg -n "selector:\\s*'lib-" libs/ui/src/lib/primitives
rg -n "input\\([^)]*(style|class)|@Input\\(\\)\\s*(style|class)" libs/ui/src/lib/primitives
rg -n "display:\\s*contents" libs/ui/src
```

Expected:

1. No new primitive uses the `lib-*` namespace.
2. No primitive exposes arbitrary `style` or `class` passthrough inputs.
3. No primitive relies on `display: contents`.

## What To Record If Something Fails

1. Story or route URL.
2. The control values you used.
3. A screenshot.
4. Console output.
5. What happened vs what you expected.

## Sign-Off

```md
## Phase 2 Epic 2 Manual QA Result

- Date:
- Tester:
- Environment:

- Primitive stories: PASS/FAIL
- Dashboard story: PASS/FAIL
- Playground route: PASS/FAIL
- Responsive behavior: PASS/FAIL
- Accent and density: PASS/FAIL
- Regression checks: PASS/FAIL

### Issues Found

1.
2.
3.

### Final Decision

- READY / NOT READY
```
