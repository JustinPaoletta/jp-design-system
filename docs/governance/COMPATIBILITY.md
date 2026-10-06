# Compatibility

What JP treats as a breaking change while the packages are pre-1.0, and how
the deprecated `Ui` / `lib-ui` export is removed.

Package versions on October 4, 2026:

| Package                               | Version source                          | Version |
| ------------------------------------- | --------------------------------------- | ------- |
| Repository                            | root `package.json` / README status     | `0.0.0` |
| `@jp-design-system/ui`                | `libs/ui/package.json`                  | `0.1.0` |
| `@jp-design-system/tokens` (consumer) | `libs/tokens/package.distribution.json` | `0.1.0` |

`libs/tokens/package.json` is the private workspace package (`0.0.1`). Consumers
install the distribution metadata, not that file.

Peer contract for UI: Angular `^22.2.1` and RxJS `^7.8.0`. Angular 21 is outside
the contract. See [DISTRIBUTION.md](../DISTRIBUTION.md).

Public UI entry: `libs/ui/src/index.ts`, built with ng-packagr.
Public token entries: `.`, `./tokens.css`, `./tokens.compact.css`, `./tokens.json`.

---

## Breaking changes

A break is a change a consumer cannot absorb by compiling again against the same
imports and the same documented inputs.

### Angular APIs

- Remove, rename, or stop exporting a symbol from `libs/ui/src/index.ts`.
- Change a selector (`jp-button`, `[jpFocusTrap]`, `[jpDialogActions]`, and the
  rest of the public selectors).
- Remove an input or output, change its type, or make an optional input
  required.
- Change a default that existing templates use. Examples include `jp-button` variant `primary`, `jp-text` size `body` and `jp-heading` level `h2`. Pagination defaults are `page` `1` and `pageSize` `10`. See the other defaults in [PRIMITIVES.md](../PRIMITIVES.md).
- Change a `ControlValueAccessor` value type (`string` for input, textarea,
  select, radio group, and combobox; `boolean` for checkbox and switch).
- Change a content-projection selector, including selectors that are not
  standalone classes: `[jpAppShellSidebar]`, `[jpAppShellMain]`,
  `[jpAppShellNavIcon]`, `[jpEmptyStateIcon]`, `[jpTableSearch]`,
  `[jpTableFilters]`, `[jpTableActions]`, `[jpTableBulkActions]`.
- Change keyboard activation that [PRIMITIVES.md](../PRIMITIVES.md) specifies
  (manual tab activation, menu item buttons, combobox Enter to select).

Adding an optional input with a default that keeps current behavior is not
a break. Adding a new export is not a break.

### Tokens

The styling contract is the semantic custom properties documented in
`libs/tokens/README.md`, switched with `data-jp-accent` (`neon` | `cobalt`) and
`data-jp-density` (`default` | `compact`).

Breaking:

- Remove or rename a documented semantic custom property.
- Change `data-jp-accent` or `data-jp-density` accepted values, or the default
  accent (`neon`) or density (`default`).
- Change the meaning of a semantic group: success, warning, error, and info
  must stay distinct from accent (principle 9). Heading levels must keep
  one token per `h1`–`h6`.
- Remove `tokens.css`, `tokens.compact.css`, or `tokens.json` from
  `libs/tokens/package.distribution.json` `exports`.
- Rename a key in the exported `tokens.json` document. That file is a public
  entry. Primitive palette keys are part of it even though `libs/ui` and
  `apps/*` are linted away from using primitives directly.

`tokens.css` already includes compact overrides. `tokens.compact.css` is an
optional second entry. Removing either file is a break. Requiring the compact
file for default density would also be a break.

### Styles

Host classes (`jp-button`, `jp-dialog`, and the rest) and internal DOM are not
a styling API. Components reject arbitrary `class` and `style` inputs.
Consumers style through tokens and documented inputs.

These style changes are still breaks:

- A documented input no longer produces its documented appearance (variant,
  tone, size, elevation, placement).
- Focus indicator, selected state, or invalid state disappears, or becomes
  color-only.
- Contrast drops below WCAG AA on the dark theme.
- The shell breakpoint, assistant dock, or table overflow model changes without
  a docs update and a major or pre-1.0 minor bump.

A visual adjustment that keeps the same token meaning, the same inputs, and
AA contrast is not a break. Recipe screenshot updates follow
[QUALITY.md](../QUALITY.md); they are not by themselves an API break.

### Accessibility behavior

These are breaks even when TypeScript signatures stay the same:

- Remove keyboard operation or visible focus.
- Change the accessible name, role, or which element is in the tab order.
- Change where focus moves on open or close (dialog, shell drawer, assistant
  composer).
- Change which overlay Escape closes when layers are nested.
- Stop restoring focus to the opener where restoration is documented.

### Package exports

- Remove or rename an export path in `libs/tokens/package.distribution.json`
  or the UI package entry (`libs/ui/src/index.ts` via ng-packagr).
- Raise the Angular or RxJS peer floor across a major, or drop Angular 22.
- Change `sideEffects` so `tokens.css` is tree-shaken out of a normal import.
- Ship UI metadata that no longer matches the distribution layout in
  [DISTRIBUTION.md](../DISTRIBUTION.md) (declarations, bundled component CSS,
  token CSS/JSON).

Private modules are not a contract. `registerOverlay`, `claimOverlayEvent`,
and `positionOverlay` live in `libs/ui/src/lib/primitives/shared/overlay-manager.ts`
and are not re-exported from `libs/ui/src/index.ts`. Moving them is not a break.
Importing them from a deep path is unsupported.

---

## Deprecation window

The installed packages are `0.1.0`, before `1.0.0`.

Before removal:

1. Mark the symbol `@deprecated` in source, with the replacement named in the
   comment.
2. Document the migration in `CHANGELOG.md` and in the primitive or governance
   doc that owns the API.
3. Ship that deprecation in a release.
4. Keep the symbol for at least **one further minor release**.
5. Remove it only in a later pre-1.0 **minor** bump, or in a **major** bump.
   The changelog for the removing release names the version and the migration
   again.

Patch releases do not remove deprecated APIs.

Experimental exports, once any exist, may change inside the maturity rules in
[MATURITY.md](./MATURITY.md). They still must have a changelog note when a consumer
could have imported them. There are no experimental exports on October 4, 2026.

---

## `Ui` and `lib-ui`

`Ui` is still exported:

```ts
/** @deprecated Temporary compatibility export. */
export * from './lib/ui/ui';
```

The class is `libs/ui/src/lib/ui/ui.ts`. Selector: `lib-ui`. The template is a
hard-coded "Token Demo Surface" section. The class comment points consumers at
layout and typography primitives from `@jp-design-system/ui`. The unit spec
only checks that the component creates. There is no Storybook story.

Status:

- Maturity: `deprecated` (see [MATURITY.md](./MATURITY.md)).
- The symbol stays in `libs/ui/src/index.ts`. This policy does not delete it.
- `CHANGELOG.md` does not yet name the deprecation or a removal version, so the
  one-minor window **has not started**.
- Removal version: **unassigned**.

Removal is allowed only when all of the following are true:

- The changelog records the deprecation and tells consumers to delete `<lib-ui>`
  and compose `jp-box`, `jp-stack`, `jp-surface`, `jp-text`, `jp-heading`, and
  `jp-button` instead.
- At least one minor release has shipped after that changelog entry.
- The removing release is a later pre-1.0 minor, or a major, and its changelog
  repeats the migration note.
- The maturity row is updated in the same change that deletes the export.

Until that release, `Ui` remains importable and `<lib-ui>` still renders.
