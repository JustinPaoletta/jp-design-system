import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { JpInlineAlert } from './inline-alert';

const meta: Meta<JpInlineAlert> = {
  title: 'Primitives/Feedback/InlineAlert',
  component: JpInlineAlert,
  parameters: { a11y: { test: 'error' } },
};
export default meta;
type Story = StoryObj<JpInlineAlert>;
export const Information: Story = {
  args: {
    title: 'Field maintenance',
    message: 'Games resume after field maintenance.',
    tone: 'info',
  },
};
export const Saved: Story = {
  args: { message: 'The lineup was saved.', tone: 'success' },
};
export const Warning: Story = {
  args: {
    title: 'Unsaved lineup',
    message: 'Save before leaving this page.',
    tone: 'warning',
  },
};
export const RetryInteraction: Story = {
  render: () => {
    const state = {
      failed: true,
      retry: function (this: { failed: boolean }) {
        this.failed = false;
      },
    };
    return {
      props: state,
      template: `
      @if (failed) {
        <jp-inline-alert tone="error" title="Could not save changes" message="Your draft is still available." actionLabel="Retry" (action)="retry()" />
      } @else {
        <jp-inline-alert tone="success" message="The lineup was saved." />
      }
    `,
    };
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(button);
    await expect(canvasElement.textContent).toContain('The lineup was saved.');
  },
};

export const FailedWithRetry: Story = {
  args: {
    tone: 'error',
    title: 'Could not save changes',
    message: 'Your draft is still available.',
    actionLabel: 'Retry',
  },
};
