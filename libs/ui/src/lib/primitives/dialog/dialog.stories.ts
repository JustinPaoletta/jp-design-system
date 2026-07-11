import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from 'storybook/test';
import { Component } from '@angular/core';
import { JpButton } from '../button/button';
import { JpText } from '../text/text';
import { JpDialog, JpDialogActions } from './dialog';

@Component({
  selector: 'jp-dialog-story-host',
  standalone: true,
  imports: [JpDialog, JpDialogActions, JpButton, JpText],
  template: `
    <jp-button type="button" variant="secondary" (click)="open = true">
      Open dialog
    </jp-button>
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
  open = true;
  title = 'Delete deployment?';
}

const meta: Meta = {
  title: 'Primitives/Feedback/Dialog',
  component: JpDialog,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    moduleMetadata({
      imports: [JpDialog, JpDialogActions, JpButton, JpText, DialogStoryHost],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Open: Story = {
  render: () => ({
    template: `<jp-dialog-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const dialog = canvasElement.querySelector(
      '[role="dialog"][aria-modal="true"]',
    );
    await expect(dialog).toBeTruthy();
    await expect(dialog?.getAttribute('aria-modal')).toBe('true');
  },
};
