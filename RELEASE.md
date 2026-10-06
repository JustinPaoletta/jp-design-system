# Release Process

UI and tokens ship together as one repository release. They do not have independent package versions. The release pull request is the approval gate. After merge, a person creates the tag and GitHub Release.

The first tagged release is not cut. No git tag, GitHub Release, or package publish has been created.

## Version relationship

`@jp-design-system/ui` (`libs/ui/package.json`) and `@jp-design-system/tokens` (`libs/tokens/package.distribution.json`) stay in lockstep with each other. Those two files are the distributed package versions. `tools/build-packages.mjs` copies the tokens distribution metadata into `dist/packages/tokens/package.json` and packages the UI metadata with ng-packagr.

The root `package.json` version is the repository version. During `0.0.0` development it may differ from the package versions. A release pull request sets all of these to the same `X.Y.Z` (or `X.Y.Z-rc.N`):

- `package.json`
- `package-lock.json` (root version and `packages[""].version` only)
- `libs/ui/package.json`
- `libs/tokens/package.distribution.json`

`libs/tokens/package.json` is private workspace metadata. It is not the distributed tokens version and the release script does not change it.

## Standards

- Use Semantic Versioning.
- Create Git tags as `vX.Y.Z`. Prerelease tags use `vX.Y.Z-rc.N`, where `N` is a positive integer without leading zeros (`rc.1`, `rc.2`). Other prerelease identifiers are not used.
- Keep `CHANGELOG.md` as the source of truth for GitHub Release notes. The format follows Keep a Changelog.
- Cut release branches as `release/vX.Y.Z` from the protected default branch.
- Do not add Changesets, semantic-release, or an Nx release plugin. Version and changelog preparation is the local script `tools/release/prepare.mjs`, which has no additional dependencies.

## Pre-1.0

Use `0.x` until the API and design-token contract are intentionally stabilized. While the project is pre-1.0, breaking changes may ship as a minor bump instead of jumping to `1.0.0`. Patch remains for backward-compatible fixes.

## Stable 1.0.0 criteria

Do not tag `1.0.0` until all of the following are true:

1. The acceptance checklist is complete for every component classified as stable.
2. The release pull request passes all required CI jobs. See the job names and commands in [Required checks before artifacts](#required-checks-before-artifacts).
3. Consumer smoke is green: `npm exec -- nx run packages:smoke` installs the workspace tarballs in an isolated Angular application and passes.
4. The changelog is complete: `## [Unreleased]` describes the release, and `prepare.mjs` can move that section into `## [1.0.0] - YYYY-MM-DD`.

The prepare script reminds the operator of these criteria. It does not judge the checklist or CI.

## Automation

`npm exec -- nx run packages:check-release` verifies the prepare tool's version
pairing, changelog handling, invalid-input guards, dry-run behavior and recovery
after a failed write. It runs on every PR in the Build job and in the Release
dry-run workflow. The checks use temporary fixtures and synthetic versions;
they do not select or publish a release.

`tools/release/prepare.mjs` accepts `--version X.Y.Z` (or `--version X.Y.Z-rc.N`) and `--dry-run`.

Dry-run prints the version plan, the changelog heading move from `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD` (UTC date), the files it would touch, and the tag `vX.Y.Z`. It does not write files.

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

The release pull request must be green before merge. Artifacts are the workspace tarballs built from the merged commit, not objects uploaded by the release workflow.

Hosted CI jobs, matching [.github/workflows/ci.yml](.github/workflows/ci.yml):

Required jobs cover formatting, linting, tests, Storybook, browser checks, type checks, builds, release safety, package consumption, and the runtime audit.

The macOS visual job runs the examined visual check. The other browser checks run in the Test job.

Run the non-visual Showcase browser check with this command:

```bash
npm exec -- nx run showcase-e2e:e2e -- --project=chromium --project=webkit --grep-invert="recipes visual | component expansion visual | product tools visual | workflow visual | advanced layout visual | larger features visual"
```

Run the examined macOS visual check with this command:

```bash
npm exec -- nx run showcase-e2e:e2e -- --project=chromium --grep="recipes visual | component expansion visual | product tools visual | workflow visual | advanced layout visual | larger features visual"
```

The other hosted commands are `npm run format:check`, `npm run lint`, `npm run test`, `npm exec -- nx run ui:test-storybook`, `npm exec -- nx run ui:test-storybook-dev`, `npm run typecheck`, `npm run build`, `npm exec -- nx run packages:check-release`, `npm exec -- nx run packages:smoke`, and `npm audit --omit=dev --audit-level=moderate`.

Also examine the full development dependency audit against [SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md) and complete affected manual QA. The macOS visual command is the examined check described in [QUALITY.md](docs/QUALITY.md).

`.github/workflows/release.yml` is `workflow_dispatch` only. It takes a `version` input and refuses to run except to demonstrate a dry-run on a `release/*` branch or manual dispatch. It checks out the repository, runs `npm ci`, runs `node tools/release/prepare.mjs --version <input> --dry-run`, then `npm exec -- nx run packages:check-release`, `npm exec -- nx run packages:build` and `npm exec -- nx run packages:smoke`. Permissions are `contents: read`.

It always passes `--dry-run`, so the input version is not written before the package build. The build and smoke steps validate the checked-out commit. The workflow does not create tags or GitHub Releases.

## Release checklist

1. Update your local copy of the protected default branch.
2. Examine `CHANGELOG.md` and confirm `## [Unreleased]` describes the release.
3. Select the next version using SemVer, the pre-1.0 rule, and the `1.0.0` criteria above.
4. Create the release branch:

   ```bash
   git checkout main
   git pull --ff-only
   git checkout -b release/vX.Y.Z
   ```

5. Dry-run the plan, then write it. This does not create a tag:

   ```bash
   node tools/release/prepare.mjs --version X.Y.Z --dry-run
   node tools/release/prepare.mjs --version X.Y.Z
   ```

6. Update a README version sentence if that file quotes one.
7. Run the required checks locally or wait for the release pull request CI. Optional: dispatch the Release workflow on `release/vX.Y.Z` to repeat the dry-run plus package build and consumer smoke. That dispatch still does not tag or publish.
8. Commit the release branch:

   ```bash
   git add package.json package-lock.json libs/ui/package.json libs/tokens/package.distribution.json CHANGELOG.md
   git commit -m "chore(release): prepare vX.Y.Z"
   ```

   Include `README.md` in that commit only when its version sentence changed.

9. Open a pull request from `release/vX.Y.Z` into the protected default branch. Merge it only after inspection and the required checks are green.
10. After merge, tag that commit and push the tag. This remains a human step:

    ```bash
    git checkout main
    git pull --ff-only
    git tag -a vX.Y.Z -m "Release vX.Y.Z"
    git push origin vX.Y.Z
    ```

11. Publish the GitHub Release from the matching changelog section. The workflow does not do this.
12. Build tarballs from that tagged commit. See [distribution](docs/DISTRIBUTION.md).
13. Continue new work under `## [Unreleased]`.

## Distribution channel

Packages are installed from workspace tarballs produced by `tools/build-packages.mjs`. Private npm publication is not configured: there is no registry, no publish credentials, and no unpublish flow. The package scope remains `@jp-design-system`, from the existing names `@jp-design-system/ui` and `@jp-design-system/tokens`.

## Failed-release recovery

Do not delete a tag that has been pushed.

If the release pull request has not merged, fix the branch or close it. No tag exists yet. Uncommitted prepare writes can be restored with `git checkout --` on the files the script changed.

If a GitHub Release is incorrect, mark that version as replaced in `CHANGELOG.md`. State the problem on the GitHub Release. Give consumers a link to the previous good tag. Leave the git tag in place.

Consumers roll back by reinstalling the previous UI and tokens tarballs. There is no registry unpublish step.

## Current state

The first tagged release is not cut. `prepare.mjs` can plan a version, and the release workflow can dry-run that plan and run package build and consumer smoke. Neither creates `vX.Y.Z`.
