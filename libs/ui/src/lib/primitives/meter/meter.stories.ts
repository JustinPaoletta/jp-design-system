import type { Meta, StoryObj } from '@storybook/angular';

import { JpMeter } from './meter';

const meta: Meta<JpMeter> = {
  title: 'Primitives/Data Display/Meter',
  component: JpMeter,
  parameters: { layout: 'padded' },
  args: {
    label: 'Season ticket sales',
    value: 68,
    valueText: '68 of 100 season tickets',
  },
};
export default meta;
type Story = StoryObj<JpMeter>;
export const Default: Story = {};
