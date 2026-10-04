# Changelog

All notable changes to this repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Add thirteen preview components and an announcer service for commands, context menus, native dates/times, file queues, notifications, button combinations, inline editing, skip links and announcements.
- Add lazy Showcase workflows, public exports, localization, native/form/async contracts, Storybook, browser/accessibility/visual checks and isolated consumer compilation.
- Keep concurrent Storybook preview/test output isolation and runtime guards.

- Added preview checklist, stepper, slider/range, number stepper, timeline,
  overflow chip, code/inline-code, and clipboard action APIs, with a validated
  Showcase wizard and Storybook examples.
- Isolated Storybook development bundles per server port and added compiler/runtime
  checks to prevent concurrent live tests from causing continuous preview reloads.

### Added

- Preview component expansion: icons/native links, disclosure/accordion, identity,
  spinner/meter, structured content, form wrappers/groups, multi-select,
  search/password fields, validation summary, page banner, and general drawers
- Lazy-loaded Showcase component expansion with Chromium/WebKit interaction and
  accessibility regressions, Storybook examples, and extended package-consumer checks

- Product recipes for validated forms, async save/retry, controlled search/sort/pagination, bulk selection, destructive recovery, and assistant response recovery
- Skeleton, progress, inline alert, radio group, combobox, tabs/panels, breadcrumbs, table toolbar, and one-based pagination
- Loading buttons, checkbox indeterminate state, native field attributes, controlled table sort/selection, and stale-safe assistant request lifecycle
- Angular Package Format UI package, typed ESM/CSS/JSON tokens, and isolated tarball consumer smoke check
- Chromium/WebKit functional and axe regressions, four macOS visual baselines, and CI consumer/visual/runtime-audit jobs

- Layout and typography primitives (`jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, `jp-surface`, `jp-text`, `jp-heading`)
- Showcase `/layout-dashboard` route and Playwright e2e gate
- UI Storybook primitive and composition coverage
- Manual changelog and root `RELEASE.md` release process documentation
- App shell semantic tokens (sidebar widths, nav colors, shell motion, z-index)
- `jp-app-shell` primitive with sidebar collapse, mobile drawer, and Storybook coverage
- `jp-app-shell-nav-item` with active/hover/focus states
- Showcase `/app-shell` route and Playwright shell e2e gate
- Storybook `Compositions/App Shell Dashboard` composition
- Control tokens (button, field, selection) and control size mappings
- Control primitives: `jp-button`, `jp-icon-button`, `jp-input`, `jp-textarea`, `jp-select`, `jp-checkbox`, `jp-switch`
- Showcase `/controls` form composition inside `jp-app-shell` + Playwright e2e
- Storybook `Compositions/Controls Form` with accent/density toolbars
- Data-display tokens (badge tones, table surfaces)
- Data-display primitives: `jp-badge`, `jp-empty-state`, `jp-table` (with optional `jpTableCell` templates)
- Showcase `/data` dashboard data page inside `jp-app-shell` + Playwright e2e
- Storybook `Compositions/Data Display` with accent/density toolbars
- Overlay/feedback tokens (tooltip, toast, overlay panel, z-index stack)
- Feedback primitives: `jpFocusTrap`, `jp-tooltip`, `jp-toast` (+ service/outlet), `jp-dialog`, `jp-popover`, `jp-dropdown-menu`
- Showcase `/overlays` interaction page inside `jp-app-shell` + Playwright e2e
- Storybook `Compositions/Feedback Overlays` with accent/density toolbars
- Assistant tokens (panel chrome, message role tones, context chip, z-index)
- Assistant primitives: `JpAssistantService`, `jpAssistantTrigger`, `jp-assistant-message`, `jp-assistant-panel`
- Showcase `/assistant` assistant page inside `jp-app-shell` + Playwright e2e
- Storybook `Compositions/Assistant System` with accent/density toolbars

### Security

- Patched compatible build-tool dependencies, constrained Nx overrides to audited leaf packages, rejected prototype-related token keys, and limited reference lookup to own properties
- Validated patched UUID and Storybook middleware major overrides with 148 live development-server interaction/accessibility tests; added the live suite to CI. Only the unpatched braces development advisory remains.
- Restricted workflow token permissions, pinned official actions, and added runtime audit gating; documented remaining development-tool advisories in `docs/SECURITY_REVIEW.md`

### Changed

- Angular 22.2.1, Nx 23.2.1, TypeScript 6.0.3, Storybook 10.6.1, and project Node 24.21.0; built UI peers require Angular ^22.2.1
- Dialogs and anchored overlays use native top-layer behavior with viewport positioning, nested dismissal, and focus restoration
- Documentation aligned with current APIs, interactive recipes, distribution metadata, quality commands, and historical epic scope

- Showcase routes renamed to feature paths (`/assistant`, `/overlays`, `/data`, `/controls`, `/app-shell`, `/layout-dashboard`); page titles and nav no longer reference delivery milestones
- Epic plan docs renamed to feature filenames (`APP_SHELL_PLAN.md`, `CONTROLS_PLAN.md`, `DATA_DISPLAY_PLAN.md`, `FEEDBACK_OVERLAYS_PLAN.md`, `ASSISTANT_SYSTEM_PLAN.md`); `MANUAL_QA.md` is the Storybook top-to-bottom checklist (layout through assistant compositions)
- Renamed `playground` app to `showcase` for integration testing
- No tagged releases exist yet. The first formal release should create the initial dated section, most likely as `0.1.0`.
- Jest coverage gates enabled for all unit-test projects; `ui` and `showcase` require ≥90% statements/branches/functions/lines
- Showcase root redirect now points to `/assistant`
- Documentation audit: Controls plan acceptance criteria marked complete; plan docs note current Showcase root (`/assistant`); `PRIMITIVES.md` / `libs/ui` README / `MANUAL_QA.md` aligned to shipped APIs and Storybook paths
- Storybook preview: story-owned sunken page (`.jp-storybook-page`) with an independent Canvas-only Dark/Light stage toolbar; Docs keeps a fixed dark stage
- Showcase pages reactively read `data-jp-accent` / `data-jp-density` for live theme readouts
- Documentation audit (Sep 2026): corrected Accent toolbar guidance; documented Storybook page vs stage; refreshed roadmap progress date; pointed `docs/qa` at `MANUAL_QA.md`

### Component expansion corrections

- Restore native label association for static input IDs and defer focus recovery
  until rendered content is available.
- Keep banner, error-summary, and disabled-chip text readable; correct cobalt
  primary-button text contrast on normal and hover surfaces.
