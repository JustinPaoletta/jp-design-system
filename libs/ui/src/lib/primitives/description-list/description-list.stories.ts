import type { Meta, StoryObj } from '@storybook/angular';

import { JpDescriptionList } from './description-list';

const meta: Meta<JpDescriptionList> = {
  title: 'Primitives/Data Display/Description List',
  component: JpDescriptionList,
  parameters: { layout: 'padded' },
  args: {
    items: [
      { term: 'Owner', description: 'Ada Lovelace' },
      { term: 'Region', description: 'us-east-1' },
      { term: 'Retries', description: 0 },
    ],
  },
};
export default meta;
type Story = StoryObj<JpDescriptionList>;
export const Default: Story = {};
