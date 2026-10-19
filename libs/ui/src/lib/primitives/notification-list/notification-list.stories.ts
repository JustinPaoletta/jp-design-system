import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpCard } from '../card/card';
import { JpNotificationList, type JpNotification } from './notification-list';
const meta: Meta<JpNotificationList> = {
  title: 'Primitives/Feedback/Notification List',
  component: JpNotificationList,
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [JpCard] })],
  args: {
    label: 'Club messages',
    items: [
      {
        id: 'one',
        title: 'Lineup review requested',
        description: 'Alex Morgan requested a review of the Falcons lineup.',
        group: 'Today',
        unread: true,
        timeLabel: '10:00 UTC',
        dateTime: '2026-10-04T10:00:00Z',
      },
      {
        id: 'two',
        title: 'Jordan Davis joined the club',
        description: 'Jordan accepted the invitation to the Riverton Falcons.',
        group: 'Earlier',
        unread: false,
      },
    ],
  },
  render: (args) => ({
    props: {
      ...args,
      changeRead: (
        items: readonly JpNotification[],
        change: { id: string; unread: boolean },
      ) =>
        items.map((item) =>
          item.id === change.id ? { ...item, unread: change.unread } : item,
        ),
      dismiss: (items: readonly JpNotification[], id: string) =>
        items.filter((item) => item.id !== id),
      markAll: (items: readonly JpNotification[]) =>
        items.map((item) => ({ ...item, unread: false })),
    },
    template: `<jp-card [title]="label" style="max-width:40rem"><jp-notification-list [label]="label" [items]="items" [loading]="loading" [error]="error" (readChange)="items=changeRead(items, $event)" (dismissRequested)="items=dismiss(items, $event)" (markAllRequested)="items=markAll(items)" (retryRequested)="error=''" /></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpNotificationList>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Mark as read: Lineup review requested',
      }),
    );
    await expect(
      canvas.getByRole('button', { name: 'Unread 0' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Mark as unread: Lineup review requested',
      }),
    );
    await expect(
      canvas.getByRole('button', { name: 'Unread 1' }),
    ).toBeVisible();
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
export const Empty: Story = { args: { items: [] } };
export const Loading: Story = { args: { loading: true } };
export const Failed: Story = {
  args: { error: 'Could not load notifications' },
};
