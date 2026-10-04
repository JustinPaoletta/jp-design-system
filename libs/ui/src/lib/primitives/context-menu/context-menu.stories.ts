import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpContextMenu } from './context-menu';
const meta: Meta<JpContextMenu> = {
  title: 'Primitives/Navigation/Context Menu',
  component: JpContextMenu,
  parameters: { layout: 'padded' },
  args: {
    label: 'Launch plan',
    actions: [
      { id: 'rename', label: 'Rename' },
      { id: 'duplicate', label: 'Duplicate' },
      { id: 'archive', label: 'Archive', disabled: true },
    ],
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template:
      '<jp-context-menu [label]="label" [actions]="actions" [disabled]="disabled"><p>Launch plan. Right-click or use Shift + F10.</p></jp-context-menu>',
  }),
};
export default meta;
type Story = StoryObj<JpContextMenu>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole('button', { name: 'More actions: Launch plan' }),
    );
    await expect(c.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(c.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(
      c.getByRole('button', { name: 'More actions: Launch plan' }),
    ).toHaveFocus();
  },
};
export const Disabled: Story = { args: { disabled: true } };
