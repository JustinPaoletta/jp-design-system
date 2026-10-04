# Contributing

How a component or pattern gets into `@jp-design-system/ui`, and how to keep
it in the consuming application instead.

Owner: JP maintainers. Principles: [DESIGN_PRINCIPLES.md](../DESIGN_PRINCIPLES.md).
Acceptance: [ACCEPTANCE.md](./ACCEPTANCE.md). Maturity:
[MATURITY.md](./MATURITY.md). Compatibility: [COMPATIBILITY.md](./COMPATIBILITY.md).

Quality commands and browser limits: [QUALITY.md](../QUALITY.md).
Storybook click-through: [MANUAL_QA.md](../../MANUAL_QA.md).

## Keep live Storybook previews isolated

Development bundle output must remain unique to each server port. Storybook
writes bundles to disk, and the patched development middleware serves those
files. Sharing one output directory between the preview on 4400 and a test
server on 4500 caused continuous iframe reloads across all stories.

Keep the development output isolation in `.storybook/main.ts` and the runtime
hash checks in `tools/run-ui-test-storybook.mjs`. When changing Storybook or its
middleware, run `npm exec -- nx run ui:test-storybook-dev` with the normal preview
already running on 4400; both servers must pass their compiler/runtime checks.
Also run the static target sequentially. See the
[incident and verification evidence](../qa/STORYBOOK_RELOAD_REGRESSION.md).

---

## Propose

1. Read [PRIMITIVES.md](../PRIMITIVES.md). Prefer composition of `jp-box`,
   `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-text`, and `jp-heading`.
2. Open a GitHub issue or a pull request on this repository. Include:
   - the product task
   - why existing primitives cannot express it
   - the proposed selector and inputs
   - keyboard behavior, accessible name, and tokens
   - whether the consuming app must keep ownership of data, auth, or network
3. JP maintainers accept it, reject it, or tell you to keep it in the app.

A single maintainer still fills in that note. The checklist is not optional
when only one person is available to review.

---

## Review

Review checks the acceptance list, the design principles, and the compatibility
rules.

Reject or send back work that:

- adds a `class` or `style` input
- hardcodes a color or uses a primitive token from `libs/ui`
- uses accent as a large background
- introduces bounce, spring, or decorative motion
- builds a one-screen variant that the app can compose
- fetches data, uploads files, or calls an assistant transport inside the library

`experimental` is the starting maturity if the spec or the story is not in the
same change. Promote with a [MATURITY.md](./MATURITY.md) edit when the evidence
exists. There are no experimental exports on October 4, 2026.

---

## Accept into the library

Accept when all of these are true:

- At least two product surfaces need the same behavior, or the roadmap already
  lists it and a real screen needs it now.
- The API can be token-driven and typed.
- The library can ship it without owning application data, authorization, or
  network calls.
- The acceptance checklist can be met, including a spec and a story before the
  export is rated `stable`.

Candidates already listed for later evaluation (accordion, link, avatar, chips,
date picker, upload, multi-select, advanced table) stay out of the library
until that case is made. This document does not accept them.

---

## Keep it in the consuming app

Keep the pattern in the app when:

- only one product uses it
- it is a composition of existing primitives (page header, validation summary,
  dashboard arrangement)
- it owns rows, sorting data, pagination fetches, upload, auth, or assistant
  transport
- it needs product copy, routes, or permissions

`jp-table`, `jp-pagination`, `jp-table-toolbar`, and `JpAssistantService` are
the library's boundary for those jobs. The app keeps the data and the requests.
Recipes for that split live in [PRODUCT_RECIPES.md](../PRODUCT_RECIPES.md).

---

## Pull request checklist

- [ ] Proposal note: task, why it is a library change, and what the app still owns.
- [ ] [ACCEPTANCE.md](./ACCEPTANCE.md) blocking items checked, or a named waiver.
- [ ] Unit spec updated. `npm exec nx test ui` (and `npm exec nx test tokens`
      when tokens change).
- [ ] Storybook story updated for a visual change, including disabled, invalid,
      empty, or open states when those states exist.
- [ ] [PRIMITIVES.md](../PRIMITIVES.md) updated when inputs, defaults, or
      limitations change.
- [ ] [MATURITY.md](./MATURITY.md) updated when maturity or a known limitation
      changes.
- [ ] Breaking or deprecating changes follow [COMPATIBILITY.md](./COMPATIBILITY.md)
      and name the migration in `CHANGELOG.md`.
- [ ] Visual note: neon/cobalt, default/compact, and viewport if layout moved.
      Recipe-page screenshots follow [QUALITY.md](../QUALITY.md).
- [ ] Accessibility note: axe on the touched story, and the [MANUAL_QA.md](../../MANUAL_QA.md)
      path you actually clicked. Say when VoiceOver or NVDA was not run.
- [ ] New user-visible strings are inputs, or the maturity row records them as
      fixed `preview` copy.
- [ ] No edits to generated `tokens.css` / `tokens.json` by hand. Regenerate
      with `npm run tokens:build` and pass `npm run tokens:check`.

Findings from review go to `docs/qa/` using [TRIAGE.md](./TRIAGE.md).
