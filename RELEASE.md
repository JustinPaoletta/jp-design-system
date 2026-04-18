# Release Process

This repository uses a manual changelog + release branch workflow.

## Standards

- Use Semantic Versioning.
- Create Git tags as `vX.Y.Z`.
- Keep `package.json` and `CHANGELOG.md` aligned to the release version.
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
npm run build
```

## Release Checklist

1. Update your local copy of the protected default branch.
2. Review `CHANGELOG.md` and confirm `## [Unreleased]` accurately describes the release scope.
3. Choose the next version using SemVer and the pre-1.0 guidance above.
4. Create the release branch:

   ```bash
   git checkout master
   git pull --ff-only
   git checkout -b release/vX.Y.Z
   ```

5. Bump the repository version without creating a tag yet:

   ```bash
   npm version --no-git-tag-version X.Y.Z
   ```

6. Move the release notes from `## [Unreleased]` into a dated section like `## [X.Y.Z] - YYYY-MM-DD`, then leave a fresh empty `Unreleased` section at the top.
7. Run the pre-release checks.
8. Commit the release branch changes:

   ```bash
   git add package.json package-lock.json CHANGELOG.md README.md RELEASE.md
   git commit -m "chore(release): prepare vX.Y.Z"
   ```

9. Open a pull request from `release/vX.Y.Z` into the protected default branch and merge it after review.
10. Tag the merge commit and push the tag:

   ```bash
   git checkout master
   git pull --ff-only
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```

11. Publish the GitHub Release from the matching changelog section.
12. Continue adding new work under `## [Unreleased]` for the next cycle.

## Notes

- Until the branch rename is completed, substitute the current default branch name where this document says `master`.
- Until package publishing exists, releases are repository-level milestones rather than npm package publishes.
