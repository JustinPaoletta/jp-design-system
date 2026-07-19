import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';

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
  },
})
export class JpPopover {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly open = input(false, { transform: booleanAttribute });
  readonly openChange = output<boolean>();

  readonly contentId = `jp-popover-${Math.random().toString(36).slice(2, 9)}`;

  toggle(): void {
    this.openChange.emit(!this.open());
  }

  close(): void {
    if (this.open()) {
      this.openChange.emit(false);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open()) {
      event.preventDefault();
      this.close();
    }
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.open()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.close();
    }
  }
}
