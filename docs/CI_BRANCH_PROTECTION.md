# CI and branch protection

GitHub Actions runs on pull requests to any branch (including stacked feature PRs), pushes to `main`, and manual dispatch. Workflow permissions are restricted to `contents: read`; third-party workflow execution is avoided and official actions are pinned to commit SHAs.

## Current protection

Verified October 2, 2026: `main` requires `Lint`, `Test`, and `Build`, with strict up-to-date checks enabled. GitHub Actions alone does not require every new job before merge.

The workflow also defines `Visual regression (macOS)`, `Package consumer`, and `Runtime dependency audit`. These additional names are **not yet configured as required checks**. After their first hosted run, add them to the `main` protection rule under Settings → Branches → Require status checks to pass before merging. Keep “Require branches to be up to date” enabled. No protection settings were changed as part of this work.

## Job scope

- `Lint`: formatting, ESLint, hardcoded-color/primitive-token guards, and generated token drift.
- `Test`: unit coverage, Storybook interactions, and Chromium/WebKit functional and axe checks; excludes platform-specific visual snapshots.
- `Build`: Angular type/template checks and all production build targets.
- `Visual regression (macOS)`: reviewed Chromium PNG comparisons without automatic updates; failure diffs are uploaded.
- `Package consumer`: builds real tarballs and compiles an isolated Angular consumer without workspace aliases.
- `Runtime dependency audit`: fails for moderate-or-higher runtime advisories and uploads the complete dependency audit, including development-tool findings. The development report is informational because known upstream advisories remain; see [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

UI and Showcase coverage gates remain 90% across statements, branches, functions, and lines; tokens and the placeholder Storybook app remain 100%. See [QUALITY.md](QUALITY.md) for local commands and platform limits. Release branches should merge through protected `main` PRs.
