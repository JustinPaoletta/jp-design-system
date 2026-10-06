import type { Meta, StoryObj } from '@storybook/angular';
import { JpButtonGroup } from './button-group';
const meta: Meta<JpButtonGroup> = {
  title: 'Primitives/Controls/Button Group',
  component: JpButtonGroup,
  args: { label: 'Document actions', orientation: 'horizontal' },
  parameters: { layout: 'padded' },
  render: (args) => ({
    props: args,
    template:
      '<jp-button-group [label]="label" [orientation]="orientation"><button type="button">Save</button><button type="button">Cancel</button></jp-button-group>',
  }),
};
export default meta;
type Story = StoryObj<JpButtonGroup>;
export const Default: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
