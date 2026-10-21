import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { JpSearchField } from './search-field';

const meta: Meta<JpSearchField> = {
  title: 'Primitives/Controls/Search Field',
  decorators: [
    moduleMetadata({ imports: [FormsModule] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 28rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpSearchField,
  parameters: { layout: 'padded' },
  args: { label: 'Search clubs', placeholder: 'Search by name' },
};
export default meta;
type Story = StoryObj<JpSearchField>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: 'Enter at least two letters from the club name.' },
};

export const Populated: Story = {
  render: (args) => ({
    props: args,
    template: `<jp-search-field [label]="label" [ngModel]="'Dodgers'" />`,
  }),
};
