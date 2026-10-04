import { ChangeDetectionStrategy, Component, input } from '@angular/core';
@Component({
  selector: 'jp-button-group',
  templateUrl: './button-group.html',
  styleUrl: './button-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.aria-label]': 'label()',
    '[class.vertical]': 'orientation() === "vertical"',
  },
})
export class JpButtonGroup {
  readonly label = input.required<string>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
