import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpSurface } from './surface';

const meta: Meta<JpSurface> = {
  title: 'Primitives/Layout/Surface',
  component: JpSurface,
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <jp-surface [as]="asTag" [tone]="tone" [padding]="padding" [radius]="radius" [border]="border" [elevation]="elevation">
        Surface content
      </jp-surface>
    `,
  }),
  args: {
    as: 'section',
    tone: 'raised',
    padding: 'lg',
    radius: 'lg',
    border: 'default',
    elevation: 'raised',
  },
};

export default meta;
type Story = StoryObj<JpSurface>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('section.jp-surface__root');
    await expect(root).toBeTruthy();
  },
};
