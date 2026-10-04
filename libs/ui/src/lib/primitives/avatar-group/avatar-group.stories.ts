import type { Meta, StoryObj } from '@storybook/angular';

import { JpAvatarGroup } from './avatar-group';

const meta: Meta<JpAvatarGroup> = {
  title: 'Primitives/Identity/Avatar Group',
  component: JpAvatarGroup,
  parameters: { layout: 'padded' },
  args: {
    label: 'Reviewers',
    people: [
      { id: 'a', name: 'Ada Lovelace' },
      { id: 'g', name: 'Grace Hopper' },
      { id: 'l', name: 'Linus Torvalds' },
    ],
    max: 2,
  },
};
export default meta;
type Story = StoryObj<JpAvatarGroup>;
export const Default: Story = {};
