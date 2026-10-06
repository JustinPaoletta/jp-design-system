import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { JpDatePicker } from './date-picker';
const meta: Meta<JpDatePicker> = {
  title: 'Primitives/Controls/Date Picker',
  component: JpDatePicker,
  parameters: { layout: 'padded' },
  args: {
    label: 'Date Picker',
    hint: 'Uses your browser’s locale and native picker',
    min: '2026-10-01',
    max: '2026-10-31',
  },
};
export default meta;
type Story = StoryObj<JpDatePicker>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Date Picker'),
    ).toHaveAttribute('type', 'date');
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Readonly: Story = { args: { readonly: true } };
export const Invalid: Story = { args: { error: 'Choose a valid date.' } };
