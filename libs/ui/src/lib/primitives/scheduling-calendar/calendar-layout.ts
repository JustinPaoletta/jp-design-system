/** Absolute timed appointments, or calendar dates for an all-day appointment. End is exclusive. */
export interface JpCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  description?: string;
}
export interface JpCalendarPlacement {
  event: JpCalendarEvent;
  start: number;
  end: number;
  displayStart: number;
  displayEnd: number;
  lane: number;
  lanes: number;
  timeLabel: string;
}
export interface JpCalendarDay {
  date: string;
  label: string;
  duration: number;
  allDay: JpCalendarEvent[];
  timed: JpCalendarPlacement[];
  hours: { minute: number; label: string }[];
}
export interface JpCalendarLayout {
  days: JpCalendarDay[];
  invalid: boolean;
  invalidEvents: number;
}

const minute = 60000;
const day = 86400000;
const absoluteTime =
  /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;

/** Validate Gregorian calendar dates without permissive Date rollover. */
export function isJpCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '0100-01-01') return false;
  const epoch = Date.parse(value + 'T00:00:00Z');
  return (
    Number.isFinite(epoch) &&
    new Date(epoch).toISOString().slice(0, 10) === value
  );
}

export function addJpCalendarDays(date: string, count: number): string {
  if (!isJpCalendarDate(date) || !Number.isFinite(count)) return date;
  const result = new Date(
    Date.parse(date + 'T00:00:00Z') + Math.trunc(count) * day,
  );
  if (!Number.isFinite(result.getTime())) return date;
  const value = result.toISOString().slice(0, 10);
  return isJpCalendarDate(value) ? value : date;
}

function dateKey(epoch: number, formatter: Intl.DateTimeFormat): string {
  const parts = formatter.formatToParts(epoch);
  return ['year', 'month', 'day']
    .map((type) =>
      (parts.find((part) => part.type === type)?.value ?? '').padStart(
        type === 'year' ? 4 : 2,
        '0',
      ),
    )
    .join('-');
}

/** First instant whose zoned date is at least target; a skipped civil date has no interval. */
function dayStart(date: string, formatter: Intl.DateTimeFormat): number {
  const guess = Date.parse(date + 'T00:00:00Z');
  let lo = guess - 2 * day;
  let hi = guess + 2 * day;
  while (hi - lo > 1) {
    const middle = Math.floor((lo + hi) / 2);
    if (dateKey(middle, formatter) < date) lo = middle;
    else hi = middle;
  }
  return hi;
}

/** Collision groups share equal-width lanes; adjacent (exclusive-end) events reuse a lane. */
function assignLanes<T extends JpCalendarPlacement>(events: T[]): T[] {
  events.sort(
    (a, b) =>
      a.start - b.start ||
      b.end - a.end ||
      a.event.id.localeCompare(b.event.id),
  );
  let group: T[] = [];
  let ends: number[] = [];
  let groupEnd = -1;
  const flush = () => {
    for (const item of group) item.lanes = ends.length;
  };
  for (const item of events) {
    if (item.displayStart >= groupEnd) {
      flush();
      group = [];
      ends = [];
      groupEnd = -1;
    }
    let lane = ends.findIndex((end) => end <= item.displayStart);
    if (lane === -1) lane = ends.length;
    ends[lane] = item.displayEnd;
    item.lane = lane;
    group.push(item);
    groupEnd = Math.max(groupEnd, item.displayEnd);
  }
  flush();
  return events;
}

export function buildJpCalendarLayout(options: {
  date: string;
  view: 'day' | 'week';
  weekStartsOn: number;
  events: readonly JpCalendarEvent[];
  timeZone: string;
  locale: string;
}): JpCalendarLayout {
  const empty = { days: [], invalid: true, invalidEvents: 0 };
  if (!isJpCalendarDate(options.date)) return empty;
  try {
    const zone = new Intl.DateTimeFormat('en-US', {
      timeZone: options.timeZone,
      calendar: 'gregory',
      numberingSystem: 'latn',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const dateLabel = new Intl.DateTimeFormat(options.locale, {
      timeZone: 'UTC',
      calendar: 'gregory',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeLabel = new Intl.DateTimeFormat(options.locale, {
      timeZone: options.timeZone,
      calendar: 'gregory',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'shortOffset',
      month: 'short',
      day: 'numeric',
    });
    const hourLabel = new Intl.DateTimeFormat(options.locale, {
      timeZone: options.timeZone,
      hour: 'numeric',
      minute: '2-digit',
    });
    const weekday = new Date(options.date + 'T00:00:00Z').getUTCDay();
    const weekStartsOn = Number.isInteger(options.weekStartsOn)
      ? Math.max(0, Math.min(6, options.weekStartsOn))
      : 1;
    const first =
      options.view === 'week'
        ? addJpCalendarDays(options.date, -((weekday - weekStartsOn + 7) % 7))
        : options.date;
    const dates = Array.from(
      { length: options.view === 'week' ? 7 : 1 },
      (_, i) => addJpCalendarDays(first, i),
    );
    const ids = new Set<string>();
    let invalidEvents = 0;
    const events = options.events.filter((event) => {
      const valid =
        Boolean(event.id && event.title.trim() && !ids.has(event.id)) &&
        (event.allDay
          ? isJpCalendarDate(event.start) &&
            isJpCalendarDate(event.end) &&
            event.end > event.start
          : absoluteTime.test(event.start) &&
            absoluteTime.test(event.end) &&
            isJpCalendarDate(event.start.slice(0, 10)) &&
            isJpCalendarDate(event.end.slice(0, 10)) &&
            Number.isFinite(Date.parse(event.start)) &&
            Date.parse(event.end) > Date.parse(event.start));
      if (!valid) {
        invalidEvents++;
        return false;
      }
      ids.add(event.id);
      return true;
    });
    const days = dates.map((date): JpCalendarDay => {
      const start = dayStart(date, zone);
      const next = addJpCalendarDays(date, 1);
      const end = dayStart(next, zone);
      const duration =
        dateKey(start, zone) === date ? (end - start) / minute : 0;
      const timed =
        duration > 0
          ? events
              .filter(
                (event) =>
                  !event.allDay &&
                  Date.parse(event.start) < end &&
                  Date.parse(event.end) > start,
              )
              .map((event): JpCalendarPlacement => {
                const eventStart =
                  (Math.max(start, Date.parse(event.start)) - start) / minute;
                const eventEnd =
                  (Math.min(end, Date.parse(event.end)) - start) / minute;
                const displayStart = Math.max(
                  0,
                  Math.min(eventStart, duration - 40),
                );
                return {
                  event,
                  start: eventStart,
                  end: eventEnd,
                  displayStart,
                  displayEnd: Math.min(
                    duration,
                    Math.max(eventEnd, displayStart + 40),
                  ),
                  lane: 0,
                  lanes: 1,
                  timeLabel:
                    timeLabel.format(Date.parse(event.start)) +
                    ' – ' +
                    timeLabel.format(Date.parse(event.end)),
                };
              })
          : [];
      return {
        date,
        label: dateLabel.format(Date.parse(date + 'T00:00:00Z')),
        duration,
        allDay: events.filter(
          (event) => event.allDay && event.start <= date && event.end > date,
        ),
        timed: assignLanes(timed),
        hours: Array.from({ length: Math.ceil(duration / 60) }, (_, index) => ({
          minute: index * 60,
          label: hourLabel.format(start + index * 60 * minute),
        })),
      };
    });
    return {
      days,
      invalid: days.some((item) => item.duration <= 0),
      invalidEvents,
    };
  } catch {
    return empty;
  }
}

/** Share wall-clock tracks across a week, including a separate track for a repeated hour. */
export function buildJpCalendarGrid(
  calendar: JpCalendarLayout,
  timeZone: string,
  locale: string,
) {
  if (calendar.invalid || !calendar.days.length)
    return { days: [], hours: [], duration: 1440, initialMinute: 480 };
  const civil = new Intl.DateTimeFormat('en-US', {
    timeZone,
    calendar: 'gregory',
    numberingSystem: 'latn',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const wall = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    calendar: 'gregory',
    numberingSystem: 'latn',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const wallParts = (epoch: number) => {
    const parts = wall.formatToParts(epoch);
    const value = (key: string) =>
      Number(parts.find((part) => part.type === key)?.value);
    return {
      year: value('year'),
      month: value('month'),
      date: value('day'),
      minute: value('hour') * 60 + value('minute'),
    };
  };
  const offsetAt = (epoch: number) => {
    const parts = wallParts(epoch);
    return (
      (Date.UTC(parts.year, parts.month - 1, parts.date, 0, parts.minute) -
        Math.floor(epoch / minute) * minute) /
      minute
    );
  };
  const weekdayLabel = new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    calendar: 'gregory',
    weekday: 'short',
  });
  const dateLabel = new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    calendar: 'gregory',
    month: 'short',
    day: 'numeric',
  });
  const clock = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  });
  const wholeHourClock = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: 'numeric',
  });
  const offsetClock = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'shortOffset',
  });
  const compactRange = (start: number, end: number) => {
    const parts = (epoch: number) =>
      (wallParts(epoch).minute % 60 ? clock : wholeHourClock).formatToParts(
        epoch,
      );
    const first = parts(start),
      last = parts(end);
    const firstPeriod = first.find((part) => part.type === 'dayPeriod')?.value;
    const lastPeriod = last.find((part) => part.type === 'dayPeriod')?.value;
    const startLabel = first
      .filter(
        (part) =>
          !(
            firstPeriod &&
            firstPeriod === lastPeriod &&
            part.type === 'dayPeriod'
          ),
      )
      .map((part) => part.value)
      .join('')
      .trim();
    return startLabel + '–' + last.map((part) => part.value).join('');
  };
  const axisClock = new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  });
  const offsetName = new Intl.DateTimeFormat(locale, {
    timeZone,
    timeZoneName: 'shortOffset',
  });
  const zoneName = (epoch: number) =>
    offsetName.formatToParts(epoch).find((part) => part.type === 'timeZoneName')
      ?.value ?? '';
  const intervals = calendar.days.map((item) => ({
    day: item,
    start: dayStart(item.date, civil),
  }));
  const folds: {
    start: number;
    end: number;
    transition: number;
    date: string;
    before: string;
    after: string;
  }[] = [];
  for (const { day: item, start } of intervals) {
    const end = start + item.duration * minute;
    let previous = start;
    let previousOffset = offsetAt(previous);
    for (
      let sample = Math.min(start + 60 * minute, end);
      sample < end;
      sample = Math.min(sample + 60 * minute, end)
    ) {
      const offset = offsetAt(sample);
      if (offset < previousOffset) {
        let lo = previous;
        let hi = sample;
        while (hi - lo > minute) {
          const mid = Math.floor((lo + hi) / (2 * minute)) * minute;
          if (offsetAt(mid) === previousOffset) lo = mid;
          else hi = mid;
        }
        const startMinute = wallParts(hi).minute;
        folds.push({
          start: startMinute,
          end: startMinute + previousOffset - offset,
          transition: hi,
          date: item.date,
          before: zoneName(hi - minute),
          after: zoneName(hi),
        });
      }
      previous = sample;
      previousOffset = offset;
    }
  }
  folds.sort((a, b) => a.start - b.start);
  const duration =
    1440 + folds.reduce((sum, fold) => sum + fold.end - fold.start, 0);
  const normalPosition = (value: number) =>
    value +
    folds.reduce(
      (sum, fold) => sum + (value >= fold.end ? fold.end - fold.start : 0),
      0,
    );
  const axisLabel = (value: number) =>
    axisClock.format(Date.UTC(2026, 0, 1, 0, value));
  const ticks = new Set(Array.from({ length: 24 }, (_, index) => index * 60));
  folds.forEach((fold) => {
    ticks.add(fold.start);
    ticks.add(fold.end);
  });
  const hours = [...ticks]
    .filter((value) => value < 1440)
    .map((value) => {
      const fold = folds.find(
        (candidate) => value >= candidate.start && value < candidate.end,
      );
      return {
        minute: normalPosition(value),
        label: axisLabel(value) + (fold ? ' ' + fold.before : ''),
      };
    });
  for (const fold of folds) {
    for (let value = fold.start; value < fold.end; value += 60) {
      hours.push({
        minute:
          normalPosition(fold.start) +
          fold.end -
          fold.start +
          value -
          fold.start,
        label: axisLabel(value) + ' ' + fold.after,
      });
    }
  }
  hours.sort((a, b) => a.minute - b.minute);
  const days = intervals.map(({ day: item, start }) => {
    const end = start + item.duration * minute;
    const position = (epoch: number) => {
      epoch = Math.max(start, epoch);
      if (epoch >= end) return duration;
      const value = wallParts(epoch).minute + (epoch % minute) / minute;
      return (
        normalPosition(value) +
        folds.reduce(
          (sum, fold) =>
            sum +
            (fold.date === item.date &&
            epoch >= fold.transition &&
            value >= fold.start &&
            value < fold.end
              ? fold.end - fold.start
              : 0),
          0,
        )
      );
    };
    return {
      ...item,
      weekdayLabel: weekdayLabel.format(Date.parse(item.date + 'T00:00:00Z')),
      dateLabel: dateLabel.format(Date.parse(item.date + 'T00:00:00Z')),
      duration,
      timed: assignLanes(
        item.timed.map((entry) => {
          const displayStart = Math.min(
            position(start + entry.start * minute),
            duration - 40,
          );
          const displayEnd = Math.min(
            duration,
            Math.max(position(start + entry.end * minute), displayStart + 40),
          );
          const eventStart = Date.parse(entry.event.start),
            eventEnd = Date.parse(entry.event.end);
          const labelFormatter =
            offsetAt(eventStart) !== offsetAt(eventEnd) ||
            folds.some(
              (fold) =>
                fold.date === item.date &&
                ((wallParts(eventStart).minute >= fold.start &&
                  wallParts(eventStart).minute < fold.end) ||
                  (wallParts(eventEnd).minute >= fold.start &&
                    wallParts(eventEnd).minute < fold.end)),
            )
              ? offsetClock
              : clock;
          return {
            ...entry,
            displayStart,
            displayEnd,
            compactTimeLabel:
              labelFormatter === clock
                ? compactRange(eventStart, eventEnd)
                : labelFormatter.format(eventStart) +
                  ' – ' +
                  labelFormatter.format(eventEnd),
          };
        }),
      ),
    };
  });
  const first = Math.min(
    ...(days
      .find((item) => item.timed.length)
      ?.timed.map((entry) => entry.displayStart) ?? []),
  );
  return {
    days,
    hours,
    duration,
    initialMinute: Number.isFinite(first) ? Math.max(0, first - 60) : 480,
  };
}
