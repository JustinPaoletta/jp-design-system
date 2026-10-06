import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { JP_MESSAGES } from '../../i18n';

export interface JpReorderItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
export interface JpReorderContext {
  $implicit: JpReorderItem;
  index: number;
}
@Directive({ selector: 'ng-template[jpReorderContent]' })
export class JpReorderContent {
  readonly template = inject<TemplateRef<JpReorderContext>>(TemplateRef);
  static ngTemplateContextGuard(
    _directive: JpReorderContent,
    context: unknown,
  ): context is JpReorderContext {
    void context;
    return true;
  }
}

/** A single-list reorder surface. Draft movement commits only on drop. */
@Component({
  selector: 'jp-reorder',
  imports: [NgTemplateOutlet],
  templateUrl: './reorder.html',
  styleUrl: './reorder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(pointermove)': 'pointerMove($event)',
    '(pointerup)': 'pointerEnd($event)',
    '(pointercancel)': 'pointerEnd($event, true)',
    '(lostpointercapture)': 'pointerLost($event)',
  },
})
export class JpReorder {
  readonly messages = inject(JP_MESSAGES).reorder;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly items = input.required<readonly JpReorderItem[]>();
  readonly order = model<readonly string[]>([]);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly content = contentChild(JpReorderContent);
  readonly activeId = signal<string | null>(null);
  readonly draft = signal<readonly string[] | null>(null);
  readonly announcement = signal('');
  readonly normalized = computed(() => {
    const items = this.items();
    const ids = items.map((item) => item.id);
    if (ids.some((id) => !id.trim()) || new Set(ids).size !== ids.length)
      throw new Error('jp-reorder requires non-empty, unique item ids.');
    const allowed = new Set(ids);
    const supplied = [...new Set(this.order())].filter((id) => allowed.has(id));
    return [...supplied, ...ids.filter((id) => !supplied.includes(id))];
  });
  readonly rows = computed(() => {
    const byId = new Map(this.items().map((item) => [item.id, item]));
    return (this.draft() ?? this.normalized())
      .map((id) => byId.get(id))
      .filter((item): item is JpReorderItem => !!item);
  });
  private origin: readonly string[] = [];
  private pointer: {
    id: number;
    item: string;
    x: number;
    y: number;
    started: boolean;
  } | null = null;
  private suppressClick = false;
  constructor() {
    effect(() => {
      const current = this.normalized();
      if (
        this.activeId() &&
        (this.disabled() ||
          !this.items().some(
            (item) => item.id === this.activeId() && !item.disabled,
          ) ||
          current.length !== this.origin.length ||
          current.some((id, index) => id !== this.origin[index]))
      )
        this.cancel();
    });
  }
  private focus(id: string, action = 'handle'): void {
    afterNextRender(
      () => {
        const button = Array.from(
          this.host.nativeElement.querySelectorAll<HTMLButtonElement>(
            'button[data-item]',
          ),
        ).find(
          (el) => el.dataset['item'] === id && el.dataset['action'] === action,
        );
        button?.focus();
      },
      { injector: this.injector },
    );
  }
  private canMove(item: JpReorderItem): boolean {
    return !this.disabled() && !item.disabled;
  }
  pickUp(item: JpReorderItem): void {
    if (!this.canMove(item) || this.activeId()) return;
    this.origin = [...this.normalized()];
    this.draft.set(this.origin);
    this.activeId.set(item.id);
    this.announcement.set(this.messages.picked(item.label));
  }
  toggle(item: JpReorderItem): void {
    if (this.suppressClick) {
      this.suppressClick = false;
      return;
    }
    if (this.activeId() === item.id) this.drop();
    else this.pickUp(item);
  }
  private moveTo(id: string, index: number): void {
    const current = [...(this.draft() ?? this.normalized())];
    const from = current.indexOf(id);
    const to = Math.max(0, Math.min(current.length - 1, index));
    if (from < 0 || from === to) return;
    current.splice(from, 1);
    current.splice(to, 0, id);
    this.draft.set(current);
    const item = this.items().find((row) => row.id === id);
    if (item)
      this.announcement.set(
        this.messages.moved({
          label: item.label,
          position: to + 1,
          total: current.length,
        }),
      );
  }
  move(item: JpReorderItem, delta: number, action: string): void {
    if (!this.canMove(item) || this.activeId()) return;
    const before = this.normalized();
    const from = before.indexOf(item.id);
    if (from + delta < 0 || from + delta >= before.length) return;
    this.moveTo(item.id, from + delta);
    this.order.set([...(this.draft() ?? before)]);
    this.draft.set(null);
    this.focus(item.id, action);
  }
  drop(): void {
    const id = this.activeId();
    if (!id) return;
    const label = this.items().find((item) => item.id === id)?.label ?? id;
    const next = [...(this.draft() ?? this.normalized())];
    this.activeId.set(null);
    this.draft.set(null);
    this.pointer = null;
    this.order.set(next);
    this.announcement.set(this.messages.dropped(label));
    this.focus(id);
  }
  cancel(): void {
    const id = this.activeId();
    if (!id) {
      this.pointer = null;
      return;
    }
    const label = this.items().find((item) => item.id === id)?.label ?? id;
    this.activeId.set(null);
    this.draft.set(null);
    this.pointer = null;
    this.announcement.set(this.messages.cancelled(label));
    this.focus(id);
  }
  onKey(event: KeyboardEvent, item: JpReorderItem): void {
    if (this.activeId() !== item.id) return;
    const index = this.rows().findIndex((row) => row.id === item.id);
    if (event.key === 'ArrowUp') this.moveTo(item.id, index - 1);
    else if (event.key === 'ArrowDown') this.moveTo(item.id, index + 1);
    else if (event.key === 'Home') this.moveTo(item.id, 0);
    else if (event.key === 'End') this.moveTo(item.id, this.rows().length - 1);
    else if (event.key === 'Escape') this.cancel();
    else return;
    event.preventDefault();
    this.focus(item.id);
  }
  pointerStart(event: PointerEvent, item: JpReorderItem): void {
    if (event.button !== 0 || !this.canMove(item) || this.activeId()) return;
    this.pointer = {
      id: event.pointerId,
      item: item.id,
      x: event.clientX,
      y: event.clientY,
      started: false,
    };
    try {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    } catch {
      /* Synthetic story events have no active native pointer. */
    }
  }
  pointerMove(event: PointerEvent): void {
    const p = this.pointer;
    if (!p || p.id !== event.pointerId) return;
    if (!p.started && Math.hypot(event.clientX - p.x, event.clientY - p.y) < 6)
      return;
    if (!p.started) {
      const item = this.items().find((row) => row.id === p.item);
      if (!item) return;
      this.pickUp(item);
      p.started = true;
      try {
        this.host.nativeElement.setPointerCapture(event.pointerId);
      } catch {
        /* Keep keyboard and click alternatives available. */
      }
      Array.from(
        this.host.nativeElement.querySelectorAll<HTMLButtonElement>(
          'button[data-action=handle]',
        ),
      )
        .find((button) => button.dataset['item'] === p.item)
        ?.focus();
    }
    const rows = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('li[data-row]'),
    );
    let to = rows.length - 1;
    for (let i = 0; i < rows.length; i++) {
      const box = rows[i].getBoundingClientRect();
      if (event.clientY < box.top + box.height / 2) {
        to = i;
        break;
      }
    }
    this.moveTo(p.item, to);
    event.preventDefault();
  }
  pointerLost(event: PointerEvent): void {
    if (event.target === this.host.nativeElement) this.pointerEnd(event, true);
  }
  pointerEnd(event: PointerEvent, cancelled = false): void {
    const p = this.pointer;
    if (!p || p.id !== event.pointerId) return;
    this.pointer = null;
    if (p.started) {
      this.suppressClick = !cancelled;
      this.host.nativeElement.ownerDocument.defaultView?.setTimeout(() => {
        this.suppressClick = false;
      }, 0);
      if (cancelled) this.cancel();
      else this.drop();
    }
  }
}
