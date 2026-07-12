# Manual Test Checklist — Phases 3–7

Use this after automated gates are green (`lint`, unit tests + coverage, Storybook
interaction tests, Showcase Chromium e2e). Record failures in the PR description;
do not create a separate QA ledger.

**Related plans:** [Phase 3](./docs/PHASE3_EPIC3_APP_SHELL_PLAN.md) ·
[Phase 4](./docs/PHASE4_EPIC4_CONTROLS_PLAN.md) ·
[Phase 5](./docs/PHASE5_EPIC5_DATA_DISPLAY_PLAN.md) ·
[Phase 6](./docs/PHASE6_EPIC6_FEEDBACK_OVERLAYS_PLAN.md) ·
[Phase 7](./docs/PHASE7_EPIC7_ASSISTANT_SYSTEM_PLAN.md) ·
[Primitive API](./docs/PRIMITIVES.md)

---

## Overview

Phases 3–7 build on each other inside the `jp-app-shell`. Validate the **current
milestone route** first (Showcase `/` redirect), then exercise that phase's
primitives, then spot-check earlier phase routes for regression.

| Phase | Milestone route      | Key deliverables                                                     |
| ----- | -------------------- | -------------------------------------------------------------------- |
| 3     | `/phase-3-dashboard` | `jp-app-shell`, `jp-app-shell-nav-item`, mobile drawer               |
| 4     | `/phase-4-controls`  | `jp-button`, `jp-icon-button`, input/textarea/select/checkbox/switch |
| 5     | `/phase-5-data`      | `jp-badge`, `jp-empty-state`, `jp-table`                             |
| 6     | `/phase-6-overlays`  | `jpFocusTrap`, tooltip, toast, dialog, popover, dropdown-menu        |
| 7     | `/phase-7-assistant` | `JpAssistantService`, trigger, message, panel                        |

**Out of scope for Phases 3–7 (do not file as bugs):** router-aware nav inside the
shell primitive, user menu, breadcrumbs, custom listbox/combobox, date picker, file
upload, form validation engine, sortable/filterable table columns, row selection,
virtualization, CDK Overlay / collision engine, nested modal stacks, LLM/streaming
runtime, markdown rendering, conversation persistence, visual regression baselines
(Phase 8).

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
Spot-check both **neon** and **cobalt** accents where noted.

---

## Shared regression routes

Run these when validating any phase ≥ 3 to confirm the stack still works.

| #   | Action                     | Expect                                                       |
| --- | -------------------------- | ------------------------------------------------------------ |
| R.1 | Visit `/phase-2-dashboard` | Phase 2 layout-only page still works (no app shell)          |
| R.2 | Visit `/phase-3-dashboard` | Shell + dashboard unchanged (see Phase 3 for full shell QA)  |
| R.3 | Visit `/phase-4-controls`  | Controls form inside shell (when phase ≥ 4)                  |
| R.4 | Visit `/phase-5-data`      | Data display page (when phase ≥ 5)                           |
| R.5 | Visit `/phase-6-overlays`  | Overlays page (when phase ≥ 6)                               |
| R.6 | Accent / density meta      | Page shows `accent:` and `density:` from document attributes |
| R.7 | No horizontal overflow     | 1440, 1024, and 390 viewports                                |
| R.8 | Token discipline           | No obvious hardcoded colors on chrome or new primitives      |

---

## Phase 3 — App Shell

### Showcase — routing and composition

| #   | Action                        | Expect                                                                  |
| --- | ----------------------------- | ----------------------------------------------------------------------- |
| 3.1 | Visit `/` (phase 3 milestone) | Redirects to `/phase-3-dashboard`                                       |
| 3.2 | Read the page                 | Heading **Phase 3 App Shell Dashboard**; metric cards + activity panels |
| 3.3 | Inspect chrome                | Persistent left sidebar + main content; no `lib-ui` usage               |
| 3.4 | Check nav                     | Overview / Phase 2 / Activity / Settings; **Overview** is active        |

### Desktop shell — collapse (1440px and 1024px)

Do both widths. Sidebar should stay visible; no horizontal page scroll.

| #    | Action                    | Expect                                                                |
| ---- | ------------------------- | --------------------------------------------------------------------- |
| 3.5  | Load `/phase-3-dashboard` | Expanded sidebar ~`16rem` (256px); main fills remaining width         |
| 3.6  | Note sidebar surface      | Sunken shell background; right border uses shell border token         |
| 3.7  | Click collapse (chevron)  | Sidebar narrows to ~`4rem` icon rail; main expands; chevron rotates   |
| 3.8  | Labels when collapsed     | Nav labels visually hidden (screen-reader text may remain)            |
| 3.9  | Click collapse again      | Sidebar expands; labels return                                        |
| 3.10 | Collapse toggle a11y      | `aria-label` flips Collapse/Expand; `aria-pressed` tracks state       |
| 3.11 | Sidebar landmark          | `aside` has `aria-label` (default **Primary**); `aria-expanded` flips |

### Nav items — states and accent

| #    | Action                                      | Expect                                                             |
| ---- | ------------------------------------------- | ------------------------------------------------------------------ |
| 3.12 | Inspect **Overview**                        | Active: stronger text, subtle bg, **left accent bar** (not a fill) |
| 3.13 | Hover inactive items                        | Hover background; text brightens; cursor pointer                   |
| 3.14 | Tab to a nav item                           | Visible focus ring (`--jp-color-focus-ring`)                       |
| 3.15 | Active item semantics                       | `aria-current="page"` on the active control                        |
| 3.16 | Storybook → **App Shell Nav Item → Active** | Same accent indicator in isolation                                 |
| 3.17 | Accent toolbar neon → cobalt                | Active indicator / focus ring follow accent family                 |
| 3.18 | Density → compact                           | Nav row padding tightens; layout stays coherent                    |

### Mobile drawer (390px / &lt; 768px)

| #    | Action                       | Expect                                                  |
| ---- | ---------------------------- | ------------------------------------------------------- |
| 3.19 | Load at 390px                | Sidebar off-canvas; only main + top mobile bar visible  |
| 3.20 | Find menu (hamburger)        | Visible in mobile bar; `aria-expanded="false"`          |
| 3.21 | Open menu                    | Drawer slides in from left; dimmed scrim over main      |
| 3.22 | Menu button when open        | `aria-expanded="true"`; label reflects close/open       |
| 3.23 | Focus on open                | Focus moves into the drawer (first focusable control)   |
| 3.24 | Tab while open               | Focus stays trapped inside the drawer                   |
| 3.25 | Press Escape                 | Drawer closes; scrim gone; focus returns to menu button |
| 3.26 | Re-open, click scrim         | Drawer closes                                           |
| 3.27 | Re-open, click drawer X      | Drawer closes                                           |
| 3.28 | Main while open              | Main is non-interactive (`inert` / not reachable)       |
| 3.29 | Resize to desktop while open | Drawer state clears; desktop sidebar layout returns     |

### Storybook — primitives and composition

| Story                                        | Check                                                        |
| -------------------------------------------- | ------------------------------------------------------------ |
| **Primitives / Layout / App Shell**          | Default, Collapsed, MobileDrawerOpen; collapse control works |
| **Primitives / Layout / App Shell Nav Item** | Default, Active, FocusVisible, AsButton                      |
| **Compositions / App Shell Dashboard**       | Full shell + dashboard; accent + density toolbars enabled    |

| #    | Action                    | Expect                                             |
| ---- | ------------------------- | -------------------------------------------------- |
| 3.30 | Switch accent neon/cobalt | Active nav indicator and accents update            |
| 3.31 | Switch density compact    | Shell/nav spacing tightens without breaking layout |
| 3.32 | Collapse in composition   | Same rail behavior as Showcase                     |

### Keyboard and accessibility (Phase 3)

| #    | Action                           | Expect                                                    |
| ---- | -------------------------------- | --------------------------------------------------------- |
| 3.33 | Tab through shell chrome         | Collapse / menu / nav / close all focusable               |
| 3.34 | Focus rings                      | Always visible on keyboard focus                          |
| 3.35 | Contrast (neon + cobalt)         | Nav text and active states readable on shell bg (WCAG AA) |
| 3.36 | `prefers-reduced-motion: reduce` | Shell width/transform transitions minimal or off          |

### Phase 3 pass criteria

1. Desktop collapse and mobile drawer behave as above on Showcase.
2. Active nav uses an accent **signal** (indicator), not a large accent fill.
3. Keyboard + focus management work for collapse and drawer.
4. Storybook composition responds to accent and density toolbars.
5. Phase 2 route remains intact (see [Shared regression routes](#shared-regression-routes)).

---

## Phase 4 — Core Controls

### Showcase — routing and shell composition

| #   | Action                        | Expect                                                   |
| --- | ----------------------------- | -------------------------------------------------------- |
| 4.1 | Visit `/` (phase 4 milestone) | Redirects to `/phase-4-controls`                         |
| 4.2 | Read the page                 | Heading **Phase 4 Controls**; form inside raised surface |
| 4.3 | Inspect chrome                | App shell sidebar + main; **Controls** nav item active   |
| 4.4 | Nav links                     | Phase 3 / Phase 2 links present                          |
| 4.5 | Icon button in header         | “More actions” icon button visible next to the heading   |

### Buttons (`jp-button`)

On `/phase-4-controls` and Storybook **Primitives → Controls → Button**.

| #    | Action                           | Expect                                                             |
| ---- | -------------------------------- | ------------------------------------------------------------------ |
| 4.6  | Inspect **Save** (primary)       | Accent solid fill; high-contrast label; not a large page wash      |
| 4.7  | Inspect **Cancel** (secondary)   | Neutral surface + border; primary text                             |
| 4.8  | Inspect **Reset** (ghost)        | No heavy fill; secondary text; hover softens background            |
| 4.9  | Inspect **Delete** (destructive) | Error-strong background (not accent); readable label               |
| 4.10 | Hover each variant               | Clear hover change; cursor pointer                                 |
| 4.11 | Storybook → **Disabled**         | Dimmed; not clickable; no strong hover                             |
| 4.12 | Storybook sizes sm / md / lg     | Height tracks control size tokens; padding coherent                |
| 4.13 | Accent neon → cobalt             | Primary fill follows accent family; destructive stays error tokens |
| 4.14 | Density → compact                | Button height/padding tightens without clipping labels             |

### Icon button (`jp-icon-button`)

| #    | Action                      | Expect                                                |
| ---- | --------------------------- | ----------------------------------------------------- |
| 4.15 | Showcase header icon button | Square control; icon centered                         |
| 4.16 | Hover / focus               | Visible hover + focus ring                            |
| 4.17 | Inspect accessible name     | `aria-label="More actions"` (or Storybook equivalent) |
| 4.18 | Storybook disabled          | Not activatable; muted appearance                     |

### Text fields (`jp-input`, `jp-textarea`, `jp-select`)

| #    | Action                       | Expect                                                            |
| ---- | ---------------------------- | ----------------------------------------------------------------- |
| 4.19 | Email input label            | Visible **Email** label associated with the control               |
| 4.20 | Type in Email                | Value updates; placeholder gone when filled                       |
| 4.21 | Hint text                    | “Used for account notifications.” visible under the field         |
| 4.22 | Notes textarea               | Multi-line; accepts text; same field chrome as input              |
| 4.23 | Role select                  | Native select; options selectable; value sticks                   |
| 4.24 | Focus each field             | Focus ring uses focus token; border may strengthen on hover/focus |
| 4.25 | Storybook **Invalid** states | Invalid border (error token); error message when provided         |
| 4.26 | Storybook **Disabled**       | Fields not editable; muted                                        |
| 4.27 | `aria-invalid` when invalid  | Present on the control when `invalid` is set                      |
| 4.28 | Density compact              | Field height/padding tightens; labels remain readable             |

### Selection controls (`jp-checkbox`, `jp-switch`)

| #    | Action                            | Expect                                                        |
| ---- | --------------------------------- | ------------------------------------------------------------- |
| 4.29 | Click checkbox label              | Toggles checked; label text is the hit target                 |
| 4.30 | Checked checkbox                  | Accent fill / check signal (not a huge accent block)          |
| 4.31 | Click switch                      | Toggles on/off; thumb moves                                   |
| 4.32 | Switch on                         | Track uses accent solid; `aria-checked` / role reflects state |
| 4.33 | Keyboard Space on focused control | Toggles state                                                 |
| 4.34 | Accent cobalt                     | Checked/on states follow cobalt accent                        |
| 4.35 | Disabled stories                  | Cannot toggle; muted                                          |

### Form interaction (Showcase)

| #    | Action                     | Expect                                                            |
| ---- | -------------------------- | ----------------------------------------------------------------- |
| 4.36 | Fill Email + Notes         | Values persist while interacting with other controls              |
| 4.37 | Change Role                | Selected option remains after blur                                |
| 4.38 | Toggle Subscribe + Compact | Both stay in sync with UI state                                   |
| 4.39 | Tab through the form       | Logical order: fields → checkbox → switch → buttons → icon button |

### Shell regression on the controls page

Phase 4 sits inside the shell — spot-check chrome still works here (full shell QA in [Phase 3](#phase-3--app-shell)).

| #    | Action (desktop ~1440) | Expect                                    |
| ---- | ---------------------- | ----------------------------------------- |
| 4.40 | Collapse sidebar       | Rail collapses; form reflows; no overflow |
| 4.41 | Expand again           | Labels return                             |

| #    | Action (mobile 390)     | Expect                               |
| ---- | ----------------------- | ------------------------------------ |
| 4.42 | Open menu drawer        | Drawer + scrim; form behind scrim    |
| 4.43 | Escape / scrim close    | Drawer closes; focus returns to menu |
| 4.44 | Use a field after close | Form still interactive               |

### Storybook — primitives and composition

| Story                                   | Check                                            |
| --------------------------------------- | ------------------------------------------------ |
| **Primitives / Controls / Button**      | Primary, Secondary, Ghost, Destructive, Disabled |
| **Primitives / Controls / Icon Button** | Default + disabled; aria-label present           |
| **Primitives / Controls / Input**       | Default, invalid, disabled                       |
| **Primitives / Controls / Textarea**    | Default, invalid                                 |
| **Primitives / Controls / Select**      | Options render; change value                     |
| **Primitives / Controls / Checkbox**    | Checked / unchecked / disabled                   |
| **Primitives / Controls / Switch**      | On / off / disabled                              |
| **Compositions / Controls Form**        | Full form; accent + density toolbars enabled     |

| #    | Action                   | Expect                                          |
| ---- | ------------------------ | ----------------------------------------------- |
| 4.45 | Accent neon → cobalt     | Primary button, focus, checked/on states update |
| 4.46 | Density → compact        | Controls tighten; form layout stays coherent    |
| 4.47 | Interact with all fields | Same behaviors as Showcase                      |

### Keyboard and accessibility (Phase 4)

| #    | Action                           | Expect                                            |
| ---- | -------------------------------- | ------------------------------------------------- |
| 4.48 | Tab through all controls         | Every interactive control is reachable            |
| 4.49 | Focus rings                      | Visible on keyboard focus for buttons and fields  |
| 4.50 | Icon button name                 | Announced / present via `aria-label`              |
| 4.51 | Checkbox / switch labels         | Activating label toggles control                  |
| 4.52 | Contrast (neon + cobalt)         | Primary, destructive, and field text meet WCAG AA |
| 4.53 | Color not sole meaning           | Destructive still reads as Delete via label text  |
| 4.54 | `prefers-reduced-motion: reduce` | Switch thumb / hover transitions minimal or off   |

### Phase 4 pass criteria

1. All four button variants (plus icon button) look correct and respect accent/density.
2. Input, textarea, and select are labeled, focusable, and show invalid/disabled affordances in Storybook.
3. Checkbox and switch toggle via click, label, and keyboard; checked/on uses accent as a **signal**.
4. Showcase `/phase-4-controls` form works inside the app shell on desktop and mobile.
5. Storybook Controls Form responds to accent and density toolbars.
6. Phase 2 and Phase 3 routes remain intact.

---

## Phase 5 — Data Display

### Showcase — routing and shell composition

| #   | Action                        | Expect                                                          |
| --- | ----------------------------- | --------------------------------------------------------------- |
| 5.1 | Visit `/` (phase 5 milestone) | Redirects to `/phase-5-data`                                    |
| 5.2 | Read the page                 | Heading **Phase 5 Data Display**; badge row + deployments table |
| 5.3 | Inspect chrome                | App shell sidebar + main; **Data** nav item active              |
| 5.4 | Nav links                     | Controls / Phase 3 / Phase 2 links present                      |

### Badges (`jp-badge`)

On `/phase-5-data` and Storybook **Primitives → Data Display → Badge**.

| #    | Action                    | Expect                                                            |
| ---- | ------------------------- | ----------------------------------------------------------------- |
| 5.5  | Inspect tone row          | Neutral / accent / success / warning / error / info chips visible |
| 5.6  | Accent tone               | Soft accent fill + strong accent text (not a large accent wash)   |
| 5.7  | Success / warning / error | Soft state fills with readable status text                        |
| 5.8  | Storybook sizes sm / md   | Padding/type scale coherent; no clipping                          |
| 5.9  | Accent neon → cobalt      | Accent badge follows accent family; state tones stay state tokens |
| 5.10 | Density → compact         | Badge padding tightens via space tokens without clipping labels   |

### Table (`jp-table`)

| #    | Action                | Expect                                            |
| ---- | --------------------- | ------------------------------------------------- |
| 5.11 | Inspect caption       | “Recent deployments” above headers                |
| 5.12 | Inspect headers       | Service / Environment / Status / Region           |
| 5.13 | Inspect status cells  | Badges inside status column                       |
| 5.14 | Hover a row           | Subtle surface hover (not accent fill)            |
| 5.15 | Striped rows          | Alternating row backgrounds visible               |
| 5.16 | Region column         | End-aligned                                       |
| 5.17 | Compact density       | Cell padding tightens; headers remain readable    |
| 5.18 | Narrow viewport (390) | Table scrolls horizontally inside frame if needed |

### Empty state (`jp-empty-state`)

| #    | Action                      | Expect                                             |
| ---- | --------------------------- | -------------------------------------------------- |
| 5.19 | Toggle **Show empty state** | Table body replaced by empty state                 |
| 5.20 | Read empty copy             | Title + description; `role="status"`               |
| 5.21 | Click **Clear filters**     | Returns to populated table                         |
| 5.22 | Standalone empty section    | Icon + title + primary action below the table card |
| 5.23 | Storybook Empty table story | Projected empty state with secondary action        |

### Keyboard / accessibility (Phase 5)

| #    | Action                           | Expect                                          |
| ---- | -------------------------------- | ----------------------------------------------- |
| 5.24 | Tab to empty-state action button | Visible focus ring                              |
| 5.25 | Inspect table semantics          | Real `<table>`, `<th scope="col">`, `<caption>` |
| 5.26 | Badge is not focusable           | Status text conveys meaning (not color alone)   |
| 5.27 | Screen reader (optional)         | Empty state announced as status                 |

### Storybook composition

| #    | Action                               | Expect                                 |
| ---- | ------------------------------------ | -------------------------------------- |
| 5.28 | Open **Compositions / Data Display** | Shell + badges + table                 |
| 5.29 | Toggle accent / density toolbars     | Tokens update without layout collapse  |
| 5.30 | Toggle show-empty switch             | Empty state appears inside table frame |

### Phase 5 pass criteria

1. Badge tones and sizes render correctly; accent is a signal, not a wash.
2. Table caption, headers, striped/hover, and status badges work on Showcase and in Storybook.
3. Empty state toggles and actions behave as described.
4. Earlier phase routes remain intact.

---

## Phase 6 — Feedback & Overlays

### Showcase — routing and shell composition

| #   | Action                        | Expect                                                           |
| --- | ----------------------------- | ---------------------------------------------------------------- |
| 6.1 | Visit `/` (phase 6 milestone) | Redirects to `/phase-6-overlays`                                 |
| 6.2 | Read the page                 | Heading **Phase 6 Feedback & Overlays**; tooltip/toast/dialog UI |
| 6.3 | Inspect chrome                | App shell sidebar + main; **Overlays** nav item active           |
| 6.4 | Nav links                     | Data / Controls / Phase 3 / Phase 2 links present                |

### Tooltip (`jp-tooltip`)

| #   | Action                  | Expect                                     |
| --- | ----------------------- | ------------------------------------------ |
| 6.5 | Hover **Copy ID**       | Tooltip “Copy deployment ID” appears above |
| 6.6 | Move pointer away       | Tooltip hides                              |
| 6.7 | Tab to **Docs**         | Tooltip appears on focus                   |
| 6.8 | Press Escape while open | Tooltip hides                              |
| 6.9 | Storybook placements    | Top / bottom / left / right all readable   |

### Toast (`jp-toast`)

| #    | Action                   | Expect                                        |
| ---- | ------------------------ | --------------------------------------------- |
| 6.10 | Click **Success**        | Toast “Deployment saved” appears bottom-right |
| 6.11 | Click dismiss ×          | Toast removes                                 |
| 6.12 | Click **Error**          | Error-accent left border; message readable    |
| 6.13 | Wait ~4s without dismiss | Toast auto-dismisses                          |
| 6.14 | Focus stays on trigger   | Toast does not steal keyboard focus           |

### Dialog (`jp-dialog`)

| #    | Action                      | Expect                                       |
| ---- | --------------------------- | -------------------------------------------- |
| 6.15 | Click **Delete deployment** | Dialog opens with title + actions            |
| 6.16 | Tab inside dialog           | Focus cycles within dialog (trap)            |
| 6.17 | Press Escape                | Dialog closes; focus returns to trigger area |
| 6.18 | Re-open; click scrim        | Dialog closes                                |
| 6.19 | Re-open; click **Delete**   | Closes + success toast; last action updates  |
| 6.20 | Narrow viewport (390)       | Dialog fits without horizontal page scroll   |

### Popover (`jp-popover`)

| #    | Action                | Expect                            |
| ---- | --------------------- | --------------------------------- |
| 6.21 | Click **Filters**     | Popover panel opens below trigger |
| 6.22 | Click outside         | Popover closes                    |
| 6.23 | Re-open; press Escape | Popover closes                    |

### Dropdown menu (`jp-dropdown-menu`)

| #    | Action                   | Expect                                   |
| ---- | ------------------------ | ---------------------------------------- |
| 6.24 | Click **Actions**        | Menu opens with Edit / Delete…           |
| 6.25 | ArrowDown / ArrowUp      | Focus moves between items                |
| 6.26 | Activate **Edit**        | Menu closes; last action = Edit selected |
| 6.27 | Open; choose **Delete…** | Menu closes; confirm dialog opens        |

### Keyboard / accessibility (Phase 6)

| #    | Action                 | Expect                                 |
| ---- | ---------------------- | -------------------------------------- |
| 6.28 | Dialog focus rings     | Visible on close + action buttons      |
| 6.29 | Menu `role="menu"`     | Items are `menuitem`                   |
| 6.30 | Toast `role="status"`  | Announced politely (optional SR check) |
| 6.31 | Tooltip not sole label | Trigger still has visible text         |

### Storybook composition

| #    | Action                                    | Expect                                |
| ---- | ----------------------------------------- | ------------------------------------- |
| 6.32 | Open **Compositions / Feedback Overlays** | Shell + overlay controls              |
| 6.33 | Toggle accent / density toolbars          | Tokens update without layout collapse |
| 6.34 | Open dialog from composition              | Dialog appears over shell             |

### Phase 6 pass criteria

1. Tooltip, toast, dialog, popover, and dropdown menu behave as described on Showcase.
2. Dialog focus trap and focus restore work; toast does not steal focus.
3. Storybook composition passes accent/density toggles.
4. Earlier phase routes remain intact.

---

## Phase 7 — Assistant System

### Showcase — routing and shell composition

| #   | Action                        | Expect                                                        |
| --- | ----------------------------- | ------------------------------------------------------------- |
| 7.1 | Visit `/` (phase 7 milestone) | Redirects to `/phase-7-assistant`                             |
| 7.2 | Read the page                 | Heading **Phase 7 Assistant System**; context trigger buttons |
| 7.3 | Inspect chrome                | App shell sidebar + main; **Assistant** nav item active       |
| 7.4 | Nav links                     | Overlays / Data / Controls / Phase 3 / Phase 2 links present  |

### Context trigger API

| #   | Action                         | Expect                                                        |
| --- | ------------------------------ | ------------------------------------------------------------- |
| 7.5 | Click **Ask about deployment** | Panel opens; context chip shows dep-1042 + Production rollout |
| 7.6 | Click **Ask about row**        | Context updates to payments-api / Degraded                    |
| 7.7 | Click **Ask about filters**    | Context updates; message history clears                       |
| 7.8 | Click context chip ×           | Context chip dismisses; panel stays open                      |

### Assistant panel

| #    | Action                      | Expect                                            |
| ---- | --------------------------- | ------------------------------------------------- |
| 7.9  | With panel open, press Esc  | Panel closes                                      |
| 7.10 | Re-open; click header ×     | Panel closes                                      |
| 7.11 | Open panel                  | Focus moves into composer textarea                |
| 7.12 | Type a question; click Send | User bubble appears; host assistant reply appears |
| 7.13 | Press Enter in composer     | Same as Send (Shift+Enter should not send)        |
| 7.14 | Empty composer + Send       | No message added                                  |

### Tone refinement

| #    | Action                   | Expect                                                          |
| ---- | ------------------------ | --------------------------------------------------------------- |
| 7.15 | Click **Seed tone demo** | System (muted), assistant (sunken), user (subtle) messages show |
| 7.16 | Inspect panel chrome     | Neutral surfaces; no large accent wash                          |
| 7.17 | Inspect context chip     | Soft accent fill + strong accent text (signal only)             |
| 7.18 | Inspect Send button      | Primary accent action                                           |
| 7.19 | Swap accent neon↔cobalt | Context chip + Send track accent; message bubbles stay neutral  |

### Mobile (390×844)

| #    | Action               | Expect                                     |
| ---- | -------------------- | ------------------------------------------ |
| 7.20 | Open assistant       | Full-height overlay + scrim behind panel   |
| 7.21 | Tap scrim            | Panel closes                               |
| 7.22 | Shell drawer + panel | Both usable independently; no layout crash |

### Storybook

| #    | Action                                      | Expect                              |
| ---- | ------------------------------------------- | ----------------------------------- |
| 7.23 | `Primitives/Assistant/Panel` → MessageRoles | Three role tones readable           |
| 7.24 | ContextTrigger play function                | Opens panel with deployment context |
| 7.25 | `Compositions/Assistant System`             | Shell + trigger interaction passes  |
| 7.26 | Accent / density toolbars                   | Composition remains coherent        |

### Phase 7 pass criteria

1. Context triggers open/update/dismiss context correctly.
2. Panel open/close, composer, and message flow work on desktop and mobile.
3. Accent applies as signal on chip/Send only; message bubbles stay neutral.
4. Storybook assistant stories and composition pass.
5. Earlier phase routes remain intact.

---

## Sign-off

| Gate                        | Pass? |
| --------------------------- | ----- |
| Automated unit + coverage   |       |
| Storybook interaction tests |       |
| Showcase Chromium e2e       |       |
| Manual checks above         |       |

Automated gates green + this checklist exercised once on neon and once on cobalt
is enough to merge Phases 3–7.

If anything fails, note viewport, accent/density, control or route name, and steps
to reproduce on the PR.

Tester: **\*\***\_\_**\*\*** Date: **\*\***\_\_**\*\***
