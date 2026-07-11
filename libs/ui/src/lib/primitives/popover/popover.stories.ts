import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component } from '@angular/core';
import { JpButton } from '../button/button';
import { JpText } from '../text/text';
import { JpPopover, JpPopoverContent, JpPopoverTrigger } from './popover';

@Component({
  selector: 'jp-popover-story-host',
  standalone: true,
  imports: [JpPopover, JpPopoverTrigger, JpPopoverContent, JpButton, JpText],
  template: `
    <jp-popover [open]="open" (openChange)="open = $event">
      <jp-button jpPopoverTrigger type="button" variant="secondary">
        Filters
      </jp-button>
      <div jpPopoverContent>
        <jp-text>Filter panel content</jp-text>
      </div>
    </jp-popover>
  `,
})
class PopoverStoryHost {
  open = false;
}

const meta: Meta = {
  title: 'Primitives/Feedback/Popover',
  component: JpPopover,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    moduleMetadata({
      imports: [
        JpPopover,
        JpPopoverTrigger,
        JpPopoverContent,
        JpButton,
        JpText,
        PopoverStoryHost,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<jp-popover-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(trigger);
    const content = canvasElement.querySelector('[jppopovercontent]');
    await expect(content?.textContent).toContain('Filter panel content');
  },
};
