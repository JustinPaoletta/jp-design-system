import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component } from '@angular/core';
import { JpButton } from '../button/button';
import {
  JpDropdownMenu,
  JpDropdownMenuItem,
  JpDropdownTrigger,
} from './dropdown-menu';

@Component({
  selector: 'jp-dropdown-story-host',
  standalone: true,
  imports: [JpDropdownMenu, JpDropdownTrigger, JpDropdownMenuItem, JpButton],
  template: `
    <jp-dropdown-menu [open]="open" (openChange)="open = $event">
      <jp-button jpDropdownTrigger type="button" variant="secondary">
        Actions
      </jp-button>
      <button type="button" jpDropdownMenuItem (itemSelect)="open = false">
        Edit
      </button>
      <button type="button" jpDropdownMenuItem (itemSelect)="open = false">
        Delete
      </button>
    </jp-dropdown-menu>
  `,
})
class DropdownStoryHost {
  open = false;
}

const meta: Meta = {
  title: 'Primitives/Feedback/Dropdown Menu',
  component: JpDropdownMenu,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    moduleMetadata({
      imports: [
        JpDropdownMenu,
        JpDropdownTrigger,
        JpDropdownMenuItem,
        JpButton,
        DropdownStoryHost,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<jp-dropdown-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(trigger);
    await expect(canvasElement.querySelector('[role="menu"]')).toBeTruthy();
    await expect(canvasElement.textContent).toContain('Edit');
  },
};
