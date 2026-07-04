import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_FONT_WEIGHTS,
  JP_HEADING_SIZES,
  JP_HEADING_TAGS,
  JP_TEXT_TONES,
} from '../shared/primitive-types';
import { JpHeading } from './heading';

const meta: Meta<JpHeading> = {
  title: 'Primitives/Typography/Heading',
  component: JpHeading,
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
        .jp-heading-story__frame {
          display: grid;
          gap: var(--jp-space-xs);
          max-width: calc(var(--jp-space-3xl) * 5 + var(--jp-space-md) * 2);
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-default);
          border-radius: var(--jp-radius-md);
          background: var(--jp-color-surface-sunken);
        }

        .jp-heading-story__hint {
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }

        .jp-heading-story__sample {
          min-height: calc(var(--jp-space-3xl) + var(--jp-space-lg));
          display: flex;
          align-items: center;
          padding: var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
          border-radius: var(--jp-radius-md);
          background: var(--jp-color-surface-raised);
        }
      </style>

      <div class="jp-heading-story__frame">
        <div class="jp-heading-story__hint">
          Page and section titles. as sets h1–h6; size auto uses display scale for h1/h2 and title scale for h3–h6.
        </div>
        <div class="jp-heading-story__sample">
          <jp-heading [as]="asTag" [size]="size" [tone]="tone" [weight]="weight">
            Heading Primitive
          </jp-heading>
        </div>
      </div>
    `,
  }),
  argTypes: {
    as: {
      control: 'select',
      options: JP_HEADING_TAGS,
    },
    size: {
      control: 'select',
      options: JP_HEADING_SIZES,
    },
    tone: {
      control: 'select',
      options: JP_TEXT_TONES,
    },
    weight: {
      control: 'select',
      options: JP_FONT_WEIGHTS,
    },
  },
  args: {
    as: 'h2',
    size: 'auto',
    tone: 'primary',
    weight: 'semibold',
  },
};

export default meta;
type Story = StoryObj<JpHeading>;

function resolveExpectedTag(value: unknown): (typeof JP_HEADING_TAGS)[number] {
  if (
    typeof value === 'string' &&
    (JP_HEADING_TAGS as readonly string[]).includes(value)
  ) {
    return value as (typeof JP_HEADING_TAGS)[number];
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
