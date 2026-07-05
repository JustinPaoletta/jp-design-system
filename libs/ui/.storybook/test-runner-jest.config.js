import { getJestConfig } from '@storybook/test-runner';

const testRunnerConfig = getJestConfig();

/**
 * Ignore build output under `dist/` so Jest does not treat duplicate
 * `package.json` files (e.g. `libs/tokens` vs `dist/libs/tokens`) as
 * colliding Haste modules.
 *
 * @type {import('@jest/types').Config.InitialOptions}
 */
export default {
  ...testRunnerConfig,
  modulePathIgnorePatterns: [
    ...(testRunnerConfig.modulePathIgnorePatterns ?? []),
    '<rootDir>/dist',
  ],
};
