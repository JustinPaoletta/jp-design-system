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
import { getFocusableElements } from '../shared/focus-trap';

@Directive({
  selector: '[jpDropdownTrigger]',
  standalone: true,
  host: {
    '(click)': 'onClick($event)',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'menu.open()',
    '[attr.aria-controls]': 'menu.menuId',
  },
})
export class JpDropdownTrigger {
  readonly menu = inject(JpDropdownMenu);

  onClick(event: Event): void {
    event.stopPropagation();
    this.menu.toggle();
  }
}

@Directive({
  selector: '[jpDropdownMenuItem]',
  standalone: true,
  host: {
    class: 'jp-dropdown-menu__item',
    role: 'menuitem',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class JpDropdownMenuItem {
  private readonly menu = inject(JpDropdownMenu);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly itemSelect = output<void>();

  onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.itemSelect.emit();
    this.menu.close();
  }

  onKeydown(event: KeyboardEvent): void {
    this.menu.onItemKeydown(event, this.host.nativeElement);
  }
}

@Component({
  selector: 'jp-dropdown-menu',
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-dropdown-menu',
    '[class.jp-dropdown-menu--open]': 'open()',
  },
})
export class JpDropdownMenu {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly open = input(false, { transform: booleanAttribute });
  readonly openChange = output<boolean>();

  readonly menuId = `jp-dropdown-menu-${Math.random().toString(36).slice(2, 9)}`;

  toggle(): void {
    const next = !this.open();
    this.openChange.emit(next);
    if (next) {
      queueMicrotask(() => this.focusFirstItem());
    }
  }

  close(): void {
    if (this.open()) {
      this.openChange.emit(false);
    }
  }

  focusFirstItem(): void {
    const panel = this.host.nativeElement.querySelector(
      '.jp-dropdown-menu__panel',
    ) as HTMLElement | null;
    if (!panel) {
      return;
    }
    getFocusableElements(panel)[0]?.focus();
  }

  onItemKeydown(event: KeyboardEvent, current: HTMLElement): void {
    const panel = this.host.nativeElement.querySelector(
      '.jp-dropdown-menu__panel',
    ) as HTMLElement | null;
    if (!panel) {
      return;
    }

    const focusables = getFocusableElements(panel);
    const index = focusables.indexOf(current);
    if (index < 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusables[(index + 1) % focusables.length]?.focus();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusables[(index - 1 + focusables.length) % focusables.length]?.focus();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusables[0]?.focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusables[focusables.length - 1]?.focus();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
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
