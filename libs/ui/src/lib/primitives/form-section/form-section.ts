import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
let nextSectionId = 0;
@Component({
  selector: 'jp-form-section',

  templateUrl: './form-section.html',
  styleUrl: './form-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpFormSection {
  private readonly generatedId = `jp-form-section-${++nextSectionId}`;
  readonly id = input('');
  readonly legend = input.required<string>();
  readonly hint = input('');
  readonly error = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly describedBy = computed(
    () =>
      [
        this.hint() ? `${this.resolvedId()}-hint` : '',
        this.error() ? `${this.resolvedId()}-error` : '',
      ]
        .filter(Boolean)
        .join(' ') || null,
  );
}
