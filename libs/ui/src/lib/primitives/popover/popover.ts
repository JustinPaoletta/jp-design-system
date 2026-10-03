import {
  afterRenderEffect,
  booleanAttribute,
  DestroyRef,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

import {
  claimOverlayEvent,
  positionOverlay,
  registerOverlay,
} from '../shared/overlay-manager';

@Directive({
  selector: '[jpPopoverTrigger]',
  standalone: true,
  host: {
    '(click)': 'onClick($event)',
    '[attr.aria-expanded]': 'popover.open()',
    '[attr.aria-controls]': 'popover.contentId',
  },
})
export class JpPopoverTrigger {
  readonly popover = inject(JpPopover);

  onClick(event: Event): void {
    event.stopPropagation();
    this.popover.toggle();
  }
}

@Directive({
  selector: '[jpPopoverContent]',
  standalone: true,
  host: {
    class: 'jp-popover__content',
    role: 'region',
    '[attr.id]': 'popover.contentId',
    '[hidden]': '!popover.open()',
  },
})
export class JpPopoverContent {
  readonly popover = inject(JpPopover);
}

@Component({
  selector: 'jp-popover',
  templateUrl: './popover.html',
  styleUrl: './popover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-popover',
    '[class.jp-popover--open]': 'open()',
    '(document:keydown)': 'onDocumentKeydown($event)',
    '(document:pointerdown)': 'onDocumentPointerDown($event)',
  },
})
export class JpPopover {
  private overlayCleanup?: () => void;
  private readonly destroyRef = inject(DestroyRef);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly open = input(false, { transform: booleanAttribute });
  readonly openChange = output<boolean>();

  readonly contentId = `jp-popover-${Math.random().toString(36).slice(2, 9)}`;

  constructor() {
    this.destroyRef.onDestroy(() => this.overlayCleanup?.());
    afterRenderEffect(() => {
      const isOpen = this.open();
      if (isOpen && !this.overlayCleanup) {
        const host = this.host.nativeElement;
        const panel = host.querySelector<HTMLElement>('.jp-popover__content');
        const anchor = host.querySelector<HTMLElement>('[jppopovertrigger]');
        if (panel && anchor) {
          const unregister = registerOverlay(this, host.ownerDocument);
          const unposition = positionOverlay(panel, anchor);
          this.overlayCleanup = () => {
            unposition();
            unregister();
          };
        }
      }
      if (!isOpen) {
        this.overlayCleanup?.();
        this.overlayCleanup = undefined;
      }
    });
  }

  toggle(): void {
    this.openChange.emit(!this.open());
  }

  close(): void {
    if (this.open()) {
      this.openChange.emit(false);
    }
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'Escape' &&
      this.open() &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    ) {
      event.preventDefault();
      this.close();
    }
  }

  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.open()) {
      return;
    }
    const target = event.target as Node | null;
    if (
      target &&
      !this.host.nativeElement.contains(target) &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    ) {
      this.close();
    }
  }
}
