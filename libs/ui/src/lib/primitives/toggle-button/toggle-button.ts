import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'jp-toggle-button',
  templateUrl: './toggle-button.html',
  styleUrl: './toggle-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpToggleButton),
      multi: true,
    },
  ],
})
export class JpToggleButton implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly value = signal(false);
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly pressedChange = output<boolean>();
  private changed: (value: boolean) => void = () => undefined;
  private touched: () => void = () => undefined;
  writeValue(value: boolean | null): void {
    this.value.set(value === true);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.changed = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }
  setDisabledState(value: boolean): void {
    this.formDisabled.set(value);
  }
  toggle(): void {
    if (this.isDisabled()) return;
    const value = !this.value();
    this.value.set(value);
    this.changed(value);
    this.pressedChange.emit(value);
  }
  blur(): void {
    this.touched();
  }
}
