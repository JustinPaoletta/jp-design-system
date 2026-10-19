import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { JpContextMenu } from './context-menu';
const meta: Meta<JpContextMenu> = {
  title: 'Primitives/Navigation/Context Menu',
  component: JpContextMenu,
  parameters: { layout: 'padded' },
  args: {
    label: 'Game plan',
    actions: [
      { id: 'rename', label: 'Rename' },
      { id: 'duplicate', label: 'Duplicate' },
      { id: 'archive', label: 'Archive', disabled: true },
    ],
    disabled: false,
  },
  render: (args) => {
    const selected = signal('');
    return {
      props: {
        ...args,
        selected,
        onStoryActionSelected: (id: string) =>
          selected.set(
            args.actions?.find((action) => action.id === id)?.label || '',
          ),
      },
      template: `<div style="max-width:28rem;display:grid;gap:1rem">
        <jp-context-menu [label]="label" [actions]="actions" [disabled]="disabled" (actionSelected)="onStoryActionSelected($event)"><p style="margin:0">Game plan. Right-click or use Shift + F10.</p></jp-context-menu>
        @if (selected()) { <p role="status" style="margin:0;font-size:var(--jp-font-size-body-sm);color:var(--jp-color-text-secondary)">{{ selected() }} selected for the game plan.</p> }
      </div>`,
    };
  },
};
export default meta;
type Story = StoryObj<JpContextMenu>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole('button', { name: 'More actions: Game plan' }),
    );
    await expect(c.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(c.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(
      c.getByRole('button', { name: 'More actions: Game plan' }),
    ).toHaveFocus();
    await userEvent.click(
      c.getByRole('button', { name: 'More actions: Game plan' }),
    );
    await expect(c.getByRole('menu')).toBeVisible();
    await userEvent.click(c.getByRole('menuitem', { name: 'Duplicate' }));
    await waitFor(() =>
      expect(c.getByRole('status')).toHaveTextContent(
        'Duplicate selected for the game plan.',
      ),
    );
    await userEvent.click(
      c.getByRole('button', { name: 'More actions: Game plan' }),
    );
  },
};
export const Disabled: Story = { args: { disabled: true } };
