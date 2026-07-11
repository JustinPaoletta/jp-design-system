# Phase 3 — Manual Test Checklist

Use this after automated gates are green (`lint`, unit tests + coverage, Storybook
interaction tests, Showcase Chromium e2e). Record failures in the PR description;
do not create a separate QA ledger.

**Related:** [docs/PHASE3_EPIC3_APP_SHELL_PLAN.md](./docs/PHASE3_EPIC3_APP_SHELL_PLAN.md) ·
[docs/PRIMITIVES.md](./docs/PRIMITIVES.md) · PR #7 (`phase3-app-shell`)

---

## What you are validating

Phase 3 delivers a token-driven app shell:

| Piece                   | What it should do                                               |
| ----------------------- | --------------------------------------------------------------- |
| `jp-app-shell`          | Sidebar + main layout; desktop collapse; mobile drawer          |
| `jp-app-shell-nav-item` | Nav rows with active accent signal, hover, focus-visible        |
| Showcase                | `/phase-3-dashboard` composition; `/phase-2-dashboard` still OK |
| Storybook               | Primitive stories + `Compositions/App Shell Dashboard`          |

**Not in Phase 3 (do not file as bugs):** formal `jp-button` / icon-button APIs,
router-aware nav inside the primitive, user menu, breadcrumbs, visual regression
baselines.

---

## Setup

### Showcase

```bash
npx nx run showcase:serve
```

Open http://localhost:4200

### Storybook

```bash
npx nx run ui:storybook
```

Open http://localhost:4400

Use browser DevTools device mode for mobile checks (390×844 is the reference).

---

## 1. Showcase — routing and composition

| #   | Action                     | Expect                                                                  |
| --- | -------------------------- | ----------------------------------------------------------------------- |
| 1.1 | Visit `/`                  | Redirects to `/phase-3-dashboard`                                       |
| 1.2 | Read the page              | Heading **Phase 3 App Shell Dashboard**; metric cards + activity panels |
| 1.3 | Inspect chrome             | Persistent left sidebar + main content; no `lib-ui` usage               |
| 1.4 | Check nav                  | Overview / Phase 2 / Activity / Settings; **Overview** is active        |
| 1.5 | Visit `/phase-2-dashboard` | Phase 2 layout-only page still works (no app shell)                     |
| 1.6 | Accent / density meta      | Page shows `accent:` and `density:` from document attributes            |

---

## 2. Desktop shell — collapse (1440px and 1024px)

Do both widths. Sidebar should stay visible; no horizontal page scroll.

| #   | Action                    | Expect                                                                |
| --- | ------------------------- | --------------------------------------------------------------------- |
| 2.1 | Load `/phase-3-dashboard` | Expanded sidebar ~`16rem` (256px); main fills remaining width         |
| 2.2 | Note sidebar surface      | Sunken shell background; right border uses shell border token         |
| 2.3 | Click collapse (chevron)  | Sidebar narrows to ~`4rem` icon rail; main expands; chevron rotates   |
| 2.4 | Labels when collapsed     | Nav labels visually hidden (screen-reader text may remain)            |
| 2.5 | Click collapse again      | Sidebar expands; labels return                                        |
| 2.6 | Collapse toggle a11y      | `aria-label` flips Collapse/Expand; `aria-pressed` tracks state       |
| 2.7 | Sidebar landmark          | `aside` has `aria-label` (default **Primary**); `aria-expanded` flips |

---

## 3. Nav items — states and accent

| #   | Action                                      | Expect                                                             |
| --- | ------------------------------------------- | ------------------------------------------------------------------ |
| 3.1 | Inspect **Overview**                        | Active: stronger text, subtle bg, **left accent bar** (not a fill) |
| 3.2 | Hover inactive items                        | Hover background; text brightens; cursor pointer                   |
| 3.3 | Tab to a nav item                           | Visible focus ring (`--jp-color-focus-ring`)                       |
| 3.4 | Active item semantics                       | `aria-current="page"` on the active control                        |
| 3.5 | Storybook → **App Shell Nav Item → Active** | Same accent indicator in isolation                                 |
| 3.6 | Accent toolbar neon → cobalt                | Active indicator / focus ring follow accent family                 |
| 3.7 | Density → compact                           | Nav row padding tightens; layout stays coherent                    |

---

## 4. Mobile drawer (390px / &lt; 768px)

| #    | Action                       | Expect                                                  |
| ---- | ---------------------------- | ------------------------------------------------------- |
| 4.1  | Load at 390px                | Sidebar off-canvas; only main + top mobile bar visible  |
| 4.2  | Find menu (hamburger)        | Visible in mobile bar; `aria-expanded="false"`          |
| 4.3  | Open menu                    | Drawer slides in from left; dimmed scrim over main      |
| 4.4  | Menu button when open        | `aria-expanded="true"`; label reflects close/open       |
| 4.5  | Focus on open                | Focus moves into the drawer (first focusable control)   |
| 4.6  | Tab while open               | Focus stays trapped inside the drawer                   |
| 4.7  | Press Escape                 | Drawer closes; scrim gone; focus returns to menu button |
| 4.8  | Re-open, click scrim         | Drawer closes                                           |
| 4.9  | Re-open, click drawer X      | Drawer closes                                           |
| 4.10 | Main while open              | Main is non-interactive (`inert` / not reachable)       |
| 4.11 | Resize to desktop while open | Drawer state clears; desktop sidebar layout returns     |

---

## 5. Storybook — primitives and composition

| Story                                        | Check                                                        |
| -------------------------------------------- | ------------------------------------------------------------ |
| **Primitives / Layout / App Shell**          | Default, Collapsed, MobileDrawerOpen; collapse control works |
| **Primitives / Layout / App Shell Nav Item** | Default, Active, FocusVisible, AsButton                      |
| **Compositions / App Shell Dashboard**       | Full shell + dashboard; accent + density toolbars enabled    |

Composition-specific:

| #   | Action                    | Expect                                             |
| --- | ------------------------- | -------------------------------------------------- |
| 5.1 | Switch accent neon/cobalt | Active nav indicator and accents update            |
| 5.2 | Switch density compact    | Shell/nav spacing tightens without breaking layout |
| 5.3 | Collapse in composition   | Same rail behavior as Showcase                     |

---

## 6. Keyboard and accessibility spot-check

| #   | Action                           | Expect                                                    |
| --- | -------------------------------- | --------------------------------------------------------- |
| 6.1 | Tab through shell chrome         | Collapse / menu / nav / close all focusable               |
| 6.2 | Focus rings                      | Always visible on keyboard focus                          |
| 6.3 | Contrast (neon + cobalt)         | Nav text and active states readable on shell bg (WCAG AA) |
| 6.4 | `prefers-reduced-motion: reduce` | Shell width/transform transitions minimal or off          |

---

## 7. Regression / “still works”

| #   | Action                 | Expect                                      |
| --- | ---------------------- | ------------------------------------------- |
| 7.1 | `/phase-2-dashboard`   | Unchanged Phase 2 composition               |
| 7.2 | No horizontal overflow | 1440, 1024, 390                             |
| 7.3 | Token discipline       | No obvious hardcoded colors in shell chrome |

---

## Pass criteria

Phase 3 manual QA passes when:

1. Desktop collapse and mobile drawer behave as above on Showcase.
2. Active nav uses an accent **signal** (indicator), not a large accent fill.
3. Keyboard + focus management work for collapse and drawer.
4. Storybook composition responds to accent and density toolbars.
5. Phase 2 route remains intact.

If anything fails, note viewport, accent/density, and steps to reproduce on the PR.
