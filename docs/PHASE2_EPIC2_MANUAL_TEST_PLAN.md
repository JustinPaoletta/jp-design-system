# Phase 2 Epic 2 — Manual QA Record

Branch: `phase2Epic2` · PR: [#3](https://github.com/JustinPaoletta/jp-design-system/pull/3)

**Last updated:** 2026-07-04

---

## Summary

Phase 2 Epic 2 manual QA is **complete**. All automated and manual checks passed on
2026-07-04. The milestone is ready to merge via PR #3.

| Area                              | Status      | Notes                                         |
| --------------------------------- | ----------- | --------------------------------------------- |
| Automated gate (full suite)       | ✅ **PASS** | All Step 1 commands green (2026-07-04)        |
| Layout primitives (Storybook)     | ✅ **PASS** | Box, Stack, Inline, Grid, Surface             |
| Typography primitives (Storybook) | ✅ **PASS** | Text, Heading                                 |
| Dashboard composition (Storybook) | ✅ **PASS** | `Compositions/Layout Dashboard` → `Dashboard` |
| Showcase route                    | ✅ **PASS** | `/phase-2-dashboard`                          |
| Responsive (Showcase)             | ✅ **PASS** | 1440 / 1024 / 768 / 390 viewports             |
| Regression grep                   | ✅ **PASS** | All 3 `rg` commands returned no matches       |

---

## Post-QA merge sequence

1. Resolve any open review threads on PR #3.
2. Merge PR #3 (`phase2Epic2` → `master`).
3. Merge PR #4 (`standardizeApps` — release/docs standardization).
4. Rename `master` → `main` as a separate repo operation (update branch protection,
   local clones, and any doc references).
5. Start **Phase 3 — App Shell** ([JP_ROADMAP.md](./JP_ROADMAP.md)).

---

## Step 1 — Automated gate

Run from repo root to re-verify before merge:

```bash
npm ci
npm run tokens:build
npm run format:check
npm run lint
npm run test
npm run build
npx nx run ui:test-storybook
npx nx run showcase-e2e:e2e -- --project=chromium
```

All commands must pass.

---

## Step 2 — Dev servers

```bash
npx nx run ui:storybook
```

```bash
npx nx run showcase:serve
```

Showcase URL: `http://localhost:4200/phase-2-dashboard`

---

## Step 3 — Manual checks (reference)

### Primitive stories

| Story   | Path                            | Status  |
| ------- | ------------------------------- | ------- |
| Box     | `Primitives/Layout/Box`         | ✅ PASS |
| Stack   | `Primitives/Layout/Stack`       | ✅ PASS |
| Inline  | `Primitives/Layout/Inline`      | ✅ PASS |
| Grid    | `Primitives/Layout/Grid`        | ✅ PASS |
| Surface | `Primitives/Layout/Surface`     | ✅ PASS |
| Text    | `Primitives/Typography/Text`    | ✅ PASS |
| Heading | `Primitives/Typography/Heading` | ✅ PASS |

The **accent toolbar is disabled** on primitive stories by design. Test accent and
density on the dashboard composition story and Showcase route instead.

### Box — ✅ PASS

- [x] `padding="lg"` + `paddingX="none"` → horizontal padding clears, vertical stays
- [x] `padding="lg"` + `paddingY="none"` → vertical padding clears, horizontal stays
- [x] `maxWidth` changes (`narrow`, `wide`) update the width cap
- [x] `as` changes the root tag (`section`, `article`, `main`, `nav`)

**Helpful stories:** `PaddingXOverride`, `PaddingYOverride`, `MaxWidthNarrow`, `SemanticSection`

`jp-box` is a structural wrapper (padding + max-width only). Visual panels use `jp-surface`.

### Stack — ✅ PASS

- [x] Default story renders; controls update gap, align, justify
- [x] `SpaceBetween` and `Centered` stories show distribution presets

### Inline — ✅ PASS

- [x] Default story renders; controls update gap, align, justify, wrap
- [x] `WrapStress` — items reflow when viewport is narrow (wrap=true)
- [x] `NoWrap` — items stay on one row (wrap=false)

### Grid — ✅ PASS

- [x] Default story: changing `columns` updates column count
- [x] AutoFit story: resize to mobile → cards reflow, no horizontal overflow

### Surface — ✅ PASS

- [x] Changing `tone`, `border`, `elevation`, `radius`, `padding` each produces a visible change
- [x] `ElevationLadder` shows all elevation steps side-by-side

### Heading — ✅ PASS

Design: `jp-heading` has **no `size` prop**. The `as` level (`h1`–`h6`) sets both
the HTML tag and font size via per-level tokens. See [PRIMITIVES.md](./PRIMITIVES.md).

- [x] `as="h1"`–`h6` → rendered tag matches; each step down is visibly smaller
- [x] Controls panel shows only `as`, `tone`, `weight` (no `size`)

### Text — ✅ PASS

Design: `jp-text` separates semantic tag (`as`) from visual size (`size`).
Inline tags stay inline. See [PRIMITIVES.md](./PRIMITIVES.md).

- [x] `as="span"`, `small`, `strong`, `em`, `label` → tag matches and **stays inline**
- [x] `truncate: false` → text wraps when container is narrow
- [x] `truncate: true` → single line with ellipsis when container is narrow

### Dashboard composition — ✅ PASS

Open `Compositions/Layout Dashboard` → `Dashboard`.

- [x] Header, KPI cards, Activity, Insights, Recent Events all render
- [x] Toggle **accent** (`neon` ↔ `cobalt`) → accent badge, rule, and KPI accent value change
- [x] Toggle **density** (`default` ↔ `compact`) → spacing tightens

### Showcase route — ✅ PASS

- [x] `/` redirects to `/phase-2-dashboard`
- [x] Page loads with no console errors
- [x] Same dashboard sections as Storybook
- [x] No legacy `lib-ui` on the page

### Responsive — ✅ PASS

At widths **1440**, **1024**, **768**, **390** on `/phase-2-dashboard`:

- [x] No horizontal overflow
- [x] KPI grid reflows cleanly (3 → 3 → 2 → 1 columns)
- [x] Typography stays legible

### Regression — ✅ PASS

```bash
rg -n "selector:\\s*'lib-" libs/ui/src/lib/primitives
rg -n "input\\([^)]*(style|class)|@Input\\(\\)\\s*(style|class)" libs/ui/src/lib/primitives
rg -n "display:\\s*contents" libs/ui/src
```

All three commands returned **no matches** (exit code 1).

---

## Step 4 — Start Phase 3 (App Shell)

After PRs #3 and #4 are merged, begin **Phase 3, Epic 3** from [JP_ROADMAP.md](./JP_ROADMAP.md).

| Component / behavior | What it does                                   |
| -------------------- | ---------------------------------------------- |
| `jp-app-shell`       | Root layout wrapper for dashboard pages        |
| Sidebar collapse     | Collapse/expand the nav sidebar                |
| Nav item states      | Active, hover, and focus states for navigation |
| Mobile drawer        | Sidebar becomes a drawer on small viewports    |

**How to start:**

1. Pull the latest default branch after merges.
2. Create a feature branch (e.g. `phase3-app-shell`).
3. Scaffold `jp-app-shell` in `libs/ui` following existing primitive patterns.
4. Wire it into a new Showcase route and Storybook story.
5. Keep using tokens and existing layout primitives inside the shell.

---

## If something fails (re-test)

Record:

1. Story or URL
2. Control values used
3. Screenshot
4. Console output
5. Expected vs actual

---

## Sign-off

```md
## Phase 2 Epic 2 Manual QA

- Date: 2026-07-04
- Branch: phase2Epic2

- [x] Automated gate: PASS
- [x] Layout primitive stories: PASS (Box, Stack, Inline, Grid, Surface)
- [x] Typography primitive stories: PASS (Text, Heading)
- [x] Dashboard story: PASS
- [x] Showcase route: PASS
- [x] Responsive: PASS
- [x] Regression: PASS

### Issues

None.

### Decision

READY TO MERGE PR #3
```
