import {
  afterRenderEffect,
  ElementRef,
  booleanAttribute,
  Directive,
  computed,
  effect,
  input,
  inject,
  signal,
} from '@angular/core';
import { type ControlValueAccessor } from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';
import {
  type JpControlSize,
  JP_CONTROL_SIZES,
  type JpInputType,
  JP_INPUT_TYPES,
} from './primitive-types';
import { controlSizeToCssVar, createStringUnionTransform } from './token-maps';

let nextInputId = 0;

@Directive({
  host: {
    class: 'jp-input',
    '[attr.id]': 'null',
    '[class.jp-input--sm]': 'size() === "sm"',
    '[class.jp-input--md]': 'size() === "md"',
    '[class.jp-input--lg]': 'size() === "lg"',
    '[class.jp-input--invalid]': 'isInvalid()',
    '[class.jp-input--disabled]': 'isDisabled()',
  },
})
export abstract class JpInputControl implements ControlValueAccessor {
  private readonly messages = inject(JP_MESSAGES);
  private readonly generatedId = `jp-input-${++nextInputId}`;
  private readonly cvaDisabled = signal(false);
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  private readonly nativeConstraintError = signal('');
  readonly fieldError = computed(
    () => this.error() || this.nativeConstraintError(),
  );
  readonly value = signal('');
  readonly passwordVisible = signal(false);
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly revealPassword = input(false, { transform: booleanAttribute });
  readonly clearLabel = input(this.messages.forms.clearSearch);
  readonly showPasswordLabel = input(this.messages.forms.showPassword);
  readonly hidePasswordLabel = input(this.messages.forms.hidePassword);
  readonly ariaDescribedBy = input('');

  readonly ariaLabel = input('');
  readonly name = input('');
  readonly autocomplete = input('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly minLength = input<number | null>(null);
  readonly maxLength = input<number | null>(null);
  readonly min = input<string | number | null>(null);
  readonly max = input<string | number | null>(null);
  readonly step = input<string | number | null>(null);
  readonly pattern = input('');
  readonly inputMode = input('');

  readonly label = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly placeholder = input('');
  readonly id = input<string | undefined>(undefined);

  readonly type = input<JpInputType, unknown>('text', {
    transform: createStringUnionTransform(JP_INPUT_TYPES, 'text'),
  });

  readonly size = input<JpControlSize, unknown>('md', {
    transform: createStringUnionTransform(JP_CONTROL_SIZES, 'md'),
  });

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly hintId = computed(() => `${this.resolvedId()}-hint`);
  readonly errorId = computed(() => `${this.resolvedId()}-error`);
  readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.fieldError()) {
      ids.push(this.errorId());
    } else if (this.hint()) {
      ids.push(this.hintId());
    }
    if (this.ariaDescribedBy()) ids.push(this.ariaDescribedBy());
    return ids.length > 0 ? ids.join(' ') : null;
  });
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly isInvalid = computed(
    () => this.invalid() || this.fieldError().length > 0,
  );
  readonly controlHeight = computed(() => controlSizeToCssVar(this.size()));
  readonly resolvedType = computed(() =>
    this.type() === 'password' &&
    this.revealPassword() &&
    this.passwordVisible()
      ? 'text'
      : this.type(),
  );

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    afterRenderEffect(() => {
      this.value();
      this.required();
      this.min();
      this.max();
      this.step();
      this.pattern();
      this.minLength();
      this.maxLength();
      if (
        this.nativeConstraintError() &&
        host.nativeElement.querySelector('input')?.validity.valid
      ) {
        this.nativeConstraintError.set('');
      }
    });
    effect(() => {
      this.type();
      this.passwordVisible.set(false);
    });
  }

  clearSearch(control: HTMLInputElement): void {
    if (this.isDisabled() || this.readonly()) return;
    this.commitValue('');
    control.focus();
  }

  togglePassword(): void {
    if (this.isDisabled()) return;
    this.passwordVisible.update((visible) => !visible);
  }

  writeValue(value: string | null): void {
    this.nativeConstraintError.set('');
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    this.commitValue((event.target as HTMLInputElement).value);
  }

  protected commitValue(value: string): void {
    this.nativeConstraintError.set('');
    this.value.set(value);
    this.onChange(value);
  }

  onConstraintInvalid(event: Event): void {
    event.preventDefault();
    const control = event.target as HTMLInputElement;
    const validity = control.validity;
    const copy = this.messages.forms;
    const message = validity.valueMissing
      ? copy.requiredValue
      : validity.typeMismatch
        ? this.type() === 'email'
          ? copy.invalidEmail
          : this.type() === 'url'
            ? copy.invalidUrl
            : copy.invalidValue
        : validity.rangeUnderflow || validity.rangeOverflow
          ? copy.invalidRange
          : validity.stepMismatch
            ? copy.invalidStep
            : validity.tooShort || validity.tooLong
              ? copy.invalidLength
              : validity.patternMismatch
                ? copy.invalidFormat
                : copy.invalidValue;
    this.nativeConstraintError.set(message);
    control.focus();
    this.onBlur();
  }

  onNestedFocusout(event: FocusEvent): void {
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    )
      return;
    this.onBlur();
  }

  onBlur(): void {
    this.onTouched();
  }
}
