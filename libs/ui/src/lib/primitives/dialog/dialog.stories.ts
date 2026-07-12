import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from 'storybook/test';
import { Component, Input } from '@angular/core';
import { JpButton } from '../button/button';
import { JpText } from '../text/text';
import { JpDialog, JpDialogActions } from './dialog';

@Component({
  selector: 'jp-dialog-story-host',
  standalone: true,
  imports: [JpDialog, JpDialogActions, JpButton, JpText],
  template: `
    @if (!open) {
      <jp-button type="button" variant="secondary" (click)="open = true">
        Open dialog
      </jp-button>
    }
    <jp-dialog [open]="open" [title]="title" (openChange)="open = $event">
      <jp-text>This action cannot be undone.</jp-text>
      <div jpDialogActions>
        <jp-button type="button" variant="secondary" (click)="open = false">
          Cancel
        </jp-button>
        <jp-button type="button" variant="destructive" (click)="open = false">
          Delete
        </jp-button>
      </div>
    </jp-dialog>
  `,
})
class DialogStoryHost {
  @Input() open = false;
  @Input() title = 'Delete deployment?';
}

const meta: Meta<DialogStoryHost> = {
  title: 'Primitives/Feedback/Dialog',
  component: JpDialog,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
  },
  args: {
    open: false,
    title: 'Delete deployment?',
  },
  decorators: [
    moduleMetadata({
      imports: [JpDialog, JpDialogActions, JpButton, JpText, DialogStoryHost],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `<jp-dialog-story-host [open]="open" [title]="title" />`,
  }),
};

export default meta;
type Story = StoryObj<DialogStoryHost>;

export const Default: Story = {};

export const Open: Story = {
  args: {
    open: true,
  },
  play: async ({ canvasElement }) => {
    const dialog = canvasElement.querySelector(
      '[role="dialog"][aria-modal="true"]',
    );
    await expect(dialog).toBeTruthy();
    await expect(dialog?.getAttribute('aria-modal')).toBe('true');
  },
};
