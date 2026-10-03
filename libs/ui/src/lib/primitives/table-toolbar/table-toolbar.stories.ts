import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { JpInput } from '../input/input';
import { JpButton } from '../button/button';
import { JpTableToolbar } from './table-toolbar';
const meta: Meta<JpTableToolbar> = {
  title: 'Primitives/Data Display/Table Toolbar',
  component: JpTableToolbar,
  decorators: [
    moduleMetadata({ imports: [JpInput, JpButton, JpTableToolbar] }),
  ],
  args: {
    activeFilters: [{ key: 'status', label: 'Status: healthy' }],
    selectedCount: 2,
  },
  render: (args) => ({
    props: args,
    template: `<jp-table-toolbar [activeFilters]="activeFilters" [selectedCount]="selectedCount"><jp-input jpTableSearch label="Search deployments" type="search" /><jp-button jpTableActions>Create deployment</jp-button><jp-button jpTableBulkActions variant="secondary">Archive selected</jp-button></jp-table-toolbar>`,
  }),
};
export default meta;
type Story = StoryObj<JpTableToolbar>;
export const FilteredSelection: Story = {};
export const Unfiltered: Story = {
  args: { activeFilters: [], selectedCount: 0 },
};
