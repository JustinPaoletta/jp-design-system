import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpSplitPane } from './split-pane';
const meta: Meta<JpSplitPane> = {
  title: 'Primitives/Layout/Split Pane',
  component: JpSplitPane,
  parameters: { layout: 'padded' },
  args: {
    id: 'story-workspace',
    primaryLabel: 'Overview',
    secondaryLabel: 'Details',
    size: 40,
    min: 20,
    max: 80,
  },
  render: (args) => ({
    props: args,
    template: `<jp-split-pane style="height:320px" [id]="id" [primaryLabel]="primaryLabel" [secondaryLabel]="secondaryLabel" [orientation]="orientation" [min]="min" [max]="max" [size]="size"><div jpSplitPrimary><h2>Overview</h2><button type="button">Open overview</button></div><div jpSplitSecondary><h2>Details</h2><p>Responsive work surface</p></div></jp-split-pane>`,
  }),
};
export default meta;
type Story = StoryObj<JpSplitPane>;
export const Default: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const separator = c.getByRole('separator', { name: 'Overview' });
    await userEvent.click(separator);
    await userEvent.keyboard('{ArrowRight}');
    await expect(separator).toHaveAttribute('aria-valuenow', '41');
    await userEvent.keyboard('{End}');
    await expect(separator).toHaveAttribute('aria-valuenow', '80');
    await userEvent.keyboard('{Enter}');
    await expect(separator).toHaveAttribute('aria-valuenow', '0');
    await expect(
      c.getByRole('button', { name: 'Open overview', hidden: true }),
    ).not.toBeVisible();
    await userEvent.keyboard('{Enter}');
    await expect(
      c.getByRole('button', { name: 'Open overview' }),
    ).toBeVisible();
  },
};
