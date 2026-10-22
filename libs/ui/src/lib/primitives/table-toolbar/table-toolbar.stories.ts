import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { expect, userEvent, within } from 'storybook/test';
import { JpInput } from '../input/input';
import { JpButton } from '../button/button';
import { JpTable, type JpTableRowKey } from '../table/table';
import { JpTableToolbar, type JpTableFilter } from './table-toolbar';
const players = [
  { id: 'alex', name: 'Shane Baz', status: 'Available' },
  { id: 'jordan', name: 'Yandy Díaz', status: 'Day to day' },
  { id: 'maya', name: 'Taylor Walls', status: 'Available' },
];
const meta: Meta<JpTableToolbar> = {
  title: 'Primitives/Data Display/Table Toolbar',
  component: JpTableToolbar,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, JpInput, JpButton, JpTableToolbar, JpTable],
    }),
  ],
  args: {
    activeFilters: [{ key: 'status', label: 'Availability: Available' }],
    selectedCount: 2,
  },
  render: (args) => {
    const filters = signal<readonly JpTableFilter[]>(args.activeFilters ?? []);
    const selected = signal<readonly JpTableRowKey[]>(
      args.selectedCount ? ['alex', 'maya'] : [],
    );
    const roster = signal(players);
    const query = signal('');
    const feedback = signal('');
    const added = computed(() =>
      roster().some((player) => player.id === 'taylor'),
    );
    const visibleRows = computed(() =>
      roster().filter(
        (player) =>
          (!filters().length || player.status === 'Available') &&
          player.name.toLowerCase().includes(query().toLowerCase()),
      ),
    );
    return {
      props: {
        filters,
        selected,
        query,
        feedback,
        visibleRows,
        added,
        columns: [
          { key: 'name', header: 'Player' },
          { key: 'status', header: 'Availability' },
        ],
        removeFilter: (key: string) =>
          filters.update((current) =>
            current.filter((filter) => filter.key !== key),
          ),
        addPlayer: () => {
          roster.update((current) => [
            ...current,
            { id: 'taylor', name: 'Shane McClanahan', status: 'Available' },
          ]);
          feedback.set('Shane McClanahan added to the roster.');
        },
        archiveSelected: () => {
          const count = selected().length;
          roster.update((current) =>
            current.filter((player) => !selected().includes(player.id)),
          );
          selected.set([]);
          feedback.set(`${count} players archived.`);
        },
        reset: () => {
          filters.set(args.activeFilters ?? []);
          selected.set(args.selectedCount ? ['alex', 'maya'] : []);
          roster.set(players);
          query.set('');
          feedback.set('');
        },
      },
      template: `<section style="max-inline-size:56rem">
        <jp-table-toolbar [activeFilters]="filters()" [selectedCount]="selected().length" (removeFilter)="removeFilter($event)" (clearFilters)="filters.set([])">
          <jp-input jpTableSearch label="Search players" type="search" [ngModel]="query()" (ngModelChange)="query.set($event)" clearable />
          <jp-button jpTableActions [disabled]="added()" (click)="addPlayer()">Add player</jp-button>
          <jp-button jpTableBulkActions variant="secondary" (click)="archiveSelected()">Archive selected</jp-button>
        </jp-table-toolbar>
        <jp-table caption="Rays roster" [columns]="columns" [rows]="visibleRows()" selectable rowKey="id" [selectedKeys]="selected()" (selectedKeysChange)="selected.set($event)" />
        <p role="status">{{ feedback() }}</p>
        <jp-button variant="ghost" size="sm" (click)="reset()">Reset roster</jp-button>
      </section>`,
    };
  },
};
export default meta;
type Story = StoryObj<JpTableToolbar>;
export const FilteredSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear filters' }),
    );
    await expect(
      canvas.getByRole('cell', { name: 'Yandy Díaz' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Archive selected' }),
    );
    await expect(canvas.queryByRole('cell', { name: 'Shane Baz' })).toBeNull();
    await expect(canvas.getByText('2 players archived.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Add player' }));
    await expect(
      canvas.getByRole('cell', { name: 'Shane McClanahan' }),
    ).toBeVisible();
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Search players' }),
      'Taylor',
    );
    await expect(canvas.queryByRole('cell', { name: 'Yandy Díaz' })).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset roster' }));
    await userEvent.click(
      canvas.getByRole('button', {
        name: /Remove filter: Availability: Available/,
      }),
    );
    await expect(
      canvas.getByRole('cell', { name: 'Yandy Díaz' }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset roster' }));
    await expect(canvas.getByRole('cell', { name: 'Shane Baz' })).toBeVisible();
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
export const Unfiltered: Story = {
  args: { activeFilters: [], selectedCount: 0 },
};
