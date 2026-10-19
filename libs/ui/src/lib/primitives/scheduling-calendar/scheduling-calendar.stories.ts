import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { JpSchedulingCalendar } from './scheduling-calendar';
const meta: Meta<JpSchedulingCalendar> = {
  title: 'Primitives/Data Display/Scheduling Calendar',
  component: JpSchedulingCalendar,
  parameters: { layout: 'padded' },
  args: {
    label: 'Team schedule',
    date: '2024-10-07',
    today: '2024-10-07',
    view: 'week',
    layout: 'schedule',
    timeZone: 'UTC',
    locale: 'en-US',
    loading: false,
    error: '',
    events: [
      {
        id: 'planning',
        title: 'Lineup meeting',
        start: '2024-10-07T09:00:00Z',
        end: '2024-10-07T10:30:00Z',
      },
      {
        id: 'review',
        title: 'Batting practice',
        start: '2024-10-07T09:30:00Z',
        end: '2024-10-07T11:00:00Z',
      },
      {
        id: 'release',
        title: 'Away series',
        start: '2024-10-08',
        end: '2024-10-10',
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
  args: { error: 'Club events are unavailable. Try again.' },
};
export const ClockChange: Story = {
  args: {
    date: '2024-11-03',
    view: 'day',
    timeZone: 'America/New_York',
    events: [
      {
        id: 'first',
        title: 'Early field check',
        start: '2024-11-03T01:15:00-04:00',
        end: '2024-11-03T01:45:00-04:00',
      },
      {
        id: 'second',
        title: 'Late field check',
        start: '2024-11-03T01:15:00-05:00',
        end: '2024-11-03T01:45:00-05:00',
      },
    ],
  },
};
export const Navigation: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Next' }));
    await expect(
      c.queryByRole('button', { name: /Lineup meeting,/ }),
    ).not.toBeInTheDocument();
    await userEvent.click(c.getByRole('button', { name: 'Today' }));
    await expect(
      c.getByRole('button', { name: /Lineup meeting,/ }),
    ).toBeVisible();
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

export const BusyAllDay: Story = {
  args: {
    view: 'day',
    events: [
      ...Array.from({ length: 11 }, (_, index) => ({
        id: 'squad-' + index,
        title: 'Dodgers layout ' + (index + 1),
        start: '2024-10-07',
        end: '2024-10-08',
        allDay: true,
      })),
      {
        id: 'practice',
        title:
          'Jack Flaherty, Freddie Freeman, Mookie Betts and Teoscar Hernández played the 2024 World Series',
        start: '2024-10-07T09:00:00Z',
        end: '2024-10-07T09:45:00Z',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const allDay = canvasElement.querySelector('.day .all-day') as HTMLElement;
    const frame = canvasElement.querySelector('.days') as HTMLElement;
    const timed = canvas.getByRole('button', { name: /Jack Flaherty.*,/ });
    const slot = timed.parentElement;
    if (!slot)
      throw new globalThis.Error('The timed appointment must have a slot.');
    const schedule = getComputedStyle(slot).position === 'absolute';
    if (schedule)
      await expect(allDay.clientHeight).toBeLessThan(frame.clientHeight / 2);
    const last = canvas.getByRole('button', { name: /Dodgers layout 11,/ });
    last.focus();
    if (schedule)
      await waitFor(() => expect(allDay.scrollTop).toBeGreaterThan(0));
    await expect(last).toHaveFocus();
    timed.focus();
    await expect(timed).toHaveFocus();
    const bounds = timed.getBoundingClientRect();
    const band = allDay.getBoundingClientRect();
    await expect(bounds.top).toBeGreaterThanOrEqual(band.bottom);
    await expect(bounds.bottom).toBeLessThanOrEqual(
      frame.getBoundingClientRect().bottom,
    );
    const title = timed.querySelector('strong') as HTMLElement;
    await userEvent.click(canvas.getByRole('button', { name: 'Agenda' }));
    await waitFor(() =>
      expect(getComputedStyle(title).webkitLineClamp).toBe('none'),
    );
    await expect(title.scrollHeight).toBeLessThanOrEqual(
      title.clientHeight + 1,
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Schedule' }));
    const host = canvasElement.querySelector(
      'jp-scheduling-calendar',
    ) as HTMLElement;
    host.style.width = '390px';
    await waitFor(() => expect(getComputedStyle(slot).position).toBe('static'));
    await expect(getComputedStyle(title).webkitLineClamp).toBe('none');
    await expect(title.scrollHeight).toBeLessThanOrEqual(
      title.clientHeight + 1,
    );
    host.style.width = '';
    await userEvent.click(canvas.getByRole('button', { name: 'Agenda' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Schedule' }));
  },
};

export const CrowdedWeek: Story = {
  args: {
    events: [
      ...(meta.args?.events ?? []),
      {
        id: 'pitching',
        title: 'Jack Flaherty started Game 5',
        start: '2024-10-07T10:00:00Z',
        end: '2024-10-07T10:45:00Z',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template:
      '<jp-scheduling-calendar style="width:1100px;max-width:100%" [label]="label" [date]="date" [today]="today" [events]="events" [view]="view" [layout]="layout" [timeZone]="timeZone" [locale]="locale" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvasElement.querySelector(
      'jp-scheduling-calendar',
    ) as HTMLElement;
    const frame = canvasElement.querySelector('.days') as HTMLElement;
    const appointment = canvas.getByRole('button', { name: /Lineup meeting,/ });
    const title = appointment.querySelector('strong') as HTMLElement;
    const time = appointment.querySelector('span') as HTMLElement;
    const days = Array.from(canvasElement.querySelectorAll('.day'));
    await waitFor(() => expect(frame).toHaveClass('overview'));
    if (host.clientWidth > 896) {
      await expect(days).toHaveLength(7);
      await expect(
        Math.max(...days.map((day) => day.clientWidth)) -
          Math.min(...days.map((day) => day.clientWidth)),
      ).toBeLessThanOrEqual(1);
    }
    await expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth + 1);
    for (const event of canvasElement.querySelectorAll('.timed .appointment')) {
      const text = event.querySelector('strong') as HTMLElement;
      await expect(getComputedStyle(text).webkitLineClamp).toBe('none');
      await expect(text.scrollHeight).toBeLessThanOrEqual(
        text.clientHeight + 1,
      );
      await expect(event.querySelector('span')).toBeVisible();
    }
    await expect(appointment.getAttribute('title')).toMatch(
      /Lineup meeting.*9:00.*10:30/,
    );
    appointment.focus();
    host.style.width = '900px';
    await expect(appointment).toHaveFocus();
    await expect(frame).toHaveClass('overview');
    host.style.width = '1100px';
    await userEvent.click(canvas.getByRole('button', { name: 'Day' }));
    await waitFor(() => expect(frame).not.toHaveClass('overview'));
    if (host.clientWidth > 896) {
      await expect(
        getComputedStyle(appointment.parentElement as HTMLElement).position,
      ).toBe('absolute');
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Week' }));
    await waitFor(() => expect(frame).toHaveClass('overview'));
    await userEvent.click(canvas.getByRole('button', { name: 'Agenda' }));
    await expect(getComputedStyle(title).whiteSpace).toBe('normal');
    await expect(getComputedStyle(time).display).not.toBe('none');
    host.dir = 'rtl';
    const isolatedTime = time.querySelector('bdi') as HTMLElement;
    await expect(getComputedStyle(isolatedTime).direction).toBe('ltr');
    await expect(getComputedStyle(isolatedTime).unicodeBidi).toBe('isolate');
    host.dir = '';
    await userEvent.click(canvas.getByRole('button', { name: 'Schedule' }));
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
