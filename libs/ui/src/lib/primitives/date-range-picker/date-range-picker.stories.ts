import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { JpDateRangePicker } from './date-range-picker';
const meta: Meta<JpDateRangePicker> = {
  title: 'Primitives/Controls/Date Range Picker',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width: 32rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpDateRangePicker,
  parameters: { layout: 'padded' },
  args: {
    label: 'Series dates',
    min: '2024-10-01',
    max: '2024-10-31',
    hint: 'Local calendar dates; start must be on or before end.',
  },
};
export default meta;
type Story = StoryObj<JpDateRangePicker>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('group', { name: 'Series dates' })).toBeVisible();
    await expect(c.getByLabelText('Start date')).toHaveAttribute(
      'type',
      'date',
    );
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Readonly: Story = { args: { readonly: true } };
export const Invalid: Story = {
  args: { error: 'Choose an ordered date range.' },
};
