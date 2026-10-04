/** Local calendar/time strings; no timezone conversion or Date-object form values. */
export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1) return false;
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
export function timeSeconds(value: string): number | null {
  const parts = /^(\d{2}):(\d{2})(?::(\d{2})(\.\d{1,3})?)?$/.exec(value);
  if (!parts || +parts[1] > 23 || +parts[2] > 59 || +(parts[3] ?? 0) > 59)
    return null;
  return (
    +parts[1] * 3600 + +parts[2] * 60 + +(parts[3] ?? 0) + +(parts[4] ?? 0)
  );
}
export function dateErrors(
  value: unknown,
  min: unknown,
  max: unknown,
  required = false,
  configuredStep: string | number | null = null,
) {
  if (value === '' || value === null || value === undefined)
    return required ? { required: true } : null;
  if (typeof value !== 'string' || !isCalendarDate(value))
    return { date: true };
  if (
    (min && (typeof min !== 'string' || !isCalendarDate(min))) ||
    (max && (typeof max !== 'string' || !isCalendarDate(max))) ||
    (typeof min === 'string' &&
      typeof max === 'string' &&
      min &&
      max &&
      min > max)
  )
    return { dateBounds: true };
  if (typeof min === 'string' && min && value < min)
    return { minDate: { min, actual: value } };
  if (typeof max === 'string' && max && value > max)
    return { maxDate: { max, actual: value } };
  const step = configuredStep === 'any' ? null : Number(configuredStep ?? 1);
  if (step !== null && (!(step > 0) || !Number.isFinite(step)))
    return { dateStep: true };
  const days = (dateValue: string) => {
    const [year, month, day] = dateValue.split('-').map(Number);
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    date.setUTCHours(0, 0, 0, 0);
    return date.getTime() / 86400000;
  };
  if (step !== null) {
    const offset =
      (days(value) -
        days(typeof min === 'string' && min ? min : '1970-01-01')) /
      step;
    if (Math.abs(offset - Math.round(offset)) > 1e-7)
      return { stepDate: { step, actual: value } };
  }
  return null;
}
