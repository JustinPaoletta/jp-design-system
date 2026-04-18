import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpHeading } from './heading';

const meta: Meta<JpHeading> = {
  title: 'Primitives/Typography/Heading',
  component: JpHeading,
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <jp-heading [as]="asTag" [size]="size" [tone]="tone" [weight]="weight">
        Heading Primitive
      </jp-heading>
    `,
  }),
  args: {
    as: 'h2',
    size: 'auto',
    tone: 'primary',
    weight: 'semibold',
  },
};

export default meta;
type Story = StoryObj<JpHeading>;

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

function resolveExpectedTag(value: unknown): (typeof HEADING_TAGS)[number] {
  if (
    typeof value === 'string' &&
    (HEADING_TAGS as readonly string[]).includes(value)
  ) {
    return value as (typeof HEADING_TAGS)[number];
  }

  return 'h2';
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector(
      `${resolveExpectedTag(args.as)}.jp-heading__root`,
    );
    await expect(root).toBeTruthy();
  },
};
