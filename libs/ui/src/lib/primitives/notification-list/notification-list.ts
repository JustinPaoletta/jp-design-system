import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Injector,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpLink } from '../link/link';
export interface JpNotification {
  id: string;
  title: string;
  description?: string;
  group?: string;
  unread?: boolean;
  href?: string;
  timeLabel?: string;
  dateTime?: string;
}
@Component({
  selector: 'jp-notification-list',
  imports: [JpLink],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpNotificationList {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  readonly messages = inject(JP_MESSAGES).notifications;
  readonly label = input.required<string>();
  readonly items = input<readonly JpNotification[]>([]);
  readonly loading = input(false);
  readonly error = input('');
  readonly retryRequested = output<void>();
  readonly readChange = output<{ id: string; unread: boolean }>();
  readonly dismissRequested = output<string>();
  readonly markAllRequested = output<void>();
  readonly filter = signal<'all' | 'unread'>('all');
  readonly unreadCount = computed(
    () => this.items().filter((item) => item.unread).length,
  );
  readonly groups = computed(() => {
    const groups = new Map<string, JpNotification[]>();
    for (const item of this.items()) {
      if (this.filter() === 'unread' && !item.unread) continue;
      const name = item.group ?? '';
      const values = groups.get(name) ?? [];
      values.push(item);
      groups.set(name, values);
    }
    return Array.from(groups, ([name, items]) => ({ name, items }));
  });
  mark(item: JpNotification): void {
    if (!this.loading()) {
      this.recoverRemovedFocus();
      this.readChange.emit({ id: item.id, unread: !item.unread });
    }
  }
  dismiss(item: JpNotification): void {
    if (!this.loading()) {
      this.recoverRemovedFocus();
      this.dismissRequested.emit(item.id);
    }
  }
  private recoverRemovedFocus(): void {
    const host = this.host.nativeElement;
    const active = host.ownerDocument.activeElement as HTMLElement | null;
    const row = active?.closest('[data-jp-notification]');
    if (!row || !host.contains(row)) return;
    const index = Array.from(
      host.querySelectorAll('[data-jp-notification]'),
    ).indexOf(row);
    afterNextRender(
      () => {
        if (
          active?.isConnected ||
          host.ownerDocument.activeElement !== host.ownerDocument.body
        )
          return;
        const rows = host.querySelectorAll('[data-jp-notification]');
        const next =
          rows[Math.min(index, rows.length - 1)]?.querySelector<HTMLElement>(
            'button',
          );
        (
          next ?? host.querySelector<HTMLElement>('button[aria-pressed="true"]')
        )?.focus();
      },
      { injector: this.injector },
    );
  }
  markAll(): void {
    if (!this.loading() && this.unreadCount()) this.markAllRequested.emit();
  }
  retry(): void {
    if (!this.loading()) this.retryRequested.emit();
  }
}
