# JP design principles

## Purpose

JP gives applications clear, consistent interface components.
These rules apply to design and code changes.

## 1. Precision Over Decoration

Every visual element must help users read, understand or operate the interface.
Decoration alone is not a reason to add an element.

## 2. Signal, Not Noise

Accent color identifies primary actions, focus, active navigation and selection.
Large backgrounds and long text do not use accent color for decoration.

## 3. Consistency Over Customization

Visual inputs use the documented token scales.
Components do not accept arbitrary `class` or `style` inputs.
Spacing, colors, type and motion use semantic tokens.

## 4. Dark-First Clarity

JP uses a dark theme.
Text and controls must meet the documented WCAG AA contrast target.
Tone changes and borders separate surfaces.
Heavy shadows are not a substitute for clear structure.

## 5. Accessibility Is Default

Components must have keyboard operation, visible focus and readable contrast.
Status must remain clear without color alone.
Accessibility takes priority over decoration.

## 6. Motion Is Subtle and Purposeful

Motion must explain a change.
It must be brief and respect reduced-motion preferences.
Bounce, spring effects and decorative transitions are not permitted.

## 7. Layout Discipline

Box, Stack, Inline, Grid and Surface supply shared layout rules.
Applications use token spacing instead of unrelated margin values.

## 8. Typography Hierarchy Is Level-Based

`jp-text` is for body text, labels and inline emphasis.
Its `as` tag and `size` are independent.

`jp-heading` is for page and section titles.
Its `h1`–`h6` level sets both the tag and visual size.
It has no separate `size` input.
Each level has its own heading token.

Select the heading level from the document structure.
Use `jp-text` for text that is not a heading.

## 9. Semantic Meaning Is Stable

Success, warning, error and information remain distinct from brand accent.
An accent change must not change those meanings.

## 10. Approachability Without Softness

Product text is calm, direct and specific.
Labels name the action or content.
Decoration, jokes and aggressive language do not help the user.

## 11. Engineering-Grade Standards

Strict types, semantic tokens, lint rules and tests are design requirements.
Chromium/Firefox/WebKit tests and macOS Chromium snapshots give automated evidence.
[Quality](QUALITY.md) defines their scope and remaining manual inspection.

## 12. Evolution Without Chaos

Accent and density changes use documented token modes.
New modes must have a clear requirement and evidence that existing behavior still works.

## Final Standard

A change must keep clarity, consistency, accessibility and layout rules.
JP maintainers reject changes that weaken those requirements.
