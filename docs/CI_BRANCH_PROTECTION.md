# CI and branch protection

GitHub Actions CI runs on pull requests, pushes to `main` and manual dispatch.
Workflow permissions are `contents: read`; official actions are pinned to
commit SHAs. A separate Docs workflow checks repository Markdown links on PRs.

## Main protection

Verified October 4, 2026 through the GitHub branch-protection API. `main`
requires these six checks and strict up-to-date status checks:

- `Lint`
- `Test`
- `Build`
- `Visual regression (macOS)`
- `Package consumer`
- `Runtime dependency audit`

There are no repository rulesets. Required PR reviews and conversation
resolution are unset; admin enforcement is off. Force pushes and branch
deletion are disabled. The status-check rule blocks ordinary merges with
failing/pending checks or a branch behind `main`; admin enforcement is a
separate setting. This record verifies the stored configuration, rather than
claiming a deliberately failing merge experiment.

## Job scope

| Job                       | Scope                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Lint                      | Formatting, ESLint, semantic-color/token guards and generated token drift                                                         |
| Test                      | Unit coverage, static and live Storybook, Chromium/WebKit functional and WCAG 2.1 A/AA checks; excludes visual titles             |
| Build                     | Type/template checks, production builds and release-preparation safety tests                                                      |
| Visual regression (macOS) | All six visual title prefixes, reviewed Chromium PNG comparisons without automatic updates                                        |
| Package consumer          | Real package tarballs and an isolated Angular consumer without workspace aliases                                                  |
| Runtime dependency audit  | Fails for moderate-or-higher runtime advisories; uploads the complete dependency audit as informational development-tool evidence |
| Documentation links       | Relative file/anchor checks in the separate Docs workflow; not a required branch-protection context                               |

`Test` uploads coverage and Playwright output on failure when available.
The visual job uploads failure diffs from `dist/.playwright`. Unit coverage
gates are 90% across statements, branches, functions and lines for UI/Showcase,
and 100% for tokens and the placeholder Storybook app.

Confirmed hosted results and revisions are in
[Verification](qa/VERIFICATION.md). Local commands and the platform split are
in [Quality](QUALITY.md); development advisories are in
[Security review](SECURITY_REVIEW.md). Release branches should merge through
protected `main` pull requests.
