import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpChecklist } from './checklist';
const meta: Meta<JpChecklist> = {
  title: 'Primitives/Controls/Checklist',
  component: JpChecklist,
  parameters: { layout: 'padded' },
  args: {
    label: 'Game 6 checklist',
    items: [
      {
        id: 'quality',
        label: 'Game 6 collection',
        children: [
          { id: 'test', label: 'Read the box score' },
          { id: 'a11y', label: 'Add photo credits' },
          { id: 'blocked', label: 'Publish collection', disabled: true },
        ],
      },
      {
        id: 'publish',
        label: 'Save the game recap',
        description: 'After you review the box score',
      },
    ],
  },
};
export default meta;
type Story = StoryObj<JpChecklist>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Empty: Story = { args: { items: [] } };
export const NestedCompletion: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole('checkbox', { name: 'Game 6 collection' }),
    );
    await expect(
      c.getByRole('checkbox', { name: 'Read the box score' }),
    ).toBeChecked();
    await expect(
      c.getByRole('checkbox', { name: 'Publish collection' }),
    ).not.toBeChecked();
    await expect(c.getByRole('status')).toHaveTextContent('2 of 4 completed');
    await userEvent.click(
      c.getByRole('checkbox', { name: 'Read the box score' }),
    );
    await expect(c.getByRole('status')).toHaveTextContent('1 of 4 completed');
  },
};
