# Security review — October 2, 2026

Scope: current application/library source, token/build scripts, workflow configuration, candidate tracked source, and the npm lockfile after the Angular 22.2.1 upgrade. This is a focused source/dependency review, not a penetration test or a guarantee that all vulnerabilities are absent. No deployment, credentials, backend service, or registry publication was involved.

## Findings corrected

- Upgraded Style Dictionary from 4.4.0 to 5.5.5, including the [prototype-pollution fix](https://github.com/advisories/GHSA-vj5c-m527-mpff). Generated CSS/JSON is unchanged, verified by token drift checking.
- Nx 23.2.1 pins vulnerable development dependencies. Scoped `nx` overrides select axios 1.20.0, brace-expansion 5.0.12, and smol-toml 1.9.0. These remain within their existing major versions. Recheck/remove the overrides when Nx incorporates the fixes; strict peer installation and Nx validation must continue to pass.
- Token JSON parsing rejects `__proto__`, `constructor`, and `prototype` keys before build output is generated. Custom reference resolution only reads own properties. Regression fixtures verify rejection without generated artifacts. Local token inputs and build environment overrides are trusted developer configuration, not an arbitrary upload interface.
- CI restricts the GitHub token to `contents: read`, pins official actions to reviewed commit SHAs, and runs a runtime dependency audit. Example environment templates remain committable, while local `.env` files are ignored.

## Dependency results

Commands against the official npm registry:

```sh
npm audit --json
npm audit --omit=dev --json
```

The complete scan decreased from **32 affected packages (27 high, 5 moderate)** to **15 (10 high, 5 moderate)**. These counts include packages whose findings propagate from vulnerable dependencies; there are **three remaining advisory-bearing leaf packages** below. There are no critical findings. The runtime-only scan reports **zero findings at every severity**. A clean runtime audit does not clear development-tool findings or prove application security.

| Remaining dependency                  | Advisory / condition                                                                                                                                                       | Boundary and follow-up                                                                                                                                                                                                                                                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `braces` 3.0.3 (high)                 | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): deeply nested brace patterns can exhaust the stack; no patched release exists as of this review. | Used by build/test glob tooling, not the shipped UI. Keep configuration/glob patterns developer-controlled; update when an upstream patch is available.                                                                                                                                                                           |
| `uuid` 8.3.2 (moderate)               | [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq): buffer bounds checks in v3/v5/v6; fixed in 11.1.1 and later.                                     | Pulled in by test/coverage/report tooling. The inspected Storybook runner uses v4; that observation is not a proof about every transitive caller. A major override would exceed parent dependency ranges; track compatible upstream updates or validate a deliberate tooling migration.                                           |
| `webpack-dev-middleware` 6.1.3 (high) | [GHSA-g84c-rxfj-3j2c](https://github.com/advisories/GHSA-g84c-rxfj-3j2c): path traversal under non-slash-terminated `publicPath`; fixed in 7.4.5 and later.                | Storybook's Angular Webpack builder still requests 6.x. Do not expose development middleware publicly or introduce a vulnerable custom `publicPath`. Validation serves the static production Storybook build, which does not use this middleware. Upgrade the upstream builder rather than silently forcing an unsupported major. |

The full audit intentionally still exits nonzero. Do not run `npm audit fix --force`: its proposed major changes/downgrades are not a verified remediation for this Angular/Nx stack. The CI runtime check blocks moderate-or-higher runtime advisories. CI also uploads the complete audit as an informational artifact so the remaining development findings stay visible; it does not claim a clean full scan.

## Source review

Application text, assistant messages, option labels, and table text render with Angular interpolation. No trusted-HTML bypass, raw `innerHTML`, `eval`, embedded application credential, or application transport endpoint was found in the reviewed source. Link values use Angular bindings; applications must still validate allowed destinations and own authorization. Build/test child processes use argument-based spawn/exec APIs rather than interpolated shell strings.

A targeted credential-pattern scan of 376 candidate text files found no private-key blocks, GitHub tokens, AWS access-key IDs, or long hardcoded credential literals. It excluded unrelated local browser artifacts and skill files. This scan does not inspect Git history, external services, arbitrary binary files, or all possible secret formats. The consuming application still owns authentication, backend permission checks, transport cancellation, persistence, and LLM/content policy.

## Validation boundary

Dependency patches and token safeguards require formatting/lint, token drift, unit coverage, Angular type/template checks, production builds, Storybook interactions, Chromium/WebKit functional/axe checks, reviewed macOS visual comparisons, and isolated package-consumer compilation. Local results are reported in the PR. Hosted CI is a separate verification; adding new required status checks remains a repository-settings task documented in [CI_BRANCH_PROTECTION.md](CI_BRANCH_PROTECTION.md).
