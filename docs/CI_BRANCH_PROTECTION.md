# CI Branch Protection Setup

Story 0.4 requires merge blocking on failed checks. GitHub Actions alone
does not enforce that; the branch protection rule must require CI checks.

## Required Setup (GitHub UI)

1. Open repository Settings.
2. Open Branches.
3. Add or edit the protection rule for your default branch (`master` in this repo).
4. Enable "Require status checks to pass before merging".
5. Add these required checks from the `CI` workflow:
   - `Lint`
   - `Test`
   - `Build`
6. Enable "Require branches to be up to date before merging".
7. Save changes.

After this is configured, any failed CI job will block merges into the protected default branch.

## Current Repo State

- Default branch: `master`
- Required checks configured: `Lint`, `Test`, `Build`
- Strict status checks: enabled
