# Security review — October 2, 2026

Scope: current application/library source, token/build scripts, workflow configuration, candidate tracked source, and the npm lockfile after the Angular 22.2.1 upgrade. This is a focused source/dependency review, not a penetration test or a guarantee that all vulnerabilities are absent. No deployment, credentials, backend service, or registry publication was involved.

## Findings corrected

- Upgraded Style Dictionary from 4.4.0 to 5.5.5, including the [prototype-pollution fix](https://github.com/advisories/GHSA-vj5c-m527-mpff). Generated CSS/JSON is unchanged, verified by token drift checking.
- Nx 23.2.1 pins vulnerable development dependencies. Scoped `nx` overrides select axios 1.20.0, brace-expansion 5.0.12, and smol-toml 1.9.0. These remain within their existing major versions. Recheck/remove the overrides when Nx incorporates the fixes; strict peer installation and Nx validation must continue to pass.
- Validated targeted major overrides: UUID 11.1.1 under the Storybook runner, Istanbul process-info, and Jest JUnit reporting; webpack-dev-middleware 7.4.5 under the Storybook Webpack builder. The inspected UUID v1/v4 APIs are compatible. All 148 live development-server interactions/accessibility tests pass; CI now runs that live suite as well as static production tests. These overrides deliberately exceed parent ranges and must be reassessed with upstream updates.
- Token JSON parsing rejects `__proto__`, `constructor`, and `prototype` keys before build output is generated. Custom reference resolution only reads own properties. Regression fixtures verify rejection without generated artifacts. Local token inputs and build environment overrides are trusted developer configuration, not an arbitrary upload interface.
- CI restricts the GitHub token to `contents: read`, pins official actions to reviewed commit SHAs, and runs a runtime dependency audit. Example environment templates remain committable, while local `.env` files are ignored.

## Dependency results

Commands against the official npm registry:

```sh
npm audit --json
npm audit --omit=dev --json
```

The complete scan decreased from **32 affected packages (27 high, 5 moderate)** initially, to 15 after the first fixes, and now **8 high-severity development packages** after the validated UUID/middleware upgrades. These eight findings propagate from **one advisory-bearing leaf package: braces 3.0.3**. There are no moderate or critical findings. The runtime-only scan reports **zero findings at every severity**. A clean runtime audit does not clear development-tool findings or prove application security.

| Remaining dependency  | Advisory / condition                                                                                                                                                       | Boundary and follow-up                                                                                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `braces` 3.0.3 (high) | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): deeply nested brace patterns can exhaust the stack; no patched release exists as of this review. | Used by build/test glob tooling, not the shipped UI. Keep configuration/glob patterns developer-controlled. Clearing it now would require maintaining a fork or replacing dependent tooling; wait for an upstream patch unless untrusted patterns become a requirement. |

The [UUID bounds-check advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq) and [middleware path-traversal advisory](https://github.com/advisories/GHSA-g84c-rxfj-3j2c) no longer appear in the resolved lockfile audit. The targeted overrides preserve CJS/ESM UUID imports used by the inspected consumers and Storybook's middleware API on project Node 24.21.0. No global or unrelated major upgrades were forced.

The full audit intentionally still exits nonzero for braces. Do not run `npm audit fix --force`: its proposed major changes/downgrades are not a verified remediation for this Angular/Nx stack. The CI runtime check blocks moderate-or-higher runtime advisories. CI also uploads the complete audit as an informational artifact so development findings stay visible; it does not claim a clean full scan.

## Source review

Application text, assistant messages, option labels, and table text render with Angular interpolation. No trusted-HTML bypass, raw `innerHTML`, `eval`, embedded application credential, or application transport endpoint was found in the reviewed source. Link values use Angular bindings; applications must still validate allowed destinations and own authorization. Build/test child processes use argument-based spawn/exec APIs rather than interpolated shell strings.

A targeted credential-pattern scan of 376 candidate text files found no private-key blocks, GitHub tokens, AWS access-key IDs, or long hardcoded credential literals. It excluded unrelated local browser artifacts and skill files. This scan does not inspect Git history, external services, arbitrary binary files, or all possible secret formats. The consuming application still owns authentication, backend permission checks, transport cancellation, persistence, and LLM/content policy.

## Validation boundary

Dependency patches and token safeguards require formatting/lint, token drift, unit coverage, Angular type/template checks, production builds, Storybook interactions, Chromium/WebKit functional/axe checks, reviewed macOS visual comparisons, and isolated package-consumer compilation. Local results are reported in the PR. Hosted CI is a separate verification; adding new required status checks remains a repository-settings task documented in [CI_BRANCH_PROTECTION.md](CI_BRANCH_PROTECTION.md).
