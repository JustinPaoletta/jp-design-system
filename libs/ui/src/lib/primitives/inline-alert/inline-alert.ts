import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { JpButton } from '../button/button';
import { createStringUnionTransform } from '../shared/token-maps';

export const JP_INLINE_ALERT_TONES = [
  'info',
  'success',
  'warning',
  'error',
] as const;
export type JpInlineAlertTone = (typeof JP_INLINE_ALERT_TONES)[number];

@Component({
  selector: 'jp-inline-alert',
  imports: [JpButton],
  template: `
    <div class="jp-inline-alert__copy">
      @if (title()) {
        <strong>{{ title() }}</strong>
      }
      @if (message()) {
        <p>{{ message() }}</p>
      }
      <ng-content />
    </div>
    @if (actionLabel()) {
      <jp-button variant="secondary" size="sm" (click)="action.emit()">{{
        actionLabel()
      }}</jp-button>
    }
  `,
  styleUrl: './inline-alert.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-inline-alert',
    '[attr.role]': 'tone() === "error" ? "alert" : "status"',
    '[attr.aria-atomic]': 'true',
    '[class.jp-inline-alert--info]': 'tone() === "info"',
    '[class.jp-inline-alert--success]': 'tone() === "success"',
    '[class.jp-inline-alert--warning]': 'tone() === "warning"',
    '[class.jp-inline-alert--error]': 'tone() === "error"',
  },
})
export class JpInlineAlert {
  readonly tone = input<JpInlineAlertTone, unknown>('info', {
    transform: createStringUnionTransform(JP_INLINE_ALERT_TONES, 'info'),
  });
  readonly title = input('');
  readonly message = input('');
  readonly actionLabel = input('');
  readonly action = output<void>();
}
