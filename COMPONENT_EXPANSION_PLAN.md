# Component Expansion Task List

Updated: October 8, 2026. Remaining work: five promotion and integration items. The [documentation index](docs/README.md) links completed feature work. The [verification record](docs/qa/VERIFICATION.md) gives test evidence.

The [changelog](CHANGELOG.md) records changes. Implemented components remain preview APIs until their individual inspections finish. This is the single list of remaining work.

## Promotion and integration follow-up

- [ ] Complete manual assistive-technology and forced-colors inspection of preview components
- [ ] Examine component APIs with consuming-product screens and resolve feedback
- [ ] Complete compatibility inspection beyond the automated Chromium/Firefox/WebKit matrix
- [ ] Promote individual APIs through the acceptance and maturity process
- [ ] Coordinate release notes, versions, distribution, and the optional design kit

Automation covers functional and accessibility checks in Chromium, Firefox and WebKit.
Installed tarballs have browser runtime checks for forms, retries, tables and dialogs.
Each public class has a checked maturity and evidence entry.
Actual Chrome 200%/400% zoom passed on the seven larger features.
The five tasks still need screen-reader and Windows sessions, physical devices,
real product feedback, individual maturity approval and release decisions.
See the [completion instructions and evidence](docs/qa/READINESS.md).

Every later component should include its token contract, states, keyboard/form
behavior, localization, Storybook examples, consumer documentation, and relevant
browser/package checks. Do not mark a larger feature complete merely because a
visual placeholder exists.

## Storybook stability requirement

Storybook development output remains isolated per port. Contributors must keep
the runtime checks and verify concurrent preview/test servers when changing
Storybook infrastructure; see the [incident note](docs/qa/STORYBOOK_RELOAD_REGRESSION.md).
