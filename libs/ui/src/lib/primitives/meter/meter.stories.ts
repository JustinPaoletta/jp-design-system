import type { Meta, StoryObj } from '@storybook/angular';

import { JpMeter } from './meter';

const meta: Meta<JpMeter> = {
  title: 'Primitives/Data Display/Meter',
  component: JpMeter,
  parameters: { layout: 'padded' },
  args: {
    label: '2026 Rays ALCS wins',
    value: 4,
    max: 4,
    valueText: '4 wins in a best-of-seven series',
  },
};
export default meta;
type Story = StoryObj<JpMeter>;
export const Default: Story = {};
