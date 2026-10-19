import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { JpTimePicker } from './time-picker';
const meta: Meta<JpTimePicker> = {
  title: 'Primitives/Controls/Time Picker',
  decorators: [
    moduleMetadata({ imports: [FormsModule] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 14rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpTimePicker,
  render: (args) => ({
    props: args,
    template: `<jp-time-picker [label]="label" [hint]="hint" [min]="min" [max]="max" [step]="step" [error]="error || ''" [disabled]="disabled" [readonly]="readonly" [ngModel]="'18:30'" />`,
  }),
  parameters: { layout: 'padded' },
  args: {
    label: 'First pitch',
    hint: 'Uses your browser’s locale and native picker',
    min: '09:00',
    max: '22:00',
    step: 900,
  },
};
export default meta;
type Story = StoryObj<JpTimePicker>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('First pitch'),
    ).toHaveAttribute('type', 'time');
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Readonly: Story = { args: { readonly: true } };
export const Invalid: Story = { args: { error: 'Choose a valid time.' } };
