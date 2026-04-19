import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpText } from './text';

const meta: Meta<JpText> = {
  title: 'Primitives/Typography/Text',
  component: JpText,
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <jp-text [as]="asTag" [size]="size" [tone]="tone" [weight]="weight" [truncate]="truncate" [mono]="mono">
        Text primitive sample
      </jp-text>
    `,
  }),
  args: {
    as: 'p',
    size: 'body',
    tone: 'primary',
    weight: 'regular',
    truncate: false,
    mono: false,
  },
};

export default meta;
type Story = StoryObj<JpText>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('p.jp-text__root');
    await expect(root).toBeTruthy();
  },
};
