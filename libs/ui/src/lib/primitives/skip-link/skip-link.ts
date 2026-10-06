import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
@Component({
  selector: 'jp-skip-link',
  templateUrl: './skip-link.html',
  styleUrl: './skip-link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpSkipLink {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private restore?: () => void;
  readonly target = input.required<string>();
  readonly label = input(inject(JP_MESSAGES).actions.skip);
  constructor() {
    inject(DestroyRef).onDestroy(() => this.restore?.());
  }
  activate(event: MouseEvent): void {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const target = this.host.nativeElement.ownerDocument.getElementById(
      this.target(),
    );
    if (!target) return;
    event.preventDefault();
    this.restore?.();
    const original = target.getAttribute('tabindex');
    if (original === null) target.setAttribute('tabindex', '-1');
    const cleanup = () => {
      target.removeEventListener('blur', cleanup);
      if (original === null && target.getAttribute('tabindex') === '-1')
        target.removeAttribute('tabindex');
      this.restore = undefined;
    };
    this.restore = cleanup;
    target.addEventListener('blur', cleanup, { once: true });
    target.focus();
    target.scrollIntoView?.({ block: 'start' });
  }
}
