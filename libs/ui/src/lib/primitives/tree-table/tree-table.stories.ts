import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpTreeTable, type JpTreeTableRow } from './tree-table';

const rows: readonly JpTreeTableRow[] = [
  {
    key: 'website',
    label: 'Season preparation',
    cells: { owner: 'Dave Roberts', hours: 72 },
    children: [
      {
        key: 'design',
        label: 'Batting drills',
        cells: { owner: 'Mookie Betts', hours: 32 },
        children: [
          {
            key: 'landing',
            label: 'Batting order',
            cells: { owner: 'Mookie Betts', hours: 12 },
          },
        ],
      },
      {
        key: 'engineering',
        label: 'Pitching drills',
        cells: { owner: 'Dave Roberts', hours: 40 },
      },
    ],
  },
  {
    key: 'mobile',
    label: 'Fielding drills',
    cells: { owner: 'Dave Roberts', hours: 48 },
  },
  {
    key: 'archive',
    label: 'Previous season',
    cells: { owner: 'Dave Roberts', hours: 0 },
    disabled: true,
  },
];
const columns = [
  { key: 'owner', header: 'Lead' },
  { key: 'hours', header: 'Minutes', align: 'end' as const },
];
@Component({
  selector: 'jp-tree-table-story',
  imports: [JpTreeTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <jp-tree-table
      id="story-projects"
      caption="Practice plan"
      nameHeader="Drill"
      [rows]="rows"
      [columns]="columns"
      selectable
      [expandedKeys]="expanded()"
      (expandedKeysChange)="expanded.set($event)"
      [selectedKeys]="selected()"
      (selectedKeysChange)="selected.set($event)"
    />
    <p role="status">Selected drills: {{ selected().length }}</p>
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
    caption: 'Practice plan',
    nameHeader: 'Drill',
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
      canvas.getByRole('button', { name: 'Expand Season preparation' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand Batting drills' }),
    );
    await expect(
      canvas.getByRole('rowheader', {
        name: 'Season preparation / Batting drills / Batting order',
      }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Select Batting order' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse Season preparation' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Selected drills: 1',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand Season preparation' }),
    );
    await expect(
      canvas.getByRole('checkbox', { name: 'Select Batting order' }),
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
