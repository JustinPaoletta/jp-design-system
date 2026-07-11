# Phase 4 — Manual Test Checklist

Use this after automated gates are green (`lint`, unit tests + coverage, Storybook
interaction tests, Showcase Chromium e2e). Record failures in the PR description;
do not create a separate QA ledger.

**Related:** [docs/PHASE4_EPIC4_CONTROLS_PLAN.md](./docs/PHASE4_EPIC4_CONTROLS_PLAN.md) ·
[docs/PRIMITIVES.md](./docs/PRIMITIVES.md) · PR #8 (`phase4-controls`) · depends on
[PR #7](https://github.com/JustinPaoletta/jp-design-system/pull/7)

---

## What you are validating

Phase 4 delivers the interactive control layer inside the Phase 3 app shell:

| Piece            | What it should do                                              |
| ---------------- | -------------------------------------------------------------- |
| `jp-button`      | Primary / secondary / ghost / destructive; sizes; disabled     |
| `jp-icon-button` | Square icon control with required accessible name              |
| `jp-input`       | Labeled text field; hint/error; invalid; CVA / ngModel         |
| `jp-textarea`    | Multi-line field with same field chrome                        |
| `jp-select`      | Native styled select with options                              |
| `jp-checkbox`    | Boolean toggle with projected label; accent when checked       |
| `jp-switch`      | On/off switch (`role="switch"`); accent track when on          |
| Showcase         | `/phase-4-controls` form inside `jp-app-shell`                 |
| Storybook        | Control primitive stories + `Compositions/Controls Form`       |

**Not in Phase 4 (do not file as bugs):** custom listbox/combobox, date picker,
file upload, form validation engine, toast/dialog, replacing shell chrome
native buttons with `jp-icon-button`, visual regression baselines.

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

## 1. Showcase — routing and shell composition

| #   | Action                     | Expect                                                                 |
| --- | -------------------------- | ---------------------------------------------------------------------- |
| 1.1 | Visit `/`                  | Redirects to `/phase-4-controls`                                       |
| 1.2 | Read the page              | Heading **Phase 4 Controls**; form inside raised surface               |
| 1.3 | Inspect chrome             | App shell sidebar + main; **Controls** nav item active                 |
| 1.4 | Nav links                  | Phase 3 / Phase 2 links present                                        |
| 1.5 | Visit `/phase-3-dashboard` | Phase 3 shell dashboard still works                                    |
| 1.6 | Visit `/phase-2-dashboard` | Phase 2 layout-only page still works (no shell)                        |
| 1.7 | Accent / density meta      | Page shows `accent:` and `density:` from document attributes           |
| 1.8 | Icon button in header      | “More actions” icon button visible next to the heading                 |

---

## 2. Buttons (`jp-button`)

On `/phase-4-controls` and Storybook **Primitives → Controls → Button**.

| #   | Action                         | Expect                                                                 |
| --- | ------------------------------ | ---------------------------------------------------------------------- |
| 2.1 | Inspect **Save** (primary)     | Accent solid fill; high-contrast label; not a large page wash          |
| 2.2 | Inspect **Cancel** (secondary) | Neutral surface + border; primary text                                 |
| 2.3 | Inspect **Reset** (ghost)      | No heavy fill; secondary text; hover softens background                |
| 2.4 | Inspect **Delete** (destructive) | Error-strong background (not accent); readable label                 |
| 2.5 | Hover each variant             | Clear hover change; cursor pointer                                     |
| 2.6 | Storybook → **Disabled**       | Dimmed; not clickable; no strong hover                                 |
| 2.7 | Storybook sizes sm / md / lg   | Height tracks control size tokens; padding coherent                    |
| 2.8 | Accent neon → cobalt           | Primary fill follows accent family; destructive stays error tokens     |
| 2.9 | Density → compact              | Button height/padding tightens without clipping labels                 |

---

## 3. Icon button (`jp-icon-button`)

| #   | Action                                      | Expect                                              |
| --- | ------------------------------------------- | --------------------------------------------------- |
| 3.1 | Showcase header icon button                 | Square control; icon centered                       |
| 3.2 | Hover / focus                               | Visible hover + focus ring                          |
| 3.3 | Inspect accessible name                     | `aria-label="More actions"` (or Storybook equivalent) |
| 3.4 | Storybook disabled                          | Not activatable; muted appearance                   |

---

## 4. Text fields (`jp-input`, `jp-textarea`, `jp-select`)

| #   | Action                         | Expect                                                                 |
| --- | ------------------------------ | ---------------------------------------------------------------------- |
| 4.1 | Email input label              | Visible **Email** label associated with the control                    |
| 4.2 | Type in Email                  | Value updates; placeholder gone when filled                            |
| 4.3 | Hint text                      | “Used for account notifications.” visible under the field              |
| 4.4 | Notes textarea                 | Multi-line; accepts text; same field chrome as input                   |
| 4.5 | Role select                    | Native select; options selectable; value sticks                        |
| 4.6 | Focus each field               | Focus ring uses focus token; border may strengthen on hover/focus      |
| 4.7 | Storybook **Invalid** states   | Invalid border (error token); error message when provided              |
| 4.8 | Storybook **Disabled**         | Fields not editable; muted                                           |
| 4.9 | `aria-invalid` when invalid    | Present on the control when `invalid` is set                           |
| 4.10| Density compact                | Field height/padding tightens; labels remain readable                  |

---

## 5. Selection controls (`jp-checkbox`, `jp-switch`)

| #   | Action                         | Expect                                                                 |
| --- | ------------------------------ | ---------------------------------------------------------------------- |
| 5.1 | Click checkbox label           | Toggles checked; label text is the hit target                          |
| 5.2 | Checked checkbox               | Accent fill / check signal (not a huge accent block)                   |
| 5.3 | Click switch                   | Toggles on/off; thumb moves                                            |
| 5.4 | Switch on                      | Track uses accent solid; `aria-checked` / role reflects state          |
| 5.5 | Keyboard Space on focused control | Toggles state                                                       |
| 5.6 | Accent cobalt                  | Checked/on states follow cobalt accent                                 |
| 5.7 | Disabled stories               | Cannot toggle; muted                                                   |

---

## 6. Form interaction (Showcase)

| #   | Action                         | Expect                                                                 |
| --- | ------------------------------ | ---------------------------------------------------------------------- |
| 6.1 | Fill Email + Notes             | Values persist while interacting with other controls                   |
| 6.2 | Change Role                    | Selected option remains after blur                                     |
| 6.3 | Toggle Subscribe + Compact     | Both stay in sync with UI state                                        |
| 6.4 | Tab through the form           | Logical order: fields → checkbox → switch → buttons → icon button      |
| 6.5 | No horizontal overflow         | 1440, 1024, and 390 viewports                                          |

---

## 7. Shell regression on the controls page

Phase 4 sits inside the shell — spot-check chrome still works here.

| #   | Action (desktop ~1440)     | Expect                                      |
| --- | -------------------------- | ------------------------------------------- |
| 7.1 | Collapse sidebar           | Rail collapses; form reflows; no overflow   |
| 7.2 | Expand again               | Labels return                               |

| #   | Action (mobile 390)        | Expect                                      |
| --- | -------------------------- | ------------------------------------------- |
| 7.3 | Open menu drawer           | Drawer + scrim; form behind scrim           |
| 7.4 | Escape / scrim close       | Drawer closes; focus returns to menu        |
| 7.5 | Use a field after close    | Form still interactive                      |

---

## 8. Storybook — primitives and composition

| Story                                      | Check                                                        |
| ------------------------------------------ | ------------------------------------------------------------ |
| **Primitives / Controls / Button**         | Primary, Secondary, Ghost, Destructive, Disabled             |
| **Primitives / Controls / Icon Button**    | Default + disabled; aria-label present                       |
| **Primitives / Controls / Input**          | Default, invalid, disabled                                   |
| **Primitives / Controls / Textarea**       | Default, invalid                                             |
| **Primitives / Controls / Select**         | Options render; change value                                 |
| **Primitives / Controls / Checkbox**       | Checked / unchecked / disabled                               |
| **Primitives / Controls / Switch**         | On / off / disabled                                          |
| **Compositions / Controls Form**           | Full form; accent + density toolbars enabled                 |

Composition-specific:

| #   | Action                    | Expect                                                         |
| --- | ------------------------- | -------------------------------------------------------------- |
| 8.1 | Accent neon → cobalt      | Primary button, focus, checked/on states update                |
| 8.2 | Density → compact         | Controls tighten; form layout stays coherent                   |
| 8.3 | Interact with all fields  | Same behaviors as Showcase                                     |

---

## 9. Keyboard and accessibility spot-check

| #   | Action                              | Expect                                              |
| --- | ----------------------------------- | --------------------------------------------------- |
| 9.1 | Tab through all controls            | Every interactive control is reachable              |
| 9.2 | Focus rings                         | Visible on keyboard focus for buttons and fields    |
| 9.3 | Icon button name                    | Announced / present via `aria-label`                |
| 9.4 | Checkbox / switch labels            | Activating label toggles control                    |
| 9.5 | Contrast (neon + cobalt)            | Primary, destructive, and field text meet WCAG AA   |
| 9.6 | Color not sole meaning              | Destructive still reads as Delete via label text    |
| 9.7 | `prefers-reduced-motion: reduce`    | Switch thumb / hover transitions minimal or off     |

---

## 10. Regression / “still works”

| #   | Action                   | Expect                                           |
| --- | ------------------------ | ------------------------------------------------ |
| 10.1| `/phase-3-dashboard`     | Shell + dashboard unchanged                      |
| 10.2| `/phase-2-dashboard`     | Layout-only composition unchanged                |
| 10.3| Token discipline         | No obvious hardcoded colors on new controls      |
| 10.4| No `lib-ui` on page      | Phase 4 page uses `jp-*` primitives only         |

---

## Pass criteria

Phase 4 manual QA passes when:

1. All four button variants (plus icon button) look correct and respect accent/density.
2. Input, textarea, and select are labeled, focusable, and show invalid/disabled affordances in Storybook.
3. Checkbox and switch toggle via click, label, and keyboard; checked/on uses accent as a **signal**.
4. Showcase `/phase-4-controls` form works inside the app shell on desktop and mobile.
5. Storybook Controls Form responds to accent and density toolbars.
6. Phase 2 and Phase 3 routes remain intact.

If anything fails, note viewport, accent/density, control name, and steps to reproduce on the PR.
