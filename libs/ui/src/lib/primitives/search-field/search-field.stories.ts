import type { Meta, StoryObj } from '@storybook/angular';

import { JpSearchField } from './search-field';

const meta: Meta<JpSearchField> = {
  title: 'Primitives/Controls/Search Field',
  component: JpSearchField,
  parameters: { layout: 'padded' },
  args: { label: 'Search projects', placeholder: 'Search by name' },
};
export default meta;
type Story = StoryObj<JpSearchField>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { error: 'This field needs attention' } };
