# Component Expansion Task List

Updated: October 4, 2026. Remaining work: five promotion and integration items.
Completed feature work is documented in the
[component APIs and limits](docs/COMPONENT_EXPANSION.md),
[workflow component APIs](docs/WORKFLOW_COMPONENTS.md),
[advanced layout and table APIs](docs/ADVANCED_LAYOUT_COMPONENTS.md),
[hierarchy APIs](docs/HIERARCHY_COMPONENTS.md),
[scheduling calendar API](docs/SCHEDULING_CALENDAR.md),
[reordering and carousel APIs](docs/INTERACTION_COMPONENTS.md),
[chart and virtual-table APIs](docs/DATA_PERFORMANCE_COMPONENTS.md),
[larger feature verification](docs/qa/LARGE_FEATURES.md), and
[changelog](CHANGELOG.md). Implemented components remain preview APIs pending
the promotion checks below. This file complements
[PROFESSIONAL_READINESS_PLAN.md](PROFESSIONAL_READINESS_PLAN.md).

## Promotion and integration follow-up

- [ ] Complete manual assistive-technology and forced-colors review of preview components
- [ ] Review component APIs with consuming-product screens and resolve feedback
- [ ] Confirm compatibility and native details-name support across the declared browsers
- [ ] Promote individual APIs through the acceptance and maturity process
- [ ] Coordinate release notes, versions, distribution, and the optional design kit

Every later component should include its token contract, states, keyboard/form
behavior, localization, Storybook examples, consumer documentation, and relevant
browser/package checks. Do not mark a larger feature complete merely because a
visual placeholder exists.

## Storybook stability requirement

Storybook development output remains isolated per port. Contributors must keep
the runtime checks and verify concurrent preview/test servers when changing
Storybook infrastructure; see the [incident note](docs/qa/STORYBOOK_RELOAD_REGRESSION.md).
