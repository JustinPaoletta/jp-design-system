import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpSlider } from './slider';
const meta: Meta<JpSlider> = {
  title: 'Primitives/Controls/Slider',
  decorators: [
    moduleMetadata({ imports: [FormsModule] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 32rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpSlider,
  render: (args) => ({
    props: args,
    template: `<jp-slider [label]="label" [min]="min" [max]="max" [step]="step" [hint]="hint" [error]="error" [disabled]="disabled" [readonly]="readonly" [ngModel]="40" />`,
  }),
  parameters: { layout: 'padded' },
  args: {
    label: 'Replay volume',
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
export const Invalid: Story = {
  args: { error: 'Enter a volume from 0 to 100.' },
};
export const ExactValue: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const number = c.getByRole('spinbutton', { name: 'Replay volume' });
    await userEvent.clear(number);
    await userEvent.type(number, '37');
    await userEvent.tab();
    await expect(c.getByRole('slider', { name: 'Replay volume' })).toHaveValue(
      '35',
    );
    await expect(number).toHaveValue(35);
  },
};
