import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextCheckboxId = 0;

@Component({
  selector: 'jp-checkbox',
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpCheckbox),
      multi: true,
    },
  ],
  host: {
    class: 'jp-checkbox',
    '[class.jp-checkbox--checked]': 'checked()',
    '[class.jp-checkbox--invalid]': 'invalid()',
    '[class.jp-checkbox--disabled]': 'isDisabled()',
  },
})
export class JpCheckbox implements ControlValueAccessor {
  private readonly generatedId = `jp-checkbox-${++nextCheckboxId}`;
  private readonly cvaDisabled = signal(false);
  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly checked = signal(false);

  readonly id = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  writeValue(value: boolean | null): void {
    this.checked.set(Boolean(value));
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  onInputChange(event: Event): void {
    const next = (event.target as HTMLInputElement).checked;
    this.checked.set(next);
    this.onChange(next);
  }

  onBlur(): void {
    this.onTouched();
  }
}
