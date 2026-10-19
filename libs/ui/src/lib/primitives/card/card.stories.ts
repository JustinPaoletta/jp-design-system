import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { JpButton } from '../button/button';

import { JpCard } from './card';

const meta: Meta<JpCard> = {
  title: 'Primitives/Layout/Card',
  component: JpCard,
  decorators: [moduleMetadata({ imports: [JpButton] })],
  parameters: { layout: 'padded' },
  args: { title: 'Club overview' },
  render: (args) => ({
    props: args,
    template: `<jp-card [title]="title"><p>The Falcons won 5–3 against the Bears. Review the starting lineup for the next game.</p><jp-button jpCardActions variant="secondary">Edit lineup</jp-button></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpCard>;
export const Default: Story = {};
