# Phase 6 — Manual Test Checklist

Use this after automated gates are green (`lint`, unit tests + coverage, Storybook
interaction tests, Showcase Chromium e2e). Record failures in the PR description;
do not create a separate QA ledger.

**Related:** [docs/PHASE6_EPIC6_FEEDBACK_OVERLAYS_PLAN.md](./docs/PHASE6_EPIC6_FEEDBACK_OVERLAYS_PLAN.md) ·
[docs/PRIMITIVES.md](./docs/PRIMITIVES.md) · Phase 6 PR (`phase6-feedback-overlays`) · depends on
[PR #9](https://github.com/JustinPaoletta/jp-design-system/pull/9) (`phase5-data-display`)

---

## What you are validating

Phase 6 delivers the feedback and overlay layer inside the Phase 3 app shell:

| Piece              | What it should do                                             |
| ------------------ | ------------------------------------------------------------- |
| `jpFocusTrap`      | Tab cycles within an active dialog panel                      |
| `jp-tooltip`       | Hover/focus tip; Escape hides; placements                     |
| `jp-toast`         | Service + outlet; tones; dismiss; does not steal focus        |
| `jp-dialog`        | Modal confirm; Escape/scrim/close; focus restore              |
| `jp-popover`       | Anchored panel; Escape/outside click                          |
| `jp-dropdown-menu` | Menu + arrow keys; item select closes                         |
| Showcase           | `/phase-6-overlays` interaction page inside `jp-app-shell`    |
| Storybook          | Feedback primitive stories + `Compositions/Feedback Overlays` |

**Not in Phase 6 (do not file as bugs):** CDK Overlay / collision engine, nested
modal stacks, assistant panel (Phase 7), visual regression baselines (Phase 8).

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

| #   | Action                     | Expect                                                           |
| --- | -------------------------- | ---------------------------------------------------------------- |
| 1.1 | Visit `/`                  | Redirects to `/phase-6-overlays`                                 |
| 1.2 | Read the page              | Heading **Phase 6 Feedback & Overlays**; tooltip/toast/dialog UI |
| 1.3 | Inspect chrome             | App shell sidebar + main; **Overlays** nav item active           |
| 1.4 | Nav links                  | Data / Controls / Phase 3 / Phase 2 links present                |
| 1.5 | Visit `/phase-5-data`      | Phase 5 data page still works                                    |
| 1.6 | Visit `/phase-4-controls`  | Phase 4 form still works                                         |
| 1.7 | Visit `/phase-3-dashboard` | Phase 3 shell dashboard still works                              |
| 1.8 | Accent / density meta      | Page shows `accent:` and `density:` from document attributes     |

---

## 2. Tooltip (`jp-tooltip`)

| #   | Action                  | Expect                                     |
| --- | ----------------------- | ------------------------------------------ |
| 2.1 | Hover **Copy ID**       | Tooltip “Copy deployment ID” appears above |
| 2.2 | Move pointer away       | Tooltip hides                              |
| 2.3 | Tab to **Docs**         | Tooltip appears on focus                   |
| 2.4 | Press Escape while open | Tooltip hides                              |
| 2.5 | Storybook placements    | Top / bottom / left / right all readable   |

---

## 3. Toast (`jp-toast`)

| #   | Action                   | Expect                                        |
| --- | ------------------------ | --------------------------------------------- |
| 3.1 | Click **Success**        | Toast “Deployment saved” appears bottom-right |
| 3.2 | Click dismiss ×          | Toast removes                                 |
| 3.3 | Click **Error**          | Error-accent left border; message readable    |
| 3.4 | Wait ~4s without dismiss | Toast auto-dismisses                          |
| 3.5 | Focus stays on trigger   | Toast does not steal keyboard focus           |

---

## 4. Dialog (`jp-dialog`)

| #   | Action                      | Expect                                       |
| --- | --------------------------- | -------------------------------------------- |
| 4.1 | Click **Delete deployment** | Dialog opens with title + actions            |
| 4.2 | Tab inside dialog           | Focus cycles within dialog (trap)            |
| 4.3 | Press Escape                | Dialog closes; focus returns to trigger area |
| 4.4 | Re-open; click scrim        | Dialog closes                                |
| 4.5 | Re-open; click **Delete**   | Closes + success toast; last action updates  |
| 4.6 | Narrow viewport (390)       | Dialog fits without horizontal page scroll   |

---

## 5. Popover (`jp-popover`)

| #   | Action                | Expect                            |
| --- | --------------------- | --------------------------------- |
| 5.1 | Click **Filters**     | Popover panel opens below trigger |
| 5.2 | Click outside         | Popover closes                    |
| 5.3 | Re-open; press Escape | Popover closes                    |

---

## 6. Dropdown menu (`jp-dropdown-menu`)

| #   | Action                   | Expect                                   |
| --- | ------------------------ | ---------------------------------------- |
| 6.1 | Click **Actions**        | Menu opens with Edit / Delete…           |
| 6.2 | ArrowDown / ArrowUp      | Focus moves between items                |
| 6.3 | Activate **Edit**        | Menu closes; last action = Edit selected |
| 6.4 | Open; choose **Delete…** | Menu closes; confirm dialog opens        |

---

## 7. Keyboard / accessibility smoke

| #   | Action                 | Expect                                 |
| --- | ---------------------- | -------------------------------------- |
| 7.1 | Dialog focus rings     | Visible on close + action buttons      |
| 7.2 | Menu `role="menu"`     | Items are `menuitem`                   |
| 7.3 | Toast `role="status"`  | Announced politely (optional SR check) |
| 7.4 | Tooltip not sole label | Trigger still has visible text         |

---

## 8. Storybook composition

| #   | Action                                    | Expect                                |
| --- | ----------------------------------------- | ------------------------------------- |
| 8.1 | Open **Compositions / Feedback Overlays** | Shell + overlay controls              |
| 8.2 | Toggle accent / density toolbars          | Tokens update without layout collapse |
| 8.3 | Open dialog from composition              | Dialog appears over shell             |

---

## Sign-off

| Gate                        | Pass? |
| --------------------------- | ----- |
| Automated unit + coverage   |       |
| Storybook interaction tests |       |
| Showcase Chromium e2e       |       |
| Manual checks above         |       |

Tester: **\*\***\_\_**\*\*** Date: **\*\***\_\_**\*\***
