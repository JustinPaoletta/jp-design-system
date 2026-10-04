import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { JP_MESSAGES } from '../../i18n';

@Directive({ selector: 'ng-template[jpCarouselSlide]' })
export class JpCarouselSlide {
  readonly key = input.required<string>({ alias: 'jpCarouselSlide' });
  readonly label = input('');
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/** Explicitly controlled reference cards; no motion or rotation by default. */
@Component({
  selector: 'jp-carousel',
  imports: [NgTemplateOutlet],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(focusin)': 'focusEntered()',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
  },
})
export class JpCarousel {
  readonly messages = inject(JP_MESSAGES).carousel;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly previousButton =
    viewChild<ElementRef<HTMLButtonElement>>('previous');
  readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly index = model(0);
  readonly autoRotate = input(false, { transform: booleanAttribute });
  readonly interval = input(6000);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loop = input(true, { transform: booleanAttribute });
  readonly slides = contentChildren(JpCarouselSlide);
  readonly hovered = signal(false);
  readonly focusStopped = signal(false);
  readonly paused = signal(false);
  readonly reducedMotion = signal(false);
  private readonly ready = signal(false);
  readonly current = computed(() => {
    const slides = this.slides();
    const keys = slides.map((slide) => slide.key());
    if (keys.some((key) => !key.trim()) || new Set(keys).size !== keys.length)
      throw new Error('jp-carousel requires non-empty, unique slide keys.');
    return Math.max(
      0,
      Math.min(
        slides.length - 1,
        Number.isFinite(this.index()) ? Math.trunc(this.index()) : 0,
      ),
    );
  });
  readonly rotating = computed(
    () =>
      this.ready() &&
      this.autoRotate() &&
      !this.disabled() &&
      !this.paused() &&
      !this.focusStopped() &&
      !this.reducedMotion() &&
      this.slides().length > 1,
  );
  readonly running = computed(() => this.rotating() && !this.hovered());
  readonly position = computed(() =>
    this.messages.slide({
      index: this.slides().length ? this.current() + 1 : 0,
      total: this.slides().length,
    }),
  );
  private pointer: { id: number; x: number; y: number } | null = null;
  constructor() {
    afterNextRender(() => {
      const query =
        this.host.nativeElement.ownerDocument.defaultView?.matchMedia?.(
          '(prefers-reduced-motion: reduce)',
        );
      if (query) {
        const update = () => this.reducedMotion.set(query.matches);
        update();
        query.addEventListener('change', update);
        this.destroyRef.onDestroy(() =>
          query.removeEventListener('change', update),
        );
      }
      this.ready.set(true);
    });
    effect((onCleanup) => {
      if (!this.running()) return;
      const delay = Number.isFinite(this.interval())
        ? Math.max(1000, this.interval())
        : 6000;
      const win = this.host.nativeElement.ownerDocument.defaultView;
      if (!win) return;
      const timer = win.setInterval(() => {
        if (!this.loop() && this.current() === this.slides().length - 1) {
          this.paused.set(true);
          return;
        }
        this.choose((this.current() + 1) % this.slides().length, true);
      }, delay);
      onCleanup(() => win.clearInterval(timer));
    });
    effect(() => {
      const current = this.current();
      const viewport = this.viewport()?.nativeElement;
      const doc = this.host.nativeElement.ownerDocument;
      const active = (
        doc.activeElement as HTMLElement | null
      )?.closest<HTMLElement>('[data-slide]');
      // External index changes must not leave focus in a newly hidden slide.
      if (
        active &&
        viewport?.contains(active) &&
        Number(active.dataset['slide']) !== current
      )
        viewport.focus();
    });
  }
  focusEntered(): void {
    this.focusStopped.set(true);
  }
  toggleRotation(): void {
    if (!this.autoRotate() || this.disabled() || this.reducedMotion()) return;
    if (this.rotating()) this.paused.set(true);
    else {
      this.focusStopped.set(false);
      this.paused.set(false);
    }
  }
  choose(index: number, automatic = false): void {
    if (this.disabled() || !this.slides().length) return;
    const next = Math.max(0, Math.min(this.slides().length - 1, index));
    if (next === this.current()) return;
    if (!automatic) this.focusStopped.set(true);
    const currentPanel =
      this.viewport()?.nativeElement.querySelector<HTMLElement>(
        '[data-slide]:not([hidden])',
      );
    if (
      currentPanel?.contains(
        this.host.nativeElement.ownerDocument.activeElement,
      )
    )
      this.viewport()?.nativeElement.focus();
    this.index.set(next);
  }
  step(delta: number): void {
    const size = this.slides().length;
    if (!size) return;
    const next = this.current() + delta;
    this.choose(this.loop() ? (next + size) % size : next);
  }
  private rtl(): boolean {
    return (
      this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(
        this.host.nativeElement,
      ).direction === 'rtl'
    );
  }
  onKey(event: KeyboardEvent): void {
    if (
      event.target !== event.currentTarget ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      this.disabled()
    )
      return;
    if (event.key === 'ArrowRight') this.step(this.rtl() ? -1 : 1);
    else if (event.key === 'ArrowLeft') this.step(this.rtl() ? 1 : -1);
    else if (event.key === 'Home') this.choose(0);
    else if (event.key === 'End') this.choose(this.slides().length - 1);
    else return;
    event.preventDefault();
  }
  pointerStart(event: PointerEvent): void {
    if (
      this.disabled() ||
      event.button !== 0 ||
      (event.target as HTMLElement).closest(
        'button,a,input,textarea,select,[contenteditable="true"]',
      )
    )
      return;
    this.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  pointerEnd(event: PointerEvent, cancelled = false): void {
    const pointer = this.pointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    this.pointer = null;
    if (cancelled) return;
    const x = event.clientX - pointer.x,
      y = event.clientY - pointer.y;
    if (Math.abs(x) < 40 || Math.abs(x) < Math.abs(y) * 1.2) return;
    this.step((x < 0 ? 1 : -1) * (this.rtl() ? -1 : 1));
  }
}
