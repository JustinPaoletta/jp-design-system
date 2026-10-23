import type { Meta, StoryObj } from '@storybook/angular';

import { JpLink } from './link';

const meta: Meta<JpLink> = {
  title: 'Primitives/Navigation/Link',
  component: JpLink,
  parameters: { layout: 'padded' },
  args: {},
  render: () => ({
    template:
      '<a jpLink href="https://www.mlb.com/news/rays-win-alcs-2026" target="_blank" rel="noopener noreferrer">Read the Game 6 recap</a>',
  }),
};
export default meta;
type Story = StoryObj<JpLink>;
export const Default: Story = {};
