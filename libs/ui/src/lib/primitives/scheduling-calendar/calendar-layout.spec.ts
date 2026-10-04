import {
  addJpCalendarDays,
  buildJpCalendarLayout,
  isJpCalendarDate,
  type JpCalendarEvent,
} from './calendar-layout';
function layout(
  events: readonly JpCalendarEvent[] = [],
  date = '2026-10-05',
  timeZone = 'UTC',
  view: 'day' | 'week' = 'day',
) {
  return buildJpCalendarLayout({
    date,
    view,
    weekStartsOn: 1,
    events,
    timeZone,
    locale: 'en-US',
  });
}
function appointment(id: string, start: string, end: string): JpCalendarEvent {
  return { id, title: id, start, end };
}
describe('calendar dates and appointment placement', () => {
  it('strictly validates Gregorian dates and navigates year/leap boundaries', () => {
    expect(isJpCalendarDate('2024-02-29')).toBe(true);
    for (const date of [
      '2026-02-29',
      '2026-04-31',
      '2026-13-01',
      '2026-1-01',
      'invalid',
      '0000-01-01',
    ])
      expect(isJpCalendarDate(date)).toBe(false);
    expect(addJpCalendarDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addJpCalendarDays('2024-03-01', -1)).toBe('2024-02-29');
    expect(addJpCalendarDays('bad', 1)).toBe('bad');
    expect(addJpCalendarDays('2026-01-01', Infinity)).toBe('2026-01-01');
    expect(addJpCalendarDays('9999-12-31', 1)).toBe('9999-12-31');
    expect(addJpCalendarDays('0100-01-01', -1)).toBe('0100-01-01');
    expect(addJpCalendarDays('2026-01-01', 1e30)).toBe('2026-01-01');
  });
  it('starts a week on the configured weekday across a month boundary', () => {
    const week = layout([], '2026-10-04', 'UTC', 'week');
    expect(week.days.map((day) => day.date)).toEqual([
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
    ]);
    const sunday = buildJpCalendarLayout({
      date: '2026-10-04',
      view: 'week',
      weekStartsOn: 0,
      events: [],
      timeZone: 'UTC',
      locale: 'de-DE',
    });
    expect(sunday.days[0].date).toBe('2026-10-04');
    const invalidStart = buildJpCalendarLayout({
      date: '2026-10-04',
      view: 'week',
      weekStartsOn: NaN,
      events: [],
      timeZone: 'UTC',
      locale: 'en-US',
    });
    expect(invalidStart.days[0].date).toBe('2026-09-28');
  });
  it('allocates collision lanes, reuses adjacency and isolates collision groups', () => {
    const result = layout([
      appointment('a', '2026-10-05T09:00:00Z', '2026-10-05T11:00:00Z'),
      appointment('b', '2026-10-05T09:15:00Z', '2026-10-05T10:00:00Z'),
      appointment('c', '2026-10-05T10:00:00Z', '2026-10-05T10:45:00Z'),
      appointment('d', '2026-10-05T11:00:00Z', '2026-10-05T12:00:00Z'),
    ]).days[0];
    expect(
      result.timed.map((item) => [item.event.id, item.lane, item.lanes]),
    ).toEqual([
      ['a', 0, 2],
      ['b', 1, 2],
      ['c', 1, 2],
      ['d', 0, 1],
    ]);
    const equal = layout([
      appointment('b', '2026-10-05T09:00:00Z', '2026-10-05T10:00:00Z'),
      appointment('a', '2026-10-05T09:00:00Z', '2026-10-05T10:00:00Z'),
    ]);
    expect(equal.days[0].timed.map((item) => item.event.id)).toEqual([
      'a',
      'b',
    ]);
  });
  it('clips cross-midnight appointments and keeps end dates exclusive', () => {
    const events = [
      appointment('night', '2026-10-05T23:30:00Z', '2026-10-06T01:00:00Z'),
      {
        id: 'release',
        title: 'Release',
        allDay: true,
        start: '2026-10-05',
        end: '2026-10-07',
      },
    ];
    const days = layout(events, '2026-10-05', 'UTC', 'week').days;
    expect(days[0].timed[0].start).toBe(1410);
    expect(days[0].timed[0].end).toBe(1440);
    expect(days[1].timed[0].start).toBe(0);
    expect(days[1].timed[0].end).toBe(60);
    expect(days[0].allDay).toHaveLength(1);
    expect(days[1].allDay).toHaveLength(1);
    expect(days[2].allDay).toHaveLength(0);
    expect(days[2].timed).toHaveLength(0);
  });
  it('keeps short appointment hit areas in separate lanes and inside the day frame', () => {
    const result = layout([
      appointment('a', '2026-10-05T23:55:00Z', '2026-10-05T23:57:00Z'),
      appointment('b', '2026-10-05T23:57:00Z', '2026-10-06T00:00:00Z'),
    ]).days[0];
    expect(result.timed.map((item) => item.lanes)).toEqual([2, 2]);
    for (const item of result.timed) {
      expect(item.displayEnd - item.displayStart).toBeGreaterThanOrEqual(40);
      expect(item.displayEnd).toBeLessThanOrEqual(1440);
    }
  });
  it('uses explicit zones and handles 23/25 hour days and repeated clock times', () => {
    expect(layout([], '2026-03-08', 'America/New_York').days[0].duration).toBe(
      1380,
    );
    const fall = layout(
      [
        appointment(
          'first',
          '2026-11-01T01:15:00-04:00',
          '2026-11-01T01:45:00-04:00',
        ),
        appointment(
          'second',
          '2026-11-01T01:15:00-05:00',
          '2026-11-01T01:45:00-05:00',
        ),
      ],
      '2026-11-01',
      'America/New_York',
    ).days[0];
    expect(fall.duration).toBe(1500);
    expect(fall.hours).toHaveLength(25);
    expect(fall.timed.map((item) => item.start)).toEqual([75, 135]);
    expect(fall.timed[0].timeLabel).toContain('GMT-4');
    expect(fall.timed[1].timeLabel).toContain('GMT-5');
    const utc = layout([
      appointment(
        'offset',
        '2026-10-05T09:00:00-04:00',
        '2026-10-05T10:00:00-04:00',
      ),
    ]);
    expect(utc.days[0].timed[0].start).toBe(780);
  });
  it.each([
    { locale: 'fa-IR', comparisonCalendar: 'persian' },
    { locale: 'ar-SA-u-ca-islamic', comparisonCalendar: 'islamic' },
  ])(
    'keeps event dates and headings Gregorian for locale $locale',
    ({ locale, comparisonCalendar }) => {
      const event = appointment(
        'review',
        '2026-10-05T09:00:00Z',
        '2026-10-05T10:00:00Z',
      );
      const result = buildJpCalendarLayout({
        date: '2026-10-05',
        view: 'day',
        weekStartsOn: 1,
        events: [event],
        timeZone: 'UTC',
        locale,
      });
      const instant = new Date(event.start);
      const gregorianMonth = new Intl.DateTimeFormat(locale, {
        timeZone: 'UTC',
        calendar: 'gregory',
        month: 'short',
      }).format(instant);
      const otherCalendarMonth = new Intl.DateTimeFormat(locale, {
        timeZone: 'UTC',
        calendar: comparisonCalendar,
        month: 'short',
      }).format(instant);
      expect(gregorianMonth).not.toBe(otherCalendarMonth);
      expect(result.days[0].label).toContain(gregorianMonth);
      expect(result.days[0].timed[0].timeLabel).toContain(gregorianMonth);
      expect(result.days[0].timed[0].timeLabel).not.toContain(
        otherCalendarMonth,
      );
    },
  );
  it('reports invalid dates/zones/locales and historical skipped civil dates without throwing', () => {
    expect(layout([], 'bad').invalid).toBe(true);
    expect(layout([], '2026-10-05', 'Not/A_Zone').invalid).toBe(true);
    expect(
      buildJpCalendarLayout({
        date: '2026-10-05',
        view: 'day',
        weekStartsOn: 1,
        events: [],
        timeZone: 'UTC',
        locale: 'not_a_locale',
      }).invalid,
    ).toBe(true);
    const skipped = layout([], '2011-12-30', 'Pacific/Apia');
    expect(skipped.invalid).toBe(true);
    expect(skipped.days[0].duration).toBe(0);
    expect(skipped.days[0].timed).toEqual([]);
    expect(layout([], '0100-01-01').invalid).toBe(false);
  });
  it('rejects ambiguous local timestamps, rollovers, invalid durations and duplicate IDs with diagnostics', () => {
    const result = layout([
      appointment('good', '2026-10-05T09:00:00Z', '2026-10-05T10:00:00Z'),
      appointment('good', '2026-10-05T10:00:00Z', '2026-10-05T11:00:00Z'),
      appointment('local', '2026-10-05T09:00:00', '2026-10-05T10:00:00'),
      appointment('zero', '2026-10-05T09:00:00Z', '2026-10-05T09:00:00Z'),
      appointment('roll', '2026-02-30T09:00:00Z', '2026-03-01T10:00:00Z'),
      appointment('hour', '2026-10-05T24:00:00Z', '2026-10-06T01:00:00Z'),
      appointment('', '2026-10-05T09:00:00Z', '2026-10-05T10:00:00Z'),
      {
        id: 'empty',
        title: ' ',
        start: '2026-10-05',
        end: '2026-10-06',
        allDay: true,
      },
      {
        id: 'bad-day',
        title: 'Bad',
        start: '2026-10-06',
        end: '2026-10-05',
        allDay: true,
      },
    ]);
    expect(result.invalidEvents).toBe(8);
    expect(result.days[0].timed).toHaveLength(1);
  });
});
