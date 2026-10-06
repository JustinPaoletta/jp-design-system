import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';

export const JP_CHIP_SIZES = ['sm', 'md'] as const;

export type JpChipSize = (typeof JP_CHIP_SIZES)[number];

function chipSize(value: unknown): JpChipSize {
  return value === 'sm' || value === 'md' ? value : 'md';
}

/**
 * Removable filter or selection. The consumer owns the collection.
 * Status that cannot be removed belongs on `jp-badge`.
 */
@Component({
  selector: 'jp-chip',
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-chip',
    '[class.jp-chip--sm]': 'size() === "sm"',
    '[class.jp-chip--md]': 'size() === "md"',
    '[class.jp-chip--disabled]': 'disabled()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class JpChip {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly messages = inject(JP_MESSAGES);

  readonly label = input.required<string>();

  readonly size = input<JpChipSize, unknown>('md', {
    transform: chipSize,
  });

  readonly disabled = input(false, { transform: booleanAttribute });

  readonly removed = output<void>();

  readonly removeLabel = computed(() =>
    this.messages.chip.remove(this.label()),
  );

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (event.key !== 'Delete' && event.key !== 'Backspace') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.remove();
  }

  remove(): void {
    if (this.disabled()) {
      return;
    }

    const next = this.neighborRemoveButton();
    this.removed.emit();

    if (!next) {
      return;
    }

    queueMicrotask(() => {
      if (next.isConnected) {
        next.focus();
      }
    });
  }

  /**
   * Prefer the next enabled sibling, then the previous one.
   * Focus stays the consumer's job when no sibling button remains connected
   * after this chip is destroyed.
   */
  private neighborRemoveButton(): HTMLButtonElement | null {
    const element = this.host.nativeElement;
    const parent = element.parentElement;
    if (!parent) {
      return null;
    }

    const chips = Array.from(parent.children).filter(
      (child): child is HTMLElement => child.localName === 'jp-chip',
    );
    const index = chips.indexOf(element);
    if (index < 0) {
      return null;
    }

    const candidates = [
      ...chips.slice(index + 1),
      ...chips.slice(0, index).reverse(),
    ];

    for (const chip of candidates) {
      const button = chip.querySelector('button');
      if (button && !button.disabled) {
        return button;
      }
    }

    return null;
  }
}
