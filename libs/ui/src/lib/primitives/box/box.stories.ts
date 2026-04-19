import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpBox } from './box';

const meta: Meta<JpBox> = {
  title: 'Primitives/Layout/Box',
  component: JpBox,
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <jp-box [as]="asTag" [padding]="padding" [paddingX]="paddingX" [paddingY]="paddingY" [maxWidth]="maxWidth">
        <div data-testid="box-content">Box content</div>
      </jp-box>
    `,
  }),
  args: {
    as: 'div',
    padding: 'md',
    maxWidth: 'none',
  },
};

export default meta;
type Story = StoryObj<JpBox>;

const LAYOUT_TAGS = [
  'div',
  'section',
  'article',
  'aside',
  'main',
  'header',
  'footer',
  'nav',
] as const;

function resolveExpectedTag(value: unknown): (typeof LAYOUT_TAGS)[number] {
  if (
    typeof value === 'string' &&
    (LAYOUT_TAGS as readonly string[]).includes(value)
  ) {
    return value as (typeof LAYOUT_TAGS)[number];
  }

  return 'div';
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector(
      `${resolveExpectedTag(args.as)}.jp-box__root`,
    );
    await expect(root).toBeTruthy();
  },
};

export const SemanticSection: Story = {
  args: {
    as: 'section',
  },
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector(
      `${resolveExpectedTag(args.as)}.jp-box__root`,
    );
    await expect(root).toBeTruthy();
  },
};
