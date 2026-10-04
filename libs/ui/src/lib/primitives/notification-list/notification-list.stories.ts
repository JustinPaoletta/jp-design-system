import type { Meta, StoryObj } from '@storybook/angular';
import { JpNotificationList } from './notification-list';
const meta: Meta<JpNotificationList> = {
  title: 'Primitives/Feedback/Notification List',
  component: JpNotificationList,
  parameters: { layout: 'padded' },
  args: {
    label: 'Project notifications',
    items: [
      {
        id: 'one',
        title: 'Review requested',
        description: 'Ada requested your feedback.',
        group: 'Today',
        unread: true,
        timeLabel: '10:00 UTC',
        dateTime: '2026-10-04T10:00:00Z',
      },
      { id: 'two', title: 'Invite accepted', group: 'Earlier', unread: false },
    ],
  },
};
export default meta;
type Story = StoryObj<JpNotificationList>;
export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
export const Loading: Story = { args: { loading: true } };
export const Failed: Story = {
  args: { error: 'Could not load notifications' },
};
