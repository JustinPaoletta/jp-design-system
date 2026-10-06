import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpButton } from '../button/button';
import {
  addJpCalendarDays,
  buildJpCalendarLayout,
  isJpCalendarDate,
  type JpCalendarEvent,
} from './calendar-layout';

/** Native, chronological appointment controls with collision-aware day/week placement. */
@Component({
  selector: 'jp-scheduling-calendar',
  imports: [JpButton],
  templateUrl: './scheduling-calendar.html',
  styleUrl: './scheduling-calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpSchedulingCalendar {
  readonly messages = inject(JP_MESSAGES).calendar;
  readonly label = input.required<string>();
  /** Gregorian civil date, independent of the browser clock. */
  readonly date = model.required<string>();
  readonly events = input.required<readonly JpCalendarEvent[]>();
  /** Consumer-supplied civil date in the selected time zone. Empty hides Today. */
  readonly today = input('');
  readonly view = model<'day' | 'week'>('week');
  readonly layout = model<'schedule' | 'agenda'>('schedule');
  readonly timeZone = input('UTC');
  readonly locale = input('en-US');
  readonly weekStartsOn = input(1);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input('');
  readonly eventActivated = output<JpCalendarEvent>();
  readonly retry = output<void>();
  readonly calendar = computed(() =>
    buildJpCalendarLayout({
      date: this.date(),
      view: this.view(),
      events: this.events(),
      timeZone: this.timeZone(),
      locale: this.locale(),
      weekStartsOn: Number.isInteger(this.weekStartsOn())
        ? Math.max(0, Math.min(6, this.weekStartsOn()))
        : 1,
    }),
  );
  readonly rangeLabel = computed(() => {
    const days = this.calendar().days;
    if (!days.length) return this.date();
    return days.length === 1
      ? days[0].label
      : days[0].label + ' – ' + days[days.length - 1].label;
  });
  readonly eventCount = computed(
    () =>
      new Set(
        this.calendar().days.flatMap((day) => [
          ...day.allDay.map((event) => event.id),
          ...day.timed.map((item) => item.event.id),
        ]),
      ).size,
  );
  readonly allDaySize = computed(
    () =>
      Math.max(1, ...this.calendar().days.map((day) => day.allDay.length)) * 4,
  );
  /** Preserve a readable appointment width instead of compressing overlap labels. */
  readonly columns = computed(() =>
    this.view() === 'day'
      ? 'minmax(0, 1fr)'
      : this.calendar()
          .days.map(
            (day) =>
              `minmax(${Math.max(1, ...day.timed.map((item) => item.lanes)) * 12}rem, 1fr)`,
          )
          .join(' '),
  );
  readonly todayValid = computed(() => isJpCalendarDate(this.today()));
  navigate(direction: number): void {
    if (this.calendar().invalid) return;
    this.date.set(
      addJpCalendarDays(
        this.date(),
        direction * (this.view() === 'week' ? 7 : 1),
      ),
    );
  }
  goToday(): void {
    if (this.todayValid()) this.date.set(this.today());
  }
}
