import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, Input, inject } from '@angular/core';
import { JP_TOAST_TONES } from '../shared/primitive-types';
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

  @Input() message = 'Game notes saved';
  @Input() tone: (typeof JP_TOAST_TONES)[number] = 'success';

  show(): void {
    this.toasts.show({ message: this.message, tone: this.tone });
  }
}

const meta: Meta = {
  title: 'Primitives/Feedback/Toast',
  component: JpToast,
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
    template: `<jp-toast message="The Rays roster is up to date." tone="neutral" />`,
  }),
};

export const Success: Story = {
  render: () => ({
    template: `<jp-toast message="Rays game notes saved." tone="success" />`,
  }),
};

export const Warning: Story = {
  render: () => ({
    template: `<jp-toast message="Choose a starting pitcher before saving." tone="warning" />`,
  }),
};

export const Error: Story = {
  render: () => ({
    template: `<jp-toast message="Lineup unavailable" tone="error" />`,
  }),
};

export const ViaService: Story = {
  argTypes: {
    message: {
      control: 'text',
    },
    tone: {
      control: 'select',
      options: JP_TOAST_TONES,
    },
  },
  args: {
    message: 'Game notes saved',
    tone: 'success',
  },
  render: (args) => ({
    props: args,
    template: `<jp-toast-story-host [message]="message" [tone]="tone" />`,
  }),
};

export const ViaServiceInteractive: Story = {
  args: {
    message: 'Game notes saved',
    tone: 'success',
  },
  render: (args) => ({
    props: args,
    template: `<jp-toast-story-host [message]="message" [tone]="tone" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(button);
    await expect(canvasElement.textContent).toContain('Game notes saved');
  },
};
