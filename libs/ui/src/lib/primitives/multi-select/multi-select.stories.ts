import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent, within } from 'storybook/test';
import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { JpMultiSelect } from './multi-select';

const meta: Meta<JpMultiSelect> = {
  title: 'Primitives/Controls/Multi Select',
  decorators: [
    moduleMetadata({ imports: [FormsModule] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 28rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpMultiSelect,
  parameters: { layout: 'padded' },
  args: {
    label: 'Players',
    options: [
      { value: 'ada', label: 'Shane Baz' },
      { value: 'grace', label: 'Yandy Díaz' },
      { value: 'blocked', label: 'Unavailable', disabled: true },
    ],
  },
};
export default meta;
type Story = StoryObj<JpMultiSelect>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: 'Select at least one player for the drill.' },
};
export const Loading: Story = { args: { loading: true } };

export const Selected: Story = {
  render: (args) => ({
    props: args,
    template: `<jp-multi-select [label]="label" [options]="options" [ngModel]="['ada', 'grace']" />`,
  }),
};
export const OpenOptions: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', { name: 'Players' }),
    );
    await expect(
      within(document.body).getByRole('listbox', { name: 'Players' }),
    ).toBeVisible();
  },
};
