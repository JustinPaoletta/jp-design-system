# Component catalog

Import public components, directives, services and types from
`@jp-design-system/ui`. [Maturity](../governance/MATURITY.md) inventories all
public classes and records preview limits. `Ui` / `lib-ui` is deprecated.

| Area                                                                                                                                                         | API reference                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Layout, typography, core controls, controlled table, tabs, breadcrumbs, overlays, feedback and assistant                                                     | [Core API](../PRIMITIVES.md)                          |
| Links/icons, disclosure, avatars, status, cards/lists, form composition, multi-selection, banners/drawers, stepper/checklist, numeric controls and code/copy | [Component expansion](../COMPONENT_EXPANSION.md)      |
| Commands/context menus, native dates/times, upload queues, notifications, grouped actions, inline edit, skip links and announcements                         | [Everyday workflows](../WORKFLOW_COMPONENTS.md)       |
| Split panes, media and advanced table behavior                                                                                                               | [Advanced layout](../ADVANCED_LAYOUT_COMPONENTS.md)   |
| Tree view and tree table                                                                                                                                     | [Hierarchy](../HIERARCHY_COMPONENTS.md)               |
| Day/week/agenda scheduling                                                                                                                                   | [Scheduling calendar](../SCHEDULING_CALENDAR.md)      |
| Reordering and carousel                                                                                                                                      | [Interactions](../INTERACTION_COMPONENTS.md)          |
| Chart.js integration and virtualized/paginated tables                                                                                                        | [Data performance](../DATA_PERFORMANCE_COMPONENTS.md) |

Use [Choosing components](SELECTION.md) to compare related APIs and
[Recipes](RECIPES.md) for application wiring. Live examples are UI Storybook
(`npm exec -- nx run ui:storybook`) and Showcase
(`npm exec -- nx run showcase:serve`). See
[browser support](../localization/SUPPORT.md) before relying on native overlay
fallbacks or server rendering.
