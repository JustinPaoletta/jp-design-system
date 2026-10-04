import type { Meta, StoryObj } from '@storybook/angular';
import { JpTimeline } from './timeline';
const meta: Meta<JpTimeline> = {
  title: 'Primitives/Data Display/Timeline',
  component: JpTimeline,
  parameters: { layout: 'padded' },
  args: {
    label: 'Project activity',
    events: [
      {
        id: 'created',
        title: 'Project created',
        timeLabel: '4 October, 10:00 UTC',
        dateTime: '2026-10-04T10:00:00Z',
        description: 'Ada created the workspace.',
      },
      {
        id: 'review',
        title: 'Review completed',
        timeLabel: '4 October, 11:30 UTC',
        dateTime: '2026-10-04T11:30:00Z',
      },
      { id: 'deploy', title: 'Deployment started', timeLabel: 'Just now' },
    ],
  },
};
export default meta;
type Story = StoryObj<JpTimeline>;
export const Default: Story = {};
export const Empty: Story = { args: { events: [] } };
