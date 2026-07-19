# Epic 7 — Assistant System Implementation Plan

**Status:** Complete — Stories 7.0–7.5 delivered  
**Delivered:** Complete  
**Roadmap:** [JP_ROADMAP.md](./JP_ROADMAP.md) · **Principles:** [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)  
**Depends on:** Feedback & Overlays complete ([FEEDBACK_OVERLAYS_PLAN.md](./FEEDBACK_OVERLAYS_PLAN.md))  

---

## Executive summary

Prior milestones established tokens, layout/typography, an app shell, controls, data display, and a full feedback/overlay layer. This epic introduces the **branded
assistant system**: a docked assistant panel, a context-trigger API so product
surfaces can open the panel with entity context, and a tone-refinement pass so
assistant chrome and message roles stay calm, professional, and accent-disciplined.

The deliverable is not a full LLM client, streaming runtime, or tool-calling
framework. It is a **small, opinionated assistant UI kit** with token-driven
visuals, an imperative context API, and proof in Storybook + Showcase — enough
to ship a branded assistant integration inside the app shell using Controls and Feedback & Overlays for confirm/dismiss patterns.

**Roadmap deliverable:** Branded assistant integration  
**Components:** `JpAssistantService`, `jpAssistantTrigger`, `jp-assistant-message`,
`jp-assistant-panel`

---

## Prerequisites

1. Feedback & Overlays (PR #10) is the tip of the open delivery chain.
2. Branch from the prior tip (not from
   `main` while the chain is unmerged).
3. Confirm coverage gates remain green (`ui` / `showcase` ≥ 90%).
4. Skim [PRIMITIVES.md](./PRIMITIVES.md) conventions — this epic must match them.

---

## Problem statement

Today the design system can host dashboards, forms, tables, and overlays, but it
cannot express a **persistent assistant surface** or a **context handoff** from
product UI into that surface. Any in-product assistant would either:

- Duplicate panel/composer/message chrome and drift from DESIGN_PRINCIPLES, or
- Pull in an external chat kit and break the dark-first / accent-as-signal model

Without this epic, Showcase cannot prove branded assistant integration, and product
teams lack a consistent way to open help with entity context (deployment, row,
filter set, etc.).

---

## Goals

| Goal                    | Success signal                                                       |
| ----------------------- | -------------------------------------------------------------------- |
| Assistant panel shipped | `jp-assistant-panel` exported from UI                                |
| Context trigger API     | `JpAssistantService` + `jpAssistantTrigger` open with typed context  |
| Tone refinement         | Message roles + panel chrome follow calm, accent-disciplined rules   |
| Token-only visuals      | No hardcoded colors; assistant tokens in `libs/tokens`               |
| Accessible by default   | Focus management, Escape dismiss, labelled region, keyboard composer |
| Composable in shell     | Showcase assistant page inside `jp-app-shell`                        |
| Testable                | Unit + Storybook play + Chromium e2e; coverage gates still pass      |

---

## Non-goals (defer)

| Defer                                   | Why / where                        |
| --------------------------------------- | ---------------------------------- |
| Real LLM / streaming / tool calling     | Product runtime concern            |
| Conversation persistence / history sync | Apps own domain persistence        |
| Multi-panel / multi-assistant registry  | Single branded assistant is enough |
| Markdown / code-block rich rendering    | Plain text messages for v1         |
| Voice input / attachments               | Later product epic                 |
| Visual regression baselines             | Quality hardening                            |
| npm publish / docs site                 | Publish                            |

---

## Design principles applied

- **Signal, not noise** — Assistant chrome stays neutral; accent appears on the
  primary send action and the compact context chip only.
- **Consistency over customization** — No `class` / `style` inputs; message roles
  are a closed enum.
- **Approachability without softness** — Calm copy surfaces, structured header,
  restrained motion; not playful chat bubbles with heavy decoration.
- **Accessibility is default** — Panel is a labelled complementary region; Escape
  closes; focus moves into the composer when opened from a trigger.
- **Motion** — Open/close uses existing motion tokens; honor `prefers-reduced-motion`.

---

## Architecture

### Placement

```text
libs/ui/src/lib/primitives/
  assistant/
    assistant.service.ts          # open/close, context, messages
    assistant-trigger.ts          # jpAssistantTrigger directive
    assistant-message.ts/.html/.scss
    assistant-panel.ts/.html/.scss
    assistant.spec.ts
    assistant.stories.ts
```

Follow existing primitive patterns: standalone OnPush components, export from
`libs/ui/src/index.ts`.

### API conventions (lock these early)

| Convention      | Rule                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| Panel delivery  | Imperative `JpAssistantService` + `<jp-assistant-panel />` (toast pattern) |
| Context trigger | Attribute directive `jpAssistantTrigger` + optional `[jpAssistantContext]` |
| Message roles   | Closed union: `user` \| `assistant` \| `system`                            |
| Panel control   | Service owns `isOpen`; panel reads service signals                         |
| Composer        | Native textarea + `jp-button` send; `(messageSubmit)` for host responders  |
| Positioning v1  | Fixed right dock (desktop); scrim + full-height overlay (mobile)           |

### Suggested public APIs (draft)

```html
<jp-assistant-panel title="JP Assistant" />

<button
  type="button"
  jpAssistantTrigger
  [jpAssistantContext]="{
    label: 'Deployment dep-1042',
    description: 'Production rollout',
    entityType: 'deployment',
    entityId: 'dep-1042'
  }"
>
  Ask about this
</button>
```

```ts
assistant.open({ context });
assistant.addMessage({ role: 'assistant', content: '…' });
assistant.close();
```

### Token work

Audit before coding. Likely additions (semantic only):

| Group     | Examples                                                                                   |
| --------- | ------------------------------------------------------------------------------------------ |
| Assistant | panel bg/border, header bg, composer bg, user/assistant/system message tones, context chip |
| Size      | `assistant.panel-width`                                                                    |
| Z-index   | `assistant.scrim`, `assistant.panel` (below dialog, above shell drawer)                    |
| Motion    | Prefer existing `motion.transition.base` / shell duration                                  |

Reuse existing surface, text, border, accent (context chip only), focus, and
elevation tokens wherever possible. Run `tokens:build` / `tokens:check` in CI.

---

## Tone refinement pass

Assistant includes an explicit **tone refinement** for assistant surfaces:

| Surface           | Rule                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| Panel chrome      | Neutral raised/subtle surfaces; never accent wash backgrounds        |
| Context chip      | Compact accent signal (soft fill + accent text) — selection metaphor |
| User message      | Subtle surface bubble; primary text                                  |
| Assistant message | Sunken/calm bubble; primary text; no brand-color fill                |
| System message    | Muted text, no bubble — status/meta only                             |
| Send action       | Primary button (accent as action signal)                             |
| Empty state       | Secondary/muted copy; structured, not playful                        |

This pass is documented in PRIMITIVES.md and proven in Showcase/Storybook.

---

## Story breakdown

### Story 7.0 — Assistant tokens + API spike

**Scope:** Token gaps, locked API decisions, tone rules.

**Acceptance criteria:**

- [x] Semantic assistant/size/z-index tokens added (only what components need)
- [x] Generated artifacts rebuilt; `tokens:check` passes
- [x] Locked decisions table filled in this plan
- [x] Documented in `libs/tokens/README.md`

### Story 7.1 — `JpAssistantService`

**Acceptance criteria:**

- [x] `open({ context? })` / `close()` / `toggle()`
- [x] `setContext` / `clearContext`
- [x] `addMessage` / `clearMessages` / readonly `messages` signal
- [x] Unit tests cover open + context + message lifecycle

### Story 7.2 — `jpAssistantTrigger`

**Acceptance criteria:**

- [x] Click opens panel via service
- [x] Optional `[jpAssistantContext]` sets context on open
- [x] Unit tests cover trigger behavior

### Story 7.3 — `jp-assistant-message`

**Acceptance criteria:**

- [x] `role`: `user` \| `assistant` \| `system`; `content` string
- [x] Role host classes map to tone tokens (refinement pass)
- [x] Unit + Storybook coverage

### Story 7.4 — `jp-assistant-panel`

**Acceptance criteria:**

- [x] Reads open/context/messages from `JpAssistantService`
- [x] Header title + close; context chip dismiss; message list; composer
- [x] Escape closes; focus moves to composer on open
- [x] Mobile scrim; desktop right dock
- [x] `messageSubmit` output for host responders
- [x] Unit + Storybook coverage

### Story 7.5 — Showcase composition + e2e

**Acceptance criteria:**

- [x] New route `/assistant` (keep prior showcase routes)
- [x] Assistant page lives inside `jp-app-shell`
- [x] Demonstrates context triggers, panel, messages, tone roles together
- [x] Root redirect points to `/assistant`
- [x] `showcase-e2e` asserts landmarks + context-open interaction
- [x] Storybook `Compositions/Assistant System` with accent/density toolbars
- [x] Coverage gates still ≥ 90% on `ui` / `showcase`
- [x] PRIMITIVES.md + CHANGELOG + roadmap + README + manual QA updated

---

## Testing strategy

### Automated (merge gate)

```bash
npm ci
npm run tokens:build
npm run format:check
npm run lint
npm run test          # includes coverage thresholds
npm run build
npx nx run ui:test-storybook
npx nx run showcase-e2e:e2e -- --project=chromium
```

### Manual spot-check (once per story)

| Check                                   | Viewports / modes   |
| --------------------------------------- | ------------------- |
| Context trigger opens panel + chip      | 1440, neon + cobalt |
| Message role tones (user/assistant/sys) | 1024                |
| Composer submit + host reply            | 1024                |
| Escape / close / context dismiss        | 1024, 390           |
| Mobile scrim overlay                    | 390                 |
| Assistant page inside app shell         | 1440, 390           |

---

## Accessibility requirements

- Panel: `role="complementary"` (or dialog-like region) with accessible name
- Context chip: dismiss control has accessible label
- Composer: labelled textarea; Enter-to-send optional (button is primary)
- Escape dismisses open panel
- Focus moves into composer when opened; restore to trigger when closed from trigger path when practical
- Honor `prefers-reduced-motion` on panel transitions
- Contrast: AA for message text on role surfaces

---

## Risks and decisions

| Decision          | Options                           | Recommendation                                         |
| ----------------- | --------------------------------- | ------------------------------------------------------ |
| Panel ownership   | Controlled inputs vs service      | Service + panel (matches toast outlet pattern)         |
| Context API       | Service-only vs trigger directive | Both: service for apps, directive for markup triggers  |
| Message rendering | Markdown vs plain text            | Plain text for v1                                      |
| LLM integration   | Built-in mock vs host-owned       | Host-owned via `messageSubmit` + `addMessage`          |
| Showcase route    | Replace `/overlays` vs add `/assistant`    | Add `/assistant`; keep `/overlays`; root → `/assistant` |
| PR granularity    | One epic PR vs per-component      | Single epic PR chained on the prior tip   |

---

## Definition of done (Epic 7)

1. Stories 7.0–7.5 acceptance criteria checked.
2. CI gate green; coverage thresholds held.
3. [JP_ROADMAP.md](./JP_ROADMAP.md) this epic marked complete.
4. [PRIMITIVES.md](./PRIMITIVES.md) documents assistant primitives + tone rules.
5. Showcase proves branded assistant integration inside the app shell.
6. No primitive token leaks; no hardcoded colors in new SCSS.
7. quality hardening was **not** started.

**Deliverable:** Branded assistant integration — service, context trigger, message
tones, and panel ready for product assistant surfaces on top of App Shell through Feedback & Overlays.

---

## Suggested PR sequence

| PR      | Contents                                                       | Depends on                 |
| ------- | -------------------------------------------------------------- | -------------------------- |
| 7.0–7.5 | Tokens + service + trigger + message + panel + Showcase + docs | Prior tip |

Single epic PR is preferred for this epic given the tightly coupled assistant set.

---

## First implementation steps

1. Branch from the prior tip.
2. Story 7.0: add assistant tokens; lock API decisions below.
3. Implement service + trigger, then message, then panel.
4. Showcase `/assistant` + composition story + e2e + docs.
5. Open PR against the prior tip.

---

## Locked decisions

| Decision        | Choice                                                           |
| --------------- | ---------------------------------------------------------------- |
| Panel delivery  | `JpAssistantService` + `<jp-assistant-panel />`                  |
| Context trigger | `jpAssistantTrigger` + optional `[jpAssistantContext]`           |
| Context shape   | `{ label, description?, entityType?, entityId? }`                |
| Message roles   | `user` \| `assistant` \| `system`                                |
| Host replies    | Panel `messageSubmit` output; apps call `addMessage`             |
| Desktop layout  | Fixed right dock (`size.assistant.panel-width`)                  |
| Mobile layout   | Scrim + full-height overlay                                      |
| Z-index         | Below dialog (90/100); above shell drawer (50)                   |
| Tone refinement | Neutral chrome; accent only on send + context chip               |
| Showcase route  | `/assistant`; keep prior routes; root redirect → `/assistant` |
| LLM / streaming | Deferred                                                         |
| Quality hardening    | Not started in this epic                                         |
