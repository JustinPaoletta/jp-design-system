# Accessibility support matrix

Recorded October 4, 2026. This file is the supported target for workstream 2.
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

| Reader    | Role                           | Status on October 4, 2026                                                                                                                                           |
| --------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VoiceOver | Intended macOS screen reader   | **Not reviewed.** No VoiceOver session was run.                                                                                                                     |
| NVDA      | Intended Windows screen reader | **Not reviewed.** This environment is macOS. No NVDA session was run.                                                                                               |
| JAWS      | Not required                   | **Out of scope.** Repository docs do not name JAWS as a consumer requirement. The readiness plan says to include JAWS only if target consumers require it. None do. |

Automated axe and keyboard checks are not a screen reader review. Accessible
names, reading order, and announcement behavior still need VoiceOver and NVDA
before those rows can be marked reviewed.

## Reduced motion, zoom, and forced colors

| Topic           | What automation covers                                                                                                                                                                                                                                                                                                                                                 | What it does not cover                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reduced motion  | `a11y state coverage › reduced motion removes shell and assistant transitions` sets `prefers-reduced-motion: reduce` and asserts the app shell sidebar, collapse toggle, and assistant panel surface compute `transition-property: none` and `transition-duration: 0s`. The same test asserts the sidebar duration is not `0s` when the preference is `no-preference`. | It does not walk every animated component. CSS already includes `prefers-reduced-motion` in button, icon button, input, textarea, select, checkbox, switch, table row hover, nav item, progress, skeleton, app shell, and assistant panel. Those rules are not each asserted in the browser. Toast enter, switch thumb, and skeleton pulse were not exercised under the preference in this pass. |
| 200% zoom       | Not automated.                                                                                                                                                                                                                                                                                                                                                         | Manual only. Not performed in this pass.                                                                                                                                                                                                                                                                                                                                                         |
| 400% zoom       | Not automated.                                                                                                                                                                                                                                                                                                                                                         | Manual only. Not performed in this pass.                                                                                                                                                                                                                                                                                                                                                         |
| Narrow viewport | Existing `app-shell.spec.ts` opens and closes the drawer at 390×844. `recipes visual neon default mobile shell` stores a macOS Chromium screenshot of that closed mobile shell.                                                                                                                                                                                        | This is a narrow viewport, not browser zoom. Reflow at 200%/400% is still manual.                                                                                                                                                                                                                                                                                                                |
| Forced colors   | Not automated. Playwright was not set to `forcedColors: 'active'`.                                                                                                                                                                                                                                                                                                     | No `forced-colors` (or Windows high contrast) styles exist under `libs/ui` or `libs/tokens`. Windows high contrast was not reviewed. See [FINDINGS.md](FINDINGS.md).                                                                                                                                                                                                                             |

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
capturing, matching the existing recipe shots.

**Both accents (neon, cobalt) and both densities (default, compact):** the
product recipes page at 1280×900, full page. Four baselines, titles
`recipes visual <accent> <density>`.

**Neon and default density only**, so the matrix stays bounded:

| Title                                            | What it captures                                            |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `recipes visual neon default mobile shell`       | `/app-shell` at 390×844, drawer closed                      |
| `recipes visual neon default open dialog`        | `/overlays` with Delete deployment? open                    |
| `recipes visual neon default assistant response` | `/assistant` after Seed tone demo                           |
| `recipes visual neon default settings error`     | `/product-recipes` Settings with the email validation alert |

That is four new PNGs. Cobalt, compact, WebKit, and Linux do not have baselines
for these extra states.

## CI follow-up

The macOS visual job now selects both `recipes visual` and
`component expansion visual` titles:

```sh
npx nx run showcase-e2e:e2e -- --project=chromium --grep="recipes visual|component expansion visual|product tools visual|workflow visual"
```

The Linux functional job excludes that grep, so the new screenshots stay off
Linux runners. `a11y-states.spec.ts` titles do not contain `recipes visual`,
so Chromium and WebKit functional CI already runs them.

## Component expansion coverage

`component-expansion.spec.ts` exercises search/password controls, form recovery,
native disclosures, multi-selection, drawer focus, WCAG 2.1 A/AA axe checks, and
mobile RTL layout in Chromium and WebKit. Theme checks use reduced motion so
contrast is measured on the settled theme.

`component-expansion-visual.spec.ts` adds eight macOS Chromium baselines: the full
page in neon/cobalt and default/compact density; mobile LTR and RTL; a desktop
drawer; and a mobile RTL drawer. Both drawer screenshots capture the viewport
rather than expanding the viewport over the full underlying page.

## Everyday workflows

The third batch follows the existing macOS Chromium/WebKit functional and macOS Chromium visual matrix. Native picker dialogs, other browser locales, physical touch, screen readers, forced colors and SSR remain unverified. See [WORKFLOWS.md](WORKFLOWS.md).
