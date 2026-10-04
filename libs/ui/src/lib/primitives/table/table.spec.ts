import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpBadge } from '../badge/badge';
import { JpEmptyState } from '../empty-state/empty-state';
import {
  JpTable,
  JpTableCellDef,
  JpTableRowDetail,
  type JpTableRowKey,
} from './table';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'jp-table-populated-host',
  imports: [JpTable, JpTableCellDef, JpBadge],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <jp-table
      caption="Deployments"
      [columns]="columns"
      [rows]="rows"
      [striped]="true"
    >
      <ng-template jpTableCell="status" let-value>
        <jp-badge tone="success">{{ value }}</jp-badge>
      </ng-template>
    </jp-table>
  `,
})
class TablePopulatedHost {
  readonly columns = [
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status', align: 'center' as const },
    { key: 'region', header: 'Region', align: 'end' as const },
  ];
  readonly rows = [
    { name: 'api-gateway', status: 'Healthy', region: 'us-east-1' },
    { name: 'worker', status: 'Healthy', region: 'eu-west-1' },
  ];
}

@Component({
  selector: 'jp-table-empty-host',
  imports: [JpTable, JpEmptyState],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <jp-table caption="Deployments" [columns]="columns" [rows]="[]">
      <jp-empty-state
        title="No deployments"
        description="Create one to get started."
      />
    </jp-table>
  `,
})
class TableEmptyHost {
  readonly columns = [
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
  ];
}

@Component({
  selector: 'jp-table-fallback-host',
  imports: [JpTable],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <jp-table
      [columns]="columns"
      [rows]="[]"
      emptyTitle="Fallback empty"
      emptyDescription="No projected empty state."
    />
  `,
})
class TableFallbackHost {
  readonly columns = [{ key: 'name', header: 'Name' }];
}

describe('JpTable', () => {
  it('renders caption, headers, rows, and cell templates', async () => {
    await TestBed.configureTestingModule({
      imports: [TablePopulatedHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(TablePopulatedHost);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('caption')?.textContent).toContain('Deployments');
    expect(root.querySelectorAll('th').length).toBe(3);
    expect(root.querySelectorAll('tbody tr').length).toBe(2);
    expect(root.querySelector('jp-badge')?.textContent).toContain('Healthy');
    expect(
      (root.querySelector('jp-table') as HTMLElement).classList.contains(
        'jp-table--striped',
      ),
    ).toBe(true);
  });

  it('shows projected empty state when there are no rows', async () => {
    await TestBed.configureTestingModule({
      imports: [TableEmptyHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(TableEmptyHost);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('tbody')).toBeNull();
    expect(root.querySelector('.jp-empty-state__title')?.textContent).toContain(
      'No deployments',
    );
    expect(
      (root.querySelector('jp-table') as HTMLElement).classList.contains(
        'jp-table--empty',
      ),
    ).toBe(true);
  });

  it('renders fallback empty state when none is projected', async () => {
    await TestBed.configureTestingModule({
      imports: [TableFallbackHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(TableFallbackHost);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.jp-empty-state__title')?.textContent).toContain(
      'Fallback empty',
    );
    expect(
      root.querySelector('.jp-empty-state__description')?.textContent,
    ).toContain('No projected empty state.');
  });

  it('formats nullish cell values as empty strings', async () => {
    @Component({
      selector: 'jp-table-null-host',
      imports: [JpTable],
      template: `<jp-table [columns]="columns" [rows]="rows" />`,
    })
    class TableNullHost {
      readonly columns = [{ key: 'name', header: 'Name' }];
      readonly rows = [{ name: null }];
    }

    await TestBed.configureTestingModule({
      imports: [TableNullHost],
    }).compileComponents();

    const fixture: ComponentFixture<TableNullHost> =
      TestBed.createComponent(TableNullHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('td')?.textContent?.trim()).toBe(
      '',
    );
  });
});

describe('JpTable controlled toolkit', () => {
  it('requests a three-state sort and exposes the controlled direction', () => {
    const fixture = TestBed.createComponent(JpTable);
    const column = { key: 'name', header: 'Name', sortable: true };
    fixture.componentRef.setInput('columns', [
      column,
      { key: 'status', header: 'Status' },
    ]);
    fixture.detectChanges();
    const emit = jest.spyOn(fixture.componentInstance.sortChange, 'emit');
    const button = fixture.nativeElement.querySelector(
      '.jp-table__sort',
    ) as HTMLButtonElement;
    button.click();
    expect(emit).toHaveBeenLastCalledWith({ key: 'name', direction: 'asc' });
    expect(
      fixture.nativeElement.querySelector('th')?.getAttribute('aria-sort'),
    ).toBe('none');
    fixture.componentRef.setInput('sort', { key: 'name', direction: 'asc' });
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('th')?.getAttribute('aria-sort'),
    ).toBe('ascending');
    button.click();
    expect(emit).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
    fixture.componentRef.setInput('sort', { key: 'name', direction: 'desc' });
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('th')?.getAttribute('aria-sort'),
    ).toBe('descending');
    button.click();
    expect(emit).toHaveBeenLastCalledWith(null);
    fixture.componentInstance.requestSort({ key: 'status', header: 'Status' });
    expect(emit).toHaveBeenCalledTimes(3);
    expect(
      fixture.nativeElement
        .querySelectorAll('th')[1]
        ?.hasAttribute('aria-sort'),
    ).toBe(false);
  });

  it('preserves off-page selections and renders select-all indeterminate', async () => {
    const fixture = TestBed.createComponent(JpTable);
    const rows = [
      { id: 'one', name: 'API' },
      { id: 'two', name: 'Worker' },
    ];
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('columns', [{ key: 'name', header: 'Name' }]);
    fixture.componentRef.setInput('selectable', true);
    fixture.componentRef.setInput('selectedKeys', ['one', 'off-page']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll(
      'input[type=checkbox]',
    );
    expect(inputs[0].indeterminate).toBe(true);
    expect(inputs[1].checked).toBe(true);
    const emit = jest.spyOn(fixture.componentInstance.selectionChange, 'emit');
    inputs[0].click();
    expect(emit).toHaveBeenLastCalledWith(['one', 'off-page', 'two']);
    expect(fixture.componentInstance.selectedKeys()).toEqual([
      'one',
      'off-page',
    ]);
    fixture.componentRef.setInput('selectedKeys', ['one', 'two', 'off-page']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(inputs[0].checked).toBe(true);
    expect(inputs[0].indeterminate).toBe(false);
    inputs[0].click();
    expect(emit).toHaveBeenLastCalledWith(['off-page']);
    fixture.componentInstance.selectRow(rows[0], false);
    expect(emit).toHaveBeenLastCalledWith(['two', 'off-page']);
    fixture.componentInstance.selectRow(rows[0], true);
    expect(emit).toHaveBeenLastCalledWith(['one', 'two', 'off-page']);
  });

  it('tracks rows by stable keys through reordering and supports key functions', () => {
    const fixture = TestBed.createComponent(JpTable);
    const rows = [
      { id: 1, name: 'API' },
      { id: 2, name: 'Worker' },
    ];
    fixture.componentRef.setInput('columns', [{ key: 'name', header: 'Name' }]);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('tbody tr');
    fixture.componentRef.setInput('rows', [rows[1], { ...rows[0] }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr')[1]).toBe(first);
    fixture.componentRef.setInput('rowKey', (row: Record<string, unknown>) =>
      String(row['name']),
    );
    expect(fixture.componentInstance.keyFor(rows[0])).toBe('API');
  });

  it('keeps legacy rows stable but requires valid keys for selection', () => {
    const fixture = TestBed.createComponent(JpTable);
    const row = { name: 'Legacy' };
    fixture.componentRef.setInput('rows', [row]);
    fixture.componentRef.setInput('columns', [
      { key: 'name', header: 'Name', align: 'invalid' },
    ]);
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();
    expect(fixture.componentInstance.keyFor(row)).toBe(row);
    expect(fixture.nativeElement.querySelectorAll('input')[1].disabled).toBe(
      true,
    );
    expect(fixture.componentInstance.isSelected(row)).toBe(false);
    const emit = jest.spyOn(fixture.componentInstance.selectionChange, 'emit');
    fixture.componentInstance.selectRow(row, true);
    expect(emit).not.toHaveBeenCalled();
    expect(
      fixture.componentInstance.columnAlign({ key: 'name', header: 'Name' }),
    ).toBe('start');
  });
});

@Component({
  selector: 'jp-table-advanced-test',
  imports: [JpTable, JpTableRowDetail],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<jp-table
    id="test-table"
    [columns]="columns"
    [rows]="rows"
    columnChooser
    resizable
    stickyHeader
    stickyFirstColumn
    selectable
    maxHeight="20rem"
    [visibleColumnKeys]="visible"
    (visibleColumnKeysChange)="visible = $event"
    [columnWidths]="widths"
    (columnWidthsChange)="widths = $event"
    [expandedKeys]="expanded"
    (expandedKeysChange)="expanded = $event"
  >
    <ng-template jpTableRowDetail let-row
      ><button type="button">Review {{ row.name }}</button></ng-template
    >
  </jp-table>`,
})
class TableAdvancedTest {
  readonly columns = [
    { key: 'name', header: 'Name', width: 200, minWidth: 120, maxWidth: 400 },
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status' },
  ];
  rows = [
    { id: 'one', name: 'API', owner: 'Product', status: 'Healthy' },
    { id: 'two', name: 'Jobs', owner: 'Platform', status: 'Healthy' },
  ];
  visible = ['name', 'owner', 'status'];
  widths: Record<string, number> = {};
  expanded: JpTableRowKey[] = [];
}
describe('JpTable advanced features', () => {
  function setup() {
    const fixture = TestBed.createComponent(TableAdvancedTest);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    return fixture;
  }
  it('preserves original column indices and prevents hiding every column', async () => {
    const fixture = setup();
    await fixture.whenStable();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const table = fixture.debugElement.query(By.directive(JpTable))
      .componentInstance as JpTable;
    table.toggleColumn('owner', false);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(host.visible).toEqual(['name', 'status']);
    expect(
      Array.from(fixture.nativeElement.querySelectorAll('thead th')).map(
        (th: unknown) => (th as HTMLElement).getAttribute('aria-colindex'),
      ),
    ).toEqual(['1', '2', '3', '5']);
    expect(
      fixture.nativeElement
        .querySelector('table')
        .getAttribute('aria-colcount'),
    ).toBe('5');
    table.toggleColumn('status', false);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    table.toggleColumn('name', false);
    expect(host.visible).toEqual(['name']);
    table.toggleColumn('missing', true);
    expect(host.visible).toEqual(['name']);
    table.toggleColumn('owner', true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(host.visible).toEqual(['name', 'owner']);
    host.visible = [];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(table.visibleColumns().map((column) => column.key)).toEqual([
      'name',
    ]);
  });
  it('keeps expansion controlled, stable across reordering, and preserves off-page keys', () => {
    const fixture = setup();
    const table = fixture.debugElement.query(By.directive(JpTable))
      .componentInstance as JpTable;
    fixture.componentInstance.expanded = ['off-page'];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      '.jp-table__expand',
    ) as HTMLButtonElement;
    button.click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.componentInstance.expanded).toEqual(['off-page', 'one']);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe(
      'test-table-detail-string-one',
    );
    expect(
      fixture.nativeElement.querySelector('.jp-table__detail-row td').colSpan,
    ).toBe(5);
    fixture.componentInstance.rows = fixture.componentInstance.rows
      .slice()
      .reverse();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.jp-table__detail-row').textContent,
    ).toContain('Review API');
    document.body.appendChild(fixture.nativeElement);
    const detail = fixture.nativeElement.querySelector(
      '.jp-table__detail-row button',
    ) as HTMLButtonElement;
    detail.focus();
    table.toggleRow(fixture.componentInstance.rows[1]);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(document.activeElement).toBe(button);
    expect(fixture.componentInstance.expanded).toEqual(['off-page']);
    fixture.nativeElement.remove();
  });
  it('requires explicit unique identity and a template before enabling expansion', () => {
    const fixture = TestBed.createComponent(JpTable);
    fixture.componentRef.setInput('rows', [{ name: 'Legacy' }]);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const emit = jest.spyOn(
      fixture.componentInstance.expandedKeysChange,
      'emit',
    );
    fixture.componentInstance.toggleRow({ name: 'Legacy' });
    expect(emit).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.jp-table__expand')).toBeNull();
    const hosted = setup();
    const table = hosted.debugElement.query(By.directive(JpTable))
      .componentInstance as JpTable;
    table.toggleRow({ name: 'Legacy' });
    expect(hosted.componentInstance.expanded).toEqual([]);
  });
  it('clamps exact column widths and ignores invalid changes', () => {
    const fixture = setup();
    const table = fixture.debugElement.query(By.directive(JpTable))
      .componentInstance as JpTable;
    table.resizeColumn(fixture.componentInstance.columns[0], 10);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.componentInstance.widths).toEqual({ name: 120 });
    table.resizeColumn(fixture.componentInstance.columns[0], 900);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(table.widthFor(fixture.componentInstance.columns[0])).toBe(400);
    table.resizeColumn(fixture.componentInstance.columns[0], NaN);
    expect(fixture.componentInstance.widths).toEqual({ name: 400 });
    expect(
      table.widthBounds({
        key: 'x',
        header: 'X',
        minWidth: NaN,
        maxWidth: NaN,
      }),
    ).toEqual({ min: 80, max: 960 });
    expect(
      table.widthBounds({
        key: 'x',
        header: 'X',
        minWidth: 300,
        maxWidth: 100,
      }),
    ).toEqual({ min: 300, max: 300 });
    expect(table.widthFor({ key: 'x', header: 'X', width: Infinity })).toBe(
      180,
    );
    const isolated = TestBed.createComponent(JpTable);
    isolated.componentInstance.resizeColumn({ key: 'x', header: 'X' }, 200);
    expect(isolated.componentInstance.columnWidths()).toEqual({});
  });
  it('supports pointer resize, cancellation, mismatched pointers and RTL direction', () => {
    const fixture = setup();
    const table = fixture.debugElement.query(By.directive(JpTable))
      .componentInstance as JpTable;
    const column = fixture.componentInstance.columns[0];
    const handle = fixture.nativeElement.querySelector(
      '.jp-table__resize',
    ) as HTMLElement;
    handle.setPointerCapture = jest.fn();
    const pointer = (overrides: object = {}) =>
      ({
        button: 0,
        pointerId: 1,
        clientX: 200,
        currentTarget: handle,
        preventDefault: jest.fn(),
        ...overrides,
      }) as unknown as PointerEvent;
    table.startResize(pointer({ button: 2 }), column);
    table.moveResize(pointer({ clientX: 250 }));
    expect(fixture.componentInstance.widths).toEqual({});
    table.startResize(pointer(), column);
    table.moveResize(pointer({ pointerId: 2, clientX: 250 }));
    expect(fixture.componentInstance.widths).toEqual({});
    table.moveResize(pointer({ clientX: 250 }));
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.componentInstance.widths.name).toBe(250);
    table.endResize(pointer({ pointerId: 2 }));
    table.moveResize(pointer({ clientX: 260 }));
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.componentInstance.widths.name).toBe(260);
    table.endResize(pointer());
    table.moveResize(pointer({ clientX: 500 }));
    expect(fixture.componentInstance.widths.name).toBe(260);
    fixture.nativeElement.querySelector('jp-table').style.direction = 'rtl';
    table.startResize(pointer(), column);
    table.moveResize(pointer({ clientX: 240 }));
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.componentInstance.widths.name).toBe(220);
    table.endResize(pointer());
  });
});
