import type { Meta, StoryObj } from '@storybook/angular';

import { JpCard } from './card';

const meta: Meta<JpCard> = {
  title: 'Primitives/Layout/Card',
  component: JpCard,
  parameters: { layout: 'padded' },
  args: { title: 'Project overview' },
  render: (args) => ({
    props: args,
    template: `<jp-card [title]="title"><p>A structured panel with an independent heading and actions.</p><button jpCardActions type="button">Edit project</button></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpCard>;
export const Default: Story = {};
