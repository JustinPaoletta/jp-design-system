import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpVirtualTable } from './virtual-table';
const rows = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: 'Service ' + (i + 1),
  region: i % 2 ? 'Europe' : 'North America',
}));
const meta: Meta<JpVirtualTable> = {
  title: 'Primitives/Data Display/Virtual Table',
  component: JpVirtualTable,
  parameters: { layout: 'padded' },
  args: {
    label: 'Service inventory',
    columns: [
      { key: 'name', header: 'Service' },
      { key: 'region', header: 'Region' },
    ],
    rows,
  },
};
export default meta;
type Story = StoryObj<JpVirtualTable>;
export const Default: Story = {};
export const Paginated: Story = { args: { virtual: false } };
export const Empty: Story = { args: { rows: [] } };
export const Loading: Story = { args: { loading: true } };
export const Error: Story = {
  args: { error: 'The inventory could not be loaded.' },
};
export const BrowsePages: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(
      canvasElement.querySelectorAll('tr[data-row-index]').length,
    ).toBeLessThan(30);
    await userEvent.click(c.getByRole('button', { name: 'Paginated rows' }));
    await expect(
      c.getByRole('table', { name: 'Service inventory' }),
    ).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Next' }));
    await expect(c.getByRole('cell', { name: 'Service 51' })).toBeVisible();
  },
};
