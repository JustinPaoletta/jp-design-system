import {
  afterNextRender,
  afterRenderEffect,
  DestroyRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  type JpTooltipPlacement,
  JP_TOOLTIP_PLACEMENTS,
} from '../shared/primitive-types';
import { createStringUnionTransform } from '../shared/token-maps';

import {
  claimOverlayEvent,
  positionOverlay,
  registerOverlay,
} from '../shared/overlay-manager';

let tooltipIdCounter = 0;

@Component({
  selector: 'jp-tooltip',
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-tooltip',
    '[class.jp-tooltip--top]': 'placement() === "top"',
    '[class.jp-tooltip--bottom]': 'placement() === "bottom"',
    '[class.jp-tooltip--left]': 'placement() === "left"',
    '[class.jp-tooltip--right]': 'placement() === "right"',
    '[class.jp-tooltip--open]': 'open()',
    '(pointerenter)': 'onPointerEnter()',
    '(pointerleave)': 'onPointerLeave()',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut($event)',
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
})
export class JpTooltip {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly destroyRef = inject(DestroyRef);
  private overlayCleanup?: () => void;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private hovered = false;
  private focused = false;

  readonly content = input.required<string>();
  readonly placement = input<JpTooltipPlacement, unknown>('top', {
    transform: createStringUnionTransform(JP_TOOLTIP_PLACEMENTS, 'top'),
  });

  readonly open = signal(false);
  readonly tooltipId = `jp-tooltip-${++tooltipIdCounter}`;

  constructor() {
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.hideTimer);
      this.open.set(false);
      this.syncDescribedBy();
      this.overlayCleanup?.();
    });
    afterRenderEffect(() => {
      const open = this.open();
      const placement = this.placement();
      this.overlayCleanup?.();
      this.overlayCleanup = undefined;
      if (open) {
        const panel =
          this.host.nativeElement.querySelector<HTMLElement>(
            '[role="tooltip"]',
          );
        const trigger = this.getTriggerElement();
        if (panel && trigger) {
          const unregister = registerOverlay(this, panel.ownerDocument);
          const unposition = positionOverlay(panel, trigger, placement);
          this.overlayCleanup = () => {
            unposition();
            unregister();
          };
        }
      }
    });
    afterNextRender(() => {
      this.syncDescribedBy();
    });
  }

  onPointerEnter(): void {
    this.hovered = true;
    clearTimeout(this.hideTimer);
    this.show();
  }
  onPointerLeave(): void {
    this.hovered = false;
    this.hideTimer = setTimeout(() => {
      if (!this.focused && !this.hovered) this.hide();
    }, 100);
  }
  onFocusIn(): void {
    this.focused = true;
    this.show();
  }
  onFocusOut(event: FocusEvent): void {
    if (
      event.relatedTarget instanceof Node &&
      this.host.nativeElement.contains(event.relatedTarget)
    )
      return;
    this.focused = false;
    if (!this.hovered) this.hide();
  }

  show(): void {
    if (!this.content()) {
      return;
    }
    this.open.set(true);
    this.syncDescribedBy();
  }

  hide(): void {
    this.open.set(false);
    this.syncDescribedBy();
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'Escape' &&
      this.open() &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    ) {
      event.preventDefault();
      this.hide();
    }
  }

  private syncDescribedBy(): void {
    const trigger = this.getTriggerElement();
    if (!trigger) {
      return;
    }

    const tokens = new Set(
      (trigger.getAttribute('aria-describedby') ?? '')
        .split(/\s+/)
        .filter(Boolean),
    );
    if (this.open()) tokens.add(this.tooltipId);
    else tokens.delete(this.tooltipId);
    if (tokens.size)
      trigger.setAttribute('aria-describedby', [...tokens].join(' '));
    else trigger.removeAttribute('aria-describedby');
  }

  private getTriggerElement(): HTMLElement | null {
    const host = this.host.nativeElement;
    const projected = host.querySelector(
      'button, a, [tabindex], input, select, textarea',
    ) as HTMLElement | null;
    return projected ?? (host.firstElementChild as HTMLElement | null);
  }
}
