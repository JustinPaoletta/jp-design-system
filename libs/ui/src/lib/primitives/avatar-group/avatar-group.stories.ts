import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';

import { JpAvatarGroup } from './avatar-group';

const meta: Meta<JpAvatarGroup> = {
  title: 'Primitives/Identity/Avatar Group',
  component: JpAvatarGroup,
  parameters: { layout: 'padded' },
  args: {
    label: 'Players',
    people: [
      { id: 'a', name: 'Alex Morgan' },
      { id: 'g', name: 'Jordan Davis' },
      { id: 'l', name: 'Maya Chen' },
    ],
    max: 2,
  },
};
export default meta;
type Story = StoryObj<JpAvatarGroup>;
export const Default: Story = {};

export const PhotoMembers: Story = {
  args: {
    people: [
      { id: 'a', name: 'Alex Morgan', src: '/example-photos/baseball-cap.jpg' },
      { id: 'g', name: 'Jordan Davis' },
      { id: 'l', name: 'Maya Chen' },
      { id: 's', name: 'Sam Rivera' },
      { id: 'r', name: 'Riley Brooks' },
    ],
    max: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Show 3 more items' });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('region', { name: 'Players' })).toHaveFocus();
    await expect(canvas.getByText('Maya Chen')).toBeVisible();
    await expect(canvas.getByText('Sam Rivera')).toBeVisible();
    await expect(canvas.getByText('Riley Brooks')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};
