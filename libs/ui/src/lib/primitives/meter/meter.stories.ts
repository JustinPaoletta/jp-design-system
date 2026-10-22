import type { Meta, StoryObj } from '@storybook/angular';

import { JpMeter } from './meter';

const meta: Meta<JpMeter> = {
  title: 'Primitives/Data Display/Meter',
  component: JpMeter,
  parameters: { layout: 'padded' },
  args: {
    label: 'ALCS Game 6',
    value: 98,
    max: 162,
    valueText: 'Rays won',
  },
};
export default meta;
type Story = StoryObj<JpMeter>;
export const Default: Story = {};
