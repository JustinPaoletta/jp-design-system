import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpRangeSlider } from './range-slider';
const meta: Meta<JpRangeSlider> = {
  title: 'Primitives/Controls/Range Slider',
  component: JpRangeSlider,
  parameters: { layout: 'padded' },
  args: {
    label: 'Price range',
    min: 0,
    max: 100,
    step: 5,
    lowerLabel: 'From',
    upperLabel: 'To',
  },
};
export default meta;
type Story = StoryObj<JpRangeSlider>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { error: 'Check the range' } };
export const ExactEndpoints: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const from = c.getByRole('spinbutton', { name: 'From' });
    const to = c.getByRole('spinbutton', { name: 'To' });
    await userEvent.clear(from);
    await userEvent.type(from, '40');
    await userEvent.tab();
    await userEvent.clear(to);
    await userEvent.type(to, '20');
    await userEvent.tab();
    await expect(c.getByRole('slider', { name: 'From' })).toHaveValue('40');
    await expect(to).toHaveValue(40);
  },
};
