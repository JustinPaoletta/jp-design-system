import { TestBed } from '@angular/core/testing';
import { provideJpMessages } from '../../i18n';
import { JpSchedulingCalendar } from './scheduling-calendar';
import type { JpCalendarEvent } from './calendar-layout';
const events: JpCalendarEvent[] = [
  {
    id: 'one',
    title: 'Review',
    start: '2026-10-05T09:00:00Z',
    end: '2026-10-05T10:00:00Z',
  },
  {
    id: 'day',
    title: 'Release',
    allDay: true,
    start: '2026-10-05',
    end: '2026-10-07',
  },
];
function create(width = 0) {
  const f = TestBed.createComponent(JpSchedulingCalendar);
  f.componentRef.setInput('date', '2026-10-05');
  f.componentRef.setInput('today', '2026-10-05');
  f.componentRef.setInput('label', 'Schedule');
  f.componentRef.setInput('events', events);
  Object.defineProperty(f.nativeElement, 'clientWidth', {
    configurable: true,
    value: width,
  });
  f.detectChanges();
  return f;
}
function button(root: HTMLElement, text: string) {
  return Array.from(root.querySelectorAll('button')).find(
    (el) => el.textContent?.trim() === text,
  ) as HTMLButtonElement;
}
describe('JpSchedulingCalendar', () => {
  it('shows the themed full event label on focus and dismisses it without moving focus', () => {
    const f = create(2000);
    const control = f.nativeElement.querySelector(
      '.timed button',
    ) as HTMLButtonElement;
    expect(control.hasAttribute('title')).toBe(false);
    control.focus();
    f.detectChanges();
    const tooltip = f.nativeElement.querySelector(
      '[role="tooltip"]',
    ) as HTMLElement;
    expect(tooltip.textContent).toContain('Review');
    expect(tooltip.textContent).toContain('9:00');
    expect(control.getAttribute('aria-describedby')).toContain(tooltip.id);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role="tooltip"]')).toBeNull();
    expect(control.getAttribute('aria-describedby')).toBeNull();
    expect(document.activeElement).toBe(control);
  });
  it('uses readable week rows for narrow overlaps and preserves focus when width changes', () => {
    const originalObserver = globalThis.ResizeObserver;
    const observers = new Map<
      Element,
      {
        measure: () => void;
        disconnect: ReturnType<typeof jest.fn>;
      }
    >();
    globalThis.ResizeObserver = jest
      .fn()
      .mockImplementation((callback: () => void) => {
        const disconnect = jest.fn();
        return {
          observe: jest.fn((target: HTMLElement) => {
            observers.set(target, { measure: callback, disconnect });
          }),
          disconnect,
        };
      });
    try {
      const f = create(1100);
      const calendarObserver = observers.get(f.nativeElement);
      if (!calendarObserver) throw new Error('Calendar must observe its host.');
      const { measure, disconnect } = calendarObserver;
      f.componentRef.setInput('events', [
        events[0],
        { ...events[0], id: 'two', title: 'Pitching practice' },
      ]);
      f.detectChanges();
      expect(f.componentInstance.scheduleOverview()).toBe(true);
      const first = f.nativeElement.querySelector(
        '.timed button',
      ) as HTMLButtonElement;
      first.focus();
      Object.defineProperty(f.nativeElement, 'clientWidth', {
        configurable: true,
        value: 2000,
      });
      measure();
      f.detectChanges();
      expect(f.componentInstance.scheduleOverview()).toBe(false);
      expect(f.nativeElement.querySelector('.timed button')).toBe(first);
      expect(document.activeElement).toBe(first);
      Object.defineProperty(f.nativeElement, 'clientWidth', {
        configurable: true,
        value: 1100,
      });
      measure();
      f.detectChanges();
      expect(f.componentInstance.scheduleOverview()).toBe(true);
      f.componentRef.setInput('view', 'day');
      f.detectChanges();
      expect(f.componentInstance.scheduleOverview()).toBe(false);
      f.destroy();
      expect(disconnect).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.ResizeObserver = originalObserver;
    }
  });
  it('keeps dense Day view readable while ordinary Day view retains its grid', () => {
    const f = create(1100);
    f.componentRef.setInput('view', 'day');
    f.componentRef.setInput(
      'events',
      Array.from({ length: 10 }, (_, index) => ({
        ...events[0],
        id: 'practice-' + index,
        title: 'Squad ' + (index + 1) + ' practice',
      })),
    );
    f.detectChanges();
    expect(f.componentInstance.scheduleOverview()).toBe(true);
    expect(f.componentInstance.columns()).toBe('repeat(1, minmax(0, 1fr))');
    expect(f.nativeElement.querySelectorAll('.timed button')).toHaveLength(10);
    f.componentRef.setInput('events', [events[0]]);
    f.detectChanges();
    expect(f.componentInstance.scheduleOverview()).toBe(false);
  });
  it('retains repeated-hour order, offsets, and activation in a crowded week overview', () => {
    const f = create(1100);
    const repeated = [
      {
        id: 'early',
        title: 'Early field check',
        start: '2026-11-01T01:15:00-04:00',
        end: '2026-11-01T01:45:00-04:00',
      },
      {
        id: 'overlap',
        title: 'Grounds meeting',
        start: '2026-11-01T01:20:00-04:00',
        end: '2026-11-01T01:40:00-04:00',
      },
      {
        id: 'late',
        title: 'Late field check',
        start: '2026-11-01T01:15:00-05:00',
        end: '2026-11-01T01:45:00-05:00',
      },
    ];
    f.componentRef.setInput('date', '2026-11-01');
    f.componentRef.setInput('timeZone', 'America/New_York');
    f.componentRef.setInput('events', repeated);
    f.detectChanges();
    expect(f.componentInstance.scheduleOverview()).toBe(true);
    const buttons = [
      ...f.nativeElement.querySelectorAll('.timed button'),
    ] as HTMLButtonElement[];
    expect(
      buttons.map((button) => button.querySelector('strong')?.textContent),
    ).toEqual(repeated.map((event) => event.title));
    expect(buttons[0].getAttribute('aria-label')).toContain('GMT-4');
    expect(buttons[2].getAttribute('aria-label')).toContain('GMT-5');
    const activated = jest.fn();
    f.componentInstance.eventActivated.subscribe(activated);
    buttons[2].click();
    expect(activated).toHaveBeenCalledWith(repeated[2]);
  });
  it('caps the shared all-day band while retaining every appointment control', () => {
    const f = create();
    f.componentRef.setInput('events', [
      events[0],
      ...Array.from({ length: 11 }, (_, index) => ({
        id: 'all-' + index,
        title: 'Away series ' + index,
        start: '2026-10-05',
        end: '2026-10-06',
        allDay: true,
      })),
    ]);
    f.detectChanges();
    expect(f.componentInstance.allDaySize()).toBe(12);
    expect(
      f.nativeElement.querySelectorAll('.day .all-day button'),
    ).toHaveLength(11);
    expect(
      f.nativeElement.querySelector('.timed button').getAttribute('aria-label'),
    ).toContain('Review');
  });
  it('renders chronological native activation buttons, all-day segments and unique event counts', () => {
    const f = create();
    const activated = jest.fn();
    f.componentInstance.eventActivated.subscribe(activated);
    expect(f.nativeElement.querySelectorAll('.day')).toHaveLength(7);
    expect(f.nativeElement.querySelectorAll('.all-day button')).toHaveLength(2);
    expect(f.componentInstance.eventCount()).toBe(2);
    expect(f.componentInstance.columns()).toBe(
      '5.5rem repeat(7, minmax(0, 1fr))',
    );
    const review = f.nativeElement.querySelector(
      '.timed button',
    ) as HTMLButtonElement;
    expect(review.getAttribute('aria-label')).toContain('Review, Mon, Oct 5');
    review.click();
    expect(activated).toHaveBeenCalledWith(events[0]);
    expect(f.nativeElement.querySelector('[role="grid"]')).toBeNull();
  });
  it('navigates dates and switches day/week and schedule/agenda models without reading the clock', () => {
    const f = create();
    const component = f.componentInstance;
    const changed = jest.fn();
    component.date.subscribe(changed);
    button(f.nativeElement, 'Next').click();
    f.detectChanges();
    expect(component.date()).toBe('2026-10-12');
    button(f.nativeElement, 'Previous').click();
    f.detectChanges();
    expect(component.date()).toBe('2026-10-05');
    button(f.nativeElement, 'Day').click();
    f.detectChanges();
    expect(f.nativeElement.querySelectorAll('.day')).toHaveLength(1);
    expect(component.columns()).toBe('5.5rem repeat(1, minmax(0, 1fr))');
    button(f.nativeElement, 'Previous').click();
    f.detectChanges();
    expect(component.date()).toBe('2026-10-04');
    button(f.nativeElement, 'Today').click();
    f.detectChanges();
    expect(component.date()).toBe('2026-10-05');
    button(f.nativeElement, 'Agenda').click();
    f.detectChanges();
    expect(
      f.nativeElement.querySelector('.days').classList.contains('agenda'),
    ).toBe(true);
    button(f.nativeElement, 'Schedule').click();
    f.detectChanges();
    button(f.nativeElement, 'Week').click();
    f.detectChanges();
    expect(component.layout()).toBe('schedule');
    expect(component.view()).toBe('week');
    expect(changed).toHaveBeenCalledWith('2026-10-12');
  });
  it('renders loading/error/retry/empty and invalid-input states while keeping controls usable', () => {
    const f = create();
    const retry = jest.fn();
    f.componentInstance.retry.subscribe(retry);
    const viewport = f.nativeElement.querySelector('.days');
    const appointments = [...f.nativeElement.querySelectorAll('.appointment')];
    f.componentRef.setInput('loading', true);
    f.detectChanges();
    expect(
      f.nativeElement.querySelector('section').getAttribute('aria-busy'),
    ).toBe('true');
    expect(f.nativeElement.textContent).toContain('Loading appointments');
    expect(f.nativeElement.querySelector('.days')).toBe(viewport);
    expect([...f.nativeElement.querySelectorAll('.appointment')]).toEqual(
      appointments,
    );
    expect(appointments.every((button) => button.disabled)).toBe(true);
    f.componentRef.setInput('loading', false);
    f.componentRef.setInput('error', 'Network unavailable');
    f.detectChanges();
    expect(
      f.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain('Network unavailable');
    button(f.nativeElement, 'Retry').click();
    expect(retry).toHaveBeenCalledTimes(1);
    f.componentRef.setInput('error', '');
    f.componentRef.setInput('events', []);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('No appointments');
    const scrollFrame = f.nativeElement.querySelector('.days') as HTMLElement;
    expect(scrollFrame.getAttribute('role')).toBe('region');
    expect(scrollFrame.tabIndex).toBe(0);
    expect(scrollFrame.getAttribute('aria-label')).toContain('Schedule, Mon');
    scrollFrame.focus();
    expect(document.activeElement).toBe(scrollFrame);
    f.componentRef.setInput('date', 'bad');
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(button(f.nativeElement, 'Next').disabled).toBe(true);
    f.componentInstance.navigate(1);
    expect(f.componentInstance.date()).toBe('bad');
    f.componentRef.setInput('today', '');
    f.detectChanges();
    f.componentInstance.goToday();
    expect(f.componentInstance.date()).toBe('bad');
    expect(button(f.nativeElement, 'Today')).toBeUndefined();
  });
  it('localizes generated copy and reports rejected events without crashing', () => {
    TestBed.configureTestingModule({
      providers: [
        provideJpMessages({
          calendar: {
            day: 'Tag',
            week: 'Woche',
            empty: 'Keine Termine',
            invalidEvents: (count) => `${count} ungültig`,
          },
        }),
      ],
    });
    const f = create();
    f.componentRef.setInput('events', [
      { id: 'bad', title: 'Bad', start: 'ambiguous', end: 'invalid' },
    ]);
    f.componentRef.setInput('locale', 'de-DE');
    f.componentRef.setInput('weekStartsOn', NaN);
    f.detectChanges();
    expect(button(f.nativeElement, 'Tag')).toBeTruthy();
    expect(f.nativeElement.textContent).toContain('Keine Termine');
    expect(f.nativeElement.textContent).toContain('1 ungültig');
    expect(f.componentInstance.rangeLabel()).toContain('Okt');
    expect(f.componentInstance.allDaySize()).toBe(0);
    f.componentRef.setInput('date', 'not-a-date');
    f.detectChanges();
    expect(f.componentInstance.rangeLabel()).toBe('not-a-date');
  });
});
