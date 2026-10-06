import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpDialog, JpDialogActions } from '../dialog/dialog';
@Component({
  selector: 'jp-drawer',
  imports: [JpDialog, JpDialogActions],
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpDrawer {
  private readonly messages = inject(JP_MESSAGES);
  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input.required<string>();
  readonly side = input<'start' | 'end' | 'bottom'>('end');
  readonly closeLabel = input(this.messages.drawer.close);
  readonly openChange = output<boolean>();
}
