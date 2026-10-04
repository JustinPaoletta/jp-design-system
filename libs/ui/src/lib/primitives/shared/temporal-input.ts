import { Component, effect } from '@angular/core';
import type {
  AbstractControl,
  Validator,
  ValidationErrors,
} from '@angular/forms';
import { JpInput } from '../input/input';
import { dateErrors, timeSeconds } from './temporal-value';
@Component({ template: '' })
export abstract class TemporalInput extends JpInput implements Validator {
  private validatorChanged: () => void = () => undefined;
  constructor() {
    super();
    effect(() => {
      this.min();
      this.max();
      this.step();
      this.required();
      this.validatorChanged();
    });
  }
  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (this.type() === 'date')
      return dateErrors(
        value,
        this.min(),
        this.max(),
        this.required(),
        this.step(),
      );
    if (value === '' || value == null)
      return this.required() ? { required: true } : null;
    const seconds = typeof value === 'string' ? timeSeconds(value) : null;
    if (seconds === null) return { time: true };
    const min = this.min() ? timeSeconds(String(this.min())) : null;
    const max = this.max() ? timeSeconds(String(this.max())) : null;
    if (
      (this.min() && min === null) ||
      (this.max() && max === null) ||
      (min !== null && max !== null && min > max)
    )
      return { timeBounds: true };
    if (min !== null && seconds < min)
      return { minTime: { min: this.min(), actual: value } };
    if (max !== null && seconds > max)
      return { maxTime: { max: this.max(), actual: value } };
    const step = this.step() === 'any' ? null : Number(this.step() ?? 60);
    if (step !== null && (!(step > 0) || !Number.isFinite(step)))
      return { timeStep: true };
    if (
      step !== null &&
      Math.abs(
        (seconds - (min ?? 0)) / step -
          Math.round((seconds - (min ?? 0)) / step),
      ) > 1e-7
    )
      return { stepTime: { step, actual: value } };
    return null;
  }
}
