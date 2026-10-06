import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpVisuallyHidden } from '../accessibility/accessibility';
@Component({
  selector: 'jp-spinner',
  imports: [JpVisuallyHidden],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpSpinner {
  private readonly messages = inject(JP_MESSAGES);
  readonly label = input(this.messages.progress.loading);
  readonly decorative = input(false, { transform: booleanAttribute });
  readonly size = input<'sm' | 'md' | 'lg'>('sm');
}
