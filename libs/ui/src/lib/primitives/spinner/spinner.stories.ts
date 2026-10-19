import type { Meta, StoryObj } from '@storybook/angular';

import { JpSpinner } from './spinner';

const meta: Meta<JpSpinner> = {
  title: 'Primitives/Feedback/Spinner',
  component: JpSpinner,
  parameters: { layout: 'padded' },
  args: { label: 'Refreshing roster', size: 'lg' },
};
export default meta;
type Story = StoryObj<JpSpinner>;
export const Default: Story = {};

export const WithStatus: Story = {
  render: () => ({
    template: `<div style="display:flex;align-items:center;gap:var(--jp-space-sm);font:var(--jp-font-size-body)/1.5 var(--jp-font-family-base);color:var(--jp-color-text-secondary)"><jp-spinner size="md" decorative /><span role="status">Refreshing the Falcons roster…</span></div>`,
  }),
};
export const Sizes: Story = {
  render: () => ({
    template: `<div style="display:flex;align-items:center;gap:var(--jp-space-lg)"><jp-spinner size="sm" label="Small loading indicator"/><jp-spinner size="md" label="Medium loading indicator"/><jp-spinner size="lg" label="Large loading indicator"/></div>`,
  }),
};
