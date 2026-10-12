import type { Meta, StoryObj } from '@storybook/angular';

import { JpList } from './list';

const meta: Meta<JpList> = {
  title: 'Primitives/Data Display/List',
  component: JpList,
  parameters: { layout: 'padded' },
  args: {
    items: [
      {
        id: 'a',
        title: 'Alex Morgan',
        description: 'Varsity',
        meta: 'Available',
      },
      {
        id: 'b',
        title: 'Jordan Davis',
        description: 'Varsity',
        meta: 'Day to day',
      },
    ],
  },
};
export default meta;
type Story = StoryObj<JpList>;
export const Default: Story = {};
