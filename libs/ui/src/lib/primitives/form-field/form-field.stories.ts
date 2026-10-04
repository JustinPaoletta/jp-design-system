import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { JpFormField } from './form-field';
import { JpFieldControl } from './form-field';
const meta: Meta<JpFormField> = {
  title: 'Primitives/Controls/Form Field',
  component: JpFormField,
  parameters: { layout: 'padded' },
  args: {
    controlId: 'example-field',
    label: 'Email',
    hint: 'Use your work address',
  },
  decorators: [moduleMetadata({ imports: [JpFieldControl] })],
  render: (args) => ({
    props: args,
    template: `<jp-form-field [controlId]="controlId" [label]="label" [hint]="hint" [error]="error"><input jpFieldControl type="email" /></jp-form-field>`,
  }),
};
export default meta;
type Story = StoryObj<JpFormField>;
export const Default: Story = {};
export const Invalid: Story = {
  args: { error: 'Enter a valid email address' },
};
