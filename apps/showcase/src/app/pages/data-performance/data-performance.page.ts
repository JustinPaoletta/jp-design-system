import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JpChart, type JpChartSeries } from '@jp-design-system/ui';
import { JpVirtualTable } from '@jp-design-system/ui';
import {
  JpButton,
  JpCard,
  JpLink,
  JpNumberStepper,
  JpPageHeader,
  type JpSortableTableColumn,
  type JpTableRowKey,
  type JpTableSort,
} from '@jp-design-system/ui';
@Component({
  selector: 'app-data-performance-page',
  imports: [
    RouterLink,
    FormsModule,
    JpChart,
    JpVirtualTable,
    JpButton,
    JpCard,
    JpLink,
    JpNumberStepper,
    JpPageHeader,
  ],
  templateUrl: './data-performance.page.html',
  styleUrl: './data-performance.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPerformancePage {
  readonly type = signal<'bar' | 'line'>('bar');
  readonly labels = ['April', 'May', 'June', 'July', 'August', 'September'];
  readonly series: JpChartSeries[] = [
    { id: 'product', label: 'Falcons', values: [32, 44, 38, 58, 61, 72] },
    { id: 'platform', label: 'Bears', values: [25, 28, 40, 42, 50, 57] },
  ];
  readonly columns: JpSortableTableColumn[] = [
    { key: 'name', header: 'Player', sortable: true, width: 260 },
    { key: 'region', header: 'Position', width: 180 },
    {
      key: 'requests',
      header: 'At bats',
      sortable: true,
      align: 'end',
      width: 180,
    },
  ];
  readonly inventory = Array.from({ length: 10000 }, (_, i) => ({
    id: 'service-' + (i + 1),
    name: 'Player ' + String(i + 1).padStart(5, '0'),
    region: i % 2 ? 'Catcher' : 'Pitcher',
    requests: i + 1,
  }));
  readonly sort = signal<JpTableSort | null>(null);
  readonly selected = signal<JpTableRowKey[]>([]);
  readonly overscan = signal(6);
  readonly rows = computed(() => {
    const sort = this.sort();
    if (!sort) return this.inventory;
    return [...this.inventory].sort((a, b) => {
      const av = a[sort.key as keyof typeof a],
        bv = b[sort.key as keyof typeof b];
      return (
        (typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv))) *
        (sort.direction === 'asc' ? 1 : -1)
      );
    });
  });
}
