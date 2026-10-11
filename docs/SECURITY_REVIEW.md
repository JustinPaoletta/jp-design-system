# Security inspection

The dependency audit date is October 11, 2026.
It used the lockfile at revision `b31915546a98f8ccd2cfeb85219b2030a1c995a5`.
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

- Style Dictionary changed from 4.4.0 to 5.5.5, including the [prototype-pollution fix](https://github.com/advisories/GHSA-vj5c-m527-mpff).
  Token drift checks showed unchanged generated CSS/JSON.
- Scoped `nx` overrides select axios 1.20.0, brace-expansion 5.0.12 and smol-toml 1.9.0 for Nx 23.2.1.
  These versions stay within their existing major versions.
  When Nx includes the fixes, examine and remove unnecessary overrides.
  Strict peer installation and Nx checks must continue to pass.
- Targeted major overrides select UUID 11.1.1 under the Storybook runner, Istanbul process-info and Jest JUnit reporting.
  The Storybook Webpack builder uses webpack-dev-middleware 7.4.5.
  The inspected UUID v1/v4 APIs are compatible.
  Static and live Storybook each passed 319 checks at the [recorded revision](qa/VERIFICATION.md#october-9-hosted-readiness-evidence).
  These overrides exceed parent ranges.
  After upstream updates, examine their compatibility again.
- Token JSON parsing rejects `__proto__`, `constructor` and `prototype` keys before generating build output.
  Custom reference resolution reads only own properties.
  Regression fixtures show rejection without generated artifacts.
  Local token inputs and build environment overrides are trusted developer configuration.
  They are not an upload interface.
- CI restricts the GitHub token to `contents: read` and pins official actions to inspected commit SHAs.
  It runs a runtime dependency audit.
  Example environment templates can be committed; local `.env` files are ignored.

## Dependency results

Commands against the official npm registry:

```sh
npm audit --json
npm audit --omit=dev --json
```

The October 11 scan reports **30 moderate and eight high development packages**, unchanged from October 8.
These 38 package findings come from two advisory-bearing leaf packages: `sprintf-js` and `braces`.
There are no critical findings after the Handlebars patch.
The runtime-only scan reports **zero findings at every severity**.
A clean runtime audit does not clear development-tool findings or prove application security.

| Remaining dependency          | Advisory / condition                                                                                                                                                        | Boundary and follow-up                                                                                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `braces` 3.0.3 (high)         | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): deeply nested brace patterns can exhaust the stack. The October 11 audit reports this dependency. | Build/test glob tooling uses this dependency. Keep patterns under developer control. npm lists no patched leaf version. A fork or tooling replacement needs separate inspection. |
| `sprintf-js` 1.0.3 (moderate) | [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c): uncontrolled format precision can stop an operation. No patched version is listed.                | Used by development argument parsing and test tooling. Keep format strings under developer control. Wait for an upstream patch or inspect a tooling replacement.                 |

The [UUID bounds-check advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq) and [middleware path-traversal advisory](https://github.com/advisories/GHSA-g84c-rxfj-3j2c) do not appear in this audit.
The targeted overrides preserve the inspected CJS/ESM UUID imports and Storybook middleware API on Node 24.21.0.

The full audit exits nonzero for `braces` and `sprintf-js`.
Do not run `npm audit fix --force`.
Its proposed major changes and downgrades have no successful compatibility evidence for this Angular/Nx stack.
The CI runtime check blocks moderate-or-higher runtime advisories.
CI uploads the complete audit as an informational artifact.
Development findings remain open.

## Source inspection

Application text, assistant messages, option labels, and table text render with Angular interpolation. No trusted-HTML bypass, raw `innerHTML`, `eval`, embedded application credential, or application transport endpoint was found in the examined source. Link values use Angular bindings; applications must still validate allowed destinations and own authorization. Build/test child processes use argument-based spawn/exec APIs rather than interpolated shell strings.

The October 2 targeted credential-pattern scan found no private-key blocks, GitHub tokens, AWS access-key IDs, or long hardcoded credential literals. It excluded unrelated local browser artifacts and skill files. This scan does not inspect Git history, external services, arbitrary binary files, or all possible secret formats. The application still owns authentication, backend permission checks, transport cancellation, persistence, and LLM/content policy.

## Validation boundary

Dependency and token changes must pass the checks in [Quality](QUALITY.md).
These include formatting, lint, token drift, unit coverage and type/template checks.
They also include builds, Storybook, browser/axe tests, macOS snapshots and isolated package compilation.
[Verification](qa/VERIFICATION.md) records confirmed hosted results.
[CI and branch protection](CI_BRANCH_PROTECTION.md) lists required checks and job scope.
