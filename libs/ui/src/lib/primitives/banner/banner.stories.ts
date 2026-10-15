import type { Meta, StoryObj } from '@storybook/angular';

import { JpBanner } from './banner';

const meta: Meta<JpBanner> = {
  title: 'Primitives/Feedback/Banner',
  component: JpBanner,
  parameters: { layout: 'padded' },
  args: {
    title: 'Field maintenance',
    message: 'The game starts at 20:00 UTC.',
    dismissible: true,
  },
};
export default meta;
type Story = StoryObj<JpBanner>;
export const Default: Story = {};
export const Error: Story = {
  args: {
    title: 'Score feed interrupted',
    tone: 'error',
    message: 'Your lineup has been kept. Try again.',
  },
};
