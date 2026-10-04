import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpTreeTable, type JpTreeTableRow } from './tree-table';

const rows: readonly JpTreeTableRow[] = [
  {
    key: 'website',
    label: 'Website launch',
    cells: { owner: 'Product', hours: 72 },
    children: [
      {
        key: 'design',
        label: 'Design',
        cells: { owner: 'Avery', hours: 32 },
        children: [
          {
            key: 'landing',
            label: 'Landing page',
            cells: { owner: 'Avery', hours: 12 },
          },
        ],
      },
      {
        key: 'engineering',
        label: 'Engineering',
        cells: { owner: 'Sam', hours: 40 },
      },
    ],
  },
  {
    key: 'mobile',
    label: 'Mobile refresh',
    cells: { owner: 'Platform', hours: 48 },
  },
  {
    key: 'archive',
    label: 'Archived project',
    cells: { owner: 'Platform', hours: 0 },
    disabled: true,
  },
];
const columns = [
  { key: 'owner', header: 'Owner' },
  { key: 'hours', header: 'Hours', align: 'end' as const },
];
@Component({
  selector: 'jp-tree-table-story',
  imports: [JpTreeTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <jp-tree-table
      id="story-projects"
      caption="Project work"
      nameHeader="Task"
      [rows]="rows"
      [columns]="columns"
      selectable
      [expandedKeys]="expanded()"
      (expandedKeysChange)="expanded.set($event)"
      [selectedKeys]="selected()"
      (selectedKeysChange)="selected.set($event)"
    />
    <p role="status">{{ selected().length }} project rows selected</p>
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
    caption: 'Project work',
    nameHeader: 'Task',
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
      canvas.getByRole('button', { name: 'Expand Website launch' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand Design' }),
    );
    await expect(
      canvas.getByRole('rowheader', {
        name: 'Website launch / Design / Landing page',
      }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Select Landing page' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse Website launch' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '1 project rows selected',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand Website launch' }),
    );
    await expect(
      canvas.getByRole('checkbox', { name: 'Select Landing page' }),
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
