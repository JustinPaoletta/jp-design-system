# Epic 4 — Core Controls Implementation Plan

**Status:** Complete — Stories 4.0–4.6 delivered  
**Delivered:** Complete  
**Roadmap:** [JP_ROADMAP.md](./JP_ROADMAP.md) · **Principles:** [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)  
**Depends on:** App Shell App Shell complete ([APP_SHELL_PLAN.md](./APP_SHELL_PLAN.md))

---

## Executive summary

Prior milestones established tokens, layout/typography primitives, and a persistent app
shell. This epic introduces the **interactive control layer**: buttons and form
controls that products actually click, type into, and submit.

The deliverable is not a kitchen-sink form library. It is a **small, opinionated
set of token-driven Angular controls** with strict APIs, accessible defaults, and
proof in Storybook + Showcase — enough to build real settings and filter UIs
inside the app shell without inventing one-off styles.

**Roadmap deliverable:** Complete form styling  
**Components:** `jp-button`, `jp-icon-button`, `jp-input`, `jp-textarea`,
`jp-select`, `jp-checkbox`, `jp-switch`

---

## Prerequisites

1. Merge App Shell (PR #7) into `main`.
2. Pull latest `main`; create the feature branch.
3. Confirm coverage gates remain green (`ui` / `showcase` ≥ 90%).
4. Skim [PRIMITIVES.md](./PRIMITIVES.md) conventions (`as`, no style/class inputs,
   OnPush, token maps) — this epic must match them.

---

## Problem statement

Today the design system can lay out pages and wrap them in a shell, but it cannot
express primary actions or form fields with shared semantics. Showcase and shell
chrome still use **ad-hoc native `<button>` styling**. Any settings page, filter
bar, or destructive confirm would either:

- Duplicate token mappings and drift from DESIGN_PRINCIPLES, or
- Pull in an external component kit and break the dark-first / accent-as-signal model

Without this epic, Data Display data tables and Feedback & Overlays have nothing consistent
to trigger or edit.

---

## Goals

| Goal                     | Success signal                                                    |
| ------------------------ | ----------------------------------------------------------------- |
| Core control set shipped | All seven controls exported from `libs/ui`                        |
| Token-only visuals       | No hardcoded colors; control tokens in `libs/tokens` where needed |
| Accessible by default    | Keyboard, focus-visible, labels, disabled, and checked states     |
| Accent as signal         | Primary / focus / checked use accent; never large accent fills    |
| Density-aware            | Compact mode tightens control height/padding via tokens           |
| Composable in shell      | Showcase form/settings composition inside `jp-app-shell`          |
| Testable                 | Unit + Storybook play + Chromium e2e; coverage gates still pass   |

---

## Non-goals (defer)

| Defer                                    | Why / where                                                        |
| ---------------------------------------- | ------------------------------------------------------------------ |
| Date picker, combobox, slider            | Later epic once core patterns stabilize                            |
| File upload                              | Needs separate a11y + UX pass                                      |
| Form-level validation engine             | Expose states (`invalid`, `error` text); leave schema libs to apps |
| `RouterLink` inside button               | Apps compose; primitive stays presentational                       |
| Toast / dialog / popover                 | Feedback & Overlays                                                            |
| Table bulk actions patterns              | Data Display consumes buttons; doesn’t own them                         |
| Visual regression baselines              | Quality hardening                                                            |
| Replacing shell chrome buttons mid-epic | Optional follow-up once `jp-icon-button` exists                    |

---

## Design principles applied

- **Signal, not noise** — Primary button and focus ring use accent; secondary/ghost stay neutral; destructive uses state-error tokens, not accent.
- **Consistency over customization** — No `class` / `style` inputs; variants are closed enums.
- **Accessibility is default** — Every control has a documented label strategy (`aria-label` or associated `<label>` / `jp-text as="label"`).
- **Density** — Heights and paddings come from `--jp-size-control-*` and space tokens; compact overrides already exist.
- **Motion** — Hover/active transitions use existing motion tokens; honor `prefers-reduced-motion`.

---

## Architecture

### Placement

```text
libs/ui/src/lib/primitives/
  button/
  icon-button/
  input/
  textarea/
  select/
  checkbox/
  switch/
```

Follow existing primitive patterns: standalone OnPush component, `*.ts` / `*.html` /
`*.scss` / `*.spec.ts` / `*.stories.ts`, export from `libs/ui/src/index.ts`.

### API conventions (lock these early)

| Convention | Rule                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Variants   | Closed string unions + `createStringUnionTransform`                                                                 |
| Sizes      | Prefer `sm` \| `md` \| `lg` mapped to control size tokens                                                           |
| Disabled   | `disabled` boolean input; reflects to native `disabled` / `aria-disabled` as appropriate                            |
| Labels     | Prefer external label via projection or `aria-label` input; do not invent a parallel label system per control       |
| Forms      | Support Angular forms where natural: `ControlValueAccessor` for input, textarea, select, checkbox, switch           |
| Buttons    | `type`: `button` \| `submit` \| `reset`; no CVA                                                                     |
| Icons      | `jp-icon-button`: required accessible name; optional projected icon slot (SVG/content) until an icon package exists |

### Suggested public APIs (draft)

```html
<jp-button variant="primary" size="md" type="submit">Save</jp-button>
<jp-button variant="secondary">Cancel</jp-button>
<jp-button variant="ghost">Learn more</jp-button>
<jp-button variant="destructive">Delete</jp-button>

<jp-icon-button ariaLabel="Collapse sidebar" (click)="…">
  <span jpIcon><!-- optional glyph --></span>
</jp-icon-button>

<jp-input label="Email" type="email" [(ngModel)]="email" [invalid]="…" />
<jp-textarea label="Notes" rows="4" />
<jp-select label="Role" [options]="roles" />
<jp-checkbox>Subscribe</jp-checkbox>
<jp-switch>Compact density</jp-switch>
```

Exact label wiring (input prop vs projected `<label>` vs `jp-text`) should be
decided in Story 4.0 spike and documented in PRIMITIVES.md before mass implementation.

### Token work

Audit before coding. Likely additions (semantic only):

| Group         | Examples                                                                |
| ------------- | ----------------------------------------------------------------------- |
| Control fg/bg | `--jp-color-control-bg`, `--jp-color-control-border`, hover/active maps |
| Button        | primary solid/hover, secondary border, ghost hover, destructive solid   |
| Field         | input bg, border, placeholder, invalid border                           |
| Selection     | checkbox/switch track checked (accent signal), unchecked border         |

Reuse existing focus, foreground, surface, state-error, and control-size tokens
wherever possible. Run `tokens:build` / `tokens:check` in CI.

---

## Story breakdown

### Story 4.0 — Control tokens + API spike

**Scope:** Token gaps, shared control SCSS patterns, one-page API decision record.

**Acceptance criteria:**

- [ ] Semantic control/button/field tokens added (only what components need)
- [ ] Generated artifacts rebuilt; `tokens:check` passes
- [ ] Written decision: label strategy, CVA approach, size scale
- [ ] Documented in `libs/tokens/README.md`

### Story 4.1 — `jp-button`

**Acceptance criteria:**

- [ ] Variants: `primary`, `secondary`, `ghost`, `destructive`
- [ ] Sizes: `sm`, `md`, `lg` (or documented subset)
- [ ] `type`, `disabled`, focus-visible, hover/active
- [ ] Unit tests + Storybook (all variants; disabled; focus)
- [ ] Accent toolbar meaningful on primary only (composition or globals enabled)

### Story 4.2 — `jp-icon-button`

**Acceptance criteria:**

- [ ] Square control using icon size tokens
- [ ] Requires accessible name (`ariaLabel` input or equivalent)
- [ ] Variants aligned with button ghost/secondary (keep surface area small)
- [ ] Unit + Storybook coverage
- [ ] Optional: replace shell collapse/menu native buttons in a follow-up PR (not blocking)

### Story 4.3 — `jp-input` + `jp-textarea`

**Acceptance criteria:**

- [ ] Text input + textarea with shared field chrome
- [ ] `disabled`, `readonly`, `invalid` (or `error`) visual states
- [ ] CVA + reactive forms smoke test
- [ ] Label + hint/error slot or props per Story 4.0 decision
- [ ] Unit + Storybook (including invalid + disabled)

### Story 4.4 — `jp-select`

**Acceptance criteria:**

- [ ] Native `<select>` styled via tokens for v1 (custom listbox deferred unless spike says otherwise)
- [ ] Options via input array or projected `<option>` — pick one in 4.0 and stick to it
- [ ] CVA, disabled, invalid
- [ ] Unit + Storybook

**Risk note:** Custom select/listbox is a large a11y surface. Prefer **styled native
select for v1** unless product requirements force custom. Document the choice.

### Story 4.5 — `jp-checkbox` + `jp-switch`

**Acceptance criteria:**

- [ ] Checkbox: unchecked / checked / disabled / invalid; label association
- [ ] Switch: on/off with accent on checked track (signal, not neon slab)
- [ ] CVA for both; keyboard operable
- [ ] Unit + Storybook; reduced-motion safe thumb transition

### Story 4.6 — Showcase composition + e2e

**Acceptance criteria:**

- [ ] New route e.g. `/controls` (keep prior showcase routes)
- [ ] Form lives inside `jp-app-shell` with sample nav
- [ ] Demonstrates button variants + a short form (input, textarea, select, checkbox, switch)
- [ ] Root redirect may stay on `/app-shell` until this story lands; then optionally point to `/controls`
- [ ] `showcase-e2e` asserts landmarks, primary button, and one field interaction
- [ ] Storybook `Compositions/Controls Form` with accent/density toolbars
- [ ] Coverage gates still ≥ 90% on `ui` / `showcase`
- [ ] PRIMITIVES.md + CHANGELOG + roadmap updated

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

| Check                                    | Viewports / modes    |
| ---------------------------------------- | -------------------- |
| All button variants + disabled           | 1440, neon + cobalt  |
| Focus rings on every control             | Keyboard only        |
| Invalid field styles                     | 1024                 |
| Compact density control heights          | 1024                 |
| Switch/checkbox with screen reader label | VoiceOver/NVDA smoke |
| Form inside app shell (no overflow)      | 1440, 390            |

---

## Accessibility requirements

- Buttons: discernible name; disabled not focusable (native) or correctly announced
- Icon button: name required; fail Storybook play test if missing
- Fields: label association (`for`/`id` or wrap); `aria-invalid` when invalid; error text linked via `aria-describedby` when present
- Checkbox/switch: role and checked state exposed; Space toggles
- Contrast: AA for text and essential icons on all variants
- Do not rely on color alone for invalid or destructive meaning (icon/text cue)

---

## Risks and decisions

| Decision               | Options                                    | Recommendation                                      |
| ---------------------- | ------------------------------------------ | --------------------------------------------------- |
| Select implementation  | Native styled vs custom listbox            | Native styled for v1                                |
| Forms binding          | CVA now vs inputs-only                     | CVA for field controls; buttons stay event-based    |
| Label API              | Prop vs projection vs both                 | Decide in 4.0; prefer one primary path              |
| Icon system            | Inline SVG slot vs icon font vs later pack | Content projection slot in v1                       |
| Shell button migration | Immediate vs follow-up                     | Follow-up after 4.2; don’t block the epic           |
| Showcase route         | Replace `/app-shell` vs add `/controls`             | Add `/controls`; keep `/app-shell`               |
| PR granularity         | One epic PR vs per-control PRs             | Prefer 4.0+4.1 first PR; then fields; then showcase |

---

## Definition of done (Epic 4)

1. Stories 4.0–4.6 acceptance criteria checked.
2. CI gate green; coverage thresholds held.
3. [JP_ROADMAP.md](./JP_ROADMAP.md) this epic marked complete.
4. [PRIMITIVES.md](./PRIMITIVES.md) documents all seven controls.
5. Showcase proves controls inside the app shell.
6. No primitive token leaks; no hardcoded colors in new SCSS.

**Deliverable:** Complete form styling — buttons and core inputs ready for product
settings/filter UIs on top of the app shell.

---

## Suggested PR sequence

| PR      | Contents                                     | Depends on |
| ------- | -------------------------------------------- | ---------- |
| 4.0–4.1 | Tokens + API spike + `jp-button`             | `main`     |
| 4.2     | `jp-icon-button`                             | 4.0–4.1    |
| 4.3–4.5 | Input, textarea, select, checkbox, switch    | 4.0        |
| 4.6     | Showcase route, composition story, e2e, docs | 4.2–4.5    |

Single epic PR is acceptable if review size stays manageable; split when diffs
exceed ~800 lines or mix token + many components.

---

## First implementation steps

1. Merge App Shell; branch from `main`.
2. Story 4.0: inventory missing tokens; write API spike notes in this doc’s
   “Locked decisions” section (add a table once decided).
3. Implement `jp-button` end-to-end (tokens → component → tests → stories) as the
   reference control other components copy.
4. Open a draft PR early with this plan as the scope contract.
5. Only then fan out to icon-button and field controls.

---

## Locked decisions

| Decision                | Choice                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Field labels            | `label` string input + optional `hint` / `error` string inputs                                         |
| Checkbox / switch label | Projected content as the visible label                                                                 |
| Select implementation   | Native `<select>` styled via tokens for v1                                                             |
| Options API             | `options: { value: string; label: string }[]` input array                                              |
| Control sizes           | `sm` \| `md` \| `lg` on buttons, icon-button, and fields                                               |
| Invalid state           | Explicit `invalid` boolean on fields (apps wire form state)                                            |
| Indeterminate checkbox  | Deferred — not in v1                                                                                   |
| Forms binding           | CVA for input, textarea, select, checkbox, switch; buttons stay events                                 |
| Button API              | `type`: `button` \| `submit` \| `reset`; variants `primary` \| `secondary` \| `ghost` \| `destructive` |
| Icon button a11y        | Required `ariaLabel` input; icon via content projection                                                |
