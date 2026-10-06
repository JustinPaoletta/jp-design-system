import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  JpButton,
  JpCard,
  JpPageHeader,
  JpReorder,
  JpCarousel,
  JpCarouselSlide,
  type JpReorderItem,
} from '@jp-design-system/ui';
@Component({
  selector: 'app-interaction-tools-page',
  imports: [
    JpButton,
    JpCard,
    JpPageHeader,
    JpReorder,
    JpCarousel,
    JpCarouselSlide,
  ],
  templateUrl: './interaction-tools.page.html',
  styleUrl: './interaction-tools.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractionToolsPage {
  private readonly doc = inject(DOCUMENT);
  readonly priorities: JpReorderItem[] = [
    {
      id: 'audit',
      label: 'Accessibility audit',
      description: 'Review keyboard and assistive-technology journeys.',
    },
    {
      id: 'docs',
      label: 'Consumer documentation',
      description: 'Show the contracts in a working application.',
    },
    {
      id: 'release',
      label: 'Release preparation',
      description: 'Review compatibility and migration notes.',
    },
    {
      id: 'feedback',
      label: 'Collect product feedback',
      description: 'Validate these patterns with real workflows.',
    },
  ];
  readonly order = signal<readonly string[]>(
    this.priorities.map((item) => item.id),
  );
  readonly storageStatus = signal('Priorities are saved on this device.');
  readonly slide = signal(0);
  readonly note = signal('');
  readonly action = signal('');
  constructor() {
    afterNextRender(() => {
      try {
        const raw = this.doc.defaultView?.localStorage.getItem(
          'jp-demo-priorities-v1',
        );
        if (!raw) return;
        const value: unknown = JSON.parse(raw);
        if (
          Array.isArray(value) &&
          value.every((id) => typeof id === 'string')
        ) {
          const ids = this.priorities.map((item) => item.id);
          const valid = [...new Set(value as string[])].filter((id) =>
            ids.includes(id),
          );
          this.order.set([
            ...valid,
            ...ids.filter((id) => !valid.includes(id)),
          ]);
        }
      } catch {
        this.storageStatus.set(
          'Storage unavailable. Priorities apply for this session.',
        );
      }
    });
  }
  save(order: readonly string[]): void {
    this.order.set(order);
    try {
      this.doc.defaultView?.localStorage.setItem(
        'jp-demo-priorities-v1',
        JSON.stringify(order),
      );
    } catch {
      this.storageStatus.set(
        'Storage unavailable. Priorities apply for this session.',
      );
    }
  }
  reset(): void {
    this.save(this.priorities.map((item) => item.id));
  }
  updateNote(event: Event): void {
    this.note.set((event.target as HTMLInputElement).value);
  }
}
