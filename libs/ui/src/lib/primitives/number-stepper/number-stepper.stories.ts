import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpNumberStepper } from './number-stepper';
const meta: Meta<JpNumberStepper> = {
  title: 'Primitives/Controls/Number Stepper',
  component: JpNumberStepper,
  parameters: { layout: 'padded' },
  args: {
    label: 'Players',
    min: 1,
    max: 5,
    step: 1,
    hint: 'Choose one to five players for this drill.',
  },
};
export default meta;
type Story = StoryObj<JpNumberStepper>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Readonly: Story = { args: { readonly: true } };
export const Invalid: Story = {
  args: { error: 'Choose an available player count' },
};
export const Increment: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Increase Players' }));
    await expect(c.getByRole('spinbutton', { name: 'Players' })).toHaveValue(1);
    await userEvent.click(c.getByRole('button', { name: 'Increase Players' }));
    await expect(c.getByRole('spinbutton', { name: 'Players' })).toHaveValue(2);
    await userEvent.click(c.getByRole('button', { name: 'Decrease Players' }));
    await expect(c.getByRole('spinbutton', { name: 'Players' })).toHaveValue(1);
  },
};
