import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpChecklist } from './checklist';
const meta: Meta<JpChecklist> = {
  title: 'Primitives/Controls/Checklist',
  component: JpChecklist,
  parameters: { layout: 'padded' },
  args: {
    label: 'Game checklist',
    items: [
      {
        id: 'quality',
        label: 'Game preparation',
        children: [
          { id: 'test', label: 'Check the lineup' },
          { id: 'a11y', label: 'Check the equipment' },
          { id: 'blocked', label: 'League approval', disabled: true },
        ],
      },
      {
        id: 'publish',
        label: 'Confirm the lineup',
        description: 'After the lineup check',
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
      c.getByRole('checkbox', { name: 'Game preparation' }),
    );
    await expect(
      c.getByRole('checkbox', { name: 'Check the lineup' }),
    ).toBeChecked();
    await expect(
      c.getByRole('checkbox', { name: 'League approval' }),
    ).not.toBeChecked();
    await expect(c.getByRole('status')).toHaveTextContent('2 of 4 completed');
    await userEvent.click(
      c.getByRole('checkbox', { name: 'Check the lineup' }),
    );
    await expect(c.getByRole('status')).toHaveTextContent('1 of 4 completed');
  },
};
