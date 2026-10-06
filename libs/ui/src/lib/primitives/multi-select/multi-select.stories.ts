import type { Meta, StoryObj } from '@storybook/angular';

import { JpMultiSelect } from './multi-select';

const meta: Meta<JpMultiSelect> = {
  title: 'Primitives/Controls/Multi Select',
  component: JpMultiSelect,
  parameters: { layout: 'padded' },
  args: {
    label: 'Reviewers',
    options: [
      { value: 'ada', label: 'Ada Lovelace' },
      { value: 'grace', label: 'Grace Hopper' },
      { value: 'blocked', label: 'Unavailable', disabled: true },
    ],
  },
};
export default meta;
type Story = StoryObj<JpMultiSelect>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { error: 'This field needs attention' } };
export const Loading: Story = { args: { loading: true } };
