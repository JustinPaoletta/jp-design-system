import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  output,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';
import { JpCheckbox } from '../checkbox/checkbox';
import { NgTemplateOutlet } from '@angular/common';
import { JpEmptyState } from '../empty-state/empty-state';
import {
  type JpTableAlign,
  type JpTableCellValue,
  type JpTableColumn,
  JP_TABLE_ALIGNS,
} from '../shared/primitive-types';

export type JpTableRowKey = string | number;
export interface JpTableSort {
  key: string;
  direction: 'asc' | 'desc';
}
export interface JpSortableTableColumn extends JpTableColumn {
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface JpTableCellContext {
  $implicit: JpTableCellValue;
  value: JpTableCellValue;
  row: Record<string, JpTableCellValue>;
  column: JpTableColumn;
}

@Directive({
  selector: 'ng-template[jpTableCell]',
})
export class JpTableCellDef {
  readonly jpTableCell = input.required<string>();
  readonly templateRef = inject(TemplateRef<JpTableCellContext>);
}

export interface JpTableRowDetailContext {
  $implicit: Record<string, JpTableCellValue>;
  row: Record<string, JpTableCellValue>;
}
@Directive({ selector: 'ng-template[jpTableRowDetail]' })
export class JpTableRowDetail {
  readonly templateRef = inject(TemplateRef<JpTableRowDetailContext>);
}

@Component({
  selector: 'jp-table',
  imports: [NgTemplateOutlet, FormsModule, JpCheckbox, JpEmptyState],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-table',
    '[class.jp-table--striped]': 'striped()',
    '[class.jp-table--empty]': '!hasRows()',
  },
})
export class JpTable {
  private readonly messages = inject(JP_MESSAGES);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly id = input('');
  /** null shows every column. Invalid/empty keys fall back to the first column. */
  readonly visibleColumnKeys = input<readonly string[] | null>(null);
  readonly visibleColumnKeysChange = output<string[]>();
  readonly columnChooser = input(false, { transform: booleanAttribute });
  readonly stickyHeader = input(false, { transform: booleanAttribute });
  readonly stickyFirstColumn = input(false, { transform: booleanAttribute });
  readonly maxHeight = input('');
  readonly resizable = input(false, { transform: booleanAttribute });
  readonly columnWidths = input<Readonly<Record<string, number>>>({});
  readonly columnWidthsChange = output<Record<string, number>>();
  readonly expandedKeys = input<readonly JpTableRowKey[]>([]);
  readonly expandedKeysChange = output<JpTableRowKey[]>();
  readonly detail = contentChild(JpTableRowDetail);
  readonly expandable = computed(() => !!this.id().trim() && !!this.detail());
  readonly visibleColumns = computed(() => {
    const keys = this.visibleColumnKeys();
    const columns = this.columns();
    if (keys === null) return columns;
    const visible = columns.filter((column) => keys.includes(column.key));
    return visible.length ? visible : columns.slice(0, 1);
  });
  readonly utilityCount = computed(
    () => Number(this.selectable()) + Number(this.expandable()),
  );
  readonly fullColumnCount = computed(
    () => this.columns().length + this.utilityCount(),
  );
  readonly visibleCount = computed(
    () => this.visibleColumns().length + this.utilityCount(),
  );
  readonly tableWidth = computed(
    () =>
      this.utilityCount() * 48 +
      this.visibleColumns().reduce(
        (total, column) => total + this.widthFor(column),
        0,
      ),
  );
  private drag: {
    id: number;
    key: string;
    start: number;
    width: number;
    direction: number;
  } | null = null;

  isVisible(key: string): boolean {
    return this.visibleColumns().some((column) => column.key === key);
  }
  toggleColumn(key: string, visible: boolean): void {
    if (!this.columns().some((column) => column.key === key)) return;
    const keys = new Set(this.visibleColumns().map((column) => column.key));
    if (visible) keys.add(key);
    else keys.delete(key);
    if (!keys.size) return;
    this.visibleColumnKeysChange.emit(
      this.columns()
        .filter((column) => keys.has(column.key))
        .map((column) => column.key),
    );
  }
  columnIndex(column: JpTableColumn): number {
    return (
      this.columns().findIndex((value) => value.key === column.key) +
      this.utilityCount() +
      1
    );
  }
  widthBounds(column: JpSortableTableColumn): { min: number; max: number } {
    const min = Number.isFinite(column.minWidth)
      ? Math.max(80, column.minWidth ?? 80)
      : 80;
    const max = Number.isFinite(column.maxWidth)
      ? Math.max(min, column.maxWidth ?? 960)
      : Math.max(min, 960);
    return { min, max };
  }
  widthFor(column: JpSortableTableColumn): number {
    const { min, max } = this.widthBounds(column);
    const value = this.columnWidths()[column.key] ?? column.width ?? 180;
    return Math.round(
      Math.min(max, Math.max(min, Number.isFinite(value) ? value : 180)),
    );
  }
  resizeColumn(column: JpSortableTableColumn, value: number): void {
    if (!this.resizable() || !Number.isFinite(value)) return;
    const { min, max } = this.widthBounds(column);
    this.columnWidthsChange.emit({
      ...this.columnWidths(),
      [column.key]: Math.round(Math.min(max, Math.max(min, value))),
    });
  }
  startResize(event: PointerEvent, column: JpSortableTableColumn): void {
    if (!this.resizable() || event.button !== 0) return;
    const handle = event.currentTarget as HTMLElement;
    this.drag = {
      id: event.pointerId,
      key: column.key,
      start: event.clientX,
      width: this.widthFor(column),
      direction:
        this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(
          this.host.nativeElement,
        ).direction === 'rtl'
          ? -1
          : 1,
    };
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  moveResize(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId) return;
    const column = this.columns().find((value) => value.key === drag.key);
    if (column)
      this.resizeColumn(
        column,
        drag.width + (event.clientX - drag.start) * drag.direction,
      );
  }
  endResize(event: PointerEvent): void {
    if (this.drag?.id === event.pointerId) this.drag = null;
  }
  isExpanded(row: Record<string, JpTableCellValue>): boolean {
    const key = this.keyFor(row);
    return typeof key !== 'object' && this.expandedKeys().includes(key);
  }
  detailId(row: Record<string, JpTableCellValue>): string {
    const key = this.keyFor(row);
    return (
      this.id() +
      '-detail-' +
      typeof key +
      '-' +
      encodeURIComponent(String(key))
    );
  }
  toggleRow(row: Record<string, JpTableCellValue>): void {
    const key = this.keyFor(row);
    if (!this.expandable() || typeof key === 'object') return;
    const keys = new Set(this.expandedKeys());
    if (keys.has(key)) {
      keys.delete(key);
      const doc = this.host.nativeElement.ownerDocument;
      if (doc.getElementById(this.detailId(row))?.contains(doc.activeElement))
        doc.getElementById(this.detailId(row) + '-button')?.focus();
    } else keys.add(key);
    this.expandedKeysChange.emit([...keys]);
  }

  readonly caption = input('');
  readonly columns = input<JpSortableTableColumn[]>([]);
  readonly rows = input<Record<string, JpTableCellValue>[]>([]);
  readonly striped = input(false, { transform: booleanAttribute });
  readonly emptyTitle = input(this.messages.table.emptyTitle);
  readonly emptyDescription = input('');
  /** Use a unique field or function for stable identity across server pages. */
  readonly rowKey = input<
    string | ((row: Record<string, JpTableCellValue>) => JpTableRowKey)
  >('id');
  readonly sort = input<JpTableSort | null>(null);
  readonly sortChange = output<JpTableSort | null>();
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly selectedKeys = input<readonly JpTableRowKey[]>([]);
  readonly selectionChange = output<JpTableRowKey[]>();
  readonly rowLabel = input<(row: Record<string, JpTableCellValue>) => string>(
    (row) => this.displayValue(row[this.columns()[0]?.key]),
  );
  readonly pageKeys = computed(() =>
    this.rows()
      .map((row) => this.keyFor(row))
      .filter((key): key is JpTableRowKey => typeof key !== 'object'),
  );
  readonly allSelected = computed(
    () =>
      this.pageKeys().length > 0 &&
      this.pageKeys().every((key) => this.selectedKeys().includes(key)),
  );
  readonly someSelected = computed(
    () =>
      !this.allSelected() &&
      this.pageKeys().some((key) => this.selectedKeys().includes(key)),
  );

  keyFor(
    row: Record<string, JpTableCellValue>,
  ): JpTableRowKey | Record<string, JpTableCellValue> {
    const accessor = this.rowKey();
    const key = typeof accessor === 'function' ? accessor(row) : row[accessor];
    // Keep legacy rows without an id working with stable object identity.
    return typeof key === 'string' || typeof key === 'number' ? key : row;
  }

  isSelected(row: Record<string, JpTableCellValue>): boolean {
    const key = this.keyFor(row);
    return typeof key !== 'object' && this.selectedKeys().includes(key);
  }

  canSelect(row: Record<string, JpTableCellValue>): boolean {
    return typeof this.keyFor(row) !== 'object';
  }

  selectRow(row: Record<string, JpTableCellValue>, selected: boolean): void {
    const key = this.keyFor(row);
    if (typeof key === 'object') return;
    const keys = new Set(this.selectedKeys());
    if (selected) keys.add(key);
    else keys.delete(key);
    this.selectionChange.emit([...keys]);
  }

  selectPage(selected: boolean): void {
    const keys = new Set(this.selectedKeys());
    for (const key of this.pageKeys()) {
      if (selected) keys.add(key);
      else keys.delete(key);
    }
    this.selectionChange.emit([...keys]);
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

  sortLabel(column: JpSortableTableColumn): string {
    switch (this.ariaSort(column)) {
      case 'ascending':
        return this.messages.table.sortAscending;
      case 'descending':
        return this.messages.table.sortDescending;
      default:
        return this.messages.table.sortNone;
    }
  }

  ariaSort(
    column: JpSortableTableColumn,
  ): 'ascending' | 'descending' | 'none' | null {
    if (!column.sortable) return null;
    return this.sort()?.key === column.key
      ? this.sort()?.direction === 'asc'
        ? 'ascending'
        : 'descending'
      : 'none';
  }

  readonly projectedEmpty = contentChild(JpEmptyState);
  readonly cellDefs = contentChildren(JpTableCellDef);

  readonly hasRows = computed(() => this.rows().length > 0);

  readonly cellTemplateMap = computed(() => {
    const map = new Map<string, TemplateRef<JpTableCellContext>>();
    for (const def of this.cellDefs()) {
      map.set(def.jpTableCell(), def.templateRef);
    }
    return map;
  });

  cellTemplate(columnKey: string): TemplateRef<JpTableCellContext> | null {
    return this.cellTemplateMap().get(columnKey) ?? null;
  }

  cellValue(
    row: Record<string, JpTableCellValue>,
    columnKey: string,
  ): JpTableCellValue {
    return row[columnKey];
  }

  displayValue(value: JpTableCellValue): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  columnAlign(column: JpTableColumn): JpTableAlign {
    const align = column.align;
    if (align && (JP_TABLE_ALIGNS as readonly string[]).includes(align)) {
      return align;
    }
    return 'start';
  }
}
