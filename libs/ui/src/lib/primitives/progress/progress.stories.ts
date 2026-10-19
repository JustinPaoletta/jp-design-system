import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpProgress } from './progress';

const meta: Meta<JpProgress> = {
  title: 'Primitives/Feedback/Progress',
  component: JpProgress,
  parameters: { a11y: { test: 'error' } },
};
export default meta;
type Story = StoryObj<JpProgress>;

export const Upload: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="max-width:32rem;font:var(--jp-font-size-body)/1.5 var(--jp-font-family-base);color:var(--jp-color-text-primary)"><div style="display:flex;justify-content:space-between;gap:var(--jp-space-md);margin-bottom:var(--jp-space-xs)"><span>Uploading lineup.csv</span><span>{{ value }}%</span></div><jp-progress [label]="label" [value]="value" [max]="max" [valueText]="valueText" /></div>`,
  }),
  args: {
    label: 'Uploading lineup',
    value: 42,
    max: 100,
    valueText: '42 percent uploaded',
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement
        .querySelector('[role="progressbar"]')
        ?.getAttribute('aria-valuenow'),
    ).toBe('42');
  },
};
export const Indeterminate: Story = {
  args: { label: 'Loading club roster', value: null },
};
