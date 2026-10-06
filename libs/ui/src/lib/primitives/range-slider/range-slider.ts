import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';
import { clampNumber, positiveStep, snapNumber } from '../shared/number-utils';
export type JpRangeValue = readonly [number, number];
let nextRangeId = 0;
@Component({
  selector: 'jp-range-slider',
  templateUrl: './range-slider.html',
  styleUrl: './range-slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpRangeSlider),
      multi: true,
    },
  ],
})
export class JpRangeSlider implements ControlValueAccessor {
  private readonly messages = inject(JP_MESSAGES);
  private readonly formDisabled = signal(false);
  private onChange: (value: JpRangeValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  readonly label = input.required<string>();
  readonly lowerLabel = input(this.messages.rangeSlider.lower);
  readonly upperLabel = input(this.messages.rangeSlider.upper);
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly hint = input('');
  readonly error = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly showNumberInputs = input(true, { transform: booleanAttribute });
  readonly valueText = input<(value: number) => string>((value) =>
    String(value),
  );
  readonly id = input('');
  private readonly generatedId = `jp-range-${++nextRangeId}`;
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly value = signal<JpRangeValue | null>(null);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly safeMin = computed(() =>
    Number.isFinite(this.min()) ? this.min() : 0,
  );
  readonly safeMax = computed(() =>
    Number.isFinite(this.max()) && this.max() > this.safeMin()
      ? this.max()
      : this.safeMin() + 100,
  );
  readonly safeStep = computed(() => positiveStep(this.step()));
  readonly displayedValue = computed<JpRangeValue>(() => {
    const normalize = (value: number) =>
      snapNumber(value, this.safeMin(), this.safeMax(), this.safeStep());
    const first = normalize(this.value()?.[0] ?? this.safeMin());
    const last = normalize(this.value()?.[1] ?? this.safeMax());
    return [Math.min(first, last), Math.max(first, last)];
  });
  readonly describedBy = computed(
    () =>
      [
        this.hint() ? this.resolvedId() + '-hint' : '',
        this.error() ? this.resolvedId() + '-error' : '',
      ]
        .filter(Boolean)
        .join(' ') || null,
  );
  change(index: 0 | 1, event: Event): void {
    const control = event.target as HTMLInputElement;
    if (
      !this.isDisabled() &&
      !this.readonly() &&
      Number.isFinite(control.valueAsNumber)
    ) {
      const next: [number, number] = [...this.displayedValue()];
      const value = snapNumber(
        control.valueAsNumber,
        this.safeMin(),
        this.safeMax(),
        this.safeStep(),
      );
      next[index] = clampNumber(
        value,
        index === 0 ? this.safeMin() : next[0],
        index === 0 ? next[1] : this.safeMax(),
      );
      this.value.set(next);
      this.onChange(next);
    }
    control.value = String(this.displayedValue()[index]);
  }
  blur(): void {
    this.onTouched();
  }
  writeValue(value: JpRangeValue | null): void {
    this.value.set(
      value?.length === 2 && value.every(Number.isFinite)
        ? ([...value] as [number, number])
        : null,
    );
  }
  registerOnChange(fn: (value: JpRangeValue) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(value: boolean): void {
    this.formDisabled.set(value);
  }
}
