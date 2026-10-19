import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { JpSplitButton } from './split-button';
const meta: Meta<JpSplitButton> = {
  title: 'Primitives/Controls/Split Button',
  component: JpSplitButton,
  args: {
    label: 'Create lineup',
    actions: [
      { id: 'template', label: 'From template' },
      { id: 'archive', label: 'Previous lineup', disabled: true },
    ],
  },
  parameters: { layout: 'padded' },
  render: (args) => {
    const result = signal('');
    return {
      props: {
        ...args,
        result,
        onStoryPrimary: () => result.set('A new lineup is ready.'),
        onStoryActionSelected: (id: string) =>
          result.set(
            id === 'template'
              ? 'A lineup from the template is ready.'
              : 'The previous lineup is ready.',
          ),
      },
      template: `<div style="max-width:28rem;display:grid;gap:1rem">
        <jp-split-button [label]="label" [actions]="actions" [disabled]="disabled" [menuLabel]="menuLabel || 'More actions'" (primary)="onStoryPrimary()" (actionSelected)="onStoryActionSelected($event)" />
        @if (result()) { <p role="status" style="margin:0;font-size:var(--jp-font-size-body-sm);color:var(--jp-color-text-secondary)">{{ result() }}</p> }
      </div>`,
    };
  },
};
export default meta;
type Story = StoryObj<JpSplitButton>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole('button', { name: 'More actions: Create lineup' }),
    );
    await expect(
      c.getByRole('menuitem', { name: 'From template' }),
    ).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(
      c.getByRole('button', { name: 'More actions: Create lineup' }),
    ).toHaveFocus();
    await userEvent.click(c.getByRole('button', { name: 'Create lineup' }));
    await waitFor(() =>
      expect(c.getByRole('status')).toHaveTextContent('A new lineup is ready.'),
    );
    await userEvent.click(
      c.getByRole('button', { name: 'More actions: Create lineup' }),
    );
    await userEvent.click(c.getByRole('menuitem', { name: 'From template' }));
    await waitFor(() =>
      expect(c.getByRole('status')).toHaveTextContent(
        'A lineup from the template is ready.',
      ),
    );
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const NoAlternatives: Story = { args: { actions: [] } };
