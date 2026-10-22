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
    label: 'Game 6 updates',
    items: [
      {
        id: 'one',
        title: 'Freddy Peralta starts Game 6',
        description: 'Kevin Cash started Freddy Peralta against the Guardians.',
        group: 'October 19',
        unread: true,
        timeLabel: '8:08 p.m.',
        dateTime: '2026-10-19T20:08:00-04:00',
      },
      {
        id: 'two',
        title: 'Baker closes Game 6',
        description:
          'Bryan Baker retired all three Cleveland batters in the ninth inning.',
        group: 'October 19',
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
        name: 'Mark as read: Freddy Peralta starts Game 6',
      }),
    );
    await expect(
      canvas.getByRole('button', { name: 'Unread 0' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Mark as unread: Freddy Peralta starts Game 6',
      }),
    );
    await expect(
      canvas.getByRole('button', { name: 'Unread 1' }),
    ).toBeVisible();
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
export const Empty: Story = { args: { items: [] } };
export const Loading: Story = { args: { loading: true, items: [] } };
export const Refreshing: Story = { args: { loading: true } };
export const Failed: Story = {
  args: { error: 'Game 6 updates could not be loaded. Try again.' },
};
