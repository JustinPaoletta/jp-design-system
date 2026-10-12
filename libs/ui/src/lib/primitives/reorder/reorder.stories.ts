import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpReorder } from './reorder';
const meta: Meta<JpReorder> = {
  title: 'Primitives/Selection/Reorder',
  component: JpReorder,
  parameters: { layout: 'padded' },
  args: {
    id: 'story-priorities',
    label: 'Game priorities',
    items: [
      {
        id: 'audit',
        label: 'Inspect the field',
        description: 'Confirm keyboard and screen-reader behavior.',
      },
      { id: 'docs', label: 'Prepare the lineup' },
      { id: 'release', label: 'Prepare release notes' },
    ],
  },
};
export default meta;
type Story = StoryObj<JpReorder>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Empty: Story = { args: { items: [] } };
export const KeyboardAndCancel: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const handle = c.getByRole('button', {
      name: 'Reorder: Inspect the field',
    });
    await userEvent.click(handle);
    await userEvent.keyboard('{End}');
    await expect(c.getByRole('status')).toHaveTextContent('3 of 3');
    await userEvent.keyboard('{Escape}');
    await expect(c.getAllByRole('listitem')[0]).toHaveTextContent(
      'Inspect the field',
    );
    await userEvent.click(
      c.getByRole('button', { name: 'Move down: Inspect the field' }),
    );
    await expect(c.getAllByRole('listitem')[1]).toHaveTextContent(
      'Inspect the field',
    );
    await userEvent.click(handle);
    await userEvent.keyboard('{Home}{Enter}');
    await expect(c.getAllByRole('listitem')[0]).toHaveTextContent(
      'Inspect the field',
    );
    await expect(handle).toHaveFocus();
  },
};
