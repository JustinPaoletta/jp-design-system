# Professional Design System Readiness Plan

Created: October 3, 2026

This plan extends the [product roadmap](docs/JP_ROADMAP.md) with the work needed
to make JP easier to adopt, verify, maintain, and evolve across products. Core
component milestones are already implemented. The checkboxes below track new
work and verification; they do not imply that existing behavior is broken.

## Priorities and execution order

| Order | Workstream                            | Priority                       | Depends on                                       |
| ----- | ------------------------------------- | ------------------------------ | ------------------------------------------------ |
| 1     | Hosted CI and merge protection        | P0: release gate               | Existing workflow                                |
| 2     | Accessibility and regression coverage | P0: release gate               | Hosted CI for enforcement                        |
| 3     | Component acceptance and governance   | P1: adoption                   | Existing APIs and design principles              |
| 4     | Consumer documentation                | P1: adoption                   | Acceptance checklist and compatibility decisions |
| 5     | Release automation and distribution   | P1: adoption                   | Quality gates and release policy                 |
| 6     | Localization, RTL, and compatibility  | P1: product reach              | Acceptance checklist; consumer requirements      |
| 7     | Iconography and content standards     | P1: consistency                | Design principles; localization contract         |
| 8     | Figma library                         | Conditional: designer adoption | Stable tokens, APIs, icons, and states           |
| 9     | Additional components                 | P2: product demand             | Acceptance checklist and evidence of need        |

Start with workstreams 1–3. Finish consumer documentation and release tooling
before calling the next release ready for wider adoption. Scope localization
and runtime support explicitly; complete the work required by that supported
scope before release. Conditional work requires a recorded decision, even when
the decision is to defer it.

For each workstream, assign an owner, link its issue or PR, and record validation
evidence before checking tasks off. Use workspace package-manager-prefixed Nx
targets for implementation checks, following the repository's AGENTS.md.

## 1. Hosted CI and merge protection

References: [CI and branch protection](docs/CI_BRANCH_PROTECTION.md),
[quality verification](docs/QUALITY.md), and [.github/workflows/ci.yml](.github/workflows/ci.yml).

- [ ] Verify the latest hosted Linux and macOS runs for the Angular/tooling upgrade.
- [ ] Resolve failures in lint, unit coverage, Storybook, Chromium/WebKit behavior,
      accessibility, production builds, visual comparisons, consumer packages,
      and runtime dependency auditing.
- [ ] Confirm hosted macOS screenshots use a reproducible browser/runtime setup;
      review any platform differences before changing baselines.
- [ ] Add `Visual regression (macOS)`, `Package consumer`, and
      `Runtime dependency audit` to required checks on the protected default branch.
- [ ] Verify failed required checks prevent merging and up-to-date checks remain enabled.
- [ ] Confirm failed checks provide useful logs, screenshots, diffs, and audit artifacts.
- [ ] Update the CI documentation with the verified date, required check names,
      and links to successful hosted runs.

**Complete when:** All intended jobs pass on hosted runners, required jobs block
failed merges, and the documented protection matches GitHub configuration.

## 2. Accessibility and regression coverage

References: [manual QA](MANUAL_QA.md), [quality verification](docs/QUALITY.md),
and [QA evidence](docs/qa/README.md).

- [ ] Define the accessibility target and supported assistive-technology/browser matrix.
- [ ] Perform and record VoiceOver and NVDA reviews on representative supported
      combinations; include JAWS if required by target consumers.
- [ ] Review accessible names, reading order, keyboard operation, focus visibility,
      focus restoration, and nested overlay dismissal.
- [ ] Review forms for labels, hints, errors, required/read-only/disabled states,
      invalid submission, and recovery without losing entered values.
- [ ] Review announcements for toast, progress, loading, assistant streaming,
      cancellation, and retry; check for excessive or missing announcements.
- [ ] Test Windows high contrast/forced colors; fix lost borders, focus indicators,
      selection cues, and icons where needed.
- [ ] Test text enlargement, 200%/400% zoom, narrow-screen reflow, long content,
      and touch interaction, including intentional table overflow.
- [ ] Verify reduced motion across animated components and overlay transitions.
- [ ] Check contrast and non-color status cues across accents, densities, and
      interactive states.
- [ ] Expand automated accessibility checks to exposed interaction states:
      open dialogs/menus/popovers, combobox results, validation errors, selected
      rows, active tabs, and assistant response states.
- [ ] Expand visual baselines beyond the recipe page to representative component
      states, mobile shell/assistant layouts, open overlays, and loading/error states.
- [ ] Define which states run across both accents/densities and which need
      additional browser or viewport coverage; keep the matrix maintainable.
- [ ] Record findings, fix release-blocking issues, and add targeted regressions.
- [ ] Update manual QA and quality docs with tested combinations and remaining limits.

**Complete when:** The supported matrix has review evidence, blocking findings
are fixed, and CI protects the important interaction and visual states.

## 3. Component acceptance and governance

- [ ] Create a reusable acceptance checklist covering API, semantics, tokens,
      states, keyboard behavior, responsiveness, localization, tests, and documentation.
- [ ] Define component maturity: experimental, preview, stable, and deprecated.
- [ ] Inventory public components, directives, services, and tokens; assign maturity
      and an owner to each, with known limitations recorded.
- [ ] Document how new components and patterns are proposed, reviewed, accepted,
      or kept in a consuming application.
- [ ] Define what constitutes a breaking change for Angular APIs, tokens, styles,
      accessibility behavior, and package exports.
- [ ] Define deprecation windows, migration notes, and removal requirements;
      apply these to the existing deprecated `Ui`/`lib-ui` compatibility export.
- [ ] Add contribution guidance and a PR checklist referencing required evidence.
- [ ] Define how accessibility defects, regressions, and consumer feedback are triaged.
- [ ] Review stable components against the checklist and create follow-up tasks
      for any unmet criteria.

**Complete when:** A contributor can determine how to introduce or change a
component, and a consumer can identify its support and stability expectations.

## 4. Consumer documentation

Build on [design principles](docs/DESIGN_PRINCIPLES.md),
[primitive APIs](docs/PRIMITIVES.md), [product recipes](docs/PRODUCT_RECIPES.md),
and [distribution](docs/DISTRIBUTION.md).

- [ ] Decide the documentation site's audience, navigation, hosting, and owner.
- [ ] Provide a getting-started path for a separate Angular application:
      installation, token CSS, standalone imports, accent/density setup, and forms.
- [ ] Document every public API with defaults, types, states, events, and limitations.
- [ ] Add component-selection guidance, common mistakes, and when to use related components.
- [ ] Explain accessibility responsibilities split between JP and the consuming app.
- [ ] Document responsive behavior, overflow, supported themes, and density tradeoffs.
- [ ] Promote product recipes into copyable examples for async forms, search/sort/
      pagination, selection, destructive recovery, and assistant transport integration.
- [ ] Add composition guidance for validation summaries, page headers, navigation,
      empty/loading/error states, and responsive dashboard layouts.
- [ ] Link component pages to Storybook examples and relevant recipes.
- [ ] Publish compatibility, maturity, changelog, release, and migration guidance.
- [ ] Verify installation examples against the isolated package consumer and check links.
- [ ] Build and deploy the documentation site through a repeatable workflow;
      provide previews for documentation changes.
- [ ] Link the site and this plan from the root README and roadmap.

**Complete when:** Someone unfamiliar with the repository can install JP, choose
components, build a representative screen, and understand its support boundaries.

## 5. Release automation and distribution

References: [release process](RELEASE.md), [distribution](docs/DISTRIBUTION.md),
and [changelog](CHANGELOG.md).

- [ ] Decide whether UI and tokens release together or independently; document
      how repository and package versions relate.
- [ ] Select version/changelog automation that fits the Nx workspace and ownership model.
- [ ] Define pre-1.0 breaking changes, stable-release criteria, and prerelease conventions.
- [ ] Automate consistent package metadata, lockfile updates, changelog entries,
      tags, and release notes with a reviewable release PR.
- [ ] Require quality and isolated consumer checks before producing release artifacts.
- [ ] Verify release tarball contents, declarations, CSS/JSON exports, peer dependencies,
      and installation instructions.
- [ ] Decide whether private npm publication is needed; record the registry,
      access model, package scope, and intended consumers, or document tarball distribution.
- [ ] If publishing, configure protected publication, registry credentials or trusted
      publishing, and package access settings appropriate to the chosen registry.
- [ ] Dry-run release/versioning and, if applicable, publication; verify the proposed artifacts.
- [ ] Define failed-release recovery, withdrawal/deprecation guidance, and consumer
      upgrade or rollback instructions.
- [ ] Produce the first release through the chosen process and verify installation
      from the actual distribution channel.
- [ ] Update RELEASE.md, distribution docs, README, and changelog to match that process.

**Complete when:** Releases are repeatable, versions and notes agree, and a
consumer can install the released artifacts through the documented channel.

## 6. Localization, RTL, and compatibility

- [ ] Inventory built-in visible strings and accessible labels across the library.
- [ ] Define a framework-compatible configuration contract for labels, sentences,
      pluralization, and number/date formatting.
- [ ] Replace fixed English strings where consumers need translation, including
      pagination controls and summaries; preserve usable default text.
- [ ] Test long translations, non-Latin text, and localized counts without clipping
      or fragmenting sentences in ways that prevent correct translation.
- [ ] Audit directional styles and interactions; use logical properties where
      layout should follow writing direction.
- [ ] Verify RTL shell layout, navigation, tabs, menus, overlays, table tools,
      pagination, directional icons, and assistant placement.
- [ ] Add RTL and translated-content examples and focused regression checks.
- [ ] Publish supported Angular, RxJS, Node, browser, and device versions, with
      special attention to native dialog/popover behavior and any required fallbacks.
- [ ] Decide whether SSR/hydration is supported, planned, or explicitly outside
      the current contract.
- [ ] If supported, audit DOM access and generated IDs, then test server rendering
      and hydration in an isolated Angular consumer, including overlays and forms.
- [ ] Analyze actual consumer bundle cost and tree shaking for representative
      imports; verify unused components and token utilities can be excluded.
- [ ] Record package size measurements and enforce justified bundle/style budgets.
- [ ] Document verified support, limitations, and consumer integration requirements.

**Complete when:** The declared support contract has evidence, strings can be
localized within that scope, and directional layouts behave consistently.

## 7. Iconography and content standards

- [ ] Select an icon family and verify its licensing and distribution requirements.
- [ ] Define icon sizes, stroke weight, optical alignment, color, and placement
      alongside text and inside controls.
- [ ] Define decorative versus meaningful icon semantics, accessible naming,
      and which directional icons mirror in RTL.
- [ ] Document the supported icon integration approach and replace inconsistent
      built-in glyphs where appropriate.
- [ ] Add examples showing consistent icons in navigation, actions, alerts, and empty states.
- [ ] Create UI writing guidance for voice/tone, action labels, headings, terminology,
      capitalization, inclusive language, and translation-friendly sentences.
- [ ] Define error, confirmation, success, warning, empty-state, and loading message patterns.
- [ ] Define date/time/number presentation conventions with consumer locale/time-zone ownership.
- [ ] Document assistant uncertainty, failure, cancellation, and retry wording conventions.
- [ ] Audit built-in copy and examples against these standards and add guidance to the docs site.

**Complete when:** Product teams have clear rules and examples for consistent
icons and copy, including accessibility and localization behavior.

## 8. Matching Figma library — conditional

- [ ] Confirm designer demand and assign an owner; explicitly record a deferral
      if code-only adoption meets current needs.
- [ ] If proceeding, inventory the components, tokens, modes, and states needed in the kit.
- [ ] Create variables/styles matching semantic tokens, accents, densities, and typography.
- [ ] Build components with matching names, properties, variants, auto layout,
      responsive behavior, and icons.
- [ ] Include interaction states, anatomy, usage guidance, and accessibility annotations.
- [ ] Add representative form, dashboard, table, overlay, and assistant compositions.
- [ ] Review design/code parity and document any intentional representation limits.
- [ ] Publish the kit with version and ownership information; link it from consumer docs.
- [ ] Define a release checklist that keeps the kit and code aligned; add code
      mappings where they improve handoff.

**Complete when:** The adoption decision is recorded. If adopted, designers can
compose supported screens with a maintained kit that matches the implementation.

## 9. Additional components — prioritize by product demand

For every accepted component: establish the use case and API, follow the
acceptance checklist, implement semantic token styling, add Storybook states,
verify accessibility, and demonstrate a consumer composition.

### Near-term candidates

- [x] Evaluate accordion/disclosure for progressive information and settings;
      specify keyboard, heading, expanded-state, and content behavior.
- [x] Evaluate a standard link for inline and navigation use; define Angular router
      integration, external links, focus, and long-text behavior.
- [x] Evaluate avatar for identity displays; define image failure, initials fallback,
      sizes, and accessible naming.
- [ ] Evaluate removable chips/tags for filters and selections; define remove-button
      labels, keyboard behavior, focus after removal, and overflow.
- [ ] Rank these candidates using actual consumer screens, then implement the accepted set.

### Later candidates

- [ ] Assess date and date-range pickers, including locale, keyboard, validation,
      and time-zone responsibilities.
- [ ] Assess file upload, including constraints, progress, failure, cancellation,
      retry, and the consuming application's upload/security responsibilities.
- [ ] Assess multi-select, including search, selected-item representation, keyboard
      interaction, announcements, and large option sets.
- [ ] Assess advanced table needs such as column visibility, resizing, expandable
      rows, sticky regions, and virtualization; retain consumer ownership of data.
- [ ] Record build, integrate, or defer decisions for each later candidate.

**Complete when:** Candidate decisions are backed by consumer needs, and accepted
components meet the same stability criteria as the existing library.

## Next milestone acceptance

- [ ] Hosted CI and required merge checks are verified.
- [ ] Manual accessibility review is recorded and blocking findings are resolved.
- [ ] Important component states and responsive layouts have regression protection.
- [ ] Component maturity, contribution, compatibility, and deprecation policies are published.
- [ ] Consumer documentation is navigable and its installation examples are verified.
- [ ] Versioning and distribution work through a repeatable release process.
- [ ] Localization, RTL, SSR/hydration, Figma, and component-expansion scope decisions are recorded;
      all promises made for the milestone are implemented and verified.
- [ ] The roadmap, README, release docs, and this task list reflect the shipped result.

## Reference benchmarks

- [Carbon component checklist](https://www.carbondesignsystem.com/getting-started/contributing/component-checklist)
  for design, code, documentation, accessibility, testing, and kit readiness.
- [Atlassian content foundations](https://atlassian.design/foundations/content/)
  for consistent, accessible, and localizable product language.

## Component expansion progress — October 4, 2026

The near-term accordion/disclosure, native link, and avatar candidates now have
preview implementations. Additional foundations, identity, structured content,
selection/form controls, feedback, and general drawers are implemented in the
same batch. See [COMPONENT_EXPANSION_PLAN.md](COMPONENT_EXPANSION_PLAN.md) for the
expanded catalogue checklist and [the API guide](docs/COMPONENT_EXPANSION.md)
for contracts and remaining limits. This update does not mark pending manual
reviews, hosted CI, publication, or advanced components complete.

The second batch completes eight additional catalogue entries with nine preview
components and an inline-code directive. The validated wizard and related
compositions live at Showcase `/product-tools`. Details and evidence remain in
the component task list and API guide; broader professional-readiness tasks
retain their original review and release requirements.

The third component batch completes the remaining everyday-product task entries. Native temporal and consumer-owned async contracts are documented in [WORKFLOW_COMPONENTS.md](docs/WORKFLOW_COMPONENTS.md). Larger catalogue items and manual maturity/promotion checks remain open.
