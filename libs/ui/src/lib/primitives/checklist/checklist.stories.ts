import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpChecklist } from './checklist';
const meta: Meta<JpChecklist> = {
  title: 'Primitives/Controls/Checklist',
  component: JpChecklist,
  parameters: { layout: 'padded' },
  args: {
    label: 'Release checklist',
    items: [
      {
        id: 'quality',
        label: 'Quality checks',
        children: [
          { id: 'test', label: 'Run tests' },
          { id: 'a11y', label: 'Review accessibility' },
          { id: 'blocked', label: 'External approval', disabled: true },
        ],
      },
      {
        id: 'publish',
        label: 'Publish package',
        description: 'After all checks pass',
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
    await userEvent.click(c.getByRole('checkbox', { name: 'Quality checks' }));
    await expect(c.getByRole('checkbox', { name: 'Run tests' })).toBeChecked();
    await expect(
      c.getByRole('checkbox', { name: 'External approval' }),
    ).not.toBeChecked();
    await expect(c.getByRole('status')).toHaveTextContent('2 of 4 completed');
    await userEvent.click(c.getByRole('checkbox', { name: 'Run tests' }));
    await expect(c.getByRole('status')).toHaveTextContent('1 of 4 completed');
  },
};
