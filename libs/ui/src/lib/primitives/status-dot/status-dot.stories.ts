import type { Meta, StoryObj } from '@storybook/angular';

import { JpStatusDot } from './status-dot';

const meta: Meta<JpStatusDot> = {
  title: 'Primitives/Identity/Status Dot',
  component: JpStatusDot,
  parameters: { layout: 'padded' },
  args: { tone: 'success', label: 'Sam Rivera is online' },
};
export default meta;
type Story = StoryObj<JpStatusDot>;
export const Default: Story = {};

export const StatusLabels: Story = {
  render: () => ({
    template: `<div style="display:flex;flex-wrap:wrap;gap:var(--jp-space-lg);font:var(--jp-font-size-body-sm)/1.5 var(--jp-font-family-base);color:var(--jp-color-text-secondary)">
    <span><jp-status-dot tone="success" /> Available</span><span><jp-status-dot tone="warning" /> Away</span><span><jp-status-dot tone="error" /> Busy</span><span><jp-status-dot tone="neutral" /> Offline</span>
  </div>`,
  }),
};
