import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, Input } from '@angular/core';
import { JpButton } from '../button/button';
import { JpPopover, JpPopoverContent, JpPopoverTrigger } from './popover';

@Component({
  selector: 'jp-popover-story-host',
  standalone: true,
  imports: [JpPopover, JpPopoverTrigger, JpPopoverContent, JpButton],
  template: `
    <jp-popover [open]="open" (openChange)="open = $event">
      <jp-button jpPopoverTrigger type="button" variant="secondary">
        Filters
      </jp-button>
      <div jpPopoverContent aria-label="Game 6 player filters">
        <p>Choose a squad and player position.</p>
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
    await expect(content?.textContent).toContain(
      'Choose a squad and player position.',
    );
  },
};

/** Scroll the clipped surface; the panel remains in the browser top layer. */
export const ClippedScrollContainer: Story = {
  render: () => ({
    template: `<div style="overflow:auto;width:280px;height:140px;border:1px solid var(--jp-color-border-default)"><div style="width:420px;height:320px;padding:90px 0 0 230px"><jp-popover-story-host [open]="true" /></div></div>`,
  }),
};

export const ViewportEdge: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => ({
    template: `<div style="position:fixed;bottom:8px;right:8px"><jp-popover-story-host [open]="true" /></div>`,
  }),
};

export const NestedPanels: Story = {
  render: () => ({
    props: { outer: false, inner: false },
    template: `<jp-popover [open]="outer" (openChange)="outer = $event"><jp-button variant="secondary" jpPopoverTrigger>Open roster</jp-button><div jpPopoverContent aria-label="Roster actions"><p>Escape closes the child first.</p><jp-popover [open]="inner" (openChange)="inner = $event"><jp-button variant="secondary" jpPopoverTrigger>Open player details</jp-button><div jpPopoverContent aria-label="Player details">Freddy Peralta earned the win and ALCS MVP honors.</div></jp-popover></div></jp-popover>`,
  }),
  play: async ({ canvasElement }) => {
    const triggers = canvasElement.querySelectorAll('[jppopovertrigger]');
    await userEvent.click(triggers[0]);
    await userEvent.click(triggers[1]);
    await userEvent.keyboard('{Escape}');
    await expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    await expect(triggers[1].getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(triggers[1]);
    await expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
  },
};
