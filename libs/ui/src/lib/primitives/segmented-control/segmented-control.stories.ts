import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';

import { JpSegmentedControl } from './segmented-control';

const meta: Meta<JpSegmentedControl> = {
  title: 'Primitives/Controls/Segmented Control',
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  component: JpSegmentedControl,
  render: (args) => ({
    props: args,
    template: `<jp-segmented-control [label]="label" [options]="options" [disabled]="disabled" [error]="error" [ngModel]="'week'" />`,
  }),
  parameters: { layout: 'padded' },
  args: {
    label: 'Game schedule period',
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
};
export default meta;
type Story = StoryObj<JpSegmentedControl>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { error: 'Choose Day, Week or Month.' } };
