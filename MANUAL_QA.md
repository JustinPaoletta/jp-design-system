# Manual Test Checklist — App Shell through Assistant

Use this after automated gates are green (`lint`, unit tests + coverage, Storybook
interaction tests, Showcase Chromium e2e). Record failures in the PR description;
do not create a separate QA ledger.

**Related plans:** [App Shell](./docs/APP_SHELL_PLAN.md) ·
[Controls](./docs/CONTROLS_PLAN.md) ·
[Data Display](./docs/DATA_DISPLAY_PLAN.md) ·
[Feedback & Overlays](./docs/FEEDBACK_OVERLAYS_PLAN.md) ·
[Assistant System](./docs/ASSISTANT_SYSTEM_PLAN.md) ·
[Primitive API](./docs/PRIMITIVES.md)

---

## Overview

Showcase pages build on each other inside the `jp-app-shell`. Validate the
**current default route** first (Showcase `/` → `/assistant`), then exercise each
area's primitives, then spot-check earlier routes for regression.

| Area | Route | Key deliverables |
| ------------------ | --------------- | -------------------------------------------------------------------- |
| App Shell | `/app-shell` | `jp-app-shell`, `jp-app-shell-nav-item`, mobile drawer |
| Controls | `/controls` | `jp-button`, `jp-icon-button`, input/textarea/select/checkbox/switch |
| Data Display | `/data` | `jp-badge`, `jp-empty-state`, `jp-table` |
| Feedback & Overlays| `/overlays` | `jpFocusTrap`, tooltip, toast, dialog, popover, dropdown-menu |
| Assistant System | `/assistant` | `JpAssistantService`, trigger, message, panel |

**Out of scope (do not file as bugs):** router-aware nav inside the shell
primitive, user menu, breadcrumbs, custom listbox/combobox, date picker, file
upload, form validation engine, sortable/filterable table columns, row selection,
virtualization, CDK Overlay / collision engine, nested modal stacks, LLM/streaming
runtime, markdown rendering, conversation persistence, visual regression baselines.

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

Run these when validating any showcase area to confirm the stack still works.

| # | Action | Expect |
| --- | -------------------------- | ------------------------------------------------------------ |
| R.1 | Visit `/layout-dashboard` | Layout-only page still works (no app shell) |
| R.2 | Visit `/app-shell` | Shell + dashboard unchanged (see App Shell for full shell QA)|
| R.3 | Visit `/controls` | Controls form inside shell |
| R.4 | Visit `/data` | Data display page |
| R.5 | Visit `/overlays` | Overlays page |
| R.6 | Visit `/assistant` | Assistant page inside shell |
| R.7 | Accent / density meta | Page shows `accent:` and `density:` from document attributes |
| R.8 | No horizontal overflow | 1440, 1024, and 390 viewports |
| R.9 | Token discipline | No obvious hardcoded colors on chrome or new primitives |

---

## App Shell

### Showcase — routing and composition

| # | Action | Expect |
| --- | ----------------------------- | ----------------------------------------------------------------------- |
| SH.1 | Visit `/app-shell` | Loads app shell dashboard |
| SH.2 | Read the page | Heading **App Shell Dashboard**; metric cards + activity panels |
| SH.3 | Inspect chrome | Persistent left sidebar + main content; no `lib-ui` usage |
| SH.4 | Check nav | Overview / Layout / Activity / Settings; **Overview** is active |

### Desktop shell — collapse (1440px and 1024px)

Do both widths. Sidebar should stay visible; no horizontal page scroll.

| # | Action | Expect |
| ---- | ------------------------- | --------------------------------------------------------------------- |
| SH.5 | Load `/app-shell` | Expanded sidebar ~`16rem` (256px); main fills remaining width |
| SH.6 | Note sidebar surface | Sunken shell background; right border uses shell border token |
| SH.7 | Click collapse (chevron) | Sidebar narrows to ~`4rem` icon rail; main expands; chevron rotates |
| SH.8 | Labels when collapsed | Nav labels visually hidden (screen-reader text may remain) |
| SH.9 | Click collapse again | Sidebar expands; labels return |
| SH.10 | Collapse toggle a11y | `aria-label` flips Collapse/Expand; `aria-pressed` tracks state |
| SH.11 | Sidebar landmark | `aside` has `aria-label` (default **Primary**); `aria-expanded` flips |

### Nav items — states and accent

| # | Action | Expect |
| ---- | ------------------------------------------- | ------------------------------------------------------------------ |
| SH.12 | Inspect **Overview** | Active: stronger text, subtle bg, **left accent bar** (not a fill) |
| SH.13 | Hover inactive items | Hover background; text brightens; cursor pointer |
| SH.14 | Tab to a nav item | Visible focus ring (`--jp-color-focus-ring`) |
| SH.15 | Active item semantics | `aria-current="page"` on the active control |
| SH.16 | Storybook → **App Shell Nav Item → Active** | Same accent indicator in isolation |
| SH.17 | Accent toolbar neon → cobalt | Active indicator / focus ring follow accent family |
| SH.18 | Density → compact | Nav row padding tightens; layout stays coherent |

### Mobile drawer (390px / &lt; 768px)

| # | Action | Expect |
| ---- | ---------------------------- | ------------------------------------------------------- |
| SH.19 | Load at 390px | Sidebar off-canvas; only main + top mobile bar visible |
| SH.20 | Find menu (hamburger) | Visible in mobile bar; `aria-expanded="false"` |
| SH.21 | Open menu | Drawer slides in from left; dimmed scrim over main |
| SH.22 | Menu button when open | `aria-expanded="true"`; label reflects close/open |
| SH.23 | Focus on open | Focus moves into the drawer (first focusable control) |
| SH.24 | Tab while open | Focus stays trapped inside the drawer |
| SH.25 | Press Escape | Drawer closes; scrim gone; focus returns to menu button |
| SH.26 | Re-open, click scrim | Drawer closes |
| SH.27 | Re-open, click drawer X | Drawer closes |
| SH.28 | Main while open | Main is non-interactive (`inert` / not reachable) |
| SH.29 | Resize to desktop while open | Drawer state clears; desktop sidebar layout returns |

### Storybook — primitives and composition

| Story | Check |
| -------------------------------------------- | ------------------------------------------------------------ |
| **Primitives / Layout / App Shell** | Default, Collapsed, MobileDrawerOpen; collapse control works |
| **Primitives / Layout / App Shell Nav Item** | Default, Active, FocusVisible, AsButton |
| **Compositions / App Shell Dashboard** | Full shell + dashboard; accent + density toolbars enabled |

| # | Action | Expect |
| ---- | ------------------------- | -------------------------------------------------- |
| SH.30 | Switch accent neon/cobalt | Active nav indicator and accents update |
| SH.31 | Switch density compact | Shell/nav spacing tightens without breaking layout |
| SH.32 | Collapse in composition | Same rail behavior as Showcase |

### Keyboard and accessibility (App Shell)

| # | Action | Expect |
| ---- | -------------------------------- | --------------------------------------------------------- |
| SH.33 | Tab through shell chrome | Collapse / menu / nav / close all focusable |
| SH.34 | Focus rings | Always visible on keyboard focus |
| SH.35 | Contrast (neon + cobalt) | Nav text and active states readable on shell bg (WCAG AA) |
| SH.36 | `prefers-reduced-motion: reduce` | Shell width/transform transitions minimal or off |

### App Shell pass criteria

1. Desktop collapse and mobile drawer behave as above on Showcase.
2. Active nav uses an accent **signal** (indicator), not a large accent fill.
3. Keyboard + focus management work for collapse and drawer.
4. Storybook composition responds to accent and density toolbars.
5. Layout dashboard route remains intact (see [Shared regression routes](#shared-regression-routes)).

---

## Controls

### Showcase — routing and shell composition

| # | Action | Expect |
| --- | ----------------------------- | -------------------------------------------------------- |
| CT.1 | Visit `/controls` | Loads controls page |
| CT.2 | Read the page | Heading **Controls**; form inside raised surface |
| CT.3 | Inspect chrome | App shell sidebar + main; **Controls** nav item active |
| CT.4 | Nav links | App Shell / Layout links present |
| CT.5 | Icon button in header | “More actions” icon button visible next to the heading |

### Buttons (`jp-button`)

On `/controls` and Storybook **Primitives → Controls → Button**.

| # | Action | Expect |
| ---- | -------------------------------- | ------------------------------------------------------------------ |
| CT.6 | Inspect **Save** (primary) | Accent solid fill; high-contrast label; not a large page wash |
| CT.7 | Inspect **Cancel** (secondary) | Neutral surface + border; primary text |
| CT.8 | Inspect **Reset** (ghost) | No heavy fill; secondary text; hover softens background |
| CT.9 | Inspect **Delete** (destructive) | Error-strong background (not accent); readable label |
| CT.10 | Hover each variant | Clear hover change; cursor pointer |
| CT.11 | Storybook → **Disabled** | Dimmed; not clickable; no strong hover |
| CT.12 | Storybook sizes sm / md / lg | Height tracks control size tokens; padding coherent |
| CT.13 | Accent neon → cobalt | Primary fill follows accent family; destructive stays error tokens |
| CT.14 | Density → compact | Button height/padding tightens without clipping labels |

### Icon button (`jp-icon-button`)

| # | Action | Expect |
| ---- | --------------------------- | ----------------------------------------------------- |
| CT.15 | Showcase header icon button | Square control; icon centered |
| CT.16 | Hover / focus | Visible hover + focus ring |
| CT.17 | Inspect accessible name | `aria-label="More actions"` (or Storybook equivalent) |
| CT.18 | Storybook disabled | Not activatable; muted appearance |

### Text fields (`jp-input`, `jp-textarea`, `jp-select`)

| # | Action | Expect |
| ---- | ---------------------------- | ----------------------------------------------------------------- |
| CT.19 | Email input label | Visible **Email** label associated with the control |
| CT.20 | Type in Email | Value updates; placeholder gone when filled |
| CT.21 | Hint text | “Used for account notifications.” visible under the field |
| CT.22 | Notes textarea | Multi-line; accepts text; same field chrome as input |
| CT.23 | Role select | Native select; options selectable; value sticks |
| CT.24 | Focus each field | Focus ring uses focus token; border may strengthen on hover/focus |
| CT.25 | Storybook **Invalid** states | Invalid border (error token); error message when provided |
| CT.26 | Storybook **Disabled** | Fields not editable; muted |
| CT.27 | `aria-invalid` when invalid | Present on the control when `invalid` is set |
| CT.28 | Density compact | Field height/padding tightens; labels remain readable |

### Selection controls (`jp-checkbox`, `jp-switch`)

| # | Action | Expect |
| ---- | --------------------------------- | ------------------------------------------------------------- |
| CT.29 | Click checkbox label | Toggles checked; label text is the hit target |
| CT.30 | Checked checkbox | Accent fill / check signal (not a huge accent block) |
| CT.31 | Click switch | Toggles on/off; thumb moves |
| CT.32 | Switch on | Track uses accent solid; `aria-checked` / role reflects state |
| CT.33 | Keyboard Space on focused control | Toggles state |
| CT.34 | Accent cobalt | Checked/on states follow cobalt accent |
| CT.35 | Disabled stories | Cannot toggle; muted |

### Form interaction (Showcase)

| # | Action | Expect |
| ---- | -------------------------- | ----------------------------------------------------------------- |
| CT.36 | Fill Email + Notes | Values persist while interacting with other controls |
| CT.37 | Change Role | Selected option remains after blur |
| CT.38 | Toggle Subscribe + Compact | Both stay in sync with UI state |
| CT.39 | Tab through the form | Logical order: fields → checkbox → switch → buttons → icon button |

### Shell regression on the controls page

Controls sit inside the shell — spot-check chrome still works here (full shell QA in [App Shell](#app-shell)).

| # | Action (desktop ~1440) | Expect |
| ---- | ---------------------- | ----------------------------------------- |
| CT.40 | Collapse sidebar | Rail collapses; form reflows; no overflow |
| CT.41 | Expand again | Labels return |

| # | Action (mobile 390) | Expect |
| ---- | ----------------------- | ------------------------------------ |
| CT.42 | Open menu drawer | Drawer + scrim; form behind scrim |
| CT.43 | Escape / scrim close | Drawer closes; focus returns to menu |
| CT.44 | Use a field after close | Form still interactive |

### Storybook — primitives and composition

| Story | Check |
| --------------------------------------- | ------------------------------------------------ |
| **Primitives / Controls / Button** | Primary, Secondary, Ghost, Destructive, Disabled |
| **Primitives / Controls / Icon Button** | Default + disabled; aria-label present |
| **Primitives / Controls / Input** | Default, invalid, disabled |
| **Primitives / Controls / Textarea** | Default, invalid |
| **Primitives / Controls / Select** | Options render; change value |
| **Primitives / Controls / Checkbox** | Checked / unchecked / disabled |
| **Primitives / Controls / Switch** | On / off / disabled |
| **Compositions / Controls Form** | Full form; accent + density toolbars enabled |

| # | Action | Expect |
| ---- | ------------------------ | ----------------------------------------------- |
| CT.45 | Accent neon → cobalt | Primary button, focus, checked/on states update |
| CT.46 | Density → compact | Controls tighten; form layout stays coherent |
| CT.47 | Interact with all fields | Same behaviors as Showcase |

### Keyboard and accessibility (Controls)

| # | Action | Expect |
| ---- | -------------------------------- | ------------------------------------------------- |
| CT.48 | Tab through all controls | Every interactive control is reachable |
| CT.49 | Focus rings | Visible on keyboard focus for buttons and fields |
| CT.50 | Icon button name | Announced / present via `aria-label` |
| CT.51 | Checkbox / switch labels | Activating label toggles control |
| CT.52 | Contrast (neon + cobalt) | Primary, destructive, and field text meet WCAG AA |
| CT.53 | Color not sole meaning | Destructive still reads as Delete via label text |
| CT.54 | `prefers-reduced-motion: reduce` | Switch thumb / hover transitions minimal or off |

### Controls pass criteria

1. All four button variants (plus icon button) look correct and respect accent/density.
2. Input, textarea, and select are labeled, focusable, and show invalid/disabled affordances in Storybook.
3. Checkbox and switch toggle via click, label, and keyboard; checked/on uses accent as a **signal**.
4. Showcase `/controls` form works inside the app shell on desktop and mobile.
5. Storybook Controls Form responds to accent and density toolbars.
6. Layout dashboard and App Shell routes remain intact.

---

## Data Display

### Showcase — routing and shell composition

| # | Action | Expect |
| --- | ----------------------------- | --------------------------------------------------------------- |
| DD.1 | Visit `/data` | Loads data display page |
| DD.2 | Read the page | Heading **Data Display**; badge row + deployments table |
| DD.3 | Inspect chrome | App shell sidebar + main; **Data** nav item active |
| DD.4 | Nav links | Controls / App Shell / Layout links present |

### Badges (`jp-badge`)

On `/data` and Storybook **Primitives → Data Display → Badge**.

| # | Action | Expect |
| ---- | ------------------------- | ----------------------------------------------------------------- |
| DD.5 | Inspect tone row | Neutral / accent / success / warning / error / info chips visible |
| DD.6 | Accent tone | Soft accent fill + strong accent text (not a large accent wash) |
| DD.7 | Success / warning / error | Soft state fills with readable status text |
| DD.8 | Storybook sizes sm / md | Padding/type scale coherent; no clipping |
| DD.9 | Accent neon → cobalt | Accent badge follows accent family; state tones stay state tokens |
| DD.10 | Density → compact | Badge padding tightens via space tokens without clipping labels |

### Table (`jp-table`)

| # | Action | Expect |
| ---- | --------------------- | ------------------------------------------------- |
| DD.11 | Inspect caption | “Recent deployments” above headers |
| DD.12 | Inspect headers | Service / Environment / Status / Region |
| DD.13 | Inspect status cells | Badges inside status column |
| DD.14 | Hover a row | Subtle surface hover (not accent fill) |
| DD.15 | Striped rows | Alternating row backgrounds visible |
| DD.16 | Region column | End-aligned |
| DD.17 | Compact density | Cell padding tightens; headers remain readable |
| DD.18 | Narrow viewport (390) | Table scrolls horizontally inside frame if needed |

### Empty state (`jp-empty-state`)

| # | Action | Expect |
| ---- | --------------------------- | -------------------------------------------------- |
| DD.19 | Toggle **Show empty state** | Table body replaced by empty state |
| DD.20 | Read empty copy | Title + description; `role="status"` |
| DD.21 | Click **Clear filters** | Returns to populated table |
| DD.22 | Standalone empty section | Icon + title + primary action below the table card |
| DD.23 | Storybook Empty table story | Projected empty state with secondary action |

### Keyboard / accessibility (Data Display)

| # | Action | Expect |
| ---- | -------------------------------- | ----------------------------------------------- |
| DD.24 | Tab to empty-state action button | Visible focus ring |
| DD.25 | Inspect table semantics | Real `<table>`, `<th scope="col">`, `<caption>` |
| DD.26 | Badge is not focusable | Status text conveys meaning (not color alone) |
| DD.27 | Screen reader (optional) | Empty state announced as status |

### Storybook composition

| # | Action | Expect |
| ---- | ------------------------------------ | -------------------------------------- |
| DD.28 | Open **Compositions / Data Display** | Shell + badges + table |
| DD.29 | Toggle accent / density toolbars | Tokens update without layout collapse |
| DD.30 | Toggle show-empty switch | Empty state appears inside table frame |

### Data Display pass criteria

1. Badge tones and sizes render correctly; accent is a signal, not a wash.
2. Table caption, headers, striped/hover, and status badges work on Showcase and in Storybook.
3. Empty state toggles and actions behave as described.
4. Earlier showcase routes remain intact.

---

## Feedback & Overlays

### Showcase — routing and shell composition

| # | Action | Expect |
| --- | ----------------------------- | ---------------------------------------------------------------- |
| FO.1 | Visit `/overlays` | Loads feedback & overlays page |
| FO.2 | Read the page | Heading **Feedback & Overlays**; tooltip/toast/dialog UI |
| FO.3 | Inspect chrome | App shell sidebar + main; **Overlays** nav item active |
| FO.4 | Nav links | Data / Controls / App Shell / Layout links present |

### Tooltip (`jp-tooltip`)

| # | Action | Expect |
| --- | ----------------------- | ------------------------------------------ |
| FO.5 | Hover **Copy ID** | Tooltip “Copy deployment ID” appears above |
| FO.6 | Move pointer away | Tooltip hides |
| FO.7 | Tab to **Docs** | Tooltip appears on focus |
| FO.8 | Press Escape while open | Tooltip hides |
| FO.9 | Storybook placements | Top / bottom / left / right all readable |

### Toast (`jp-toast`)

| # | Action | Expect |
| ---- | ------------------------ | --------------------------------------------- |
| FO.10 | Click **Success** | Toast “Deployment saved” appears bottom-right |
| FO.11 | Click dismiss × | Toast removes |
| FO.12 | Click **Error** | Error-accent left border; message readable |
| FO.13 | Wait ~4s without dismiss | Toast auto-dismisses |
| FO.14 | Focus stays on trigger | Toast does not steal keyboard focus |

### Dialog (`jp-dialog`)

| # | Action | Expect |
| ---- | --------------------------- | -------------------------------------------- |
| FO.15 | Click **Delete deployment** | Dialog opens with title + actions |
| FO.16 | Tab inside dialog | Focus cycles within dialog (trap) |
| FO.17 | Press Escape | Dialog closes; focus returns to trigger area |
| FO.18 | Re-open; click scrim | Dialog closes |
| FO.19 | Re-open; click **Delete** | Closes + success toast; last action updates |
| FO.20 | Narrow viewport (390) | Dialog fits without horizontal page scroll |

### Popover (`jp-popover`)

| # | Action | Expect |
| ---- | --------------------- | --------------------------------- |
| FO.21 | Click **Filters** | Popover panel opens below trigger |
| FO.22 | Click outside | Popover closes |
| FO.23 | Re-open; press Escape | Popover closes |

### Dropdown menu (`jp-dropdown-menu`)

| # | Action | Expect |
| ---- | ------------------------ | ---------------------------------------- |
| FO.24 | Click **Actions** | Menu opens with Edit / Delete… |
| FO.25 | ArrowDown / ArrowUp | Focus moves between items |
| FO.26 | Activate **Edit** | Menu closes; last action = Edit selected |
| FO.27 | Open; choose **Delete…** | Menu closes; confirm dialog opens |

### Keyboard / accessibility (Feedback & Overlays)

| # | Action | Expect |
| ---- | ---------------------- | -------------------------------------- |
| FO.28 | Dialog focus rings | Visible on close + action buttons |
| FO.29 | Menu `role="menu"` | Items are `menuitem` |
| FO.30 | Toast `role="status"` | Announced politely (optional SR check) |
| FO.31 | Tooltip not sole label | Trigger still has visible text |

### Storybook composition

| # | Action | Expect |
| ---- | ----------------------------------------- | ------------------------------------- |
| FO.32 | Open **Compositions / Feedback Overlays** | Shell + overlay controls |
| FO.33 | Toggle accent / density toolbars | Tokens update without layout collapse |
| FO.34 | Open dialog from composition | Dialog appears over shell |

### Feedback & Overlays pass criteria

1. Tooltip, toast, dialog, popover, and dropdown menu behave as described on Showcase.
2. Dialog focus trap and focus restore work; toast does not steal focus.
3. Storybook composition passes accent/density toggles.
4. Earlier showcase routes remain intact.

---

## Assistant System

### Showcase — routing and shell composition

| # | Action | Expect |
| --- | ----------------------------- | ------------------------------------------------------------- |
| AT.1 | Visit `/` | Redirects to `/assistant` |
| AT.2 | Read the page | Heading **Assistant System**; context trigger buttons |
| AT.3 | Inspect chrome | App shell sidebar + main; **Assistant** nav item active |
| AT.4 | Nav links | Overlays / Data / Controls / App Shell / Layout links present |

### Context trigger API

| # | Action | Expect |
| --- | ------------------------------ | ------------------------------------------------------------- |
| AT.5 | Click **Ask about deployment** | Panel opens; context chip shows dep-1042 + Production rollout |
| AT.6 | Click **Ask about row** | Context updates to payments-api / Degraded |
| AT.7 | Click **Ask about filters** | Context updates; message history clears |
| AT.8 | Click context chip × | Context chip dismisses; panel stays open |

### Assistant panel

| # | Action | Expect |
| ---- | --------------------------- | ------------------------------------------------- |
| AT.9 | With panel open, press Esc | Panel closes |
| AT.10 | Re-open; click header × | Panel closes |
| AT.11 | Open panel | Focus moves into composer textarea |
| AT.12 | Type a question; click Send | User bubble appears; host assistant reply appears |
| AT.13 | Press Enter in composer | Same as Send (Shift+Enter should not send) |
| AT.14 | Empty composer + Send | No message added |

### Tone refinement

| # | Action | Expect |
| ---- | ------------------------ | --------------------------------------------------------------- |
| AT.15 | Click **Seed tone demo** | System (muted), assistant (sunken), user (subtle) messages show |
| AT.16 | Inspect panel chrome | Neutral surfaces; no large accent wash |
| AT.17 | Inspect context chip | Soft accent fill + strong accent text (signal only) |
| AT.18 | Inspect Send button | Primary accent action |
| AT.19 | Swap accent neon↔cobalt | Context chip + Send track accent; message bubbles stay neutral |

### Mobile (390×844)

| # | Action | Expect |
| ---- | -------------------- | ------------------------------------------ |
| AT.20 | Open assistant | Full-height overlay + scrim behind panel |
| AT.21 | Tap scrim | Panel closes |
| AT.22 | Shell drawer + panel | Both usable independently; no layout crash |

### Storybook

| # | Action | Expect |
| ---- | ------------------------------------------- | ----------------------------------- |
| AT.23 | `Primitives/Assistant/Panel` → MessageRoles | Three role tones readable |
| AT.24 | ContextTrigger play function | Opens panel with deployment context |
| AT.25 | `Compositions/Assistant System` | Shell + trigger interaction passes |
| AT.26 | Accent / density toolbars | Composition remains coherent |

### Assistant System pass criteria

1. Context triggers open/update/dismiss context correctly.
2. Panel open/close, composer, and message flow work on desktop and mobile.
3. Accent applies as signal on chip/Send only; message bubbles stay neutral.
4. Storybook assistant stories and composition pass.
5. Earlier showcase routes remain intact.

---

## Sign-off

| Gate | Pass? |
| --------------------------- | ----- |
| Automated unit + coverage | |
| Storybook interaction tests | |
| Showcase Chromium e2e | |
| Manual checks above | |

Automated gates green + this checklist exercised once on neon and once on cobalt
is enough to merge these showcase areas.

If anything fails, note viewport, accent/density, control or route name, and steps
to reproduce on the PR.

Tester: **\*\***\_\_**\*\*** Date: **\*\***\_\_**\*\***
