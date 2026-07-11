# Changelog

All notable changes to this repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Phase 2 layout and typography primitives (`jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-text`, `jp-heading`)
- Showcase `/phase-2-dashboard` route and Playwright e2e gate
- UI Storybook primitive and composition coverage
- Manual changelog and root `RELEASE.md` release process documentation
- Phase 3 app shell semantic tokens (sidebar widths, nav colors, shell motion, z-index)
- `jp-app-shell` primitive with sidebar collapse, mobile drawer, and Storybook coverage
- `jp-app-shell-nav-item` with active/hover/focus states
- Showcase `/phase-3-dashboard` route and Playwright shell e2e gate
- Storybook `Compositions/App Shell Dashboard` composition
- Phase 4 control tokens (button, field, selection) and control size mappings
- Control primitives: `jp-button`, `jp-icon-button`, `jp-input`, `jp-textarea`, `jp-select`, `jp-checkbox`, `jp-switch`
- Showcase `/phase-4-controls` form composition inside `jp-app-shell` + Playwright e2e
- Storybook `Compositions/Controls Form` with accent/density toolbars
- Phase 5 data-display tokens (badge tones, table surfaces)
- Data-display primitives: `jp-badge`, `jp-empty-state`, `jp-table` (with optional `jpTableCell` templates)
- Showcase `/phase-5-data` dashboard data page inside `jp-app-shell` + Playwright e2e
- Storybook `Compositions/Data Display` with accent/density toolbars
- Phase 6 overlay/feedback tokens (tooltip, toast, overlay panel, z-index stack)
- Feedback primitives: `jpFocusTrap`, `jp-tooltip`, `jp-toast` (+ service/outlet), `jp-dialog`, `jp-popover`, `jp-dropdown-menu`
- Showcase `/phase-6-overlays` interaction page inside `jp-app-shell` + Playwright e2e
- Storybook `Compositions/Feedback Overlays` with accent/density toolbars
- Phase 7 assistant tokens (panel chrome, message role tones, context chip, z-index)
- Assistant primitives: `JpAssistantService`, `jpAssistantTrigger`, `jp-assistant-message`, `jp-assistant-panel`
- Showcase `/phase-7-assistant` assistant page inside `jp-app-shell` + Playwright e2e
- Storybook `Compositions/Assistant System` with accent/density toolbars

### Changed

- Renamed `playground` app to `showcase` for integration testing
- No tagged releases exist yet. The first formal release should create the initial dated section, most likely as `0.1.0`.
- Jest coverage gates enabled for all unit-test projects; `ui` and `showcase` require ≥90% statements/branches/functions/lines
- Showcase root redirect now points to `/phase-7-assistant`
