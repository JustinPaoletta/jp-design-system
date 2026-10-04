# Triage

How JP handles accessibility defects, regressions, and consumer feedback.

Owner: JP maintainers. Evidence folder: [docs/qa/](../qa/README.md).
Manual Storybook script: [MANUAL_QA.md](../../MANUAL_QA.md).
Automated gates: [QUALITY.md](../QUALITY.md).

---

## Severity

| Level | Meaning                                                                                            | Examples in this library                                                                                                                                                                                         |
| ----- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1    | The documented task cannot be completed, or WCAG A/AA fails on the dark theme for a default state. | No keyboard path to a control. Dialog or shell drawer traps focus with no Escape. Missing name on `jp-icon-button` or a field. Contrast below AA for text or a focus ring. Form value dropped on invalid submit. |
| S2    | The task can be finished, but a documented behavior is wrong.                                      | Wrong `aria-sort`. Tab arrows select instead of only moving focus. Toast or alert uses the wrong role. Focus does not return to the dialog opener. Nested Escape closes the parent first.                        |
| S3    | Visual or copy defect inside the token rules. Use is still possible.                               | Compact density clips padding. Accent washes a surface it should not. A default English string is wrong while an input exists to replace it.                                                                     |
| S4    | Preference or a new component.                                                                     | A second visual theme. A component the roadmap has not accepted.                                                                                                                                                 |

S1 and S2 are defects. S3 is fixed in the normal queue. S4 is a proposal under
[CONTRIBUTING.md](./CONTRIBUTING.md), not a defect, unless it hides an S1 or S2.

---

## Release-blocking

A finding is **release-blocking** when any of these are true:

- Severity is S1.
- Severity is S2 on a `stable` export, or on a `preview` export in the part of
  the behavior the library does claim (keyboard for menus, dialog focus
  restore, pagination page math). The native top-layer parity limit in
  [MATURITY.md](./MATURITY.md) is a known limit, not an open S2, until a `docs/qa/`
  note shows a failure inside the claimed fallback.
- CI already fails or would fail: `npm exec nx test ui`, `npm exec nx test tokens`,
  `npm run tokens:check`, Storybook interaction or axe failures, showcase axe,
  or the recipe visual job in [QUALITY.md](../QUALITY.md).
- A `stable` API break ships without the window in
  [COMPATIBILITY.md](./COMPATIBILITY.md).

Release-blocking findings are fixed or explicitly waived by JP maintainers
before the release those packages ship. A waiver names the export, the severity,
and the follow-up. It is written under `docs/qa/`.

Not release-blocking by themselves:

- Missing VoiceOver or NVDA evidence while [ACCEPTANCE.md](./ACCEPTANCE.md)
  still lists that review as outside the merge gate
- Absence of a light theme
- Fixed English on exports already marked `preview` for that copy
- Browser differences inside the documented popover/dialog fallback, until they
  break a behavior the spec claims

---

## Where to record findings

Write a markdown note under `docs/qa/`. Name it with the date and the surface,
for example `docs/qa/2026-10-04-dialog-focus.md`.

Include:

- date, export, maturity, severity
- accent, density, viewport, browser, and assistive technology when relevant
- steps and the expected documented behavior
- whether it is release-blocking
- spec, story, or e2e that should lock the fix

Link the note from [docs/qa/README.md](../qa/README.md). That index currently
points at [MANUAL_QA.md](../../MANUAL_QA.md) and warns against unused historical
capture folders. New notes belong next to that index, not in `phase2-epic2/`.

Storybook mismatches found while walking [MANUAL_QA.md](../../MANUAL_QA.md) use
the same note. Include the story path and the toolbar state, as that checklist
already asks.

---

## Accessibility defects

1. Assign S1–S3 from the table.
2. Reproduce on the component story, then on the showcase route if one exists
   (`/overlays`, `/controls`, `/data`, `/app-shell`, `/assistant`,
   `/product-recipes`).
3. If the story's accessibility panel or showcase axe already covers the state,
   add or extend the failing test in the same change as the fix.
4. If the failure is only visible to VoiceOver, NVDA, high contrast, or zoom,
   record that in `docs/qa/` even when no automated test can lock it yet.

Keyboard regressions on dialog, menu, combobox, tabs, and the shell drawer are
S1 or S2. Treat a focus trap with no exit as S1.

---

## Regressions

A regression is a break of behavior described in [PRIMITIVES.md](../PRIMITIVES.md),
a unit spec, a story `play` function, showcase e2e, or a recipe screenshot.

1. Confirm it against the documented default, not against an undocumented DOM
   structure. Host classes are not a styling API
   ([COMPATIBILITY.md](./COMPATIBILITY.md)).
2. Rate severity.
3. Fix `stable` and claimed `preview` behavior before adding features in the
   same area.
4. Add a spec or a story assertion that fails before the fix.

Token drift (`npm run tokens:check` failing) is a regression of the generated
contract. Fix the source JSON or the generator; do not hand-edit
`libs/tokens/src/generated/`.

---

## Consumer feedback

Consumers report issues on this repository's GitHub issues. JP maintainers
triage them with the same severity scale.

Ask for the package version (`@jp-design-system/ui` and
`@jp-design-system/tokens`, currently `0.1.0` in distribution metadata), the
import they used, Angular version, and whether they styled through tokens or
through unsupported internal classes.

Feedback that asks for a new component follows [CONTRIBUTING.md](./CONTRIBUTING.md).
Feedback that reports a broken contract becomes a `docs/qa/` note when it is
S1 or S2, then a code change with a test.

Do not treat a request to own application data, uploads, or assistant transport
inside the library as a defect. Those stay in the consuming app.
