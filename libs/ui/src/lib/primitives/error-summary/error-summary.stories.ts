import type { Meta, StoryObj } from '@storybook/angular';

import { JpErrorSummary } from './error-summary';

const meta: Meta<JpErrorSummary> = {
  title: 'Primitives/Feedback/Error Summary',
  component: JpErrorSummary,
  parameters: { layout: 'padded' },
  args: {
    errors: [
      { controlId: 'story-email', message: 'Enter a valid email address' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<jp-error-summary [errors]="errors" /><label for="story-email">Email</label><input id="story-email" type="email" aria-invalid="true" />`,
  }),
};
export default meta;
type Story = StoryObj<JpErrorSummary>;
export const Default: Story = {};
