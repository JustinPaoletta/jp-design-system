import type { Meta, StoryObj } from '@storybook/angular';

import { JpLink } from './link';

const meta: Meta<JpLink> = {
  title: 'Primitives/Navigation/Link',
  component: JpLink,
  parameters: { layout: 'padded' },
  args: {},
  render: () => ({
    template: '<a jpLink href="#example">Read documentation</a>',
  }),
};
export default meta;
type Story = StoryObj<JpLink>;
export const Default: Story = {};
