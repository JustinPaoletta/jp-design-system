import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  JpButton,
  JpCard,
  JpPageHeader,
  JpSchedulingCalendar,
  type JpCalendarEvent,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-scheduling-page',
  imports: [JpButton, JpCard, JpPageHeader, JpSchedulingCalendar],
  templateUrl: './scheduling.page.html',
  styleUrl: './scheduling.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingPage {
  readonly date = signal('2026-10-05');
  readonly view = signal<'day' | 'week'>('week');
  readonly zone = signal('America/New_York');
  readonly state = signal<'ready' | 'loading' | 'error'>('ready');
  readonly selected = signal<JpCalendarEvent | null>(null);
  readonly appointments: readonly JpCalendarEvent[] = [
    {
      id: 'planning',
      title: 'Product planning',
      start: '2026-10-05T09:00:00-04:00',
      end: '2026-10-05T10:30:00-04:00',
      description: 'Review the next release and assign owners.',
    },
    {
      id: 'review',
      title: 'Design review',
      start: '2026-10-05T09:30:00-04:00',
      end: '2026-10-05T11:00:00-04:00',
      description: 'Inspect component keyboard and pointer behavior.',
    },
    {
      id: 'handoff',
      title: 'Engineering handoff',
      start: '2026-10-05T10:00:00-04:00',
      end: '2026-10-05T10:45:00-04:00',
      description: 'Confirm API boundaries and acceptance criteria.',
    },
    {
      id: 'office',
      title: 'Office hours',
      start: '2026-10-06T13:00:00-04:00',
      end: '2026-10-06T14:00:00-04:00',
      description: 'Questions about adopting the design system.',
    },
    {
      id: 'release',
      title: 'Release window',
      allDay: true,
      start: '2026-10-07',
      end: '2026-10-09',
      description: 'Two all-day dates; the ending date is exclusive.',
    },
    {
      id: 'overnight',
      title: 'Overnight maintenance',
      start: '2026-10-08T23:30:00-04:00',
      end: '2026-10-09T01:00:00-04:00',
      description: 'Continues across midnight; each day shows its segment.',
    },
    {
      id: 'first-hour',
      title: 'Before the clock change',
      start: '2026-11-01T01:15:00-04:00',
      end: '2026-11-01T01:45:00-04:00',
      description: 'First occurrence of 01:15, UTC−04:00.',
    },
    {
      id: 'second-hour',
      title: 'After the clock change',
      start: '2026-11-01T01:15:00-05:00',
      end: '2026-11-01T01:45:00-05:00',
      description: 'Second occurrence of 01:15, UTC−05:00.',
    },
  ];
  readonly detail = computed(
    () =>
      this.selected()?.description ??
      'Activate an appointment to inspect its details.',
  );
  showDst(): void {
    this.date.set('2026-11-01');
    this.view.set('day');
    this.zone.set('America/New_York');
    this.state.set('ready');
  }
  reset(): void {
    this.date.set('2026-10-05');
    this.view.set('week');
    this.state.set('ready');
    this.selected.set(null);
  }
}
