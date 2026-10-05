# Figma

## Decision

**Deferred.** Recorded October 4, 2026 by JP maintainers.

There is no designer owner and no Figma library, file, or kit in this
repository. JP will not start a matching Figma library until a designer owner
is assigned.

Code and Storybook remain the source of truth.

---

## Why

The optional design kit in the [remaining task list](../../COMPONENT_EXPANSION_PLAN.md)
is conditional on designer adoption. The adoption condition is not met:

- No designer is named anywhere in the repo as the kit owner.
- No `.fig` file, Figma link, or token-sync config is part of the project.
- Current consumers of this repo are integrating Angular components, token CSS,
  and Storybook.

A kit without an owner would drift from `libs/ui` and from
`libs/tokens/src/tokens`. That drift is worse than having no kit.

---

## Source of truth

Use these until a designer owner exists:

| Question                        | Look here                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Component API, states, keyboard | [PRIMITIVES.md](../PRIMITIVES.md) and Storybook (`npm exec -- nx run ui:storybook`, http://localhost:4400) |
| What is safe to depend on       | [MATURITY.md](./MATURITY.md)                                                                               |
| Visual rules                    | [DESIGN_PRINCIPLES.md](../DESIGN_PRINCIPLES.md)                                                            |
| Tokens, accent, density         | `libs/tokens/README.md`, `tokens.css`, `data-jp-accent`, `data-jp-density`                                 |
| Product compositions            | [PRODUCT_RECIPES.md](../PRODUCT_RECIPES.md) and the composition stories                                    |
| Click-through checks            | [MANUAL_QA.md](../../MANUAL_QA.md)                                                                         |

Accent values in code: `neon` (default) and `cobalt`. Density: `default` and
`compact`. The theme is dark-first. The Storybook light stage is a mat behind
the page, not a light component theme.

---

## Required before a kit exists

Do not create the kit as part of this deferral. When a designer owner is
assigned, the kit has to match the implementation that already exists:

- Owner named, and a version that tracks the package version (`0.1.0` today for
  UI and token distribution builds).
- Variables for semantic tokens only: color, space, type, radius, elevation,
  motion, and z-index. Primitive palettes stay source data, matching the lint
  rule that `libs/ui` does not use them directly.
- Modes for accent (`neon`, `cobalt`) and density (`default`, `compact`). No
  light mode until code has one.
- Component names that match selectors (`jp-button`, `jp-dialog`, `jp-app-shell`).
- Properties that match public inputs and documented defaults.
- States that the stories already show: default, disabled, invalid, loading,
  empty, open overlays, shell collapsed and mobile drawer, assistant pending
  and error.
- Accessibility notes for name, role, and keyboard, taken from
  [PRIMITIVES.md](../PRIMITIVES.md), not invented in the file.
- Compositions only for patterns the code already ships: form, dashboard, table
  with toolbar and pagination, overlays, assistant.
- A written list of representation limits. Native dialog and popover behavior,
  and the English message defaults, cannot be implied as
  fully interchangeable with a static frame.
- A release check that updates the kit in the same change as a breaking token
  or API change ([COMPATIBILITY.md](./COMPATIBILITY.md)).

Examine this decision when a designer owner is assigned. Until then, design
changes land in tokens, primitives, and stories first.
