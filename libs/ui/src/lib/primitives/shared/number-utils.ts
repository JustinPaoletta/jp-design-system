/** Keep decimal stepping free from visible binary floating-point artifacts. */
export function tidyNumber(value: number): number {
  return Number.parseFloat(value.toPrecision(14));
}
export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
export function positiveStep(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 1;
}
export function snapNumber(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const lastStep = Math.max(0, Math.floor(tidyNumber((max - min) / step)));
  const index = clampNumber(Math.round((value - min) / step), 0, lastStep);
  return tidyNumber(min + index * step);
}
