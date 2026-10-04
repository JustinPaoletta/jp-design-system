import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpSchedulingCalendar } from './scheduling-calendar';
const meta: Meta<JpSchedulingCalendar> = {
  title: 'Primitives/Data Display/Scheduling Calendar',
  component: JpSchedulingCalendar,
  parameters: { layout: 'padded' },
  args: {
    label: 'Team schedule',
    date: '2026-10-05',
    today: '2026-10-05',
    view: 'week',
    layout: 'schedule',
    timeZone: 'UTC',
    locale: 'en-US',
    loading: false,
    error: '',
    events: [
      {
        id: 'planning',
        title: 'Planning',
        start: '2026-10-05T09:00:00Z',
        end: '2026-10-05T10:30:00Z',
      },
      {
        id: 'review',
        title: 'Design review',
        start: '2026-10-05T09:30:00Z',
        end: '2026-10-05T11:00:00Z',
      },
      {
        id: 'release',
        title: 'Release window',
        start: '2026-10-06',
        end: '2026-10-08',
        allDay: true,
      },
    ],
  },
  render: (args) => ({
    props: args,
    template:
      '<jp-scheduling-calendar [label]="label" [date]="date" [today]="today" [events]="events" [view]="view" [layout]="layout" [timeZone]="timeZone" [locale]="locale" [loading]="loading" [error]="error" />',
  }),
};
export default meta;
type Story = StoryObj<JpSchedulingCalendar>;
export const Default: Story = {};
export const Day: Story = { args: { view: 'day' } };
export const Agenda: Story = { args: { layout: 'agenda' } };
export const Empty: Story = {
  args: { events: [] },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const frame = c.getByRole('region', { name: /Schedule, Mon/ });
    await expect(frame).toHaveAttribute('tabindex', '0');
    c.getByRole('button', { name: 'Agenda' }).focus();
    await userEvent.tab();
    await expect(frame).toHaveFocus();
  },
};
export const Loading: Story = { args: { loading: true } };
export const Error: Story = {
  args: { error: 'Appointments unavailable. Try again.' },
};
export const ClockChange: Story = {
  args: {
    date: '2026-11-01',
    view: 'day',
    timeZone: 'America/New_York',
    events: [
      {
        id: 'first',
        title: 'First 1:15',
        start: '2026-11-01T01:15:00-04:00',
        end: '2026-11-01T01:45:00-04:00',
      },
      {
        id: 'second',
        title: 'Second 1:15',
        start: '2026-11-01T01:15:00-05:00',
        end: '2026-11-01T01:45:00-05:00',
      },
    ],
  },
};
export const Navigation: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Next' }));
    await expect(
      c.queryByRole('button', { name: /Planning,/ }),
    ).not.toBeInTheDocument();
    await userEvent.click(c.getByRole('button', { name: 'Today' }));
    await expect(c.getByRole('button', { name: /Planning,/ })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Day' }));
    await expect(c.getByRole('button', { name: 'Day' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvasElement.querySelectorAll('.day')).toHaveLength(1);
    await userEvent.click(c.getByRole('button', { name: 'Agenda' }));
    await expect(c.getByRole('button', { name: 'Agenda' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};
