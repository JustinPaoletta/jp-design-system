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
  selector: 'jp-checkbox-group',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpCheckboxGroup),
      multi: true,
    },
  ],

  templateUrl: './checkbox-group.html',
  styleUrl: './checkbox-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpCheckboxGroup implements ControlValueAccessor {
  private readonly cvaDisabled = signal(false);
  private onChange: (value: readonly string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  readonly value = signal<readonly string[]>([]);
  readonly options = input.required<readonly JpChoiceOption[]>();
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly hint = input('');
  readonly error = input('');
  readonly id = input('');
  private readonly generatedId = `jp-checkbox-group-${++nextGroupId}`;
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
  registerOnChange(fn: (value: readonly string[]) => void): void {
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

  writeValue(values: readonly string[] | null): void {
    this.value.set([...new Set(values ?? [])]);
  }
  toggle(option: JpChoiceOption, event: Event): void {
    if (this.isDisabled() || option.disabled) return;
    const checked = (event.target as HTMLInputElement).checked;
    const values = new Set(this.value());
    if (checked) values.add(option.value);
    else values.delete(option.value);
    const next = [...values];
    this.value.set(next);
    this.onChange(next);
  }
}
