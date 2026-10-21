import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { JpPasswordField } from './password-field';

const meta: Meta<JpPasswordField> = {
  title: 'Primitives/Controls/Password Field',
  decorators: [
    moduleMetadata({ imports: [FormsModule] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 28rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpPasswordField,
  parameters: { layout: 'padded' },
  args: { label: 'Club password', autocomplete: 'current-password' },
};
export default meta;
type Story = StoryObj<JpPasswordField>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: 'Use at least 12 characters for the club password.' },
};

export const Populated: Story = {
  render: (args) => ({
    props: args,
    template: `<jp-password-field [label]="label" [ngModel]="'DodgersClub2024'" />`,
  }),
};
