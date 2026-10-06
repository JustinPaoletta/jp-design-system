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
function create() {
  const f = TestBed.createComponent(JpSchedulingCalendar);
  f.componentRef.setInput('date', '2026-10-05');
  f.componentRef.setInput('today', '2026-10-05');
  f.componentRef.setInput('label', 'Schedule');
  f.componentRef.setInput('events', events);
  f.detectChanges();
  return f;
}
function button(root: HTMLElement, text: string) {
  return Array.from(root.querySelectorAll('button')).find(
    (el) => el.textContent?.trim() === text,
  ) as HTMLButtonElement;
}
describe('JpSchedulingCalendar', () => {
  it('renders chronological native activation buttons, all-day segments and unique event counts', () => {
    const f = create();
    const activated = jest.fn();
    f.componentInstance.eventActivated.subscribe(activated);
    expect(f.nativeElement.querySelectorAll('.day')).toHaveLength(7);
    expect(f.nativeElement.querySelectorAll('.all-day button')).toHaveLength(2);
    expect(f.componentInstance.eventCount()).toBe(2);
    expect(f.componentInstance.columns()).toContain('minmax(12rem, 1fr)');
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
    expect(component.columns()).toBe('minmax(0, 1fr)');
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
    f.componentRef.setInput('loading', true);
    f.detectChanges();
    expect(
      f.nativeElement.querySelector('section').getAttribute('aria-busy'),
    ).toBe('true');
    expect(f.nativeElement.textContent).toContain('Loading appointments');
    expect(f.nativeElement.querySelectorAll('.appointment')).toHaveLength(0);
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
    expect(f.componentInstance.allDaySize()).toBe(4);
    f.componentRef.setInput('date', 'not-a-date');
    f.detectChanges();
    expect(f.componentInstance.rangeLabel()).toBe('not-a-date');
  });
});
