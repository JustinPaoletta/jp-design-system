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
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { JpEmptyState } from '../empty-state/empty-state';
import {
  type JpTableAlign,
  type JpTableCellValue,
  type JpTableColumn,
  JP_TABLE_ALIGNS,
} from '../shared/primitive-types';

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
  imports: [NgTemplateOutlet, JpEmptyState],
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
  readonly columns = input<JpTableColumn[]>([]);
  readonly rows = input<Record<string, JpTableCellValue>[]>([]);
  readonly striped = input(false, { transform: booleanAttribute });
  readonly emptyTitle = input('No data');
  readonly emptyDescription = input('');

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
