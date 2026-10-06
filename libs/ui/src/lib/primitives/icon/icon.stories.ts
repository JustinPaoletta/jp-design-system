import type { Meta, StoryObj } from '@storybook/angular';

import { JpIcon } from './icon';

const meta: Meta<JpIcon> = {
  title: 'Primitives/Foundations/Icon',
  component: JpIcon,
  parameters: { layout: 'padded' },
  args: { name: 'check', label: 'Complete', size: 'lg' },
};
export default meta;
type Story = StoryObj<JpIcon>;
export const Default: Story = {};
export const Decorative: Story = { args: { label: '' } };
