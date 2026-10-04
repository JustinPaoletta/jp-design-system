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
        title: 'API gateway',
        description: 'Production',
        meta: 'Healthy',
      },
      { id: 'b', title: 'Worker', description: 'Staging', meta: 'Paused' },
    ],
  },
};
export default meta;
type Story = StoryObj<JpList>;
export const Default: Story = {};
