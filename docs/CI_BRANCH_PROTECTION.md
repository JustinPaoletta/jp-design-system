# CI and branch protection

GitHub Actions CI runs on pull requests, pushes to `main` and manual dispatch.
Workflow permissions are `contents: read`; official actions are pinned to
commit SHAs. A separate Docs workflow checks Markdown links and writing rules on PRs.
It also runs the writing-check tests.

## Main protection

Verified October 4, 2026 through the GitHub branch-protection API. `main`
has these six necessary checks and strict up-to-date status checks:

- `Lint`
- `Test`
- `Build`
- `Visual regression (macOS)`
- `Package consumer`
- `Runtime dependency audit`

There are no repository rulesets. Required PR inspections and conversation
resolution are unset; admin enforcement is off. Force pushes and branch
deletion are disabled. The status-check rule blocks ordinary merges with
failing/pending checks or a branch behind `main`; admin enforcement is a
separate setting. This record verifies the stored configuration, rather than
claiming a deliberately failing merge experiment.

## Job scope

| Job                       | Scope                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Lint                      | Formatting, ESLint, semantic-color/token guards and generated token drift                                                         |
| Test                      | Unit coverage, static and live Storybook, Chromium/Firefox/WebKit functional and WCAG 2.1 A/AA checks; excludes visual titles     |
| Build                     | Type/template checks, production builds, release safety and public API evidence                                                   |
| Visual regression (macOS) | All six visual title prefixes, examined Chromium PNG comparisons without automatic updates                                        |
| Package consumer          | Real tarball consumer; compilation and runtime flows in Chromium/Firefox/WebKit across accents and densities                      |
| Runtime dependency audit  | Fails for moderate-or-higher runtime advisories; uploads the complete dependency audit as informational development-tool evidence |
| Documentation links       | Relative file paths, writing rules and writing-check tests. This Docs job is not a required branch-protection context.            |

`Test` uploads coverage and Playwright output on failure when available.
The visual job uploads failure diffs from `dist/.playwright`.
Build uploads `api-readiness`; Package consumer uploads `consumer-evidence`. Unit coverage
gates are 90% across statements, branches, functions and lines for UI/Showcase,
and 100% for tokens and the placeholder Storybook app.

Confirmed hosted results and revisions are in
[Verification](qa/VERIFICATION.md). Local commands and the platform split are
in [Quality](QUALITY.md); development advisories are in
[Security inspection](SECURITY_REVIEW.md). Release branches should merge through
protected `main` pull requests.
