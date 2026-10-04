import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { JpDateRangePicker } from './date-range-picker';
const meta: Meta<JpDateRangePicker> = {
  title: 'Primitives/Controls/Date Range Picker',
  component: JpDateRangePicker,
  parameters: { layout: 'padded' },
  args: {
    label: 'Event dates',
    min: '2026-10-01',
    max: '2026-10-31',
    hint: 'Local calendar dates; start must be on or before end.',
  },
};
export default meta;
type Story = StoryObj<JpDateRangePicker>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('group', { name: 'Event dates' })).toBeVisible();
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
