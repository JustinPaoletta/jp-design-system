import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpVirtualTable } from './virtual-table';
const roster = [
  ['Junior Caminero', 'Designated hitter'],
  ['Josh Lowe', 'Right field'],
  ['Yandy Díaz', 'First base'],
  ['Kameron Misner', 'Left field'],
  ['Taylor Walls', 'Shortstop'],
  ['Ben Rortvedt', 'Catcher'],
  ['Curtis Mead', 'Third base'],
  ['Brandon Lowe', 'Second base'],
  ['Jonny DeLuca', 'Center field'],
  ['Chandler Simpson', 'Outfield'],
  ['Jonathan Aranda', 'Outfield'],
  ['Jose Caballero', 'Shortstop'],
  ['Logan Driscoll', 'Catcher'],
  ['Shane Baz', 'Pitcher'],
  ['Taj Bradley', 'Pitcher'],
  ['Ryan Pepiot', 'Pitcher'],
  ['Pete Fairbanks', 'Pitcher'],
  ['Drew Rasmussen', 'Pitcher'],
  ['Zack Littell', 'Pitcher'],
  ['Edwin Uceta', 'Pitcher'],
  ['Kevin Kelly', 'Pitcher'],
  ['Mason Montgomery', 'Pitcher'],
  ['Colin Poche', 'Pitcher'],
  ['Ian Seymour', 'Pitcher'],
  ['Jacob Lopez', 'Pitcher'],
  ['Garrett Cleavinger', 'Pitcher'],
] as const;
const rows = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: roster[i % roster.length][0] + ' · ' + (i + 1),
  region: roster[i % roster.length][1],
}));
const meta: Meta<JpVirtualTable> = {
  title: 'Primitives/Data Display/Virtual Table',
  component: JpVirtualTable,
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<section style="max-inline-size:56rem;margin:var(--jp-space-lg) auto"><h2 style="margin:0 0 var(--jp-space-md);font:var(--jp-font-weight-semibold) var(--jp-font-size-body)/var(--jp-font-line-height-normal) var(--jp-font-family-base);color:var(--jp-color-text-primary)">2026 Rays roster</h2>${story}</section>`,
    ),
  ],
  parameters: { layout: 'padded' },
  args: {
    label: '2026 Rays roster',
    columns: [
      { key: 'name', header: 'Player' },
      { key: 'region', header: 'Position' },
    ],
    rows,
  },
};
export default meta;
type Story = StoryObj<JpVirtualTable>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('1–7 of 10000 rows'),
    ).toBeVisible();
  },
};
export const Paginated: Story = {
  args: { virtual: false },
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector(
      '.jp-table__frame',
    ) as HTMLElement;
    await expect(frame.getBoundingClientRect().height).toBeLessThanOrEqual(360);
    await expect(frame.scrollHeight).toBeGreaterThan(frame.clientHeight);
    await expect(
      within(canvasElement).getByRole('button', { name: 'Next' }),
    ).toBeVisible();
  },
};
export const Empty: Story = { args: { rows: [] } };
export const Loading: Story = { args: { loading: true, rows: [] } };
export const Refreshing: Story = { args: { loading: true } };
export const Error: Story = {
  args: { error: 'The player roster could not be loaded. Try again.' },
};
export const BrowsePages: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(
      canvasElement.querySelectorAll('tr[data-row-index]').length,
    ).toBeLessThan(30);
    await userEvent.click(c.getByRole('button', { name: 'Paginated rows' }));
    await expect(
      c.getByRole('table', { name: '2026 Rays roster' }),
    ).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Next' }));
    await expect(
      c.getByRole('cell', { name: 'Jacob Lopez · 51' }),
    ).toBeVisible();
  },
};

export const Narrow: Story = {
  args: { selectable: true, selectedKeys: [0] },
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="inline-size:20rem;max-inline-size:100%">${story}</div>`,
    ),
  ],
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('.frame') as HTMLElement;
    const row = frame.querySelector('tr[data-row-index]') as HTMLElement;
    const header = frame.querySelector('thead') as HTMLTableSectionElement;
    const selection = row.querySelector('td.selection') as HTMLTableCellElement;
    const checkbox = selection.querySelector(
      '.jp-checkbox__box',
    ) as HTMLElement;
    await expect(frame.scrollWidth).toBeLessThanOrEqual(
      Math.max(frame.clientWidth, 304) + 1,
    );
    await expect(row.getBoundingClientRect().height).toBe(48);
    await expect(header.getBoundingClientRect().height).toBe(40);
    await expect(checkbox.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      selection.getBoundingClientRect().left,
    );
    await expect(checkbox.getBoundingClientRect().right).toBeLessThanOrEqual(
      selection.getBoundingClientRect().right,
    );
    await expect(within(row).getByRole('checkbox')).toBeChecked();
    frame.scrollTop = frame.scrollHeight;
    frame.dispatchEvent(new Event('scroll'));
    await expect(
      await within(canvasElement).findByRole('cell', {
        name: 'Ryan Pepiot · 10000',
      }),
    ).toBeVisible();
  },
};
