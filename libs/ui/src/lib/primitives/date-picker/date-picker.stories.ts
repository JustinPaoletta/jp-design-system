import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { JpDatePicker } from './date-picker';
const meta: Meta<JpDatePicker> = {
  title: 'Primitives/Controls/Date Picker',
  decorators: [
    moduleMetadata({ imports: [FormsModule] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 14rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpDatePicker,
  render: (args) => ({
    props: args,
    template: `<jp-date-picker [label]="label" [hint]="hint" [min]="min" [max]="max" [step]="step" [error]="error || ''" [disabled]="disabled" [readonly]="readonly" [ngModel]="'2024-10-30'" />`,
  }),
  parameters: { layout: 'padded' },
  args: {
    label: 'Game date',
    hint: 'Uses your browser’s locale and native picker',
    min: '2024-10-01',
    max: '2024-10-31',
  },
};
export default meta;
type Story = StoryObj<JpDatePicker>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Game date'),
    ).toHaveAttribute('type', 'date');
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Readonly: Story = { args: { readonly: true } };
export const Invalid: Story = { args: { error: 'Choose a valid date.' } };
