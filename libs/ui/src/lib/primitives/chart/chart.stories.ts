import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { JpChart } from './chart';
const meta: Meta<JpChart> = {
  title: 'Primitives/Data Display/Chart',
  component: JpChart,
  parameters: { layout: 'padded' },
  args: {
    id: 'story-chart',
    label: 'Runs by month',
    labels: ['April', 'May', 'June'],
    series: [
      { id: 'product', label: 'Dodgers', values: [130, 120, 141] },
      { id: 'platform', label: 'Yankees', values: [129, 135, 152] },
    ],
  },
};
export default meta;
type Story = StoryObj<JpChart>;
export const Default: Story = {};
export const Line: Story = { args: { type: 'line' } };
export const Empty: Story = { args: { labels: [], series: [] } };
export const Loading: Story = {
  args: { loading: true, labels: [], series: [] },
};
export const Refreshing: Story = { args: { loading: true } };
export const Error: Story = {
  args: { error: 'Player statistics are temporarily unavailable. Try again.' },
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
    await userEvent.click(c.getByRole('button', { name: 'Dodgers' }));
    await expect(c.getByRole('button', { name: 'Dodgers' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await userEvent.click(
      c.getByRole('combobox', { name: 'Inspect category' }),
    );
    await userEvent.click(await c.findByRole('option', { name: 'June' }));
    await expect(c.getByText('Yankees · June')).toBeVisible();
    await userEvent.click(
      c.getByText('View chart data', { selector: 'summary' }),
    );
    await expect(c.getByRole('table', { name: 'Runs by month' })).toBeVisible();
    await expect(c.getByRole('cell', { name: '141' })).toBeVisible();
  },
};
