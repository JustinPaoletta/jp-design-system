# CI and branch protection

GitHub Actions runs on pull requests to any branch (including stacked feature PRs), pushes to `main`, and manual dispatch. Workflow permissions are restricted to `contents: read`; third-party workflow execution is avoided and official actions are pinned to commit SHAs.

## Current protection

Verified October 4, 2026 against `GET /repos/JustinPaoletta/jp-design-system/branches/main/protection` after updating `main`. There are no repository rulesets. `main` requires these status checks, with strict up-to-date checks enabled (`required_status_checks.strict` is `true`):

- `Lint`
- `Test`
- `Build`
- `Visual regression (macOS)`
- `Package consumer`
- `Runtime dependency audit`

A pull request cannot merge into `main` while any of those checks is failing, pending, or from a commit that is behind `main`. That gate is the stored required-status-check rule. This verification did not open a separate failing pull request to watch the merge button.

Conversation resolution stays not required. Admin enforcement stays off. Force pushes and branch deletion stay disabled. Required pull request reviews stay unset. Those settings were already configured that way and were not turned off.

The status-check sub-resource update (`PUT /branches/main/protection/required_status_checks`) returned `404 Not Found`. The full branch-protection update (`PUT /branches/main/protection`) returned `200` and the follow-up read lists the six contexts above. `Lint`, `Test`, and `Build` remain required with `app_id` null. The three added checks are bound to GitHub Actions (`app_id` 15368). Review the same settings under Settings → Branches → `main` → Require status checks to pass before merging, with “Require branches to be up to date before merging” left on.

## Hosted runs

Latest push to `main` (`cd99780`, merge of pull request #7) succeeded:

- [CI run 37094693442](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37094693442) — conclusion `success`
- Linux (`ubuntu-latest`): `Lint`, `Test`, `Build`, `Package consumer`, `Runtime dependency audit`
- macOS (`macos-latest`): `Visual regression (macOS)`

The merged readiness pull request also succeeded before that push, with the same Linux and macOS split:

- [CI run 37093942258](https://github.com/JustinPaoletta/jp-design-system/actions/runs/37093942258) — conclusion `success` on `feat/design-system-product-readiness` (`edc1fc3`, pull request #12)

The macOS job on the `main` run installed Playwright Chromium (`npx playwright install chromium`), ran only `npx nx run showcase-e2e:e2e -- --project=chromium --grep="recipes visual"`, and includes an `if: failure()` upload of `dist/.playwright` as `visual-diffs`. That upload was skipped because the job succeeded. Baselines are the reviewed macOS Chromium snapshots. They were not regenerated.

The same `main` run uploaded `dependency-audit` (the `dependency-audit.json` report). The downloaded report is npm audit v2 JSON with 8 high findings and no moderate or critical findings, matching the development-tool remainder described in [SECURITY_REVIEW.md](SECURITY_REVIEW.md). The runtime audit step (`npm audit --omit=dev --audit-level=moderate`) succeeded and still fails the job for moderate-or-higher runtime advisories.

No hosted visual-diff zip was available to download, because the latest visual jobs passed. The `Test` job on those hosted runs did not upload coverage or Playwright output. The workflow now uploads `coverage` and `dist/.playwright` as `test-failure-artifacts` when `Test` fails. That upload is only in the local workflow file and has not run on a hosted runner.

## Job scope

- `Lint`: formatting, ESLint, hardcoded-color/primitive-token guards, and generated token drift.
- `Test`: unit coverage, static and live-development Storybook interactions, and Chromium/WebKit functional and axe checks; excludes platform-specific visual snapshots. On failure, uploads `coverage` and `dist/.playwright` when those paths exist.
- `Build`: Angular type/template checks and all production build targets.
- `Visual regression (macOS)`: reviewed Chromium PNG comparisons without automatic updates; failure diffs under `dist/.playwright` are uploaded. Baselines are macOS Chromium snapshots and were not regenerated.
- `Package consumer`: builds real tarballs and compiles an isolated Angular consumer without workspace aliases.
- `Runtime dependency audit`: fails for moderate-or-higher runtime advisories and uploads the complete dependency audit, including development-tool findings. The development report is informational because known upstream advisories remain; see [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

UI and Showcase coverage gates remain 90% across statements, branches, functions, and lines; tokens and the placeholder Storybook app remain 100%. See [QUALITY.md](QUALITY.md) for local commands and platform limits. Release branches should merge through protected `main` PRs.
