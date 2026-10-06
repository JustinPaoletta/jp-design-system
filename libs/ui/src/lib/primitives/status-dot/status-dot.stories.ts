import type { Meta, StoryObj } from '@storybook/angular';

import { JpStatusDot } from './status-dot';

const meta: Meta<JpStatusDot> = {
  title: 'Primitives/Identity/Status Dot',
  component: JpStatusDot,
  parameters: { layout: 'padded' },
  args: { tone: 'success', label: 'Online' },
};
export default meta;
type Story = StoryObj<JpStatusDot>;
export const Default: Story = {};
