# Release process

UI and tokens ship together with the same package version.
The release pull request requires approval.
After merge, a person creates the tag and GitHub Release.

The repository had no release tags on October 11, 2026.
Registry publication is not configured.

## Version relationship

`libs/ui/package.json` and `libs/tokens/package.distribution.json` give the distributed package versions.
Those versions must match.
`tools/build-packages.mjs` copies token metadata into `dist/packages/tokens/package.json`.
It builds the UI package with ng-packagr.

The root `package.json` version is the repository version.
During `0.0.0` development, it can differ from the package versions.
A release pull request sets these files to the same `X.Y.Z` or `X.Y.Z-rc.N`:

- `package.json`
- `package-lock.json` (root version and `packages[""].version` only)
- `libs/ui/package.json`
- `libs/tokens/package.distribution.json`

`libs/tokens/package.json` is private workspace metadata. It is not the distributed tokens version and the release script does not change it.

## Standards

- Use Semantic Versioning.
- Create Git tags as `vX.Y.Z`.
- Use `vX.Y.Z-rc.N` for prerelease tags.
- Use a positive integer without leading zeros for `N`, such as `rc.1` or `rc.2`.
- Do not use other prerelease identifiers.
- Keep `CHANGELOG.md` as the source of truth for GitHub Release notes. The format follows Keep a Changelog.
- Create `release/vX.Y.Z` branches from the protected default branch.
- Do not add Changesets, semantic-release, or an Nx release plugin. Version and changelog preparation is the local script `tools/release/prepare.mjs`, which has no additional dependencies.

## Pre-1.0

Use `0.x` until maintainers approve a stable API and design-token contract.
Before `1.0.0`, breaking changes can use a minor version increase.
Patch versions contain backward-compatible fixes.

## Stable 1.0.0 criteria

Do not tag `1.0.0` until these conditions are met:

1. The acceptance checklist is complete for every component classified as stable.
2. The release pull request passes all required CI jobs listed in [Required checks before artifacts](#required-checks-before-artifacts).
3. `npm exec -- nx run packages:smoke` installs the tarballs in a separate Angular application and passes its compilation and runtime checks.
4. The changelog is complete: `## [Unreleased]` describes the release, and `prepare.mjs` can move that section into `## [1.0.0] - YYYY-MM-DD`.

The proposed first candidate is `0.1.0-rc.1`.
The [maintainer handoff](docs/qa/READINESS.md#5-approve-and-prepare-the-first-release) records the remaining approval steps.

The prepare script reminds the operator of these criteria. It does not judge the checklist or CI.

## Automation

`npm exec -- nx run packages:check-release` runs seven tests in `tools/release/prepare.spec.mjs`:

- Accepted SemVer/RC arguments and rejection of malformed arguments
- Paired package versions and unchanged package identities and dependency versions
- Changelog history, line endings and duplicate-version rejection
- Rejection of mismatched lockfile roots and unexpected package identities
- Planned writes in a temporary fixture
- Restoration of earlier files after a later write fails
- The real dry-run CLI leaving release files unchanged

The Build job and Release dry-run workflow run this target.
The tests use temporary fixtures and synthetic versions.
They do not select or publish a release.

`tools/release/prepare.mjs` accepts `--version X.Y.Z` (or `--version X.Y.Z-rc.N`) and `--dry-run`.

Dry-run prints the proposed versions, files and tag `vX.Y.Z`.
It also shows the heading change from `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD`, with a UTC date.
It does not write files.

Without `--dry-run`, the script writes those files and does not commit, tag, push, or publish. Write mode refuses an empty `## [Unreleased]` section and refuses a changelog that already has a section for that version. Run write mode only on the release branch when you intend to open the release pull request.

```bash
node tools/release/prepare.mjs --version X.Y.Z --dry-run
node tools/release/prepare.mjs --version X.Y.Z
```

Files written:

- `package.json`
- `package-lock.json`
- `libs/ui/package.json`
- `libs/tokens/package.distribution.json`
- `CHANGELOG.md`

The script leaves a fresh empty `## [Unreleased]` section at the top of the changelog. It does not edit `README.md`. If the README quotes the repository or package version, update that sentence in the same release pull request.

## Required checks before artifacts

The release pull request must pass required checks before merge.
Build the release tarballs from the merged commit.
The release workflow does not upload distribution tarballs.

The [CI protection page](docs/CI_BRANCH_PROTECTION.md) lists required job names and their scope.
[Quality](docs/QUALITY.md) gives the local commands and exact visual/functional selections.
Keep macOS visual comparisons separate from Linux functional checks.

Also examine the full development dependency audit against [SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md) and complete affected manual QA. The macOS visual command is the examined check described in [QUALITY.md](docs/QUALITY.md).

`.github/workflows/release.yml` is `workflow_dispatch` only.
It accepts a `version` input for the dry-run.
Permissions are `contents: read`.
It installs dependencies and Chromium, Firefox and WebKit.
It then runs these checks:

```sh
node tools/release/prepare.mjs --version <input> --dry-run
npm exec -- nx run packages:check-release
npm exec -- nx run packages:check-readiness
npm exec -- nx run packages:build
CONSUMER_BROWSERS=chromium,firefox,webkit npm exec -- nx run packages:smoke
```

It always passes `--dry-run`, so the input version is not written before the package build. The build and smoke steps validate the checked-out commit. The workflow does not create tags or GitHub Releases.

## Release checklist

1. Update your local copy of the protected default branch.
2. Examine `CHANGELOG.md`.
3. Make sure `## [Unreleased]` describes the release.
4. Select the next version using SemVer, the pre-1.0 rule and the `1.0.0` criteria above.
5. Create the release branch:

   ```bash
   git checkout main
   git pull --ff-only
   git checkout -b release/vX.Y.Z
   ```

6. Run the dry-run:

   ```bash
   node tools/release/prepare.mjs --version X.Y.Z --dry-run
   ```

7. Examine the proposed files and versions.
8. If the proposal is correct, write the version changes:

   ```bash
   node tools/release/prepare.mjs --version X.Y.Z
   ```

   Neither command creates a tag.

9. Update documents that give repository or package versions, including the README, distribution guide, compatibility guide and Figma policy.
10. Run the required checks locally or wait for the release pull request CI.
11. Stage each document whose version text changed.
12. Commit the release files:

    ```bash
    git add package.json package-lock.json libs/ui/package.json libs/tokens/package.distribution.json CHANGELOG.md
    git commit -m "chore(release): prepare vX.Y.Z"
    ```

13. Open a pull request from `release/vX.Y.Z` into the protected default branch.
14. After approval and passing required checks, merge the release pull request.
15. After merge, tag that commit and push the tag:

    ```bash
    git checkout main
    git pull --ff-only
    git tag -a vX.Y.Z -m "Release vX.Y.Z"
    git push origin vX.Y.Z
    ```

16. Publish the GitHub Release from the matching changelog section.
17. Build tarballs from that tagged commit with the [distribution procedure](docs/DISTRIBUTION.md).
18. Continue new work under `## [Unreleased]`.

A person creates the tag and GitHub Release.
The workflow does not do these actions.
To repeat dry-run, build and consumer checks, dispatch the Release workflow on `release/vX.Y.Z`.

## Distribution channel

Packages are installed from workspace tarballs produced by `tools/build-packages.mjs`. Private npm publication is not configured: there is no registry, no publish credentials, and no unpublish flow. The package scope remains `@jp-design-system`, from the existing names `@jp-design-system/ui` and `@jp-design-system/tokens`.

## Failed-release recovery

Do not delete a tag that has been pushed.

If the release pull request has not merged, fix the branch or close it. No tag exists yet. Uncommitted prepare writes can be restored with `git checkout --` on the files the script changed.

If a GitHub Release is incorrect, mark that version as replaced in `CHANGELOG.md`. State the problem on the GitHub Release. Give consumers a link to the previous good tag. Leave the git tag in place.

Consumers restore the previous version by reinstalling its UI and token tarballs together.
There is no registry unpublication step.
