import type { Meta, StoryObj } from '@storybook/angular';

import { JpErrorSummary } from './error-summary';
import { moduleMetadata } from '@storybook/angular';
import { JpInput } from '../input/input';

const meta: Meta<JpErrorSummary> = {
  title: 'Primitives/Feedback/Error Summary',
  component: JpErrorSummary,
  decorators: [moduleMetadata({ imports: [JpInput] })],
  parameters: { layout: 'padded' },
  args: {
    errors: [
      { controlId: 'story-email', message: 'Enter a valid email address' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<div style="display:grid;gap:var(--jp-space-lg);max-width:32rem"><jp-error-summary [errors]="errors" /><jp-input id="story-email" label="Manager email" type="email" [invalid]="true" error="Enter a valid email address" /></div>`,
  }),
};
export default meta;
type Story = StoryObj<JpErrorSummary>;
export const Default: Story = {};
