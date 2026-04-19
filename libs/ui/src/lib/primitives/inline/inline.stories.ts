import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpInline } from './inline';

const meta: Meta<JpInline> = {
  title: 'Primitives/Layout/Inline',
  component: JpInline,
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <jp-inline [as]="asTag" [gap]="gap" [align]="align" [justify]="justify" [wrap]="wrap">
        <span>Alpha</span>
        <span>Beta</span>
        <span>Gamma</span>
      </jp-inline>
    `,
  }),
  args: {
    as: 'div',
    gap: 'sm',
    align: 'center',
    justify: 'start',
    wrap: true,
  },
};

export default meta;
type Story = StoryObj<JpInline>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.jp-inline__root');
    await expect(root).toBeTruthy();
  },
};
