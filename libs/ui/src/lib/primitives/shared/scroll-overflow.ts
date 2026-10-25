import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  signal,
} from '@angular/core';

/** Reports hidden columns without replacing the browser's scroll behavior. */
@Directive({
  selector: '[jpScrollOverflow]',
  exportAs: 'jpScrollOverflow',
  host: { '(scroll)': 'measure()' },
})
export class JpScrollOverflow {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly overflowing = signal(false);
  readonly hasLeft = signal(false);
  readonly hasRight = signal(false);
  constructor() {
    afterNextRender(() => {
      const frame = this.host.nativeElement;
      this.measure();
      const direction = new MutationObserver(() => this.measure());
      for (
        let ancestor: HTMLElement | null = frame;
        ancestor;
        ancestor = ancestor.parentElement
      )
        direction.observe(ancestor, {
          attributes: true,
          attributeFilter: ['dir', 'class', 'style'],
        });
      this.destroyRef.onDestroy(() => direction.disconnect());
      const win = frame.ownerDocument.defaultView;
      if (!win?.ResizeObserver) return;
      const observer = new win.ResizeObserver(() => this.measure());
      observer.observe(frame);
      const table = frame.querySelector('table');
      if (table) observer.observe(table);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
  measure(): void {
    const frame = this.host.nativeElement;
    const max = frame.scrollWidth - frame.clientWidth;
    const offset = Math.max(0, Math.min(max, Math.abs(frame.scrollLeft)));
    const rtl =
      frame.ownerDocument.defaultView?.getComputedStyle(frame).direction ===
      'rtl';
    this.overflowing.set(max > 1);
    this.hasLeft.set(max > 1 && (rtl ? offset < max - 1 : offset > 1));
    this.hasRight.set(max > 1 && (rtl ? offset > 1 : offset < max - 1));
  }
}
