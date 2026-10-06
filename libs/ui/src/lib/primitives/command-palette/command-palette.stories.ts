import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpCommandPalette } from './command-palette';
const meta: Meta<JpCommandPalette> = {
  title: 'Primitives/Navigation/Command Palette',
  component: JpCommandPalette,
  parameters: { layout: 'padded' },
  args: {
    commands: [
      {
        id: 'overview',
        label: 'Overview',
        section: 'Navigate',
        keywords: ['home'],
        shortcut: ['Mod', 'Shift', 'O'],
      },
      { id: 'duplicate', label: 'Duplicate', section: 'Actions' },
      { id: 'archive', label: 'Archive', section: 'Actions', disabled: true },
    ],
    open: false,
    shortcutEnabled: true,
  },
  render: (args) => ({
    props: { ...args, selected: '' },
    template:
      '<button type="button" (click)="open=true">Open commands</button><jp-command-palette [open]="open" (openChange)="open=$event" [commands]="commands" [shortcutEnabled]="shortcutEnabled" (commandSelected)="selected=$event" /><p role="status">{{selected}}</p>',
  }),
};
export default meta;
type Story = StoryObj<JpCommandPalette>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Open commands' }));
    const search = c.getByRole('combobox', { name: 'Search commands' });
    await expect(search).toHaveFocus();
    await userEvent.type(search, 'duplicate');
    await expect(c.getByRole('option', { name: 'Duplicate' })).toBeVisible();
    await userEvent.keyboard('{Enter}');
    await expect(c.getByRole('status')).toHaveTextContent('duplicate');
    await expect(
      c.getByRole('button', { name: 'Open commands' }),
    ).toHaveFocus();
  },
};
export const Empty: Story = { args: { commands: [], open: true } };
