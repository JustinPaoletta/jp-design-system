import type { Meta, StoryObj } from '@storybook/angular';

import { JpFormSection } from './form-section';

const meta: Meta<JpFormSection> = {
  title: 'Primitives/Controls/Form Section',
  component: JpFormSection,
  parameters: { layout: 'padded' },
  args: { legend: 'Delivery settings', hint: 'Choose destinations' },
  render: (args) => ({
    props: args,
    template: `<jp-form-section [legend]="legend" [hint]="hint" [disabled]="disabled"><label><input type="checkbox" /> Email notifications</label></jp-form-section>`,
  }),
};
export default meta;
type Story = StoryObj<JpFormSection>;
export const Default: Story = {};
