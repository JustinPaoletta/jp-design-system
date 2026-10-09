# Readiness inspection and maintainer handoff

Recorded October 8, 2026. This change extends the acceptance checks after PR #13.
Use this procedure to finish the five tasks in the [task list](../../COMPONENT_EXPANSION_PLAN.md).

## Completed engineering work

- Add Firefox to the complete functional and WCAG 2.1 A/AA CI selection.
- Check missing and failing native overlay APIs in all three browser engines.
- Remove the hiding `popover` attribute when the native API is unavailable.
- Give each app shell a different sidebar ID and correct control relationships.
- Run an installed tarball consumer in Chromium, Firefox and WebKit.
- Inspect the source and maturity evidence for all 113 public classes.
- Inspect actual Chrome zoom at 200% and 400% on the four larger-feature screens.
- Prepare a dry-run proposal for `0.1.0-rc.1` without changing package versions.

### Package consumer

`tools/fixtures/consumer/contracts.ts` keeps the public-template compilation checks.
`tools/fixtures/consumer/main.ts` supplies a working project settings and member screen.
The fixture installs real UI and token tarballs into a temporary directory.
Its runtime dependencies have exact workspace versions and no workspace aliases or symlinks.
It reuses the installed workspace build tools to limit disk use.
The report records those tool versions.

`tools/consumer-runtime.mjs` checks these flows:

- Invalid submission focuses the error summary and links back to the field.
- Date-range validation rejects reversed dates.
- Save failure preserves values; retry saves them; pending controls are disabled.
- Sorting and selection update application data.
- A confirmation dialog contains focus and restores its opener after Escape.
- Confirmed removal updates the rows and status text.
- Open and closed states pass the WCAG 2.1 A/AA axe selection.

All 12 combinations passed locally: three engines, two accents and two densities.
The application is a repository fixture. Actual product feedback remains necessary.

```sh
CONSUMER_BROWSERS=chromium,firefox,webkit npm exec -- nx run packages:smoke
```

The default local selection is Chromium.
CI and the release dry-run use all three engines.
Read `dist/packages/consumer-smoke.json` for the result and tool versions.
Failure screenshots belong in ignored `dist/packages/consumer-runtime`.
The Package consumer CI job uploads these files as `consumer-evidence`.

### API inspection

```sh
npm exec -- nx run packages:check-readiness
```

Read `dist/qa/api-readiness.json` for each public class.
The Build CI job uploads this report as `api-readiness`.
The record includes its source, maturity, unit spec, host story and recorded preview gap.
The check rejects missing entries, missing files, count drift and components without `OnPush`.
Its seven tests check discovery, aliases, missing evidence and incorrect maturity records.

Evidence file presence does not establish behavior, full accessibility or promotion approval.
Unit and browser runs supply separate behavior evidence.

The inventory remains 36 stable classes, 76 preview classes and one deprecated class.
No API is promoted by this change.
The shell ID collision is fixed; its breakpoint and consumer inspection limits remain.
Overlay fallback focus and dismissal are checked; full native clipping and inert parity remain unclaimed.
Each preview API still needs the inspection described in [Maturity](../governance/MATURITY.md).

### Actual zoom inspection

The inspection used macOS 26.6.2 and installed Chrome 154.0.8037.99.
The default neon accent, default density and LTR direction were used.
Native Chrome commands changed browser zoom; CSS zoom and viewport overrides were not used.
Chrome showed 200% in its native toolbar.
The device pixel ratio changed from 1 to 2 and then 4.
The page width changed from 1655 to 827 and then 413 CSS pixels.

| Route                | 200%   | 400%   | Operation inspected                                                    |
| -------------------- | ------ | ------ | ---------------------------------------------------------------------- |
| `/hierarchy`         | Passed | Passed | Expand a project and reach its child checkbox.                         |
| `/scheduling`        | Passed | Passed | Activate an appointment and read its details.                          |
| `/interaction-tools` | Passed | Passed | Pick up and cancel a reorder; navigate to the editable carousel slide. |
| `/data-performance`  | Passed | Passed | Open equivalent chart data and switch to 50 paginated rows.            |

Document overflow was zero in all eight route/zoom cases.
Chrome was restored to 100% after the inspection.
These sessions do not cover text-only zoom, other browsers, all components or assistive technology.

## Instructions for the maintainer

### 1. Complete screen-reader and Windows inspections

1. Check out `codex/design-system-readiness`.
2. Run `npm ci` with the Node version in `.nvmrc`.
3. Run `npm exec -- nx run showcase:serve`.
4. Open http://localhost:4200.
5. Turn on VoiceOver with Command-F5 on macOS.
6. Use the [manual checklist](../../MANUAL_QA.md) to inspect every applicable area.
7. Repeat the applicable flows on Windows with NVDA.
8. Turn on Windows contrast themes and inspect two different palettes.
9. Inspect text-only zoom and the remaining browser/component combinations at 200% and 400%.
10. Record versions, commit, route, state and observed behavior with the manual inspection template.

Check names, reading order, focus restoration and announcements.
Announcements must describe the correct state without unwanted repetition.
Prioritize forms, trees, overlays, reorder, calendar, charts and paginated tables.
Report failed behavior in [Findings](FINDINGS.md).
Keep a failed or unexamined item open until its blocking findings are resolved.

### 2. Inspect physical devices and native pickers

1. Open `/workflows` on the actual browsers your product supports.
2. Open the launch date, date-range and time controls through their native picker buttons.
3. Select values, cancel a picker and submit invalid values.
4. Confirm that values and focus remain correct.
5. On a touch device, inspect menus, drawers, sliders, range handles and split panes.
6. Inspect reorder controls and carousel navigation without a mouse.
7. Record any small-target or overlapping-control problem.

Playwright engine checks do not establish physical touch or native picker-dialog usability.
Record the actual browser and device versions.

### 3. Inspect one real consuming product

1. Run `npm exec -- nx run packages:build`.
2. Follow the tarball installation procedure in [Distribution](../DISTRIBUTION.md).
3. Install both packages in a real Angular product.
4. Connect a settings form and a table flow to its real data and save behavior.
5. Inspect error recovery, selection persistence, localization and compact layout.
6. Record API problems and product feedback on the draft PR.

The supported Angular peer range is in `libs/ui/package.json`.
Use public package imports and token stylesheets.
Do not treat the repository fixture as product approval.

### 4. Approve individual maturity changes

1. Examine each affected API's [maturity entry](../governance/MATURITY.md).
2. Complete its applicable [acceptance checklist](../governance/ACCEPTANCE.md).
3. Attach the consumer and manual evidence for that API.
4. Resolve its recorded preview gaps.
5. Change only the approved entries to stable in a separate inspected change.
6. Run `npm exec -- nx run packages:check-readiness` after each inventory change.

Keep other entries at preview.
The `Ui` removal version remains unassigned; follow the documented deprecation window.

### 5. Approve and prepare the first release

The proposed first candidate is `0.1.0-rc.1`.
It permits an inspected trial release while preview APIs remain clearly identified.
It is a proposal, not a selected or published version.
The dry-run passed without writing release files.
The release tool uses a UTC date for changelog headings.

1. Approve or replace the proposed version.
2. Confirm tarball distribution, or request a separate registry setup.
3. Decide whether the optional Figma kit is required for this release.
4. Examine the candidate notes in the [changelog](../../CHANGELOG.md).
5. Merge the engineering PR after its required checks pass.
6. Follow [Release process](../../RELEASE.md) to create the release branch and release PR.
7. Run the dry-run before writing version changes.
8. After release PR approval and merge, create the tag and GitHub Release.

```sh
node tools/release/prepare.mjs --version 0.1.0-rc.1 --dry-run
```

No tag, publication, registry credentials or release version changes are part of this engineering PR.
