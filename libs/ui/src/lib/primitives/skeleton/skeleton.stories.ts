import type { Meta, StoryObj } from '@storybook/angular';
import { JpSkeleton } from './skeleton';

const meta: Meta<JpSkeleton> = {
  title: 'Primitives/Feedback/Skeleton',
  component: JpSkeleton,
};
export default meta;
type Story = StoryObj<JpSkeleton>;

export const LoadingCard: Story = {
  render: () => ({
    template: `
      <section aria-label="Loading project" aria-busy="true" style="display:grid;gap:var(--jp-space-sm);max-width:var(--jp-size-column-min-md)">
        <jp-skeleton shape="rectangle" style="height:var(--jp-size-control-xl)" />
        <jp-skeleton />
        <jp-skeleton style="width:70%" />
      </section>
    `,
  }),
};
export const Avatar: Story = {
  args: { shape: 'circle' },
  render: (args) => ({
    props: args,
    template:
      '<jp-skeleton [shape]="shape" style="width:var(--jp-size-control-lg)" />',
  }),
};
export const Static: Story = { args: { animated: false } };
