import type { Meta, StoryObj } from '@storybook/angular';

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
