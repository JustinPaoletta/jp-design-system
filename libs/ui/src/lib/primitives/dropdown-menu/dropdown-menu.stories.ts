import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, Input } from '@angular/core';
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
  @Input() open = false;
}

const meta: Meta<DropdownStoryHost> = {
  title: 'Primitives/Feedback/Dropdown Menu',
  component: JpDropdownMenu,
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
        JpDropdownMenu,
        JpDropdownTrigger,
        JpDropdownMenuItem,
        JpButton,
        DropdownStoryHost,
      ],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `<jp-dropdown-story-host [open]="open" />`,
  }),
};

export default meta;
type Story = StoryObj<DropdownStoryHost>;

export const Default: Story = {};

export const MenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(trigger);
    await expect(canvasElement.querySelector('[role="menu"]')).toBeTruthy();
    await expect(canvasElement.textContent).toContain('Edit');
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(trigger);

    const items = canvasElement.querySelectorAll<HTMLButtonElement>(
      '[jpdropdownmenuitem]',
    );
    // Opening the menu moves focus to the first item.
    await expect(document.activeElement).toBe(items[0]);

    await userEvent.keyboard('{ArrowDown}');
    await expect(document.activeElement).toBe(items[1]);

    // ArrowUp wraps back to the first item.
    await userEvent.keyboard('{ArrowUp}');
    await expect(document.activeElement).toBe(items[0]);
  },
};

export const WithDisabledItem: Story = {
  render: () => ({
    template: `
      <jp-dropdown-menu [open]="true">
        <jp-button jpDropdownTrigger type="button" variant="secondary">
          Actions
        </jp-button>
        <button type="button" jpDropdownMenuItem>Edit</button>
        <button type="button" jpDropdownMenuItem disabled>Delete</button>
        <button type="button" jpDropdownMenuItem>Duplicate</button>
      </jp-dropdown-menu>
    `,
  }),
};
