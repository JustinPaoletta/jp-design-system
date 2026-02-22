# Manual Testing Checklist

## Scope

This checklist covers what to test for the current foundation state (Phase 0.1 through Phase 0.4):

1. Workspace and project wiring
2. Formatting and lint enforcement
3. Unit test execution
4. Build integrity
5. Local app and Storybook smoke behavior
6. E2E smoke coverage
7. CI workflow behavior
8. Merge-blocking branch protection behavior

## Prerequisites

1. Use Node.js 20.x.
2. From repo root, install dependencies:

```bash
npm ci
```

3. Confirm expected projects are registered:

```bash
npx nx show projects
```

Expected output includes:

- `playground`
- `playground-e2e`
- `storybook`
- `storybook-e2e`
- `tokens`
- `ui`

## Test 1: Formatting Gate

1. Run:

```bash
npm run format:check
```

2. Expected result:

- Command exits with code `0`.
- Output reports all files are formatted.

## Test 2: Lint Gates

1. Run:

```bash
npm run lint
```

2. Expected result:

- Command exits with code `0`.
- All project lint targets pass.
- Hardcoded color check passes (`lint:colors`).

3. Negative check (recommended):

1. Add a temporary literal color to a non-token file (example: `apps/playground/src/app/app.scss`):

```scss
background: #ff00aa;
```

2. Run:

```bash
npm run lint:colors
```

3. Expected result:

- Command fails.
- Output includes file and line where color literal was found.

4. Revert the temporary test edit.

## Test 3: Unit Tests

1. Run:

```bash
npm run test
```

2. Expected result:

- Command exits with code `0`.
- Unit tests pass for:
  - `playground`
  - `storybook`
  - `tokens`
  - `ui`

## Test 4: Build Validation

1. Run:

```bash
npm run build
```

2. Expected result:

- Command exits with code `0`.
- Build targets pass for:
  - `playground`
  - `storybook`
  - `tokens`

3. Optional Storybook static build validation:

```bash
npx nx build-storybook ui
```

Expected result:

- Command exits with code `0`.
- Output directory is produced in `dist/storybook/ui`.

## Test 5: Playground App Smoke Test

1. Start app:

```bash
npx nx serve playground
```

2. Open `http://localhost:4200`.
3. Validate:

- Page renders without blank/error screen.
- Heading text shows `JP Design System`.
- Browser console has no runtime errors.
- Current expected visual in Phase 0: default browser/light colors are acceptable.
- Reason: playground uses token CSS vars (`--jp-color-surface-canvas`, `--jp-color-text-primary`) that are not defined until Phase 1 token implementation.
- Failure condition: broken layout, missing text, unreadable text, or console/runtime errors.

## Test 6: Storybook Host App Smoke Test

1. Start app:

```bash
npx nx serve storybook
```

2. Open the URL shown by Nx (default `http://localhost:4200`).
3. Validate:

- Page renders without blank/error screen.
- Heading text shows `JP Storybook Host`.
- Browser console has no runtime errors.

## Test 7: UI Library Storybook Smoke Test

1. Start Storybook:

```bash
npx nx storybook ui
```

2. Open `http://localhost:4400`.
3. Validate:

- Storybook loads successfully.
- `Ui` story appears and renders.
- Canvas and controls panels work.

## Test 8: E2E Smoke Tests

1. Ensure no other process is already using the e2e ports:
   - `4300` (playground e2e)
   - `4301` (storybook e2e)
2. Run playground e2e:

```bash
npx nx e2e playground-e2e
```

3. Run storybook host e2e:

```bash
npx nx e2e storybook-e2e
```

4. Expected result:

- Both commands exit with code `0`.
- Playwright suites pass.
- Playground e2e validates heading `JP Design System`.
- Storybook host e2e validates heading `JP Storybook Host`.

## Test 9: CI Workflow Validation

Workflow file: `.github/workflows/ci.yml`

1. Create a small PR with a safe change (example: docs-only).
2. Confirm these checks run on the PR:

- `CI / Lint`
- `CI / Test`
- `CI / Build`

3. Confirm all three pass on the safe change.

## Test 10: Merge-Blocking Validation

1. On a PR branch, introduce a deliberate failure (example: lint violation).
2. Push the failing commit.
3. Expected result:

- At least one required status check fails.
- Merge button is blocked.

4. Revert/fix the failure and push again.
5. Expected result:

- Required checks pass.
- Merge becomes allowed.

## Test 11: Branch Protection Rule Validation

Reference: `docs/CI_BRANCH_PROTECTION.md`

1. Open repository Settings > Branches.
2. Verify the protection rule on default branch (`master`) has:

- Required status checks enabled.
- Required checks set to:
  - `CI / Lint`
  - `CI / Test`
  - `CI / Build`
- "Require branches to be up to date before merging" enabled.

3. Expected result:

- Failing required checks prevent merge.

## Exit Criteria (All Must Pass)

1. `npm run format:check` passes.
2. `npm run lint` passes.
3. `npm run test` passes.
4. `npm run build` passes.
5. Playground, Storybook host, and UI Storybook smoke tests pass.
6. E2E smoke tests pass.
7.   PR checks (`CI / Lint`, `CI / Test`, `CI / Build`) run and enforce merge blocking.
