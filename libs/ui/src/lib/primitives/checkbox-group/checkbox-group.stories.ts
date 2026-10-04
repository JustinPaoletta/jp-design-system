import type { Meta, StoryObj } from '@storybook/angular';

import { JpCheckboxGroup } from './checkbox-group';

const meta: Meta<JpCheckboxGroup> = {
  title: 'Primitives/Controls/Checkbox Group',
  component: JpCheckboxGroup,
  parameters: { layout: 'padded' },
  args: {
    label: 'Notifications',
    options: [
      { value: 'email', label: 'Email' },
      { value: 'sms', label: 'SMS' },
      { value: 'push', label: 'Push', disabled: true },
    ],
  },
};
export default meta;
type Story = StoryObj<JpCheckboxGroup>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { error: 'This field needs attention' } };
