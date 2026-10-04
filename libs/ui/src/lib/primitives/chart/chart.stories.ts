import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { JpChart } from './chart';
const meta: Meta<JpChart> = {
  title: 'Primitives/Data Display/Chart',
  component: JpChart,
  parameters: { layout: 'padded' },
  args: {
    id: 'story-chart',
    label: 'Completed work',
    labels: ['April', 'May', 'June'],
    series: [
      { id: 'product', label: 'Product', values: [32, 44, 38] },
      { id: 'platform', label: 'Platform', values: [25, 28, 40] },
    ],
  },
};
export default meta;
type Story = StoryObj<JpChart>;
export const Default: Story = {};
export const Line: Story = { args: { type: 'line' } };
export const Empty: Story = { args: { labels: [], series: [] } };
export const Loading: Story = { args: { loading: true } };
export const Error: Story = {
  args: { error: 'Analytics are temporarily unavailable.' },
};
export const AccessibleData: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await waitFor(() =>
      expect(canvasElement.querySelector('.plot')).toHaveAttribute(
        'data-rendered',
        'true',
      ),
    );
    await userEvent.click(c.getByRole('button', { name: 'Product' }));
    await expect(c.getByRole('button', { name: 'Product' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await userEvent.selectOptions(
      c.getByRole('combobox', { name: 'Inspect category' }),
      '2',
    );
    await expect(c.getByText('Platform · June')).toBeVisible();
    await userEvent.click(
      c.getByText('View chart data', { selector: 'summary' }),
    );
    await expect(
      c.getByRole('table', { name: 'Completed work' }),
    ).toBeVisible();
    await expect(c.getByRole('cell', { name: '38' })).toBeVisible();
  },
};
