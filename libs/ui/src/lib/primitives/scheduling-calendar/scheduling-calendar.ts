import {
  afterNextRender,
  afterRenderEffect,
  DestroyRef,
  ElementRef,
  viewChild,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpButton } from '../button/button';
import {
  addJpCalendarDays,
  buildJpCalendarLayout,
  buildJpCalendarGrid,
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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly availableWidth = signal(0);
  private readonly rootFontSize = signal(16);
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
  readonly allDaySize = computed(() =>
    Math.min(
      12,
      Math.max(0, ...this.calendar().days.map((day) => day.allDay.length)) * 4,
    ),
  );
  readonly grid = computed(() =>
    buildJpCalendarGrid(this.calendar(), this.timeZone(), this.locale()),
  );
  readonly scheduleOverview = computed(() => {
    if (this.layout() !== 'schedule') return false;
    const days = this.grid().days;
    const lanes = Math.max(
      1,
      ...days.flatMap((day) => day.timed.map((item) => item.lanes)),
    );
    const width = this.availableWidth();
    const rem = this.rootFontSize();
    return (
      width > 0 &&
      lanes > 1 &&
      (width - 5.5 * rem) / days.length / lanes < 7 * rem
    );
  });
  readonly columns = computed(
    () =>
      (this.scheduleOverview() ? '' : '5.5rem ') +
      'repeat(' +
      this.calendar().days.length +
      ', minmax(0, 1fr))',
  );
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private positionedFrame: HTMLElement | undefined;
  private positionedKey = '';
  constructor() {
    afterNextRender(() => {
      const host = this.host.nativeElement;
      const win = host.ownerDocument.defaultView;
      if (!win) return;
      const measure = () => {
        this.availableWidth.set(host.clientWidth);
        this.rootFontSize.set(
          parseFloat(
            win.getComputedStyle(host.ownerDocument.documentElement).fontSize,
          ) || 16,
        );
      };
      measure();
      const observer = win.ResizeObserver
        ? new win.ResizeObserver(measure)
        : undefined;
      observer?.observe(host);
      this.destroyRef.onDestroy(() => observer?.disconnect());
    });
    afterRenderEffect(() => {
      const frame = this.viewport()?.nativeElement;
      const key = [
        this.date(),
        this.view(),
        this.layout(),
        this.timeZone(),
        this.scheduleOverview(),
      ].join('|');
      const minute = this.grid().initialMinute;
      if (
        !frame ||
        (this.positionedFrame === frame && this.positionedKey === key)
      )
        return;
      this.positionedFrame = frame;
      this.positionedKey = key;
      const win = frame.ownerDocument.defaultView;
      if (
        this.layout() === 'schedule' &&
        win &&
        frame.scrollHeight > frame.clientHeight
      ) {
        const rem =
          parseFloat(
            win.getComputedStyle(frame.ownerDocument.documentElement).fontSize,
          ) || 16;
        frame.scrollTop = (minute / 15) * rem;
        const active = frame.ownerDocument.activeElement as HTMLElement | null;
        if (
          active &&
          frame.contains(active) &&
          active.classList.contains('appointment')
        )
          active.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      }
    });
  }
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
