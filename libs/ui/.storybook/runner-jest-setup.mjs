import { setPreVisit, setupPage } from '@storybook/test-runner';
import hooks from './test-runner.hooks.ts';

// Equivalent to the stock runner setup, with the existing viewport hook loaded
// by Jest rather than Storybook's process-wide Node loader.
setPreVisit(hooks.preVisit);
globalThis.__sbSetupPage = setupPage;
globalThis.__sbCollectCoverage =
  process.env.STORYBOOK_COLLECT_COVERAGE === 'true';
