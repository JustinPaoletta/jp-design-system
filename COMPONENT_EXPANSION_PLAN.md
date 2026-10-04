# Component Expansion Task List

Updated: October 4, 2026. Remaining work: seven feature items and five promotion and
integration items. Completed work is documented in the
[component APIs and limits](docs/COMPONENT_EXPANSION.md),
[workflow component APIs](docs/WORKFLOW_COMPONENTS.md),
[advanced layout and table APIs](docs/ADVANCED_LAYOUT_COMPONENTS.md), and
[changelog](CHANGELOG.md). Implemented components remain preview APIs pending
the promotion checks below. This file complements
[PROFESSIONAL_READINESS_PLAN.md](PROFESSIONAL_READINESS_PLAN.md).

## Larger features: design and consumer use case first

- [ ] Tree view: define navigation/selection model, expansion, lazy loading, and keyboard contract
- [ ] Tree table: define hierarchical rows and table-versus-grid semantics
- [ ] Scheduling calendar: distinguish appointment layouts from the date-picker calendar
- [ ] Table virtualization after measuring actual row-count/performance requirements
- [ ] Carousel after identifying a product use case; include keyboard, touch, motion, and pause behavior
- [ ] Charts: select an integration and define semantic series colors, formatting, legends, tooltips, and accessible alternatives
- [ ] Drag-and-drop/reordering with keyboard alternatives and announcements

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
