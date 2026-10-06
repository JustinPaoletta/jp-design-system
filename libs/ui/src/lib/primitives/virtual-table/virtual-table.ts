import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';
import { JpButton } from '../button/button';
import { JpCheckbox } from '../checkbox/checkbox';
import { JpPagination } from '../pagination/pagination';
import {
  JpTable,
  type JpSortableTableColumn,
  type JpTableRowKey,
  type JpTableSort,
} from '../table/table';
import type { JpTableCellValue } from '../shared/primitive-types';
export interface JpVirtualRange {
  start: number;
  end: number;
  total: number;
}
/** Zero-based range with exclusive end. Fixed rows keep geometry deterministic. */
export function jpVirtualRange(
  total: number,
  scrollTop: number,
  height: number,
  rowHeight: number,
  overscan: number,
): JpVirtualRange {
  const count = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const size = Number.isFinite(rowHeight)
    ? Math.round(Math.max(40, Math.min(160, rowHeight)))
    : 48;
  const extra = Number.isFinite(overscan)
    ? Math.min(50, Math.max(0, Math.floor(overscan)))
    : 6;
  const extent = Number.isFinite(height)
    ? Math.max(120, Math.min(1200, height))
    : 360;
  // The sticky header overlays its original 40px slot: data visible below it
  // begins at scrollTop, not scrollTop minus the header height.
  const maxTop = Math.max(0, count * size + 40 - extent);
  const top = Number.isFinite(scrollTop)
    ? Math.max(0, Math.min(maxTop, scrollTop))
    : 0;
  const visible = Math.max(1, Math.ceil((extent - 40 + (top % size)) / size));
  const start = Math.min(
    Math.max(0, count - visible),
    Math.max(0, Math.floor(top / size) - extra),
  );
  return {
    start,
    end: Math.min(count, start + visible + extra * 2),
    total: count,
  };
}
@Component({
  selector: 'jp-virtual-table',
  imports: [FormsModule, JpButton, JpCheckbox, JpPagination, JpTable],
  templateUrl: './virtual-table.html',
  styleUrl: './virtual-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpVirtualTable {
  readonly messages = inject(JP_MESSAGES);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly frame = viewChild<ElementRef<HTMLElement>>('frame');
  readonly label = input.required<string>();
  readonly columns = input<JpSortableTableColumn[]>([]);
  readonly rows = input<Record<string, JpTableCellValue>[]>([]);
  readonly rowKey = input<
    string | ((row: Record<string, JpTableCellValue>) => JpTableRowKey)
  >('id');
  readonly rowHeight = input(48);
  readonly height = input(360);
  readonly overscan = input(6);
  readonly virtual = model(true);
  readonly page = model(1);
  readonly pageSize = input(50);
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly selectedKeys = input<readonly JpTableRowKey[]>([]);
  readonly selectionChange = output<JpTableRowKey[]>();
  readonly sort = input<JpTableSort | null>(null);
  readonly sortChange = output<JpTableSort | null>();
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input('');
  readonly retry = output<void>();
  readonly rangeChange = output<JpVirtualRange>();
  readonly scrollTop = signal(0);
  readonly safeHeight = computed(() =>
    Number.isFinite(this.height())
      ? Math.max(120, Math.min(1200, this.height()))
      : 360,
  );
  readonly safeRowHeight = computed(() =>
    Number.isFinite(this.rowHeight())
      ? Math.round(Math.max(40, Math.min(160, this.rowHeight())))
      : 48,
  );
  readonly safePageSize = computed(() =>
    Number.isFinite(this.pageSize())
      ? Math.max(1, Math.min(500, Math.floor(this.pageSize())))
      : 50,
  );
  readonly range = computed(() =>
    jpVirtualRange(
      this.rows().length,
      this.scrollTop(),
      this.safeHeight(),
      this.safeRowHeight(),
      this.overscan(),
    ),
  );
  readonly visible = computed(() =>
    this.rows().slice(this.range().start, this.range().end),
  );
  readonly currentPage = computed(() =>
    Number.isFinite(this.page())
      ? Math.min(
          Math.max(1, Math.ceil(this.rows().length / this.safePageSize())),
          Math.max(1, Math.floor(this.page())),
        )
      : 1,
  );
  readonly pagedRows = computed(() =>
    this.rows().slice(
      (this.currentPage() - 1) * this.safePageSize(),
      this.currentPage() * this.safePageSize(),
    ),
  );
  readonly invalid = computed(() => {
    const keys = this.rows().map((row) => this.keyFor(row));
    return (
      new Set(keys).size !== keys.length ||
      keys.some((key) => key === null) ||
      new Set(this.columns().map((c) => c.key)).size !== this.columns().length
    );
  });
  readonly columnCount = computed(
    () => this.columns().length + Number(this.selectable()),
  );
  constructor() {
    effect(() => {
      this.rangeChange.emit(this.range());
    });
    effect(() => {
      const count = this.rows().length,
        rowHeight = this.safeRowHeight(),
        height = this.safeHeight();
      const max = Math.max(0, count * rowHeight + 40 - height);
      if (this.scrollTop() > max) {
        this.scrollTop.set(max);
        const frame = this.frame()?.nativeElement;
        if (frame) frame.scrollTop = max;
      }
    });
    effect(() => {
      const nextKeys = new Set(this.visible().map((row) => this.rowToken(row)));
      const mounted =
        this.virtual() && !this.loading() && !this.error() && !this.invalid();
      const selectable = this.selectable();
      const frame = this.frame()?.nativeElement;
      if (!frame) return;
      const active = frame.ownerDocument.activeElement as HTMLElement | null;
      const row = active?.closest<HTMLElement>('[data-row-key]');
      if (!row || !frame.contains(active)) return;
      // Component effects run before the template removes keyed rows. Recover
      // focus for input-driven sorting/filtering as well as scroll recycling.
      if (!mounted)
        this.host.nativeElement
          .querySelector<HTMLElement>('.modes button[aria-pressed="true"]')
          ?.focus();
      else if (!selectable || !nextKeys.has(row.dataset['rowKey'] ?? ''))
        frame.focus({ preventScroll: true });
    });
    afterNextRender(() => {
      const win = this.host.nativeElement.ownerDocument.defaultView;
      if (!win?.ResizeObserver) return;
      const observer = new win.ResizeObserver(() => {
        const frame = this.frame()?.nativeElement;
        if (frame && frame.scrollTop !== this.scrollTop())
          this.scrollTop.set(frame.scrollTop);
      });
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
  keyFor(row: Record<string, JpTableCellValue>): JpTableRowKey | null {
    const accessor = this.rowKey();
    const key = typeof accessor === 'function' ? accessor(row) : row[accessor];
    return typeof key === 'string' ||
      (typeof key === 'number' && Number.isFinite(key))
      ? key
      : null;
  }
  onScroll(event: Event): void {
    const frame = event.currentTarget as HTMLElement;
    const next = jpVirtualRange(
      this.rows().length,
      frame.scrollTop,
      this.safeHeight(),
      this.safeRowHeight(),
      this.overscan(),
    );
    const active = this.host.nativeElement.ownerDocument
      .activeElement as HTMLElement | null;
    const row = active?.closest<HTMLElement>('[data-row-index]');
    if (
      row &&
      frame.contains(active) &&
      (Number(row.dataset['rowIndex']) < next.start ||
        Number(row.dataset['rowIndex']) >= next.end)
    )
      frame.focus({ preventScroll: true });
    this.scrollTop.set(frame.scrollTop);
  }
  chooseMode(value: boolean): void {
    if (value === this.virtual()) return;
    this.virtual.set(value);
    this.page.set(1);
    this.scrollTop.set(0);
  }
  rowToken(row: Record<string, JpTableCellValue>): string {
    const key = this.keyFor(row);
    return key === null ? '' : typeof key + ':' + String(key);
  }
  select(row: Record<string, JpTableCellValue>, checked: boolean): void {
    const key = this.keyFor(row);
    if (key === null) return;
    const keys = new Set(this.selectedKeys());
    if (checked) keys.add(key);
    else keys.delete(key);
    this.selectionChange.emit([...keys]);
  }
  ariaSort(
    column: JpSortableTableColumn,
  ): 'ascending' | 'descending' | 'none' | null {
    return !column.sortable
      ? null
      : this.sort()?.key !== column.key
        ? 'none'
        : this.sort()?.direction === 'asc'
          ? 'ascending'
          : 'descending';
  }
  requestSort(column: JpSortableTableColumn): void {
    if (!column.sortable) return;
    const current = this.sort();
    this.sortChange.emit(
      current?.key !== column.key
        ? { key: column.key, direction: 'asc' }
        : current.direction === 'asc'
          ? { key: column.key, direction: 'desc' }
          : null,
    );
  }
  text(value: JpTableCellValue): string {
    return value === null || value === undefined ? '' : String(value);
  }
  rowLabel(row: Record<string, JpTableCellValue>): string {
    return this.text(row[this.columns()[0]?.key]);
  }
  rangeLabel(): string {
    const { start, end, total } = this.range();
    return this.messages.virtualTable.range({
      start: total ? start + 1 : 0,
      end,
      total,
    });
  }
}
