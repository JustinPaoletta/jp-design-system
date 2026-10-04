import type { Meta, StoryObj } from '@storybook/angular';

import { JpBanner } from './banner';

const meta: Meta<JpBanner> = {
  title: 'Primitives/Feedback/Banner',
  component: JpBanner,
  parameters: { layout: 'padded' },
  args: {
    title: 'Scheduled maintenance',
    message: 'Service will restart at 20:00 UTC.',
    dismissible: true,
  },
};
export default meta;
type Story = StoryObj<JpBanner>;
export const Default: Story = {};
export const Error: Story = {
  args: {
    title: 'Connection interrupted',
    tone: 'error',
    message: 'Your changes have been kept. Try again.',
  },
};
