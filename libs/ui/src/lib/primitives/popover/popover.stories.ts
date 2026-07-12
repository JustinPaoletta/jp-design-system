import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, Input } from '@angular/core';
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
  @Input() open = false;
}

const meta: Meta<PopoverStoryHost> = {
  title: 'Primitives/Feedback/Popover',
  component: JpPopover,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
  },
  args: {
    open: false,
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
  render: (args) => ({
    props: args,
    template: `<jp-popover-story-host [open]="open" />`,
  }),
};

export default meta;
type Story = StoryObj<PopoverStoryHost>;

export const Default: Story = {};

export const PanelOpen: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(trigger);
    const content = canvasElement.querySelector('[jppopovercontent]');
    await expect(content?.textContent).toContain('Filter panel content');
  },
};
