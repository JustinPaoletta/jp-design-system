import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpTreeTable, type JpTreeTableRow } from './tree-table';

const rows: readonly JpTreeTableRow[] = [
  {
    key: 'website',
    label: '2026 Rays',
    cells: { owner: 'Kevin Cash', hours: 26 },
    children: [
      {
        key: 'design',
        label: 'Position players',
        cells: { owner: 'Yandy Díaz', hours: 13 },
        children: [
          {
            key: 'landing',
            label: 'Infield',
            cells: { owner: 'Yandy Díaz', hours: 5 },
          },
        ],
      },
      {
        key: 'engineering',
        label: 'Pitchers',
        cells: { owner: 'Shane Baz', hours: 13 },
      },
    ],
  },
  {
    key: 'archive',
    label: 'Injured list',
    cells: { owner: 'Shane McClanahan', hours: 1 },
    disabled: true,
  },
];
const columns = [
  { key: 'owner', header: 'Lead' },
  { key: 'hours', header: 'Players', align: 'end' as const },
];
@Component({
  selector: 'jp-tree-table-story',
  imports: [JpTreeTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <jp-tree-table
      id="story-projects"
      caption="2026 Rays roster"
      nameHeader="Group"
      [rows]="rows"
      [columns]="columns"
      selectable
      [expandedKeys]="expanded()"
      (expandedKeysChange)="expanded.set($event)"
      [selectedKeys]="selected()"
      (selectedKeysChange)="selected.set($event)"
    />
    <p role="status">Selected groups: {{ selected().length }}</p>
  `,
})
class TreeTableStory {
  readonly rows = rows;
  readonly columns = columns;
  readonly expanded = signal<string[]>([]);
  readonly selected = signal<string[]>([]);
}
const meta: Meta<JpTreeTable> = {
  title: 'Primitives/Data Display/Tree Table',
  component: JpTreeTable,
  decorators: [moduleMetadata({ imports: [TreeTableStory] })],
  parameters: { layout: 'padded' },
  args: {
    id: 'tree-table-states',
    caption: '2026 Rays roster',
    nameHeader: 'Group',
    rows,
    columns,
  },
};
export default meta;
type Story = StoryObj<JpTreeTable>;
export const ProjectBreakdown: Story = {
  render: () => ({ template: '<jp-tree-table-story />' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand 2026 Rays' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand Position players' }),
    );
    await expect(
      canvas.getByRole('rowheader', {
        name: '2026 Rays / Position players / Infield',
      }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Select Infield' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse 2026 Rays' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Selected groups: 1',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand 2026 Rays' }),
    );
    await expect(
      canvas.getByRole('checkbox', { name: 'Select Infield' }),
    ).toBeChecked();
  },
};
export const Empty: Story = { args: { rows: [] } };
export const Loading: Story = { args: { rows: [], state: 'loading' } };
export const Error: Story = { args: { rows: [], state: 'error' } };
export const Disabled: Story = {
  args: {
    disabled: true,
    selectable: true,
    expandedKeys: ['website', 'design'],
  },
};
export const RightToLeft: Story = {
  render: () => ({ template: '<div dir="rtl"><jp-tree-table-story /></div>' }),
};
