import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { type JpToastTone, JP_TOAST_TONES } from '../shared/primitive-types';
import { createStringUnionTransform } from '../shared/token-maps';

@Component({
  selector: 'jp-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-toast',
    role: 'status',
    '[class.jp-toast--neutral]': 'tone() === "neutral"',
    '[class.jp-toast--success]': 'tone() === "success"',
    '[class.jp-toast--warning]': 'tone() === "warning"',
    '[class.jp-toast--error]': 'tone() === "error"',
    '[class.jp-toast--info]': 'tone() === "info"',
  },
})
export class JpToast {
  readonly message = input.required<string>();
  readonly tone = input<JpToastTone, unknown>('neutral', {
    transform: createStringUnionTransform(JP_TOAST_TONES, 'neutral'),
  });

  readonly dismissed = output<void>();

  dismiss(): void {
    this.dismissed.emit();
  }
}
