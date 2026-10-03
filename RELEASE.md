# Release Process

This repository uses a manual changelog + release branch workflow.

## Standards

- Use Semantic Versioning.
- Create Git tags as `vX.Y.Z`.
- Keep the root `package.json`, lockfile, and `CHANGELOG.md` aligned to the repository release version.
- UI/token package versions are separate metadata in `libs/ui/package.json` and `libs/tokens/package.distribution.json` (currently `0.1.0`). Coordinate those deliberately; `npm version` at the root does not bump them.
- Treat `CHANGELOG.md` as the source of truth for GitHub Release notes.
- Cut release branches as `release/vX.Y.Z` from the protected default branch.

## Pre-1.0 Guidance

- Use `0.x` releases until the API and design-token contract are intentionally stabilized.
- While the project is pre-1.0, breaking changes can still bump the minor version instead of jumping directly to `1.0.0`.

## Pre-Release Checks

Run these before opening a release PR:

```bash
npm run format:check
npm run lint
npm run test
npm run typecheck
npm run build
npx nx run ui:test-storybook
npx nx run showcase-e2e:e2e -- --project=chromium --project=webkit --grep-invert="recipes visual"
npx nx run packages:smoke
npm audit --omit=dev --audit-level=moderate
```

Also run the reviewed macOS Chromium visual check from [QUALITY.md](docs/QUALITY.md), review the full development dependency audit against [SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md), and complete affected manual QA. Hosted CI results must pass before merging.

## Release Checklist

1. Update your local copy of the protected default branch.
2. Review `CHANGELOG.md` and confirm `## [Unreleased]` accurately describes the release scope.
3. Choose the next version using SemVer and the pre-1.0 guidance above.
4. Create the release branch:

   ```bash
   git checkout main
   git pull --ff-only
   git checkout -b release/vX.Y.Z
   ```

5. Coordinate the UI/token package versions if shipping package artifacts, then bump the repository version without creating a tag yet:

   ```bash
   npm version --no-git-tag-version X.Y.Z
   ```

6. Move the release notes from `## [Unreleased]` into a dated section like `## [X.Y.Z] - YYYY-MM-DD`, then leave a fresh empty `Unreleased` section at the top.
7. Run the pre-release checks.
8. Commit the release branch changes:

   ```bash
   git add package.json package-lock.json libs/ui/package.json libs/tokens/package.distribution.json CHANGELOG.md README.md RELEASE.md
   git commit -m "chore(release): prepare vX.Y.Z"
   ```

9. Open a pull request from `release/vX.Y.Z` into the protected default branch and merge it after review.
10. Tag the merge commit and push the tag:

```bash
git checkout main
git pull --ff-only
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

11. Publish the GitHub Release from the matching changelog section.
12. Continue adding new work under `## [Unreleased]` for the next cycle.

## Notes

- Until package publishing exists, releases are repository-level milestones rather than npm package publishes.
