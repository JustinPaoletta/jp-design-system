import {
  booleanAttribute,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';

export const JP_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(JP_FOCUSABLE_SELECTOR),
  ).filter((element) => {
    if (element.hasAttribute('disabled')) {
      return false;
    }
    if (element.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    return true;
  });
}

export function focusFirstElement(container: HTMLElement): void {
  const focusables = getFocusableElements(container);
  focusables[0]?.focus();
}

export function trapTabKey(event: KeyboardEvent, container: HTMLElement): void {
  if (event.key !== 'Tab') {
    return;
  }

  const focusables = getFocusableElements(container);
  if (focusables.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

@Directive({
  selector: '[jpFocusTrap]',
  standalone: true,
})
export class JpFocusTrap {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly jpFocusTrap = input(true, { transform: booleanAttribute });

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.jpFocusTrap()) {
      return;
    }
    trapTabKey(event, this.host.nativeElement);
  }
}
