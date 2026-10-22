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
  readonly date = signal('2026-10-19');
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
      title: 'Review Game 6 notes',
      start: '2026-10-19T09:00:00-04:00',
      end: '2026-10-19T10:30:00-04:00',
      description:
        'Review your notes about Tampa Bay’s 7–3 pennant-clinching win. Example reminder time.',
    },
    {
      id: 'review',
      title: 'Organize Game 6 photos',
      start: '2026-10-19T09:30:00-04:00',
      end: '2026-10-19T11:00:00-04:00',
      description:
        'Add captions and source credits to the Game 6 photographs. Example reminder time.',
    },
    {
      id: 'handoff',
      title: 'Read the pitching recap',
      start: '2026-10-19T10:00:00-04:00',
      end: '2026-10-19T10:45:00-04:00',
      description:
        'Read about Peralta’s 5⅓ innings and ALCS MVP award. Example reminder time.',
    },
    {
      id: 'office',
      title: 'Finish the game collection',
      start: '2026-10-20T13:00:00-04:00',
      end: '2026-10-20T14:00:00-04:00',
      description: 'Bring your Game 6 notes and photographs together.',
    },
    {
      id: 'release',
      title: 'Game 6 archive project',
      allDay: true,
      start: '2026-10-21',
      end: '2026-10-23',
      description:
        'A personal project to preserve Game 6. These are example project dates.',
    },
    {
      id: 'overnight',
      title: 'Late-night recap reading',
      start: '2026-10-22T23:30:00-04:00',
      end: '2026-10-23T01:00:00-04:00',
      description: 'Continues across midnight; each day shows its segment.',
    },
    {
      id: 'first-hour',
      title: 'First photo backup',
      start: '2026-11-01T01:15:00-04:00',
      end: '2026-11-01T01:45:00-04:00',
      description: 'First occurrence of 01:15, UTC−04:00.',
    },
    {
      id: 'second-hour',
      title: 'Second photo backup',
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
    this.date.set('2026-10-19');
    this.view.set('week');
    this.state.set('ready');
    this.selected.set(null);
  }
}
