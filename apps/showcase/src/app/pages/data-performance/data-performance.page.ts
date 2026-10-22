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
  JpDisclosure,
  JpLink,
  JpNumberStepper,
  JpPageHeader,
  type JpSortableTableColumn,
  type JpTableRowKey,
  type JpTableSort,
} from '@jp-design-system/ui';

const WORLD_SERIES_ROSTER = [
  { name: 'Junior Caminero', position: 'Designated hitter' },
  { name: 'Josh Lowe', position: 'Right field' },
  { name: 'Yandy Díaz', position: 'First base' },
  { name: 'Kameron Misner', position: 'Left field' },
  { name: 'Taylor Walls', position: 'Shortstop' },
  { name: 'Ben Rortvedt', position: 'Catcher' },
  { name: 'Curtis Mead', position: 'Third base' },
  { name: 'Brandon Lowe', position: 'Second base' },
  { name: 'Jonny DeLuca', position: 'Center field' },
  { name: 'Chandler Simpson', position: 'Outfield' },
  { name: 'Jonathan Aranda', position: 'Outfield' },
  { name: 'Jose Caballero', position: 'Shortstop' },
  { name: 'Logan Driscoll', position: 'Catcher' },
  { name: 'Shane Baz', position: 'Pitcher' },
  { name: 'Taj Bradley', position: 'Pitcher' },
  { name: 'Ryan Pepiot', position: 'Pitcher' },
  { name: 'Pete Fairbanks', position: 'Pitcher' },
  { name: 'Drew Rasmussen', position: 'Pitcher' },
  { name: 'Zack Littell', position: 'Pitcher' },
  { name: 'Edwin Uceta', position: 'Pitcher' },
  { name: 'Kevin Kelly', position: 'Pitcher' },
  { name: 'Mason Montgomery', position: 'Pitcher' },
  { name: 'Colin Poche', position: 'Pitcher' },
  { name: 'Ian Seymour', position: 'Pitcher' },
  { name: 'Jacob Lopez', position: 'Pitcher' },
  { name: 'Garrett Cleavinger', position: 'Pitcher' },
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
    JpDisclosure,
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
    { id: 'product', label: 'Rays', values: [130, 120, 141, 104, 146, 162] },
    {
      id: 'platform',
      label: 'ALCS Game 6',
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
