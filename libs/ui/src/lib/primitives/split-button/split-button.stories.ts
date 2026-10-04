import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpSplitButton } from './split-button';
const meta: Meta<JpSplitButton> = {
  title: 'Primitives/Controls/Split Button',
  component: JpSplitButton,
  args: {
    label: 'Create',
    actions: [
      { id: 'template', label: 'From template' },
      { id: 'archive', label: 'Archived template', disabled: true },
    ],
  },
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<JpSplitButton>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole('button', { name: 'More actions: Create' }),
    );
    await expect(
      c.getByRole('menuitem', { name: 'From template' }),
    ).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(
      c.getByRole('button', { name: 'More actions: Create' }),
    ).toHaveFocus();
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const NoAlternatives: Story = { args: { actions: [] } };
