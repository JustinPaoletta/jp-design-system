import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpBadge } from '../badge/badge';
import { JpButton } from '../button/button';
import { JpEmptyState } from '../empty-state/empty-state';
import { JpTable, JpTableCellDef } from './table';

type TableArgs = {
  caption: string;
  striped: boolean;
  empty: boolean;
};

const columns = [
  { key: 'name', header: 'Service' },
  { key: 'status', header: 'Status' },
  { key: 'region', header: 'Region', align: 'end' as const },
];

const rows = [
  { name: 'api-gateway', status: 'Healthy', region: 'us-east-1' },
  { name: 'worker', status: 'Degraded', region: 'eu-west-1' },
  { name: 'ingest', status: 'Healthy', region: 'us-west-2' },
];

const meta: Meta<TableArgs> = {
  title: 'Primitives/Data Display/Table',
  component: JpTable,
  decorators: [
    moduleMetadata({
      imports: [JpTable, JpTableCellDef, JpBadge, JpEmptyState, JpButton],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  args: {
    caption: 'Recent deployments',
    striped: true,
    empty: false,
  },
  render: (args) => ({
    props: {
      ...args,
      columns,
      rows: args.empty ? [] : rows,
      statusTone(value: string) {
        if (value === 'Healthy') {
          return 'success';
        }
        if (value === 'Degraded') {
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
          title="No deployments"
          description="Nothing matches the current filters."
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
      'Recent deployments',
    );
    await expect(canvasElement.querySelectorAll('tbody tr').length).toBe(3);
    await expect(canvasElement.querySelector('jp-badge')).toBeTruthy();
  },
};

export const Plain: Story = {
  args: { striped: false },
  play: async ({ canvasElement }) => {
    await expect(
      (canvasElement.querySelector('jp-table') as HTMLElement).classList.contains(
        'jp-table--striped',
      ),
    ).toBe(false);
  },
};

export const Empty: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('tbody')).toBeNull();
    await expect(
      canvasElement.querySelector('.jp-empty-state__title')?.textContent,
    ).toContain('No deployments');
  },
};

const wideColumns = [
  { key: 'name', header: 'Service' },
  { key: 'env', header: 'Environment' },
  { key: 'status', header: 'Status' },
  { key: 'region', header: 'Region' },
  { key: 'owner', header: 'Owner' },
  { key: 'lastDeploy', header: 'Last deploy' },
  { key: 'requests', header: 'Requests / min', align: 'end' as const },
  { key: 'latency', header: 'p95 latency (ms)', align: 'end' as const },
];

const wideRows = [
  {
    name: 'api-gateway',
    env: 'production',
    status: 'Healthy',
    region: 'us-east-1',
    owner: 'platform',
    lastDeploy: '2m ago',
    requests: 12480,
    latency: 84,
  },
  {
    name: 'worker',
    env: 'production',
    status: 'Degraded',
    region: 'eu-west-1',
    owner: 'payments',
    lastDeploy: '1h ago',
    requests: 3120,
    latency: 212,
  },
  {
    name: 'ingest',
    env: 'staging',
    status: 'Healthy',
    region: 'us-west-2',
    owner: 'data',
    lastDeploy: '3d ago',
    requests: 640,
    latency: 57,
  },
];

export const Scrollable: Story = {
  render: () => ({
    props: {
      columns: wideColumns,
      rows: wideRows,
      statusTone(value: string) {
        if (value === 'Healthy') {
          return 'success';
        }
        if (value === 'Degraded') {
          return 'warning';
        }
        return 'neutral';
      },
    },
    template: `
      <div style="max-width: 32rem;">
        <jp-table
          caption="Service health (scroll horizontally)"
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
