import { CommonModule } from '@angular/common';
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
import {
  type JpControlSize,
  JP_CONTROL_SIZES,
} from '../shared/primitive-types';
import {
  controlSizeToCssVar,
  createStringUnionTransform,
} from '../shared/token-maps';

export type JpSelectOption = {
  value: string;
  label: string;
};

let nextSelectId = 0;

@Component({
  selector: 'jp-select',
  imports: [CommonModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpSelect),
      multi: true,
    },
  ],
  host: {
    class: 'jp-select',
    '[class.jp-select--sm]': 'size() === "sm"',
    '[class.jp-select--md]': 'size() === "md"',
    '[class.jp-select--lg]': 'size() === "lg"',
    '[class.jp-select--invalid]': 'invalid()',
    '[class.jp-select--disabled]': 'isDisabled()',
  },
})
export class JpSelect implements ControlValueAccessor {
  private readonly generatedId = `jp-select-${++nextSelectId}`;
  private readonly cvaDisabled = signal(false);
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly value = signal('');

  readonly label = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly id = input<string | undefined>(undefined);
  readonly options = input<JpSelectOption[]>([]);

  readonly size = input<JpControlSize, unknown>('md', {
    transform: createStringUnionTransform(JP_CONTROL_SIZES, 'md'),
  });

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly hintId = computed(() => `${this.resolvedId()}-hint`);
  readonly errorId = computed(() => `${this.resolvedId()}-error`);
  readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.error()) {
      ids.push(this.errorId());
    } else if (this.hint()) {
      ids.push(this.hintId());
    }
    return ids.length > 0 ? ids.join(' ') : null;
  });
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly controlHeight = computed(() => controlSizeToCssVar(this.size()));

  writeValue(value: string | null): void {
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

  onSelectChange(event: Event): void {
    const next = (event.target as HTMLSelectElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  onBlur(): void {
    this.onTouched();
  }
}
