import type { Meta, StoryObj } from '@storybook/angular';

import { JpKeyboardHint } from './keyboard-hint';

const meta: Meta<JpKeyboardHint> = {
  title: 'Primitives/Content/Keyboard Hint',
  component: JpKeyboardHint,
  parameters: { layout: 'padded' },
  args: { keys: ['Control', 'K'] },
};
export default meta;
type Story = StoryObj<JpKeyboardHint>;
export const Default: Story = {};
