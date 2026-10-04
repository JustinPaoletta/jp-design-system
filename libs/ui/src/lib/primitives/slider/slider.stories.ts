import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpSlider } from './slider';
const meta: Meta<JpSlider> = {
  title: 'Primitives/Controls/Slider',
  component: JpSlider,
  parameters: { layout: 'padded' },
  args: {
    label: 'Volume',
    min: 0,
    max: 100,
    step: 5,
    hint: 'Use the slider or enter an exact value',
  },
};
export default meta;
type Story = StoryObj<JpSlider>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Readonly: Story = { args: { readonly: true } };
export const Invalid: Story = { args: { error: 'Check the volume' } };
export const ExactValue: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const number = c.getByRole('spinbutton', { name: 'Volume' });
    await userEvent.clear(number);
    await userEvent.type(number, '37');
    await userEvent.tab();
    await expect(c.getByRole('slider', { name: 'Volume' })).toHaveValue('35');
    await expect(number).toHaveValue(35);
  },
};
