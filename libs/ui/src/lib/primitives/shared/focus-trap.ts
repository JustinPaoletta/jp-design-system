import {
  booleanAttribute,
  Directive,
  ElementRef,
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
    if (
      element.matches(':disabled') ||
      element.hasAttribute('disabled') ||
      element.tabIndex < 0
    )
      return false;
    if (element.closest('[hidden], [inert], [aria-hidden="true"]'))
      return false;
    let ancestor: HTMLElement | null = element;
    while (ancestor) {
      const style =
        ancestor.ownerDocument.defaultView?.getComputedStyle(ancestor);
      if (
        style?.display === 'none' ||
        style?.visibility === 'hidden' ||
        style?.visibility === 'collapse'
      )
        return false;
      ancestor = ancestor.parentElement;
    }
    return true;
  });
}

export function focusFirstElement(container: HTMLElement): void {
  const focusables = getFocusableElements(container);
  if (focusables.length) focusables[0].focus();
  else {
    if (!container.hasAttribute('tabindex'))
      container.setAttribute('tabindex', '-1');
    container.focus();
  }
}

export function trapTabKey(event: KeyboardEvent, container: HTMLElement): void {
  if (event.key !== 'Tab') {
    return;
  }

  const focusables = getFocusableElements(container);
  if (focusables.length === 0) {
    event.preventDefault();
    focusFirstElement(container);
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = container.ownerDocument.activeElement;
  if (!container.contains(active)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
    return;
  }

  // WebKit may skip buttons during native Tab navigation. Explicit movement
  // keeps keyboard focus inside the active trap on every platform.
  const index = focusables.indexOf(active as HTMLElement);
  event.preventDefault();
  const next = event.shiftKey
    ? (index - 1 + focusables.length) % focusables.length
    : (index + 1) % focusables.length;
  focusables[next].focus();
}

@Directive({
  selector: '[jpFocusTrap]',
  standalone: true,
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class JpFocusTrap {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly jpFocusTrap = input(true, { transform: booleanAttribute });

  onKeydown(event: KeyboardEvent): void {
    if (!this.jpFocusTrap()) {
      return;
    }
    trapTabKey(event, this.host.nativeElement);
  }
}
