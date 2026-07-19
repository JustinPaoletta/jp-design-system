import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostListener,
  input,
  output,
  viewChild,
} from '@angular/core';
import { JpFocusTrap, focusFirstElement } from '../shared/focus-trap';

@Directive({
  selector: '[jpDialogActions]',
  standalone: true,
  host: {
    class: 'jp-dialog__actions',
  },
})
export class JpDialogActions {}

@Component({
  selector: 'jp-dialog',
  imports: [JpFocusTrap],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-dialog',
    '[class.jp-dialog--open]': 'open()',
  },
})
export class JpDialog {
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private previousFocus: HTMLElement | null = null;
  private lastOpen = false;

  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input.required<string>();
  readonly closeLabel = input('Close dialog');

  readonly openChange = output<boolean>();

  readonly titleId = `jp-dialog-title-${Math.random().toString(36).slice(2, 9)}`;

  constructor() {
    afterRenderEffect(() => {
      const isOpen = this.open();
      const panel = this.panelRef()?.nativeElement;

      if (isOpen && !this.lastOpen) {
        this.previousFocus = document.activeElement as HTMLElement | null;
        if (panel) {
          focusFirstElement(panel);
        }
      }

      if (!isOpen && this.lastOpen) {
        this.previousFocus?.focus();
        this.previousFocus = null;
      }

      this.lastOpen = isOpen;
    });
  }

  close(): void {
    if (this.open()) {
      this.openChange.emit(false);
    }
  }

  onScrimClick(): void {
    this.close();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }
}
