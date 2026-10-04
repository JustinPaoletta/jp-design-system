import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpIcon } from '../icon/icon';
@Component({
  selector: 'jp-banner',
  imports: [JpIcon],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpBanner {
  private readonly messages = inject(JP_MESSAGES);
  readonly title = input.required<string>();
  readonly message = input('');
  readonly tone = input<'info' | 'success' | 'warning' | 'error'>('info');
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly announce = input(false, { transform: booleanAttribute });
  readonly dismissLabel = input(this.messages.banner.dismiss);
  readonly dismissed = output<void>();
  readonly border = computed(
    () => `var(--jp-color-state-${this.tone()}-border)`,
  );
  readonly background = computed(() => 'var(--jp-color-surface-subtle)');
}
