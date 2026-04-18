import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpStack } from './stack';

const meta: Meta<JpStack> = {
  title: 'Primitives/Layout/Stack',
  component: JpStack,
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <jp-stack [as]="asTag" [gap]="gap" [align]="align" [justify]="justify">
        <div>Item A</div>
        <div>Item B</div>
        <div>Item C</div>
      </jp-stack>
    `,
  }),
  args: {
    as: 'div',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
};

export default meta;
type Story = StoryObj<JpStack>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.jp-stack__root');
    await expect(root).toBeTruthy();
  },
};
