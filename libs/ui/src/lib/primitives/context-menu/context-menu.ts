import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import type { JpMenuAction } from '../split-button/split-button';
import {
  claimOverlayEvent,
  positionOverlay,
  registerOverlay,
} from '../shared/overlay-manager';
let nextContext = 0;
@Component({
  selector: 'jp-context-menu',
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'documentKeydown($event)',
    '(document:pointerdown)': 'outside($event)',
  },
})
export class JpContextMenu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly point = viewChild<ElementRef<HTMLElement>>('point');
  private readonly trigger =
    viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly region = viewChild<ElementRef<HTMLElement>>('region');
  private cleanup?: () => void;
  private restoreTarget: HTMLElement | null = null;
  private usePoint = false;
  private readonly anchorRevision = signal(0);
  readonly menuId = 'jp-context-' + ++nextContext;
  readonly label = input.required<string>();
  readonly actions = input<readonly JpMenuAction[]>([]);
  readonly triggerLabel = input(inject(JP_MESSAGES).actions.more);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly actionSelected = output<string>();
  readonly open = signal(false);
  readonly x = signal(0);
  readonly y = signal(0);
  constructor() {
    inject(DestroyRef).onDestroy(() => this.cleanup?.());
    afterRenderEffect(() => {
      this.anchorRevision();
      const panel = this.panel()?.nativeElement;
      if (this.open() && !this.disabled() && panel && !this.cleanup) {
        const anchor = (this.usePoint ? this.point() : this.trigger())
          ?.nativeElement;
        if (!anchor) return;
        const unregister = registerOverlay(this, panel.ownerDocument),
          unposition = positionOverlay(panel, anchor);
        this.cleanup = () => {
          unposition();
          unregister();
        };
        this.items()[0]?.focus();
      } else if ((!this.open() || this.disabled()) && this.cleanup) {
        const active = panel?.ownerDocument.activeElement;
        this.cleanup();
        this.cleanup = undefined;
        if (
          panel &&
          (panel.contains(active ?? null) ||
            active === panel.ownerDocument.body)
        )
          this.restoreTarget?.focus();
      }
    });
  }
  private items(): HTMLButtonElement[] {
    return Array.from(
      this.panel()?.nativeElement.querySelectorAll<HTMLButtonElement>(
        'button:not(:disabled)',
      ) ?? [],
    );
  }
  show(point: MouseEvent | null = null): void {
    if (this.disabled() || !this.actions().length) return;
    this.cleanup?.();
    this.cleanup = undefined;
    this.usePoint = !!point;
    if (point) {
      this.x.set(point.clientX);
      this.y.set(point.clientY);
    }
    this.restoreTarget = point
      ? (this.region()?.nativeElement ?? null)
      : (this.trigger()?.nativeElement ?? null);
    this.anchorRevision.update((value) => value + 1);
    this.open.set(true);
  }
  context(event: MouseEvent): void {
    if (
      this.disabled() ||
      !this.actions().length ||
      (event.target instanceof Element &&
        event.target.closest(
          'input,textarea,select,[contenteditable]:not([contenteditable="false"])',
        ))
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    this.show(event);
  }
  regionKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'ContextMenu' ||
      (event.shiftKey && event.key === 'F10')
    ) {
      if (this.disabled() || !this.actions().length) return;
      event.preventDefault();
      this.show();
      this.restoreTarget = this.region()?.nativeElement ?? null;
    }
  }
  choose(action: JpMenuAction): void {
    if (this.disabled() || action.disabled) return;
    this.open.set(false);
    this.actionSelected.emit(action.id);
  }
  menuKeydown(event: KeyboardEvent): void {
    const items = this.items(),
      index = items.indexOf(event.target as HTMLButtonElement);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!items.length) return;
      items[
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? items.length - 1
            : event.key === 'ArrowDown'
              ? (index + 1) % items.length
              : (index - 1 + items.length) % items.length
      ]?.focus();
    } else if (event.key === 'Tab') {
      this.open.set(false);
      this.restoreTarget?.focus();
    } else if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)];
      const match = ordered.find((item) =>
        item.textContent
          ?.trim()
          .toLocaleLowerCase()
          .startsWith(event.key.toLocaleLowerCase()),
      );
      if (match) {
        event.preventDefault();
        match.focus();
      }
    }
  }
  documentKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'Escape' &&
      this.open() &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    ) {
      event.preventDefault();
      this.open.set(false);
    }
  }
  outside(event: PointerEvent): void {
    const target = event.target as Node | null;
    if (
      this.open() &&
      target &&
      !this.host.nativeElement.contains(target) &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    )
      this.open.set(false);
  }
}
