import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  type AbstractControl,
  type ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  type ValidationErrors,
  type Validator,
} from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';
import { dateErrors } from '../shared/temporal-value';
export type JpDateRangeValue = readonly [string, string];
let nextRange = 0;
@Component({
  selector: 'jp-date-range-picker',
  templateUrl: './date-range-picker.html',
  styleUrl: './date-range-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.id]': 'null' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpDateRangePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => JpDateRangePicker),
      multi: true,
    },
  ],
})
export class JpDateRangePicker implements ControlValueAccessor, Validator {
  private readonly messages = inject(JP_MESSAGES);
  private readonly generatedId = 'jp-date-range-' + ++nextRange;
  readonly label = input.required<string>();
  readonly id = input('');
  readonly startLabel = input(this.messages.dates.start);
  readonly endLabel = input(this.messages.dates.end);
  readonly min = input('');
  readonly max = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly value = signal<JpDateRangeValue>(['', '']);
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly describedBy = computed(() =>
    this.error()
      ? this.resolvedId() + '-error'
      : this.hint()
        ? this.resolvedId() + '-hint'
        : null,
  );
  private changed: (value: JpDateRangeValue) => void = () => undefined;
  private touched: () => void = () => undefined;
  private validatorChanged: () => void = () => undefined;
  constructor() {
    effect(() => {
      this.min();
      this.max();
      this.required();
      this.validatorChanged();
    });
  }
  writeValue(value: JpDateRangeValue | null): void {
    this.value.set(
      Array.isArray(value) ? [value[0] ?? '', value[1] ?? ''] : ['', ''],
    );
  }
  registerOnChange(fn: (value: JpDateRangeValue) => void): void {
    this.changed = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }
  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
  setDisabledState(value: boolean): void {
    this.formDisabled.set(value);
  }
  update(index: 0 | 1, event: Event): void {
    if (this.isDisabled() || this.readonly()) return;
    const pair: [string, string] = [...this.value()];
    pair[index] = (event.target as HTMLInputElement).value;
    this.value.set(pair);
    this.changed(pair);
  }
  blur(): void {
    this.touched();
  }
  validate(control: AbstractControl): ValidationErrors | null {
    const pair: unknown = control.value;
    if (pair == null) return this.required() ? { required: true } : null;
    if (!Array.isArray(pair) || pair.length !== 2) return { dateRange: true };
    const start = dateErrors(pair[0], this.min(), this.max(), this.required()),
      end = dateErrors(pair[1], this.min(), this.max(), this.required());
    if (start || end) return { dateRange: { start, end } };
    if (pair[0] && pair[1] && pair[0] > pair[1]) return { dateOrder: true };
    if (Boolean(pair[0]) !== Boolean(pair[1]))
      return { dateRangeIncomplete: true };
    return null;
  }
}
