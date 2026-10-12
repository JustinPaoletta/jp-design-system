import type { Meta, StoryObj } from '@storybook/angular';

import { JpDescriptionList } from './description-list';

const meta: Meta<JpDescriptionList> = {
  title: 'Primitives/Data Display/Description List',
  component: JpDescriptionList,
  parameters: { layout: 'padded' },
  args: {
    items: [
      { term: 'Coach', description: 'Alex Morgan' },
      { term: 'Position', description: 'Pitcher' },
      { term: 'Retries', description: 0 },
    ],
  },
};
export default meta;
type Story = StoryObj<JpDescriptionList>;
export const Default: Story = {};
