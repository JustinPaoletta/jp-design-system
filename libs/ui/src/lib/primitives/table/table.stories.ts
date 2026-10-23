import { JpLink } from '../link/link';
import { GAME_SIX_BATTING, GAME_SIX_PITCHING } from '../game-six.example';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JpInput } from '../input/input';
import { JpPagination } from '../pagination/pagination';
import { JpTableToolbar } from '../table-toolbar/table-toolbar';
import { type JpTableRowKey, type JpTableSort } from './table';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpBadge } from '../badge/badge';
import { JpButton } from '../button/button';
import { JpEmptyState } from '../empty-state/empty-state';
import { JpTable, JpTableCellDef, JpTableRowDetail } from './table';

type TableArgs = {
  caption: string;
  striped: boolean;
  empty: boolean;
};

const columns = [
  { key: 'name', header: 'Player' },
  { key: 'status', header: 'Status' },
  { key: 'region', header: 'Position', align: 'end' as const },
];

const rows = [
  { name: 'Freddy Peralta', status: 'Starter', region: 'Pitcher' },
  { name: 'Yandy Díaz', status: 'Home run', region: 'Designated hitter' },
  { name: 'Taylor Walls', status: 'Starter', region: 'Shortstop' },
];

const meta: Meta<TableArgs> = {
  title: 'Primitives/Data Display/Table',
  component: JpTable,
  decorators: [
    moduleMetadata({
      imports: [
        JpTable,
        JpTableCellDef,
        JpBadge,
        JpEmptyState,
        JpButton,
        JpLink,
      ],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  args: {
    caption: 'Rays roster',
    striped: true,
    empty: false,
  },
  render: (args) => ({
    props: {
      ...args,
      columns,
      rows: args.empty ? [] : rows,
      statusTone(value: string) {
        if (value === 'Starter') {
          return 'success';
        }
        if (value === 'Home run') {
          return 'warning';
        }
        return 'neutral';
      },
    },
    template: `
      <jp-table
        [caption]="caption"
        [columns]="columns"
        [rows]="rows"
        [striped]="striped"
      >
        <ng-template jpTableCell="status" let-value>
          <jp-badge [tone]="statusTone(value)">{{ value }}</jp-badge>
        </ng-template>
        <jp-empty-state
          title="No matching Game 6 players"
          description="Clear the filters to return to the Game 6 roster."
        >
          <jp-button variant="secondary">Clear filters</jp-button>
        </jp-empty-state>
      </jp-table>
    `,
  }),
};

export default meta;
type Story = StoryObj<TableArgs>;

export const Populated: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('caption')?.textContent).toContain(
      'Rays roster',
    );
    await expect(canvasElement.querySelectorAll('tbody tr').length).toBe(3);
    await expect(canvasElement.querySelector('jp-badge')).toBeTruthy();
  },
};

export const Plain: Story = {
  args: { striped: false },
  play: async ({ canvasElement }) => {
    await expect(
      (
        canvasElement.querySelector('jp-table') as HTMLElement
      ).classList.contains('jp-table--striped'),
    ).toBe(false);
  },
};

export const Empty: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('tbody')).toBeNull();
    await expect(
      canvasElement.querySelector('.jp-empty-state__title')?.textContent,
    ).toContain('No matching Game 6 players');
  },
};

const wideColumns = [
  { key: 'name', header: 'Player' },
  { key: 'env', header: 'Squad' },
  { key: 'status', header: 'Status' },
  { key: 'region', header: 'Position' },
  { key: 'owner', header: 'Manager' },
  { key: 'lastDeploy', header: 'Last game' },
  { key: 'requests', header: 'At bats', align: 'end' as const },
  { key: 'latency', header: 'Hits', align: 'end' as const },
];

const wideRows = [
  {
    name: 'Freddy Peralta',
    env: 'Active roster',
    status: 'Starter',
    region: 'Pitcher',
    owner: 'Kevin Cash',
    lastDeploy: 'Oct 19, 2026',
    requests: 0,
    latency: 0,
  },
  {
    name: 'Yandy Díaz',
    env: 'Active roster',
    status: 'Home run',
    region: 'Designated hitter',
    owner: 'Kevin Cash',
    lastDeploy: 'Oct 19, 2026',
    requests: 4,
    latency: 1,
  },
  {
    name: 'Taylor Walls',
    env: 'Active roster',
    status: 'Starter',
    region: 'Shortstop',
    owner: 'Kevin Cash',
    lastDeploy: 'Oct 19, 2026',
    requests: 1,
    latency: 0,
  },
];

export const Scrollable: Story = {
  render: () => ({
    props: {
      columns: wideColumns,
      rows: wideRows,
      statusTone(value: string) {
        if (value === 'Starter') {
          return 'success';
        }
        if (value === 'Home run') {
          return 'warning';
        }
        return 'neutral';
      },
    },
    template: `
      <div style="max-width: 32rem;">
        <jp-table
          caption="Player statistics (scroll horizontally)"
          [columns]="columns"
          [rows]="rows"
          [striped]="true"
        >
          <ng-template jpTableCell="status" let-value>
            <jp-badge [tone]="statusTone(value)">{{ value }}</jp-badge>
          </ng-template>
        </jp-table>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector(
      '.jp-table__frame',
    ) as HTMLElement | null;
    await expect(frame).toBeTruthy();
    await expect(canvasElement.querySelectorAll('th').length).toBe(8);
  },
};

@Component({
  selector: 'jp-table-toolkit-example',
  imports: [
    FormsModule,
    JpTable,
    JpTableToolbar,
    JpPagination,
    JpInput,
    JpButton,
  ],
  template: `
    <jp-table-toolbar
      [activeFilters]="
        search() ? [{ key: 'search', label: 'Search: ' + search() }] : []
      "
      [selectedCount]="selected().length"
      (clearFilters)="setSearch('')"
      (removeFilter)="setSearch('')"
    >
      <jp-input
        jpTableSearch
        label="Search players"
        type="search"
        [ngModel]="search()"
        (ngModelChange)="setSearch($event)"
      />
      <jp-button
        jpTableBulkActions
        variant="secondary"
        (click)="selected.set([])"
        >Clear selection</jp-button
      >
    </jp-table-toolbar>
    <jp-table
      caption="2026 Rays roster"
      [columns]="columns"
      [rows]="visible()"
      rowKey="name"
      selectable
      [sort]="sort()"
      (sortChange)="setSort($event)"
      [selectedKeys]="selected()"
      (selectionChange)="selected.set($event)"
      emptyTitle="No matching players"
      emptyDescription="Clear the search to show all players."
    />
    <jp-pagination
      [page]="page()"
      [pageSize]="2"
      [total]="filtered().length"
      (pageChange)="page.set($event)"
    />
  `,
})
class TableToolkitExample {
  readonly columns = [
    { key: 'name', header: 'Player', sortable: true },
    { key: 'status', header: 'Status' },
    { key: 'region', header: 'Position' },
  ];
  readonly search = signal('');
  readonly sort = signal<JpTableSort | null>(null);
  readonly selected = signal<JpTableRowKey[]>([]);
  readonly page = signal(1);
  readonly filtered = computed(() => {
    const filtered = rows.filter((row) =>
      row.name.toLowerCase().includes(this.search().toLowerCase()),
    );
    const sort = this.sort();
    return sort
      ? filtered.sort(
          (a, b) =>
            a.name.localeCompare(b.name) * (sort.direction === 'asc' ? 1 : -1),
        )
      : filtered;
  });
  readonly visible = computed(() =>
    this.filtered().slice((this.page() - 1) * 2, this.page() * 2),
  );
  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }
  setSort(value: JpTableSort | null): void {
    this.sort.set(value);
    this.page.set(1);
  }
}

export const ControlledToolkit: Story = {
  decorators: [moduleMetadata({ imports: [TableToolkitExample] })],
  render: () => ({ template: '<jp-table-toolkit-example />' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /^Player$/ }));
    await expect(canvasElement.querySelector('th[aria-sort]')).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Select Freddy Peralta' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('1 selected');
    await userEvent.click(canvas.getByRole('button', { name: /^Next$/ }));
    await expect(canvasElement.querySelector('tbody')).toHaveTextContent(
      'Yandy Díaz',
    );
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Search players' }),
      'missing',
    );
    await expect(canvasElement.querySelector('tbody')).toBeNull();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear filters' }),
    );
    await expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(2);
  },
};

@Component({
  selector: 'jp-table-advanced-example',
  imports: [JpTable, JpTableRowDetail, JpButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<jp-table
    id="advanced-table-story"
    caption="Rays roster details"
    [columns]="columns"
    [rows]="rows"
    columnChooser
    resizable
    stickyHeader
    stickyFirstColumn
    maxHeight="20rem"
    [visibleColumnKeys]="visible()"
    (visibleColumnKeysChange)="visible.set($event)"
    [columnWidths]="widths()"
    (columnWidthsChange)="widths.set($event)"
    [expandedKeys]="expanded()"
    (expandedKeysChange)="expanded.set($event)"
  >
    <ng-template jpTableRowDetail let-row
      ><p>Manager: {{ row.owner }}</p>
      <jp-button type="button" variant="secondary"
        >Review {{ row.name }}</jp-button
      ></ng-template
    >
  </jp-table>`,
})
class AdvancedTableExample {
  readonly columns = [
    { key: 'name', header: 'Player', width: 240 },
    { key: 'owner', header: 'Manager', width: 220 },
    { key: 'region', header: 'Position', width: 220 },
  ];
  readonly rows = [
    {
      id: 'api',
      name: 'Freddy Peralta',
      owner: 'Kevin Cash',
      region: 'Pitcher',
    },
    {
      id: 'jobs',
      name: 'Yandy Díaz',
      owner: 'Kevin Cash',
      region: 'Designated hitter',
    },
  ];
  readonly visible = signal(['name', 'owner', 'region']);
  readonly widths = signal<Record<string, number>>({});
  readonly expanded = signal<JpTableRowKey[]>([]);
}
export const AdvancedControls: Story = {
  decorators: [moduleMetadata({ imports: [AdvancedTableExample] })],
  render: () => ({ template: '<jp-table-advanced-example />' }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByText('Columns', { selector: 'summary' }));
    await userEvent.click(c.getByRole('checkbox', { name: 'Manager' }));
    await expect(c.queryByRole('columnheader', { name: 'Manager' })).toBeNull();
    const width = c.getByRole('spinbutton', {
      name: 'Width in pixels: Player',
    });
    await userEvent.clear(width);
    await userEvent.type(width, '320');
    await userEvent.tab();
    await expect(width).toHaveValue(320);
    const expand = c.getByRole('button', {
      name: 'Show details: Freddy Peralta',
    });
    await userEvent.click(expand);
    await expect(expand).toHaveAttribute('aria-expanded', 'true');
    await expect(
      c.getByRole('button', { name: 'Review Freddy Peralta' }),
    ).toBeVisible();
    await userEvent.click(expand);
    await expect(
      c.queryByRole('button', { name: 'Review Freddy Peralta' }),
    ).toBeNull();
  },
};

export const GameSixBatting: Story = {
  render: () => ({
    props: {
      rows: GAME_SIX_BATTING,
      columns: [
        { key: 'name', header: 'Player' },
        { key: 'position', header: 'Position' },
        { key: 'atBats', header: 'AB', align: 'end' },
        { key: 'runs', header: 'R', align: 'end' },
        { key: 'hits', header: 'H', align: 'end' },
        { key: 'rbi', header: 'RBI', align: 'end' },
        { key: 'homeRuns', header: 'HR', align: 'end' },
      ],
    },
    template: `<div style="max-inline-size:64rem;margin-inline:auto"><jp-table caption="Tampa Bay batting · 2026 ALCS Game 6" [columns]="columns" [rows]="rows"><ng-template jpTableCell="name" let-value><span style="white-space:nowrap">{{ value }}</span></ng-template><ng-template jpTableCell="position" let-value><span style="white-space:nowrap">{{ value }}</span></ng-template></jp-table><p>AB: at-bats · R: runs · H: hits · RBI: runs batted in · HR: home runs</p><p>Team totals: 30 at-bats, 7 runs, 7 hits, 7 RBI, 2 home runs. <a jpLink href="https://www.mlb.com/gameday/guardians-vs-rays/2026/10/19/849815/final/box" target="_blank" rel="noopener noreferrer">MLB box score</a></p></div>`,
  }),
};
export const GameSixPitching: Story = {
  render: () => ({
    props: {
      rows: GAME_SIX_PITCHING,
      columns: [
        { key: 'name', header: 'Pitcher' },
        { key: 'innings', header: 'IP', align: 'end' },
        { key: 'hits', header: 'H', align: 'end' },
        { key: 'earnedRuns', header: 'ER', align: 'end' },
        { key: 'strikeouts', header: 'K', align: 'end' },
        { key: 'walks', header: 'BB', align: 'end' },
        { key: 'pitches', header: 'Pitches', align: 'end' },
      ],
    },
    template: `<div style="max-inline-size:64rem;margin-inline:auto"><jp-table caption="Tampa Bay pitching · 2026 ALCS Game 6" [columns]="columns" [rows]="rows"><ng-template jpTableCell="name" let-value><span style="white-space:nowrap">{{ value }}</span></ng-template></jp-table><p>IP: innings pitched · H: hits · ER: earned runs · K: strikeouts · BB: walks</p><p>In baseball notation, 5.1 means 5⅓ innings. Freddy Peralta earned the win. <a jpLink href="https://www.mlb.com/gameday/guardians-vs-rays/2026/10/19/849815/final/box" target="_blank" rel="noopener noreferrer">MLB box score</a></p></div>`,
  }),
};
