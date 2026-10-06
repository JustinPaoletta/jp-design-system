# Component Expansion Task List

Updated: October 4, 2026. Remaining work: five promotion and integration items. The [documentation index](docs/README.md) links completed feature work. The [verification record](docs/qa/VERIFICATION.md) gives test evidence.

The [changelog](CHANGELOG.md) records changes. Implemented components remain preview APIs until their individual inspections finish. This is the single list of remaining work.

## Promotion and integration follow-up

- [ ] Complete manual assistive-technology and forced-colors inspection of preview components
- [ ] Examine component APIs with consuming-product screens and resolve feedback
- [ ] Complete compatibility inspection beyond the automated Chromium/WebKit matrix
- [ ] Promote individual APIs through the acceptance and maturity process
- [ ] Coordinate release notes, versions, distribution, and the optional design kit

Automation now covers Chromium/WebKit native details-name grouping, the seven
larger features at 320/640 CSS pixels, Chromium forced-colors behavior, and
release preparation safety. Consumer screen tests and isolated package
compilation also run in CI. These are partial evidence for the five tasks;
screen-reader sessions, actual Windows high contrast/zoom, product feedback,
maturity approval and release decisions remain open. See
[acceptance automation and remaining inspection](docs/qa/ACCEPTANCE_AUTOMATION.md).

Every later component should include its token contract, states, keyboard/form
behavior, localization, Storybook examples, consumer documentation, and relevant
browser/package checks. Do not mark a larger feature complete merely because a
visual placeholder exists.

## Storybook stability requirement

Storybook development output remains isolated per port. Contributors must keep
the runtime checks and verify concurrent preview/test servers when changing
Storybook infrastructure; see the [incident note](docs/qa/STORYBOOK_RELOAD_REGRESSION.md).
