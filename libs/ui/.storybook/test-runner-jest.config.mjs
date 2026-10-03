import { getJestConfig } from '@storybook/test-runner';
import { fileURLToPath } from 'node:url';

const defaults = getJestConfig();

// Storybook 10 registers a Node loader when loading test-runner.ts. Jest 30.5
// correctly rejects that inside its sandbox. Load our hooks through Jest's
// supported setupFilesAfterEnv instead, retaining the stock browser transforms.
export default {
  ...defaults,
  setupFilesAfterEnv: defaults.setupFilesAfterEnv.map((file) =>
    file.endsWith('/playwright/jest-setup.js')
      ? fileURLToPath(new URL('./runner-jest-setup.mjs', import.meta.url))
      : file,
  ),
};
