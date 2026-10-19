import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { JpCopyButton } from '../copy-button/copy-button';
import { tokenizeCode } from './code-tokens';
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
  /** Basic JavaScript, TypeScript and JSON colors. Other languages stay plain. */
  readonly highlight = input(true, { transform: booleanAttribute });
  readonly copyable = input(true, { transform: booleanAttribute });
  readonly tokens = computed(() =>
    tokenizeCode(this.code(), this.highlight() ? this.language() : ''),
  );
}
