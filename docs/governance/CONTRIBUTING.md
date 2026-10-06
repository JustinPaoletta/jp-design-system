# Contributing

JP maintainers decide which components belong in the library.
The application keeps product data, requests and permissions.

Read the [design rules](../DESIGN_PRINCIPLES.md),
[acceptance checklist](ACCEPTANCE.md), [maturity levels](MATURITY.md) and
[compatibility rules](COMPATIBILITY.md).
Use the [writing rules](../content/WRITING.md) for documentation changes.

## Keep live Storybook previews isolated

Each development server must have a separate output directory for its port.
Storybook writes bundles to disk. Development middleware serves those files.
Shared output between ports 4400 and 4500 caused repeated iframe reloads.

1. Keep per-port output in `.storybook/main.ts`.
2. Keep the runtime checks in `tools/run-ui-test-storybook.mjs`.
3. Start the normal preview on port 4400.
4. Run `npm exec -- nx run ui:test-storybook-dev`.
5. Make sure both servers pass their compiler/runtime checks.
6. Run the static Storybook target after the live target finishes.

Use these steps after a Storybook or middleware change.
The [incident record](../qa/STORYBOOK_RELOAD_REGRESSION.md) explains the failure.

## Propose

1. Read the [component catalog](../consumers/COMPONENTS.md).
2. Decide whether existing components can satisfy the requirement.
3. Open a GitHub issue or pull request with the product task and proposed API.
4. Describe keyboard behavior, accessible names and tokens.
5. State which data, permissions and requests the application will own.

Maintainers accept the proposal, reject it or keep it in the application.
A proposal note is necessary even when one maintainer does all inspections.

## Inspection

Maintainers use the acceptance, design and compatibility rules.
They reject a change that:

- Adds arbitrary `class` or `style` inputs
- Hardcodes colors or uses primitive tokens in UI code
- Uses accent for large backgrounds
- Adds bounce, spring effects or decorative motion
- Duplicates a composition that one application can make
- Loads application data, uploads files or calls an assistant service from the library

An API without its necessary test or story starts as `experimental`.
A higher maturity level must have evidence and a `MATURITY.md` change.
There are no experimental exports in the October 4, 2026 inventory.

## Accept into the library

A component belongs in the library when these conditions hold:

- Two product screens use its behavior, or an approved requirement identifies a current screen.
- Its API has strict types and uses tokens.
- It does not own application data, permissions or network requests.
- It meets the acceptance checklist.
- A stable visual API has a unit test and Storybook example.

Shipped components are listed in the [catalog](../consumers/COMPONENTS.md).
This policy applies to new proposals. It does not exclude components that
already have approval.

## Keep it in the consuming app

A pattern stays in the application when only that product uses it.
The application also owns product text, routes, permissions, data operations
and remote requests. It can compose existing primitives for those requirements.

Tables, pagination, toolbars and assistant state supply interface behavior.
The application supplies rows, sorting, page requests and response transport.
[Product recipes](../PRODUCT_RECIPES.md) show this division.

## Pull request checklist

- [ ] State the task, library requirement and application responsibilities.
- [ ] Complete applicable blocking items in [Acceptance](ACCEPTANCE.md).
- [ ] Record any maintainer waiver.
- [ ] Update unit tests for changed behavior.
- [ ] Run `npm exec -- nx test ui` for UI changes.
- [ ] Run token tests and `npm run tokens:check` for token changes.
- [ ] Update stories for visual changes and applicable disabled, invalid, empty or open states.
- [ ] Update the API guide for changed inputs, defaults or limits.
- [ ] Update maturity when support levels or known limits change.
- [ ] Follow [Compatibility](COMPATIBILITY.md) for breaks and deprecations.
- [ ] Add migration instructions to `CHANGELOG.md`.
- [ ] Record tested accent, density and viewport.
- [ ] Follow [Quality](../QUALITY.md) for affected snapshots and axe checks.
- [ ] State which manual checks ran, including VoiceOver or NVDA.
- [ ] Put new built-in text in a label input or `JP_MESSAGES`.
- [ ] Record any fixed text as a preview limit.
- [ ] Regenerate tokens with `npm run tokens:build`.
- [ ] Do not edit generated files by hand.
- [ ] Run the documentation writing, link and formatting checks.

Record findings under `docs/qa/` with the [triage rules](TRIAGE.md).
