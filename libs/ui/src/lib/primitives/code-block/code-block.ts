import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  input,
} from '@angular/core';
import { JpCopyButton } from '../copy-button/copy-button';
@Directive({
  selector: 'code[jpInlineCode]',
  host: {
    '[style.font-family]': '"var(--jp-font-family-mono)"',
    '[style.font-size]': '"var(--jp-font-size-body)"',
    '[style.background]': '"var(--jp-color-surface-subtle)"',
    '[style.color]': '"var(--jp-color-text-primary)"',
    '[style.border-radius]': '"var(--jp-radius-sm)"',
    '[style.padding-inline]': '"var(--jp-space-2xs)"',
    '[style.overflow-wrap]': '"anywhere"',
  },
})
export class JpInlineCode {}
@Component({
  selector: 'jp-code-block',
  imports: [JpCopyButton],
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpCodeBlock {
  readonly code = input.required<string>();
  readonly label = input.required<string>();
  readonly language = input('');
  readonly copyable = input(true, { transform: booleanAttribute });
}
