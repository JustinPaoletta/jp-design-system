import type { Meta, StoryObj } from '@storybook/angular';

import { JpDivider } from './divider';

const meta: Meta<JpDivider> = {
  title: 'Primitives/Foundations/Divider',
  component: JpDivider,
  parameters: { layout: 'padded' },
  args: {},
};
export default meta;
type Story = StoryObj<JpDivider>;
export const Default: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
