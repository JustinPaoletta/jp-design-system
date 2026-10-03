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
    title: 'Scheduled maintenance',
    message: 'Deployments resume after maintenance.',
    tone: 'info',
  },
};
export const Saved: Story = {
  args: { message: 'Your changes were saved.', tone: 'success' },
};
export const Warning: Story = {
  args: {
    title: 'Unsaved changes',
    message: 'Save before leaving this page.',
    tone: 'warning',
  },
};
export const FailedWithRetry: Story = {
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
        <jp-inline-alert tone="success" message="Your changes were saved." />
      }
    `,
    };
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(button);
    await expect(canvasElement.textContent).toContain(
      'Your changes were saved.',
    );
  },
};
