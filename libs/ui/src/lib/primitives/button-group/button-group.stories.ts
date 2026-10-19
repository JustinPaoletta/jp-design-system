import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { JpButton } from '../button/button';
import { JpButtonGroup } from './button-group';
const meta: Meta<JpButtonGroup> = {
  title: 'Primitives/Controls/Button Group',
  component: JpButtonGroup,
  decorators: [moduleMetadata({ imports: [JpButton] })],
  args: { label: 'Lineup actions', orientation: 'horizontal' },
  parameters: { layout: 'padded' },
  render: (args) => ({
    props: args,
    template:
      '<jp-button-group [label]="label" [orientation]="orientation"><jp-button>Save lineup</jp-button><jp-button variant="secondary">Cancel</jp-button></jp-button-group>',
  }),
};
export default meta;
type Story = StoryObj<JpButtonGroup>;
export const Default: Story = {};
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width: 18rem">${story}</div>`,
    ),
  ],
};
