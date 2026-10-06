import type { Meta, StoryObj } from '@storybook/angular';

import { JpPasswordField } from './password-field';

const meta: Meta<JpPasswordField> = {
  title: 'Primitives/Controls/Password Field',
  component: JpPasswordField,
  parameters: { layout: 'padded' },
  args: { label: 'Password', autocomplete: 'current-password' },
};
export default meta;
type Story = StoryObj<JpPasswordField>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { error: 'This field needs attention' } };
