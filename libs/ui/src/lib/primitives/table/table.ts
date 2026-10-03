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
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  readonly caption = input('');
  readonly columns = input<JpSortableTableColumn[]>([]);
  readonly rows = input<Record<string, JpTableCellValue>[]>([]);
  readonly striped = input(false, { transform: booleanAttribute });
  readonly emptyTitle = input('No data');
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
