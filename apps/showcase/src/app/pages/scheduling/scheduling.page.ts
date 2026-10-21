import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  JpButton,
  JpCard,
  JpPageHeader,
  JpSchedulingCalendar,
  JpSelect,
  type JpCalendarEvent,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-scheduling-page',
  imports: [
    FormsModule,
    JpButton,
    JpCard,
    JpPageHeader,
    JpSchedulingCalendar,
    JpSelect,
  ],
  templateUrl: './scheduling.page.html',
  styleUrl: './scheduling.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingPage {
  readonly date = signal('2024-10-07');
  readonly view = signal<'day' | 'week'>('week');
  readonly zone = signal('America/New_York');
  readonly zones = [
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/London', label: 'Europe/London' },
  ];
  readonly state = signal<'ready' | 'loading' | 'error'>('ready');
  readonly selected = signal<JpCalendarEvent | null>(null);
  readonly appointments: readonly JpCalendarEvent[] = [
    {
      id: 'planning',
      title: 'Lineup meeting',
      start: '2024-10-07T09:00:00-04:00',
      end: '2024-10-07T10:30:00-04:00',
      description:
        'Dave Roberts managed the 2024 Dodgers. This sample overlaps the next appointment.',
    },
    {
      id: 'review',
      title: 'Batting practice',
      start: '2024-10-07T09:30:00-04:00',
      end: '2024-10-07T11:00:00-04:00',
      description:
        'Freddie Freeman was day to day on October 7, 2024. This sample overlaps the lineup meeting.',
    },
    {
      id: 'handoff',
      title: 'Pitching practice',
      start: '2024-10-07T10:00:00-04:00',
      end: '2024-10-07T10:45:00-04:00',
      description:
        'Jack Flaherty started World Series Game 5 on October 30, 2024.',
    },
    {
      id: 'office',
      title: 'Meet the coaches',
      start: '2024-10-08T13:00:00-04:00',
      end: '2024-10-08T14:00:00-04:00',
      description: 'The Dodgers coaching staff reported to Dave Roberts.',
    },
    {
      id: 'release',
      title: 'Away series',
      allDay: true,
      start: '2024-10-09',
      end: '2024-10-11',
      description:
        'The ending date is exclusive. World Series Game 5 was October 30, 2024.',
    },
    {
      id: 'overnight',
      title: 'Overnight field preparation',
      start: '2024-10-10T23:30:00-04:00',
      end: '2024-10-11T01:00:00-04:00',
      description: 'Continues across midnight; each day shows its segment.',
    },
    {
      id: 'first-hour',
      title: 'Early field check',
      start: '2024-11-03T01:15:00-04:00',
      end: '2024-11-03T01:45:00-04:00',
      description: 'First occurrence of 01:15, UTC−04:00.',
    },
    {
      id: 'second-hour',
      title: 'Late field check',
      start: '2024-11-03T01:15:00-05:00',
      end: '2024-11-03T01:45:00-05:00',
      description: 'Second occurrence of 01:15, UTC−05:00.',
    },
  ];
  readonly detail = computed(
    () =>
      this.selected()?.description ??
      'Activate an appointment to inspect its details.',
  );
  showDst(): void {
    this.date.set('2024-11-03');
    this.view.set('day');
    this.zone.set('America/New_York');
    this.state.set('ready');
  }
  reset(): void {
    this.date.set('2024-10-07');
    this.view.set('week');
    this.state.set('ready');
    this.selected.set(null);
  }
}
