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

export interface JpRadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}
let nextRadioGroupId = 0;
@Component({
  selector: 'jp-radio-group',
  templateUrl: './radio-group.html',
  styleUrl: './radio-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpRadioGroup),
      multi: true,
    },
  ],
  host: { class: 'jp-radio-group' },
})
export class JpRadioGroup implements ControlValueAccessor {
  private readonly generatedId = `jp-radio-group-${++nextRadioGroupId}`;
  readonly options = input<readonly JpRadioOption[]>([]);
  readonly label = input('');
  readonly ariaLabel = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly id = input<string | undefined>(undefined);
  readonly name = input('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly value = signal('');
  private readonly cvaDisabled = signal(false);
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly isInvalid = computed(() => this.invalid() || Boolean(this.error()));
  readonly describedBy = computed(() =>
    this.error()
      ? `${this.resolvedId()}-error`
      : this.hint()
        ? `${this.resolvedId()}-hint`
        : null,
  );
  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.cvaDisabled.set(disabled);
  }
  select(option: JpRadioOption): void {
    if (this.isDisabled() || option.disabled) return;
    this.value.set(option.value);
    this.onChange(option.value);
  }
  onBlur(): void {
    this.onTouched();
  }
  onKeydown(event: KeyboardEvent, index: number): void {
    if (this.isDisabled()) return;
    const enabled = this.options()
      .map((option, i) => (option.disabled ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabled.length) return;
    const position = enabled.indexOf(index);
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = enabled[(position + 1) % enabled.length];
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = enabled[(position - 1 + enabled.length) % enabled.length];
        break;
      case 'Home':
        next = enabled[0];
        break;
      case 'End':
        next = enabled[enabled.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    this.select(this.options()[next]);
    const inputs = (event.target as HTMLInputElement)
      .closest('fieldset')
      ?.querySelectorAll('input');
    inputs?.[next]?.focus();
  }
}
