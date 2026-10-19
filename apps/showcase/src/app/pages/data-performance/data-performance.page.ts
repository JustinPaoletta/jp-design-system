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

const WORLD_SERIES_ROSTER = [
  { name: 'Shohei Ohtani', position: 'Designated hitter' },
  { name: 'Mookie Betts', position: 'Right field' },
  { name: 'Freddie Freeman', position: 'First base' },
  { name: 'Teoscar Hernández', position: 'Left field' },
  { name: 'Tommy Edman', position: 'Shortstop' },
  { name: 'Will Smith', position: 'Catcher' },
  { name: 'Max Muncy', position: 'Third base' },
  { name: 'Gavin Lux', position: 'Second base' },
  { name: 'Kiké Hernández', position: 'Center field' },
  { name: 'Andy Pages', position: 'Outfield' },
  { name: 'Chris Taylor', position: 'Outfield' },
  { name: 'Miguel Rojas', position: 'Shortstop' },
  { name: 'Austin Barnes', position: 'Catcher' },
  { name: 'Jack Flaherty', position: 'Pitcher' },
  { name: 'Yoshinobu Yamamoto', position: 'Pitcher' },
  { name: 'Walker Buehler', position: 'Pitcher' },
  { name: 'Blake Treinen', position: 'Pitcher' },
  { name: 'Alex Vesia', position: 'Pitcher' },
  { name: 'Brusdar Graterol', position: 'Pitcher' },
  { name: 'Michael Kopech', position: 'Pitcher' },
  { name: 'Ryan Brasier', position: 'Pitcher' },
  { name: 'Anthony Banda', position: 'Pitcher' },
  { name: 'Daniel Hudson', position: 'Pitcher' },
  { name: 'Landon Knack', position: 'Pitcher' },
  { name: 'Ben Casparius', position: 'Pitcher' },
  { name: 'Brent Honeywell', position: 'Pitcher' },
] as const;

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
    { id: 'product', label: 'Dodgers', values: [130, 120, 141, 104, 146, 162] },
    {
      id: 'platform',
      label: 'Yankees',
      values: [129, 135, 152, 129, 123, 126],
    },
  ];
  readonly columns: JpSortableTableColumn[] = [
    { key: 'name', header: 'Player', sortable: true, width: 260 },
    { key: 'region', header: 'Position', width: 180 },
    {
      key: 'requests',
      header: 'Row',
      sortable: true,
      align: 'end',
      width: 180,
    },
  ];
  readonly inventory = Array.from({ length: 10000 }, (_, i) => {
    const player = WORLD_SERIES_ROSTER[i % WORLD_SERIES_ROSTER.length];
    return {
      id: 'service-' + (i + 1),
      name: player.name + ' ' + String(i + 1).padStart(5, '0'),
      region: player.position,
      requests: i + 1,
    };
  });
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
