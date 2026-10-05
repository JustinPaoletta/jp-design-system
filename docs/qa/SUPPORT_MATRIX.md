# Accessibility support matrix

Recorded October 4, 2026. This file defines the accessibility and browser verification target.
It describes what automation asserts. It does not record an assistive-technology review.

## Target level

The root README states a **WCAG 2.1 A/AA** target. It does not claim WCAG 2.2.

Showcase axe checks, in `apps/showcase-e2e/src/quality.spec.ts` and
`apps/showcase-e2e/src/a11y-states.spec.ts`, call `@axe-core/playwright` 4.13.0
(axe-core 4.13.0) with only these tags:

- `wcag2a`
- `wcag2aa`
- `wcag21a`
- `wcag21aa`

That is **WCAG 2.0 A/AA and WCAG 2.1 A/AA**. It is not a WCAG 2.2 conformance claim.

axe-core 4.13.0 has no `wcag22a` tag. Its only `wcag22aa` rule is `target-size`
(Success Criterion 2.5.8), and that rule is shipped **disabled**. The Showcase
tag list does not enable it. Storybook's global gate is
`parameters.a11y.test: 'error'` in `libs/ui/.storybook/preview.ts`. The a11y
addon runs axe's default **enabled** rules, including some best-practice rules
the Showcase tag filter does not run. It does not turn `target-size` on.

Until that rule is intentionally enabled, the automated target stays **WCAG 2.1
Level A and AA** on the routes and states listed below.

## Automated browser matrix

| Check               | macOS Chromium                                | macOS WebKit           | Linux Chromium (CI)     | Linux WebKit (CI)      |
| ------------------- | --------------------------------------------- | ---------------------- | ----------------------- | ---------------------- |
| Functional behavior | Supported                                     | Supported              | Supported               | Supported              |
| axe WCAG 2.1 A/AA   | Supported                                     | Supported              | Supported               | Supported              |
| Visual baselines    | Supported. Baselines are macOS Chromium PNGs. | Not a baseline browser | Not a baseline platform | Not a baseline browser |

Firefox is configured in `apps/showcase-e2e/playwright.config.ts` and is not part
of this supported matrix. CI installs Chromium and WebKit only.

macOS screenshots do not prove Linux visual parity. Functional and axe checks
on Linux do not prove macOS pixel parity.

## Assistive technology

| Reader    | Role                           | Status on October 4, 2026                                                                                                       |
| --------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| VoiceOver | Intended macOS screen reader   | **Not reviewed.** No VoiceOver session was run.                                                                                 |
| NVDA      | Intended Windows screen reader | **Not reviewed.** This environment is macOS. No NVDA session was run.                                                           |
| JAWS      | Not required                   | **Out of scope.** Repository docs do not name JAWS as a consumer requirement. Add it only when a consumer requirement names it. |

Automated axe and keyboard checks are not a screen reader review. Accessible
names, reading order, and announcement behavior still need VoiceOver and NVDA
before those rows can be marked reviewed.

## Reduced motion, zoom, and forced colors

| Topic                  | Automated coverage                                                                                                                                                                                                       | Remaining review                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reduced motion         | `a11y-states.spec.ts` asserts shell/assistant transitions are removed. Browser tests render the expanded screens with reduced motion, and carousel unit/Storybook checks cover optional rotation and preference changes. | No claim that every animation has been manually reviewed.                                                                                                          |
| 200%/400% browser zoom | Larger feature screens run at 640/320 CSS pixels, the layout space of a 1280px window at those zoom levels. Tests interact before checking document overflow and scan the 320px LTR states with axe.                     | Actual browser zoom and text-only zoom remain manual and unreviewed.                                                                                               |
| Narrow viewport        | The expansion/workflow/product-tool suites cover mobile layouts. The seven larger features additionally run at 640px LTR, 320px LTR and 320px RTL in Chromium/WebKit. Tables may scroll inside their own regions.        | Physical touch and assistive technology at those widths remain unreviewed.                                                                                         |
| Forced colors          | Chromium emulation asserts tree/table selection/focus, reorder/carousel controls, scheduling modes/events, chart equivalent data and virtual-table selection. Source includes scoped forced-colors rules.                | Real Windows high contrast, user palettes, all preview components and forced-color contrast remain unreviewed. The four emulation cases skip WebKit intentionally. |

Details, commands and the axe forced-colors limitation are in
[ACCEPTANCE_AUTOMATION.md](ACCEPTANCE_AUTOMATION.md). Forced-colors interaction
assertions run with the preference active; complete axe scans run after restoring
normal colors. No axe rule is disabled or violation filtered. Emulation does not
count as a Windows review.

## Interaction states in axe

Closed-route axe remains in `quality.spec.ts` for `controls`, `data`,
`overlays`, `assistant`, and `product-recipes`.

`a11y-states.spec.ts` adds WCAG 2.1 A/AA scans while these states are open, on
the existing Showcase routes:

| State              | Route                       | How the test opens it                             |
| ------------------ | --------------------------- | ------------------------------------------------- |
| Open dialog        | `/overlays`                 | Delete deployment                                 |
| Open menu          | `/overlays`                 | Actions                                           |
| Open popover       | `/overlays`                 | Filters                                           |
| Combobox results   | `/product-recipes` Settings | Focus the Region combobox                         |
| Validation error   | `/product-recipes` Settings | Save with an empty email                          |
| Selected table row | `/product-recipes` Services | Check Select Payments API                         |
| Active tab         | `/product-recipes`          | Settings selected, Services unselected            |
| Assistant response | `/assistant`                | Send a question and wait for the structured reply |

Keyboard coverage added in that file, beyond `overlay-behavior.spec.ts`:

- Actions menu: Enter opens, focus moves to Edit, Escape closes, focus returns to Actions.
- Filters popover: Enter opens, Escape closes, focus stays on Filters. The showcase panel has no tabbable control. `jp-popover` does not store a previous focus target the way dialog, menu, and assistant do.
- Region combobox: focus opens the list, ArrowDown sets `aria-activedescendant`, Escape closes, focus stays on the field.
- Assistant: Enter on Ask about deployment moves focus to the composer; Escape closes the panel and returns focus to the trigger.

Dialog focus trap and opener restoration stay in `overlay-behavior.spec.ts`.
That spec also covers menu-to-dialog handoff, nested Escape, popover clipping,
and tooltip hover. This pass did not duplicate those tests.

## Visual matrix

macOS Chromium only. Motion is reduced and animations are disabled while
capturing. The existing suite has 66 baselines covering recipes, expansion,
product tools, workflows, advanced layout, and the seven larger features.
Theme, density, viewport and open-state scope are recorded in
[Verification](VERIFICATION.md). The [manual checklist](../../MANUAL_QA.md)
covers the remaining human review.

No forced-colors PNG baseline or actual-zoom baseline is claimed. WebKit and
Linux are functional/accessibility targets, not visual baseline targets.

## CI selection

The macOS visual job selects all six visual title prefixes:

```sh
npm exec -- nx run showcase-e2e:e2e -- --project=chromium --grep="recipes visual|component expansion visual|product tools visual|workflow visual|advanced layout visual|larger features visual"
```

The Linux Chromium/WebKit functional job excludes those same prefixes and
includes `acceptance-environments.spec.ts`. Firefox remains outside the
supported matrix.

## Expansion and native-browser coverage

`component-expansion.spec.ts` exercises search/password controls, form recovery,
exclusive native disclosures, multi-selection, drawer focus, WCAG 2.1 A/AA axe
checks, and mobile RTL layout. The disclosure test asserts the native
`HTMLDetailsElement.name` property and repeated Enter/click/Space activation in
Chromium and WebKit. Theme contrast checks use reduced motion so they measure
the settled theme.

Workflow, product-tool, hierarchy, scheduling, interaction, analytics and
advanced-layout specs extend the original route/state table above. The
[verification reference](VERIFICATION.md) links the current evidence and limits.
Native picker dialogs, physical touch, screen readers and SSR remain unverified;
forced-colors emulation now has the limited coverage described above.
