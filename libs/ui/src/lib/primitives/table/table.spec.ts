import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpBadge } from '../badge/badge';
import { JpEmptyState } from '../empty-state/empty-state';
import { JpTable, JpTableCellDef } from './table';

@Component({
  selector: 'jp-table-populated-host',
  imports: [JpTable, JpTableCellDef, JpBadge],
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
