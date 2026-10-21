# Component Expansion Task List

Updated: October 21, 2026. Five promotion and integration items remain.
The [documentation index](docs/README.md) links completed feature work.
The [verification record](docs/qa/VERIFICATION.md) gives test evidence.

The [changelog](CHANGELOG.md) records changes. Implemented components remain preview APIs until their individual inspections finish. This is the single list of remaining work.

The October 19 component inspection covers all 97 Storybook groups at desktop and narrow widths.
The recorded visual suggestions are implemented.
The [design inspection](design-qa.md#remaining-component-inspection) gives the scope and limits.

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

## Automated acceptance and candidate preparation

Picker checks cover forced colors, enlarged root text and touch emulation.
Installed packages also exercise date, date-range and time popup controls.
The release branch prepares paired `0.1.0-rc.1` package versions and release notes.
`packages:pack` creates archives with verified integrity and a hash manifest.
CI makes the archives available for download.

These checks do not close the five tasks above.
Screen-reader sessions, real Windows palettes and physical touch remain untested.
Actual product feedback and individual API approval remain necessary.
The optional Figma kit stays deferred until a designer owner exists.
See the [maintainer instructions](docs/qa/READINESS.md#instructions-for-the-maintainer).

## Storybook stability requirement

Storybook development output remains isolated per port. Contributors must keep
the runtime checks and verify concurrent preview/test servers when changing
Storybook infrastructure; see the [incident note](docs/qa/STORYBOOK_RELOAD_REGRESSION.md).
