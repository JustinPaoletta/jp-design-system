import type { Meta, StoryObj } from '@storybook/angular';

import { JpAvatar } from './avatar';

const meta: Meta<JpAvatar> = {
  title: 'Primitives/Identity/Avatar',
  component: JpAvatar,
  parameters: { layout: 'padded' },
  args: { name: 'Ada Lovelace' },
};
export default meta;
type Story = StoryObj<JpAvatar>;
export const Default: Story = {};
export const BrokenImage: Story = { args: { src: '/missing-avatar.png' } };
