import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  DestroyRef,
  inject,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  JpFocusTrap,
  focusFirstElement,
  getFocusableElements,
  JP_FOCUSABLE_SELECTOR,
} from '../shared/focus-trap';

import { JP_MESSAGES } from '../../i18n';
import { claimOverlayEvent, registerOverlay } from '../shared/overlay-manager';

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
    '(document:keydown)': 'onDocumentKeydown($event)',
    '(document:pointerdown)': 'onDocumentPointerDown($event)',
  },
})
export class JpDialog {
  private readonly panelRef = viewChild<ElementRef<HTMLDialogElement>>('panel');
  private readonly destroyRef = inject(DestroyRef);
  private unregister?: () => void;
  private previousFocus: HTMLElement | null = null;
  private pointerOpener: HTMLElement | null = null;
  private lastOpen = false;

  private readonly messages = inject(JP_MESSAGES);
  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input.required<string>();
  /** Edge placement powers the general-purpose drawer while sharing modal behavior. */
  readonly placement = input<'center' | 'start' | 'end' | 'bottom'>('center');
  readonly closeLabel = input(this.messages.dialog.close);

  readonly openChange = output<boolean>();

  readonly titleId = `jp-dialog-title-${Math.random().toString(36).slice(2, 9)}`;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.unregister?.();
      const panel = this.panelRef()?.nativeElement;
      if (panel?.isConnected && panel.open) {
        try {
          panel.close?.();
        } catch {
          /* Native teardown may have already closed it. */
        }
      }
      if (this.previousFocus?.isConnected) this.previousFocus.focus();
    });
    afterRenderEffect(() => {
      const isOpen = this.open();
      const panel = this.panelRef()?.nativeElement;

      if (isOpen && !this.lastOpen && panel?.isConnected) {
        this.previousFocus = this.getRestoreTarget(panel.ownerDocument);
        if (panel) {
          if (!panel.open) {
            try {
              if (panel.showModal) panel.showModal();
              else panel.setAttribute('open', '');
            } catch {
              // Recover from a native state race without stranding focus or
              // leaving an orphaned overlay registration.
              panel.setAttribute('open', '');
            }
          }
          this.unregister = registerOverlay(this, panel.ownerDocument);
          focusFirstElement(panel);
        }
      }

      if (!isOpen && this.lastOpen) {
        this.unregister?.();
        this.unregister = undefined;
        if (this.previousFocus?.isConnected) this.previousFocus.focus();
        this.previousFocus = null;
      }

      this.lastOpen = isOpen && !!panel?.isConnected;
    });
  }

  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.open() && event.target instanceof Element) {
      this.pointerOpener = event.target.closest<HTMLElement>(
        JP_FOCUSABLE_SELECTOR,
      );
    }
  }

  private getRestoreTarget(doc: Document): HTMLElement | null {
    const focusables = getFocusableElements(doc.body);
    const active = doc.activeElement as HTMLElement | null;
    const pointer = this.pointerOpener;
    this.pointerOpener = null;
    if (pointer && focusables.includes(pointer)) return pointer;
    // A menu item may already be hidden when its action opens a dialog.
    const menuTrigger = pointer
      ?.closest('jp-dropdown-menu')
      ?.querySelector<HTMLElement>('[jpdropdowntrigger]');
    const triggerTarget = menuTrigger
      ? (getFocusableElements(menuTrigger)[0] ?? menuTrigger)
      : null;
    if (triggerTarget && focusables.includes(triggerTarget))
      return triggerTarget;
    return active && focusables.includes(active) ? active : null;
  }

  close(): void {
    if (this.open()) {
      this.openChange.emit(false);
    }
  }

  onNativeCancel(event: Event): void {
    event.preventDefault();
    if (
      claimOverlayEvent(
        this,
        event,
        this.panelRef()?.nativeElement.ownerDocument ?? document,
      )
    )
      this.close();
  }

  onBackdropPointer(event: PointerEvent): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel || event.target !== panel) return;
    const rect = panel.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      if (claimOverlayEvent(this, event, panel.ownerDocument))
        this.onScrimClick();
    }
  }

  onScrimClick(): void {
    this.close();
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      // Keyboard activation should use its focused opener, not an older pointer.
      this.pointerOpener = null;
      return;
    }
    if (
      event.key === 'Escape' &&
      claimOverlayEvent(
        this,
        event,
        this.panelRef()?.nativeElement.ownerDocument ?? document,
      )
    ) {
      event.preventDefault();
      this.close();
    }
  }
}
