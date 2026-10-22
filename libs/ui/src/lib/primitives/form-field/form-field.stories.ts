import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { JpFormField } from './form-field';
import { JpInput } from '../input/input';
const meta: Meta<JpFormField> = {
  title: 'Primitives/Controls/Form Field',
  component: JpFormField,
  parameters: { layout: 'padded' },
  args: {
    controlId: 'example-field',
    label: 'Email',
    hint: 'Use the manager email address',
  },
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width: 32rem; width: 100%;">${story}</div>`,
    ),
    moduleMetadata({ imports: [JpInput] }),
  ],
  render: (args) => ({
    props: args,
    template: `<jp-form-field #field [controlId]="controlId" [label]="label" [hint]="hint" [error]="error"><jp-input [id]="controlId" type="email" placeholder="manager@rays.example" [invalid]="!!error" [ariaDescribedBy]="field.describedBy() || ''" /></jp-form-field>`,
  }),
};
export default meta;
type Story = StoryObj<JpFormField>;
export const Default: Story = {};
export const Invalid: Story = {
  args: { error: 'Enter a valid email address' },
};
