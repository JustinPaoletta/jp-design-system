import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type JpChoiceOption } from '../shared/selection-types';
let nextGroupId = 0;
@Component({
  selector: 'jp-segmented-control',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpSegmentedControl),
      multi: true,
    },
  ],

  templateUrl: './segmented-control.html',
  styleUrl: './segmented-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpSegmentedControl implements ControlValueAccessor {
  private readonly cvaDisabled = signal(false);
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  readonly value = signal<string>('');
  readonly options = input.required<readonly JpChoiceOption[]>();
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly hint = input('');
  readonly error = input('');
  readonly id = input('');
  private readonly generatedId = `jp-segmented-${++nextGroupId}`;
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly describedBy = computed(
    () =>
      [
        this.hint() ? this.resolvedId() + '-hint' : '',
        this.error() ? this.resolvedId() + '-error' : '',
      ]
        .filter(Boolean)
        .join(' ') || null,
  );
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(value: boolean): void {
    this.cvaDisabled.set(value);
  }
  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  choose(option: JpChoiceOption): void {
    if (this.isDisabled() || option.disabled) return;
    this.value.set(option.value);
    this.onChange(option.value);
  }
}
