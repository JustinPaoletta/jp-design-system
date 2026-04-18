import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpGrid } from './grid';

const meta: Meta<JpGrid> = {
  title: 'Primitives/Layout/Grid',
  component: JpGrid,
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <jp-grid [as]="asTag" [gap]="gap" [columns]="columns" [mode]="mode" [minColumn]="minColumn">
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </jp-grid>
    `,
  }),
  args: {
    as: 'div',
    gap: 'md',
    columns: 3,
    mode: 'fixed',
    minColumn: 'md',
  },
};

export default meta;
type Story = StoryObj<JpGrid>;

export const Fixed: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.jp-grid__root');
    await expect(root).toBeTruthy();
  },
};

export const AutoFit: Story = {
  args: {
    mode: 'auto-fit',
    minColumn: 'lg',
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '.jp-grid__root',
    ) as HTMLElement | null;
    await expect(root).toBeTruthy();
    await expect(root?.style.gridTemplateColumns).toContain('auto-fit');
  },
};
