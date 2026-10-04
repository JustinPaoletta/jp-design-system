import type { Meta, StoryObj } from '@storybook/angular';

import { JpSpinner } from './spinner';

const meta: Meta<JpSpinner> = {
  title: 'Primitives/Feedback/Spinner',
  component: JpSpinner,
  parameters: { layout: 'padded' },
  args: { label: 'Refreshing reports', size: 'lg' },
};
export default meta;
type Story = StoryObj<JpSpinner>;
export const Default: Story = {};
