import type { Meta, StoryObj } from '@storybook/angular';

import { JpMeter } from './meter';

const meta: Meta<JpMeter> = {
  title: 'Primitives/Data Display/Meter',
  component: JpMeter,
  parameters: { layout: 'padded' },
  args: {
    label: '2024 Dodgers wins',
    value: 98,
    max: 162,
    valueText: '98 wins and 64 losses',
  },
};
export default meta;
type Story = StoryObj<JpMeter>;
export const Default: Story = {};
