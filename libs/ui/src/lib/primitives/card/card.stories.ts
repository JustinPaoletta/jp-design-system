import type { Meta, StoryObj } from '@storybook/angular';

import { JpCard } from './card';

const meta: Meta<JpCard> = {
  title: 'Primitives/Layout/Card',
  component: JpCard,
  parameters: { layout: 'padded' },
  args: { title: 'Club overview' },
  render: (args) => ({
    props: args,
    template: `<jp-card [title]="title"><p>The Falcons won 5–3 against the Bears. Review the starting lineup for the next game.</p><button jpCardActions type="button">Edit lineup</button></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpCard>;
export const Default: Story = {};
