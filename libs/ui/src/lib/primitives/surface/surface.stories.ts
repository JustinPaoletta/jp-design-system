import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_BORDER_TONES,
  JP_ELEVATION_TOKENS,
  JP_LAYOUT_TAGS,
  JP_RADIUS_TOKENS,
  JP_SPACE_TOKENS,
  JP_SURFACE_TONES,
} from '../shared/primitive-types';
import { JpSurface } from './surface';

const STAGE_BACKGROUNDS: Record<(typeof JP_SURFACE_TONES)[number], string> = {
  canvas: 'var(--jp-color-surface-overlay)',
  sunken: 'var(--jp-color-surface-overlay)',
  subtle: 'var(--jp-color-surface-canvas)',
  raised: 'var(--jp-color-surface-canvas)',
  overlay: 'var(--jp-color-surface-canvas)',
};

const meta: Meta<JpSurface> = {
  title: 'Primitives/Layout/Surface',
  component: JpSurface,
  globals: {
    accent: 'neon',
  },
  render: (args) => ({
    props: {
      ...args,
      asTag: args.as,
      stageBackground:
        STAGE_BACKGROUNDS[
          (args.tone ?? 'raised') as (typeof JP_SURFACE_TONES)[number]
        ],
    },
    template: `
      <style>
        .jp-surface-story__frame {
          max-width: calc(var(--jp-space-3xl) * 7 + var(--jp-space-md) * 2);
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-subtle);
        }

        .jp-surface-story__stage {
          padding: var(--jp-space-lg);
          border: 1px solid var(--jp-color-border-subtle);
          border-radius: var(--jp-radius-xl);
        }

        .jp-surface-story__sample {
          max-width: calc(var(--jp-space-3xl) * 6);
          margin: 0 auto;
        }

        .jp-surface-story__eyebrow {
          margin-bottom: var(--jp-space-xs);
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }
      </style>

      <div class="jp-surface-story__frame">
        <div class="jp-surface-story__stage" [style.background]="stageBackground">
          <div class="jp-surface-story__sample">
            <jp-surface [as]="asTag" [tone]="tone" [padding]="padding" [radius]="radius" [border]="border" [elevation]="elevation">
              <div class="jp-surface-story__eyebrow">Surface primitive sample</div>
              <div>Surface content</div>
            </jp-surface>
          </div>
        </div>
      </div>
    `,
  }),
  argTypes: {
    as: {
      control: 'select',
      options: JP_LAYOUT_TAGS,
    },
    tone: {
      control: 'select',
      options: JP_SURFACE_TONES,
    },
    padding: {
      control: 'select',
      options: JP_SPACE_TOKENS,
    },
    radius: {
      control: 'select',
      options: JP_RADIUS_TOKENS,
    },
    border: {
      control: 'select',
      options: JP_BORDER_TONES,
    },
    elevation: {
      control: 'select',
      options: JP_ELEVATION_TOKENS,
    },
  },
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

function resolveExpectedTag(value: unknown): (typeof JP_LAYOUT_TAGS)[number] {
  if (
    typeof value === 'string' &&
    (JP_LAYOUT_TAGS as readonly string[]).includes(value)
  ) {
    return value as (typeof JP_LAYOUT_TAGS)[number];
  }

  return 'section';
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector(
      `${resolveExpectedTag(args.as)}.jp-surface__root`,
    );
    await expect(root).toBeTruthy();
    await expect(getComputedStyle(root as Element).backgroundColor).not.toBe(
      '',
    );
  },
};
