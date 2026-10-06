import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
} from '@angular/core';

@Component({
  selector: 'jp-form-field',

  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpFormField {
  readonly controlId = input.required<string>();
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly hintId = computed(() => `${this.controlId()}-field-hint`);
  readonly errorId = computed(() => `${this.controlId()}-field-error`);
  readonly describedBy = computed(
    () =>
      [this.hint() ? this.hintId() : '', this.error() ? this.errorId() : '']
        .filter(Boolean)
        .join(' ') || null,
  );
}

/** Apply to a native control inside jp-form-field. JP controls can bind describedBy explicitly. */
@Directive({
  selector:
    'input[jpFieldControl], select[jpFieldControl], textarea[jpFieldControl]',
  host: {
    '[attr.id]': 'field.controlId()',
    '[attr.aria-describedby]': 'description()',
    '[attr.aria-invalid]': 'field.error() ? true : null',
    '[attr.aria-required]': 'field.required() ? true : null',
  },
})
export class JpFieldControl {
  readonly field = inject(JpFormField);
  readonly ariaDescribedBy = input('');
  readonly description = computed(
    () =>
      [this.ariaDescribedBy(), this.field.describedBy()]
        .filter(Boolean)
        .join(' ') || null,
  );
}
