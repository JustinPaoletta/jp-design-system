import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/** Decorative placeholders. Mark the containing content region aria-busy while loading. */
@Component({
  selector: 'jp-skeleton',
  template: '',
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-skeleton',
    'aria-hidden': 'true',
    '[class.jp-skeleton--circle]': 'shape() === "circle"',
    '[class.jp-skeleton--animated]': 'animated()',
  },
})
export class JpSkeleton {
  readonly shape = input<'text' | 'rectangle' | 'circle'>('text');
  readonly animated = input(true, { transform: booleanAttribute });
}
