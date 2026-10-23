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
      label: 'Choose your Game 6 highlights',
      description: 'Start with the plays you want to remember.',
    },
    {
      id: 'docs',
      label: 'Read the Game 6 lineup',
      description:
        'Review the players and batting order from the official box score.',
    },
    {
      id: 'release',
      label: 'Add photo credits',
      description: 'Record the photographer and source for each image.',
    },
    {
      id: 'feedback',
      label: 'Finish the game collection',
      description: 'Bring the score, photographs and your own notes together.',
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
