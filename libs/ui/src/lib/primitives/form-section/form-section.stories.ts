import { componentWrapperDecorator } from '@storybook/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { JpCheckbox } from '../checkbox/checkbox';

import { JpFormSection } from './form-section';

const meta: Meta<JpFormSection> = {
  title: 'Primitives/Controls/Form Section',
  component: JpFormSection,
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width: 32rem; width: 100%;">${story}</div>`,
    ),
    moduleMetadata({ imports: [JpCheckbox] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    legend: 'Club messages',
    hint: 'Choose how you receive game updates.',
  },
  render: (args) => ({
    props: args,
    template: `<jp-form-section [legend]="legend" [hint]="hint" [disabled]="disabled"><jp-checkbox [disabled]="disabled">Email game alerts</jp-checkbox></jp-form-section>`,
  }),
};
export default meta;
type Story = StoryObj<JpFormSection>;
export const Default: Story = {};
