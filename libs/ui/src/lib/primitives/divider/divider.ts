import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

@Component({
  selector: 'jp-divider',

  templateUrl: './divider.html',
  styleUrl: './divider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpDivider {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly decorative = input(false, { transform: booleanAttribute });
}
