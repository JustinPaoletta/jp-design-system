import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';

@Component({
  selector: 'jp-progress',
  template:
    '<span class="jp-progress__fill" [style.width.%]="percent()"></span>',
  styleUrl: './progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-progress',
    role: 'progressbar',
    '[attr.aria-label]': 'label()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'safeMax()',
    '[attr.aria-valuenow]': 'safeValue()',
    '[attr.aria-valuetext]': 'valueText() || null',
    '[class.jp-progress--indeterminate]': 'safeValue() === null',
  },
})
export class JpProgress {
  private readonly messages = inject(JP_MESSAGES);
  readonly label = input(this.messages.progress.loading);
  /** Null represents an indeterminate operation. */
  readonly value = input<number | null>(null);
  readonly max = input(100);
  readonly valueText = input('');
  readonly safeMax = computed(() =>
    Number.isFinite(this.max()) && this.max() > 0 ? this.max() : 100,
  );
  readonly safeValue = computed(() => {
    const value = this.value();
    return value === null || !Number.isFinite(value)
      ? null
      : Math.min(this.safeMax(), Math.max(0, value));
  });
  readonly percent = computed(() => {
    const value = this.safeValue();
    return value === null ? 40 : (value / this.safeMax()) * 100;
  });
}
