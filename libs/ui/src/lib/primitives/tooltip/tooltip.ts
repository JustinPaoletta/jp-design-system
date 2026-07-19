import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  type JpTooltipPlacement,
  JP_TOOLTIP_PLACEMENTS,
} from '../shared/primitive-types';
import { createStringUnionTransform } from '../shared/token-maps';

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
  },
})
export class JpTooltip {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly content = input.required<string>();
  readonly placement = input<JpTooltipPlacement, unknown>('top', {
    transform: createStringUnionTransform(JP_TOOLTIP_PLACEMENTS, 'top'),
  });

  readonly open = signal(false);
  readonly tooltipId = `jp-tooltip-${++tooltipIdCounter}`;

  constructor() {
    afterNextRender(() => {
      this.syncDescribedBy();
    });
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

  @HostListener('pointerenter')
  onPointerEnter(): void {
    this.show();
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    this.hide();
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.show();
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.hide();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open()) {
      this.hide();
    }
  }

  private syncDescribedBy(): void {
    const trigger = this.getTriggerElement();
    if (!trigger) {
      return;
    }

    if (this.open()) {
      trigger.setAttribute('aria-describedby', this.tooltipId);
    } else {
      const current = trigger.getAttribute('aria-describedby');
      if (current === this.tooltipId) {
        trigger.removeAttribute('aria-describedby');
      }
    }
  }

  private getTriggerElement(): HTMLElement | null {
    const host = this.host.nativeElement;
    const projected = host.querySelector(
      'button, a, [tabindex], input, select, textarea',
    ) as HTMLElement | null;
    return projected ?? (host.firstElementChild as HTMLElement | null);
  }
}
