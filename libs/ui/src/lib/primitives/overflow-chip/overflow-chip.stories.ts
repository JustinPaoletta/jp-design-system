import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpOverflowChip } from './overflow-chip';
const meta: Meta<JpOverflowChip> = {
  title: 'Primitives/Data Display/Overflow Chip',
  component: JpOverflowChip,
  parameters: { layout: 'padded' },
  args: {
    label: 'Other players',
    items: [
      { id: 'ada', label: 'Alex Morgan', href: '#reviewer-ada' },
      { id: 'grace', label: 'Jordan Davis' },
      { id: 'linus', label: 'Maya Chen' },
    ],
  },
};
export default meta;
type Story = StoryObj<JpOverflowChip>;
export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const button = c.getByRole('button', {
      name: 'Show 3 more items: Other players',
    });
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(c.getByRole('link', { name: 'Alex Morgan' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await expect(c.getByRole('link', { name: 'Alex Morgan' })).toBeVisible();
  },
};
