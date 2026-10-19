import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import {
  JpDropdownMenu,
  JpDropdownMenuItem,
  JpDropdownTrigger,
} from '../dropdown-menu/dropdown-menu';

export type JpBreadcrumb = {
  label: string;
  href?: string;
};

/** The final item is the current page and is always rendered as text. */
@Component({
  selector: 'jp-breadcrumbs',
  imports: [JpDropdownMenu, JpDropdownMenuItem, JpDropdownTrigger],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'jp-breadcrumbs' },
})
export class JpBreadcrumbs {
  private readonly messages = inject(JP_MESSAGES);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly items = input<readonly JpBreadcrumb[]>([]);
  readonly ariaLabel = input(this.messages.breadcrumbs.label);
  /** Maximum visible destinations. Narrow containers show up to three. */
  readonly maxItems = input(5);
  readonly overflowLabel = input(this.messages.overflow.more);
  readonly compact = signal(false);
  readonly open = signal(false);
  private readonly pendingFocus = signal<number | null>(null);
  readonly limit = computed(() => {
    const limit = Number.isFinite(this.maxItems())
      ? Math.max(2, Math.floor(this.maxItems()))
      : 5;
    return this.compact() ? Math.min(limit, 3) : limit;
  });
  readonly hiddenCount = computed(() =>
    Math.max(0, this.items().length - this.limit()),
  );
  readonly trail = computed(() =>
    this.items().map((item, index) => ({ ...item, index })),
  );
  readonly hiddenItems = computed(() =>
    this.trail().slice(1, this.hiddenCount() + 1),
  );
  readonly visibleItems = computed(() =>
    this.trail().filter(
      (item) => item.index === 0 || item.index > this.hiddenCount(),
    ),
  );

  constructor() {
    effect(() => {
      const items = this.items();
      this.limit();
      untracked(() => {
        const host = this.host.nativeElement;
        const active = host.ownerDocument.activeElement;
        if (active instanceof HTMLElement && host.contains(active)) {
          const href =
            active.getAttribute('href') ??
            host.querySelector('[role=menuitem]')?.getAttribute('href');
          const index = href
            ? items.findIndex((item) => item.href === href)
            : 0;
          this.pendingFocus.set(Math.max(0, index));
        }
        this.open.set(false);
      });
    });
    afterNextRender(() => {
      const host = this.host.nativeElement;
      const update = (width: number) => {
        const compact = width > 0 && width <= 576;
        if (compact === this.compact()) return;
        const active = host.ownerDocument.activeElement;
        if (active instanceof HTMLElement && host.contains(active)) {
          const item = active.closest<HTMLElement>('[data-breadcrumb-index]');
          this.pendingFocus.set(
            item ? Number(item.dataset['breadcrumbIndex']) : 1,
          );
        }
        this.open.set(false);
        this.compact.set(compact);
      };
      update(host.getBoundingClientRect().width);
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(([entry]) => {
        if (entry) update(entry.contentRect.width);
      });
      observer.observe(host);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
    afterRenderEffect(() => {
      if (!this.hiddenCount() && this.open()) this.open.set(false);
      this.compact();
      const index = this.pendingFocus();
      if (index === null) return;
      const host = this.host.nativeElement;
      const destination = host.querySelector<HTMLElement>(
        `.jp-breadcrumbs__list > [data-breadcrumb-index="${index}"] a`,
      );
      const fallback =
        host.querySelector<HTMLElement>('[jpDropdownTrigger]') ??
        host.querySelector<HTMLElement>('.jp-breadcrumbs__list > li a') ??
        host.querySelector<HTMLElement>('nav');
      const active = host.ownerDocument.activeElement;
      if (active === host.ownerDocument.body || host.contains(active)) {
        (destination ?? fallback)?.focus({ preventScroll: true });
      }
      this.pendingFocus.set(null);
    });
  }
}
