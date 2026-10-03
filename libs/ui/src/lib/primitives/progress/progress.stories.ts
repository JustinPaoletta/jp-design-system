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
  args: {
    label: 'Uploading project',
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
  args: { label: 'Loading project', value: null },
};
