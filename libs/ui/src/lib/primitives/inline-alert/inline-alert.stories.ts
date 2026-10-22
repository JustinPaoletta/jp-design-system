import { signal } from '@angular/core';
import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, userEvent, waitFor } from 'storybook/test';
import { JpInlineAlert } from './inline-alert';

const meta: Meta<JpInlineAlert> = {
  title: 'Primitives/Feedback/InlineAlert',
  component: JpInlineAlert,
  parameters: { a11y: { test: 'error' }, layout: 'padded' },
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width:40rem">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<JpInlineAlert>;
export const Information: Story = {
  args: {
    title: 'Game 6 archive',
    message:
      'Explore the night Tampa Bay won the 2026 American League pennant.',
    tone: 'info',
  },
};
export const Saved: Story = {
  args: { message: 'Your Game 6 notes were saved.', tone: 'success' },
};
export const Warning: Story = {
  args: {
    title: 'Unsaved game notes',
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
        <jp-inline-alert tone="success" message="Your Game 6 notes were saved." />
      }
    `,
    };
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(button);
    await waitFor(() =>
      expect(canvasElement.textContent).toContain(
        'Your Game 6 notes were saved.',
      ),
    );
  },
};

export const FailedWithRetry: Story = {
  render: () => {
    const failed = signal(true);
    return {
      props: { failed, retry: () => failed.set(false) },
      template: `<div style="max-width:40rem">
        @if (failed()) {
          <jp-inline-alert tone="error" title="Could not save your game notes" message="Your draft is still available." actionLabel="Retry" (action)="retry()" />
        } @else {
          <jp-inline-alert tone="success" message="Your Game 6 notes were saved." />
        }
      </div>`,
    };
  },
};
