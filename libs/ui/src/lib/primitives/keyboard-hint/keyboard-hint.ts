import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'jp-keyboard-hint',

  templateUrl: './keyboard-hint.html',
  styleUrl: './keyboard-hint.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpKeyboardHint {
  readonly keys = input.required<readonly string[]>();
}
