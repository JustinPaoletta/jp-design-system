# Phase 7 — Manual Test Checklist

Use this after automated gates are green (`lint`, unit tests + coverage, Storybook
interaction tests, Showcase Chromium e2e). Record failures in the PR description;
do not create a separate QA ledger.

**Related:** [docs/PHASE7_EPIC7_ASSISTANT_SYSTEM_PLAN.md](./docs/PHASE7_EPIC7_ASSISTANT_SYSTEM_PLAN.md) ·
[docs/PRIMITIVES.md](./docs/PRIMITIVES.md) · Phase 7 PR (`phase7-assistant-system`) · depends on
[PR #10](https://github.com/JustinPaoletta/jp-design-system/pull/10) (`phase6-feedback-overlays`)

---

## What you are validating

Phase 7 delivers the branded assistant system inside the Phase 3 app shell:

| Piece                  | What it should do                                             |
| ---------------------- | ------------------------------------------------------------- |
| `JpAssistantService`   | Open/close, context, message list                             |
| `jpAssistantTrigger`   | Opens panel with optional entity context                      |
| `jp-assistant-message` | User / assistant / system role tones                          |
| `jp-assistant-panel`   | Docked panel, context chip, composer, Escape close            |
| Showcase               | `/phase-7-assistant` composition inside `jp-app-shell`        |
| Storybook              | Assistant primitive stories + `Compositions/Assistant System` |

**Not in Phase 7 (do not file as bugs):** LLM/streaming runtime, markdown
rendering, conversation persistence, visual regression baselines (Phase 8).

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

| #   | Action                    | Expect                                                        |
| --- | ------------------------- | ------------------------------------------------------------- |
| 1.1 | Visit `/`                 | Redirects to `/phase-7-assistant`                             |
| 1.2 | Read the page             | Heading **Phase 7 Assistant System**; context trigger buttons |
| 1.3 | Inspect chrome            | App shell sidebar + main; **Assistant** nav item active       |
| 1.4 | Nav links                 | Overlays / Data / Controls / Phase 3 / Phase 2 links present  |
| 1.5 | Visit `/phase-6-overlays` | Phase 6 overlays page still works                             |
| 1.6 | Visit `/phase-5-data`     | Phase 5 data page still works                                 |
| 1.7 | Accent / density meta     | Page shows `accent:` and `density:` from document attributes  |

---

## 2. Context trigger API

| #   | Action                         | Expect                                                        |
| --- | ------------------------------ | ------------------------------------------------------------- |
| 2.1 | Click **Ask about deployment** | Panel opens; context chip shows dep-1042 + Production rollout |
| 2.2 | Click **Ask about row**        | Context updates to payments-api / Degraded                    |
| 2.3 | Click **Ask about filters**    | Context updates; message history clears                       |
| 2.4 | Click context chip ×           | Context chip dismisses; panel stays open                      |

---

## 3. Assistant panel

| #   | Action                      | Expect                                            |
| --- | --------------------------- | ------------------------------------------------- |
| 3.1 | With panel open, press Esc  | Panel closes                                      |
| 3.2 | Re-open; click header ×     | Panel closes                                      |
| 3.3 | Open panel                  | Focus moves into composer textarea                |
| 3.4 | Type a question; click Send | User bubble appears; host assistant reply appears |
| 3.5 | Press Enter in composer     | Same as Send (Shift+Enter should not send)        |
| 3.6 | Empty composer + Send       | No message added                                  |

---

## 4. Tone refinement

| #   | Action                   | Expect                                                          |
| --- | ------------------------ | --------------------------------------------------------------- |
| 4.1 | Click **Seed tone demo** | System (muted), assistant (sunken), user (subtle) messages show |
| 4.2 | Inspect panel chrome     | Neutral surfaces; no large accent wash                          |
| 4.3 | Inspect context chip     | Soft accent fill + strong accent text (signal only)             |
| 4.4 | Inspect Send button      | Primary accent action                                           |
| 4.5 | Swap accent neon↔cobalt | Context chip + Send track accent; message bubbles stay neutral  |

---

## 5. Mobile (390×844)

| #   | Action               | Expect                                     |
| --- | -------------------- | ------------------------------------------ |
| 5.1 | Open assistant       | Full-height overlay + scrim behind panel   |
| 5.2 | Tap scrim            | Panel closes                               |
| 5.3 | Shell drawer + panel | Both usable independently; no layout crash |

---

## 6. Storybook

| #   | Action                                      | Expect                              |
| --- | ------------------------------------------- | ----------------------------------- |
| 6.1 | `Primitives/Assistant/Panel` → MessageRoles | Three role tones readable           |
| 6.2 | ContextTrigger play function                | Opens panel with deployment context |
| 6.3 | `Compositions/Assistant System`             | Shell + trigger interaction passes  |
| 6.4 | Accent / density toolbars                   | Composition remains coherent        |

---

## Sign-off

Automated gates green + checklist above exercised once on neon and once on cobalt
is enough to merge Phase 7.
