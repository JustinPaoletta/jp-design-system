import type { Meta, StoryObj } from '@storybook/angular';

import { JpSegmentedControl } from './segmented-control';

const meta: Meta<JpSegmentedControl> = {
  title: 'Primitives/Controls/Segmented Control',
  component: JpSegmentedControl,
  parameters: { layout: 'padded' },
  args: {
    label: 'Time period',
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
};
export default meta;
type Story = StoryObj<JpSegmentedControl>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { error: 'This field needs attention' } };
