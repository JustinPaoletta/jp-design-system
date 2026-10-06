import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import {
  JpPopover,
  JpPopoverContent,
  JpPopoverTrigger,
} from '../popover/popover';
import { JpLink } from '../link/link';
export interface JpOverflowItem {
  id: string;
  label: string;
  href?: string;
}
@Component({
  selector: 'jp-overflow-chip',
  imports: [JpPopover, JpPopoverContent, JpPopoverTrigger, JpLink],
  templateUrl: './overflow-chip.html',
  styleUrl: './overflow-chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpOverflowChip {
  private readonly messages = inject(JP_MESSAGES);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly items = input.required<readonly JpOverflowItem[]>();
  readonly label = input.required<string>();
  readonly moreLabel = input(this.messages.overflow.more);
  readonly open = signal(false);
  setOpen(value: boolean): void {
    const host = this.host.nativeElement;
    const panel = host.querySelector('[jpPopoverContent]');
    if (!value && panel?.contains(host.ownerDocument.activeElement))
      host.querySelector('button')?.focus();
    this.open.set(value);
  }
}
