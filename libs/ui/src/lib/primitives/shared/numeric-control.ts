import {
  Directive,
  booleanAttribute,
  computed,
  input,
  signal,
} from '@angular/core';
import { type ControlValueAccessor } from '@angular/forms';
import { positiveStep } from './number-utils';
let nextNumericId = 0;
@Directive()
export abstract class NumericControl implements ControlValueAccessor {
  private readonly formDisabled = signal(false);
  protected onChange: (value: number | null) => void = () => undefined;
  protected onTouched: () => void = () => undefined;
  readonly value = signal<number | null>(null);
  readonly label = input.required<string>();
  readonly id = input('');
  readonly name = input('');
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly step = input(1);
  readonly hint = input('');
  readonly error = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  private readonly generatedId = `jp-numeric-${++nextNumericId}`;
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly safeMin = computed(() =>
    this.min() !== null && Number.isFinite(this.min()) ? this.min() : null,
  );
  readonly safeMax = computed(() =>
    this.max() !== null && Number.isFinite(this.max())
      ? Math.max(this.max() as number, this.safeMin() ?? -Infinity)
      : null,
  );
  readonly safeStep = computed(() => positiveStep(this.step()));
  readonly describedBy = computed(
    () =>
      [
        this.hint() ? this.resolvedId() + '-hint' : '',
        this.error() ? this.resolvedId() + '-error' : '',
      ]
        .filter(Boolean)
        .join(' ') || null,
  );
  writeValue(value: number | null): void {
    this.value.set(
      typeof value === 'number' && Number.isFinite(value) ? value : null,
    );
  }
  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(value: boolean): void {
    this.formDisabled.set(value);
  }
  blur(): void {
    this.onTouched();
  }
  protected commit(value: number | null): void {
    this.value.set(value);
    this.onChange(value);
  }
}
