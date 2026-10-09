# Security inspection

The dependency audit date is October 8, 2026.
It uses the current lockfile.
The focused source inspection date is October 2, 2026, after the Angular 22.2.1 upgrade.
That inspection included library/application code, build scripts, workflows and candidate source files.

This inspection is not a penetration test or proof that all vulnerabilities are absent.
It did not include deployment, credentials, backend services or registry publication.

## Findings corrected

- The lockfile now selects Handlebars 4.7.10 in place of 4.7.9.
  This patch clears the [AST type-confusion advisory](https://github.com/advisories/GHSA-8r5x-fm3f-whwj) and [own-property bypass advisory](https://github.com/advisories/GHSA-p8wg-vrv2-v86f).
  It also clears the [inline-embedding advisory](https://github.com/advisories/GHSA-xw65-4hp5-5hc7).
  Handlebars belongs to development tooling, not the distributed UI.
  Parent dependency ranges permit the patch; no new override is necessary.

- Upgraded Style Dictionary from 4.4.0 to 5.5.5, including the [prototype-pollution fix](https://github.com/advisories/GHSA-vj5c-m527-mpff). Generated CSS/JSON is unchanged, verified by token drift checking.
- Nx 23.2.1 pins vulnerable development dependencies. Scoped `nx` overrides select axios 1.20.0, brace-expansion 5.0.12, and smol-toml 1.9.0. These remain within their existing major versions. Recheck/remove the overrides when Nx incorporates the fixes; strict peer installation and Nx validation must continue to pass.
- Validated targeted major overrides: UUID 11.1.1 under the Storybook runner, Istanbul process-info, and Jest JUnit reporting; webpack-dev-middleware 7.4.5 under the Storybook Webpack builder. The inspected UUID v1/v4 APIs are compatible. The current static and live suites each pass 319 interaction/accessibility checks; [verification](qa/VERIFICATION.md) records the revision. CI runs both suites. These overrides deliberately exceed parent ranges and must be reassessed with upstream updates.
- Token JSON parsing rejects `__proto__`, `constructor`, and `prototype` keys before build output is generated. Custom reference resolution only reads own properties. Regression fixtures verify rejection without generated artifacts. Local token inputs and build environment overrides are trusted developer configuration, not an arbitrary upload interface.
- CI restricts the GitHub token to `contents: read`, pins official actions to examined commit SHAs, and runs a runtime dependency audit. Example environment templates remain committable, while local `.env` files are ignored.

## Dependency results

Commands against the official npm registry:

```sh
npm audit --json
npm audit --omit=dev --json
```

The complete scan reports **30 moderate and eight high development packages**.
These 38 package findings come from two advisory-bearing leaf packages: `sprintf-js` and `braces`.
There are no critical findings after the Handlebars patch.
The runtime-only scan reports **zero findings at every severity**.
A clean runtime audit does not clear development-tool findings or prove application security.

| Remaining dependency          | Advisory / condition                                                                                                                                                                         | Boundary and follow-up                                                                                                                                                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `braces` 3.0.3 (high)         | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): deeply nested brace patterns can exhaust the stack; the current lockfile audit still reports the affected version. | Used by build/test glob tooling, not the shipped UI. Keep configuration/glob patterns developer-controlled. Clearing it now would make a fork necessary or replacing dependent tooling; wait for an upstream patch unless untrusted patterns become a requirement. |
| `sprintf-js` 1.0.3 (moderate) | [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c): uncontrolled format precision can stop an operation. No patched version is listed.                                 | Used by development argument parsing and test tooling. Keep format strings under developer control. Wait for an upstream patch or inspect a tooling replacement.                                                                                                   |

The [UUID bounds-check advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq) and [middleware path-traversal advisory](https://github.com/advisories/GHSA-g84c-rxfj-3j2c) no longer appear in the resolved lockfile audit. The targeted overrides keep CJS/ESM UUID imports used by the inspected consumers and Storybook's middleware API on project Node 24.21.0. No global or unrelated major upgrades were forced.

The full audit still exits nonzero for `braces` and `sprintf-js`. Do not run `npm audit fix --force`: its proposed major changes/downgrades are not a verified remediation for this Angular/Nx stack. The CI runtime check blocks moderate-or-higher runtime advisories. CI also uploads the complete audit as an informational artifact so development findings stay visible; it does not establish a clean full scan.

## Source inspection

Application text, assistant messages, option labels, and table text render with Angular interpolation. No trusted-HTML bypass, raw `innerHTML`, `eval`, embedded application credential, or application transport endpoint was found in the examined source. Link values use Angular bindings; applications must still validate allowed destinations and own authorization. Build/test child processes use argument-based spawn/exec APIs rather than interpolated shell strings.

The October 2 targeted credential-pattern scan found no private-key blocks, GitHub tokens, AWS access-key IDs, or long hardcoded credential literals. It excluded unrelated local browser artifacts and skill files. This scan does not inspect Git history, external services, arbitrary binary files, or all possible secret formats. The application still owns authentication, backend permission checks, transport cancellation, persistence, and LLM/content policy.

## Validation boundary

Dependency and token changes must pass the checks in [Quality](QUALITY.md).
These include formatting, lint, token drift, unit coverage and type/template checks.
They also include builds, Storybook, browser/axe tests, macOS snapshots and isolated package compilation.
[Verification](qa/VERIFICATION.md) records confirmed hosted results.
[CI and branch protection](CI_BRANCH_PROTECTION.md) lists required checks and job scope.
