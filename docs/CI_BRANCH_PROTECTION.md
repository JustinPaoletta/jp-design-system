# CI Branch Protection Setup

Story 0.4 requires merge blocking on failed checks. GitHub Actions alone
does not enforce that; the branch protection rule must require CI checks.

## Required Setup (GitHub UI)

1. Open repository Settings.
2. Open Branches.
3. Add or edit the protection rule for your protected default branch (`master` today; rename to `main` when you are ready to standardize branch names).
4. Enable "Require status checks to pass before merging".
5. Add these required checks from the `CI` workflow:
   - `Lint`
   - `Test`
   - `Build`
6. Enable "Require branches to be up to date before merging".
7. Save changes.

After this is configured, any failed CI job will block merges into the protected default branch.

Release branches such as `release/v0.1.0` should still flow back through pull requests into the protected default branch so the same required checks are enforced before release merges.

## Current Repo State

- Default branch: `master` (manual release docs use the same workflow even if this later becomes `main`)
- Required checks configured: `Lint`, `Test`, `Build`
- Strict status checks: enabled
