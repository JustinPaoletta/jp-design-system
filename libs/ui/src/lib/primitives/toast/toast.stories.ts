import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, inject } from '@angular/core';
import { JpButton } from '../button/button';
import { JpToast } from './toast';
import { JpToastOutlet } from './toast-outlet';
import { JpToastService } from './toast.service';

@Component({
  selector: 'jp-toast-story-host',
  standalone: true,
  imports: [JpButton, JpToastOutlet],
  template: `
    <jp-button type="button" variant="primary" (click)="show()">
      Show toast
    </jp-button>
    <jp-toast-outlet />
  `,
})
class ToastStoryHost {
  private readonly toasts = inject(JpToastService);

  show(): void {
    this.toasts.show({ message: 'Deployment saved', tone: 'success' });
  }
}

const meta: Meta = {
  title: 'Primitives/Feedback/Toast',
  component: JpToast,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    moduleMetadata({
      imports: [JpToast, JpButton, JpToastOutlet, ToastStoryHost],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Neutral: Story = {
  render: () => ({
    template: `<jp-toast message="Neutral notification" tone="neutral" />`,
  }),
};

export const Success: Story = {
  render: () => ({
    template: `<jp-toast message="Saved successfully" tone="success" />`,
  }),
};

export const Warning: Story = {
  render: () => ({
    template: `<jp-toast message="Check configuration" tone="warning" />`,
  }),
};

export const Error: Story = {
  render: () => ({
    template: `<jp-toast message="Deploy failed" tone="error" />`,
  }),
};

export const ViaService: Story = {
  render: () => ({
    template: `<jp-toast-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(button);
    await expect(canvasElement.textContent).toContain('Deployment saved');
  },
};
