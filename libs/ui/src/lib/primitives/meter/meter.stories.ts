import type { Meta, StoryObj } from '@storybook/angular';

import { JpMeter } from './meter';

const meta: Meta<JpMeter> = {
  title: 'Primitives/Data Display/Meter',
  component: JpMeter,
  parameters: { layout: 'padded' },
  args: { label: 'Storage used', value: 68, valueText: '68 GB of 100 GB' },
};
export default meta;
type Story = StoryObj<JpMeter>;
export const Default: Story = {};
