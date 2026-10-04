import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { JpTimePicker } from './time-picker';
const meta: Meta<JpTimePicker> = {
  title: 'Primitives/Controls/Time Picker',
  component: JpTimePicker,
  parameters: { layout: 'padded' },
  args: {
    label: 'Time Picker',
    hint: 'Uses your browser’s locale and native picker',
    min: '09:00',
    max: '17:00',
    step: 900,
  },
};
export default meta;
type Story = StoryObj<JpTimePicker>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Time Picker'),
    ).toHaveAttribute('type', 'time');
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Readonly: Story = { args: { readonly: true } };
export const Invalid: Story = { args: { error: 'Choose a valid time.' } };
