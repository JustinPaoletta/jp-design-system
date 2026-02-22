import type { Meta, StoryObj } from '@storybook/angular';
import { Ui } from './ui';
import { expect } from 'storybook/test';

const meta: Meta<Ui> = {
  component: Ui,
  title: 'Ui',
};
export default meta;

type Story = StoryObj<Ui>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/ui/gi)).toBeTruthy();
  },
};
