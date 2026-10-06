import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

/** Two panes with a pointer/keyboard separator. Size is the primary percentage. */
@Component({
  selector: 'jp-split-pane',
  templateUrl: './split-pane.html',
  styleUrl: './split-pane.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.jp-split-pane--vertical]': 'orientation() === "vertical"',
    '[class.jp-split-pane--mobile]': 'mobile()',
    '[class.jp-split-pane--collapsed]': 'primaryCollapsed()',
  },
})
export class JpSplitPane {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  readonly primary = viewChild<ElementRef<HTMLElement>>('primary');
  readonly separator = viewChild<ElementRef<HTMLElement>>('separator');
  /** Supply a document-unique id; no random or browser-generated identity. */
  readonly id = input.required<string>();
  readonly primaryLabel = input.required<string>();
  readonly secondaryLabel = input.required<string>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly min = input(15);
  readonly max = input(85);
  readonly step = input(1);
  readonly collapsible = input(true, { transform: booleanAttribute });
  readonly size = model(40);
  readonly collapsed = model(false);
  readonly mobile = signal(false);
  readonly bounds = computed(() => {
    const min = Number.isFinite(this.min())
      ? Math.min(100, Math.max(0, this.min()))
      : 15;
    const max = Number.isFinite(this.max())
      ? Math.min(100, Math.max(min, this.max()))
      : Math.max(min, 85);
    return { min, max };
  });
  readonly value = computed(() => this.clamp(this.size()));
  readonly primaryCollapsed = computed(
    () => this.collapsible() && this.collapsed() && !this.mobile(),
  );
  private drag: {
    id: number;
    start: number;
    value: number;
    extent: number;
    direction: number;
  } | null = null;

  constructor() {
    afterNextRender(() => {
      const win = this.host.nativeElement.ownerDocument.defaultView;
      const query = win?.matchMedia?.('(max-width: 48rem)');
      if (!query) return;
      const update = () => {
        this.mobile.set(query.matches);
        this.drag = null;
        if (
          query.matches &&
          this.host.nativeElement.ownerDocument.activeElement ===
            this.separator()?.nativeElement
        )
          afterNextRender(() => this.primary()?.nativeElement.focus(), {
            injector: this.injector,
          });
      };
      update();
      query.addEventListener('change', update);
      this.destroyRef.onDestroy(() =>
        query.removeEventListener('change', update),
      );
    });
  }
  private clamp(value: number): number {
    const { min, max } = this.bounds();
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 40));
  }
  setSize(value: number): void {
    if (this.mobile()) return;
    this.collapsed.set(false);
    this.size.set(this.clamp(value));
  }
  toggle(): void {
    if (!this.collapsible() || this.mobile()) return;
    if (
      !this.collapsed() &&
      this.primary()?.nativeElement.contains(
        this.host.nativeElement.ownerDocument.activeElement,
      )
    )
      this.separator()?.nativeElement.focus();
    this.collapsed.update((value) => !value);
  }
  onKey(event: KeyboardEvent): void {
    if (this.mobile()) return;
    const vertical = this.orientation() === 'vertical';
    const rtl =
      !vertical &&
      this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(
        this.host.nativeElement,
      ).direction === 'rtl';
    const increment =
      Number.isFinite(this.step()) && this.step() > 0 ? this.step() : 1;
    const delta = (event.shiftKey ? 10 : 1) * increment;
    const increasing = vertical
      ? 'ArrowDown'
      : rtl
        ? 'ArrowLeft'
        : 'ArrowRight';
    const decreasing = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === increasing) this.setSize(this.value() + delta);
    else if (event.key === decreasing) this.setSize(this.value() - delta);
    else if (event.key === 'Home') this.setSize(this.bounds().min);
    else if (event.key === 'End') this.setSize(this.bounds().max);
    else if (event.key === 'Enter' && this.collapsible()) this.toggle();
    else return;
    event.preventDefault();
  }
  startDrag(event: PointerEvent): void {
    if (event.button !== 0 || this.mobile()) return;
    const handle = event.currentTarget as HTMLElement;
    const vertical = this.orientation() === 'vertical';
    const frame = this.host.nativeElement.getBoundingClientRect();
    const extent = vertical
      ? frame.height - handle.offsetHeight
      : frame.width - handle.offsetWidth;
    if (extent <= 0) return;
    const rtl =
      !vertical &&
      this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(
        this.host.nativeElement,
      ).direction === 'rtl';
    this.drag = {
      id: event.pointerId,
      start: vertical ? event.clientY : event.clientX,
      value: this.primaryCollapsed() ? this.bounds().min : this.value(),
      extent,
      direction: rtl ? -1 : 1,
    };
    handle.focus();
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  moveDrag(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId) return;
    const point =
      this.orientation() === 'vertical' ? event.clientY : event.clientX;
    this.setSize(
      drag.value +
        (((point - drag.start) * drag.direction) / drag.extent) * 100,
    );
  }
  endDrag(event: PointerEvent): void {
    if (this.drag?.id !== event.pointerId) return;
    this.drag = null;
  }
}
