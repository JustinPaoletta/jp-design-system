import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'jp-status-dot',

  templateUrl: './status-dot.html',
  styleUrl: './status-dot.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpStatusDot {
  readonly tone = input<'neutral' | 'success' | 'warning' | 'error' | 'info'>(
    'neutral',
  );
  /** Supply a label when this dot carries meaning; otherwise it is decorative. */
  readonly label = input('');
  readonly color = computed(() =>
    this.tone() === 'neutral'
      ? 'var(--jp-color-text-muted)'
      : `var(--jp-color-state-${this.tone()}-text)`,
  );
}
