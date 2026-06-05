import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_FONT_WEIGHTS,
  JP_TEXT_SIZES,
  JP_TEXT_TAGS,
  JP_TEXT_TONES,
} from '../shared/primitive-types';
import { JpText } from './text';

const meta: Meta<JpText> = {
  title: 'Primitives/Typography/Text',
  component: JpText,
  globals: {
    accent: 'neon',
  },
  render: (args) => ({
    props: {
      ...args,
      asTag: args.as,
    },
    template: `
      <style>
        .jp-text-story__frame {
          display: grid;
          gap: var(--jp-space-xs);
          max-width: calc(var(--jp-space-3xl) * 5);
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-default);
          border-radius: var(--jp-radius-md);
          background: var(--jp-color-surface-sunken);
        }

        .jp-text-story__sample {
          min-height: calc(var(--jp-space-3xl) + var(--jp-space-md) / 2);
          display: flex;
          align-items: center;
          padding: var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
          border-radius: var(--jp-radius-md);
          background: var(--jp-color-surface-raised);
        }
      </style>

      <div class="jp-text-story__frame">
        <div class="jp-text-story__sample">
          <jp-text [as]="asTag" [size]="size" [tone]="tone" [weight]="weight" [truncate]="truncate" [mono]="mono">
            Text primitive sample with enough length to show truncation clearly.
          </jp-text>
        </div>
      </div>
    `,
  }),
  argTypes: {
    as: {
      control: 'select',
      options: JP_TEXT_TAGS,
    },
    size: {
      control: 'select',
      options: JP_TEXT_SIZES,
    },
    tone: {
      control: 'select',
      options: JP_TEXT_TONES,
    },
    weight: {
      control: 'select',
      options: JP_FONT_WEIGHTS,
    },
    truncate: {
      control: 'boolean',
    },
    mono: {
      control: 'boolean',
    },
  },
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

function resolveExpectedTag(value: unknown): (typeof JP_TEXT_TAGS)[number] {
  if (
    typeof value === 'string' &&
    (JP_TEXT_TAGS as readonly string[]).includes(value)
  ) {
    return value as (typeof JP_TEXT_TAGS)[number];
  }

  return 'p';
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector(
      `${resolveExpectedTag(args.as)}.jp-text__root`,
    );
    await expect(root).toBeTruthy();
  },
};
