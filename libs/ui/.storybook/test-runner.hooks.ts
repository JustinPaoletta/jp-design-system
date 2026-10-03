import type { TestRunnerConfig } from '@storybook/test-runner';

/** Matches Storybook's built-in `mobile1` viewport and stays under the shell's 48rem breakpoint. */
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    const id = context.id.toLowerCase();
    const name = context.name.toLowerCase();
    const isMobile =
      id.includes('mobile') ||
      name.includes('mobile') ||
      id.includes('mobiledrawer');

    await page.setViewportSize(isMobile ? MOBILE_VIEWPORT : DESKTOP_VIEWPORT);
  },
};

export default config;
