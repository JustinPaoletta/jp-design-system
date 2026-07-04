import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_BORDER_TONES,
  JP_ELEVATION_TOKENS,
  JP_LAYOUT_TAGS,
  JP_RADIUS_TOKENS,
  JP_SPACE_TOKENS,
  JP_SURFACE_TONES,
  type JpSurfaceTone,
} from '../shared/primitive-types';
import { JpSurface } from './surface';

/** Outer stage contrasts with the sample surface tone. */
function stageBackgroundForTone(tone: JpSurfaceTone): string {
  return tone === 'emphasis'
    ? 'var(--jp-color-surface-canvas)'
    : 'var(--jp-color-surface-emphasis)';
}

/** Mid-tone mat so drop shadows read against something lighter than canvas. */
function shadowMatBackgroundForTone(tone: JpSurfaceTone): string {
  return tone === 'emphasis'
    ? 'var(--jp-color-surface-raised)'
    : 'var(--jp-color-surface-emphasis)';
}

const meta: Meta<JpSurface> = {
  title: 'Primitives/Layout/Surface',
  component: JpSurface,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => ({
    props: {
      ...args,
      asTag: args.as,
      stageBackground: stageBackgroundForTone(
        (args.tone ?? 'raised') as JpSurfaceTone,
      ),
      shadowMatBackground: shadowMatBackgroundForTone(
        (args.tone ?? 'raised') as JpSurfaceTone,
      ),
    },
    template: `
      <style>
        .jp-surface-story__shell {
          inline-size: 100%;
          max-inline-size: 100%;
          box-sizing: border-box;
        }

        .jp-surface-story__frame {
          display: grid;
          gap: var(--jp-space-xs);
          inline-size: 100%;
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-subtle);
          box-sizing: border-box;
        }

        .jp-surface-story__hint {
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }

        .jp-surface-story__stage {
          padding: var(--jp-space-lg);
          border: 1px solid var(--jp-color-border-subtle);
          border-radius: var(--jp-radius-xl);
          overflow: visible;
        }

        .jp-surface-story__mat {
          padding: var(--jp-space-2xl);
          border-radius: var(--jp-radius-lg);
          overflow: visible;
        }

        .jp-surface-story__compare {
          display: grid;
          gap: var(--jp-space-xl);
          grid-template-columns: repeat(auto-fit, minmax(calc(var(--jp-space-3xl) * 4), 1fr));
        }

        .jp-surface-story__sample {
          max-width: calc(var(--jp-space-3xl) * 5);
        }

        .jp-surface-story__label {
          margin-bottom: var(--jp-space-xs);
          color: var(--jp-color-foreground-muted);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
          text-transform: uppercase;
        }

        .jp-surface-story__eyebrow {
          margin-bottom: var(--jp-space-xs);
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }
      </style>

      <div class="jp-surface-story__shell">
        <div class="jp-surface-story__frame">
          <div class="jp-surface-story__hint">
            Visual panel — tone, border, radius, and padding set the fill; elevation adds rim and shadow. Compare the control panel to the none reference on the mid-tone mat.
          </div>
          <div class="jp-surface-story__stage" [style.background]="stageBackground">
            <div class="jp-surface-story__mat" [style.background]="shadowMatBackground">
              <div class="jp-surface-story__compare">
                <div class="jp-surface-story__sample">
                  <div class="jp-surface-story__label">none (reference)</div>
                  <jp-surface [as]="asTag" [tone]="tone" [padding]="padding" [radius]="radius" border="subtle" elevation="none">
                    <div class="jp-surface-story__eyebrow">Surface primitive sample</div>
                    <div>No elevation</div>
                  </jp-surface>
                </div>
                <div class="jp-surface-story__sample">
                  <div class="jp-surface-story__label">{{ elevation }} (control)</div>
                  <jp-surface [as]="asTag" [tone]="tone" [padding]="padding" [radius]="radius" [border]="border" [elevation]="elevation">
                    <div class="jp-surface-story__eyebrow">Surface primitive sample</div>
                    <div>Surface content</div>
                  </jp-surface>
                </div>
              </div>
            </div>
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
    border: 'subtle',
    elevation: 'floating',
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

export const ElevationLadder: Story = {
  render: () => ({
    template: `
      <style>
        .jp-surface-story__shell {
          inline-size: 100%;
          box-sizing: border-box;
        }

        .jp-surface-story__frame {
          display: grid;
          gap: var(--jp-space-sm);
          inline-size: 100%;
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-subtle);
          box-sizing: border-box;
        }

        .jp-surface-story__hint {
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }

        .jp-surface-story__stage {
          padding: var(--jp-space-lg);
          border: 1px solid var(--jp-color-border-subtle);
          border-radius: var(--jp-radius-xl);
          background: var(--jp-color-surface-canvas);
          overflow: visible;
        }

        .jp-surface-story__mat {
          display: grid;
          gap: var(--jp-space-lg);
          grid-template-columns: repeat(auto-fit, minmax(calc(var(--jp-space-3xl) * 4), 1fr));
          padding: var(--jp-space-2xl);
          border-radius: var(--jp-radius-lg);
          background: var(--jp-color-surface-emphasis);
          overflow: visible;
        }

        .jp-surface-story__label {
          margin-bottom: var(--jp-space-xs);
          color: var(--jp-color-foreground-muted);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }
      </style>

      <div class="jp-surface-story__shell">
        <div class="jp-surface-story__frame">
          <div class="jp-surface-story__hint">
            All elevation steps on a fixed raised panel — none, raised, floating, and overlay.
          </div>
          <div class="jp-surface-story__stage">
            <div class="jp-surface-story__mat">
              <div>
                <div class="jp-surface-story__label">none</div>
                <jp-surface tone="raised" padding="md" radius="lg" border="subtle" elevation="none">
                  Elevation none
                </jp-surface>
              </div>
              <div>
                <div class="jp-surface-story__label">raised</div>
                <jp-surface tone="raised" padding="md" radius="lg" border="subtle" elevation="raised">
                  Elevation raised
                </jp-surface>
              </div>
              <div>
                <div class="jp-surface-story__label">floating</div>
                <jp-surface tone="raised" padding="md" radius="lg" border="subtle" elevation="floating">
                  Elevation floating
                </jp-surface>
              </div>
              <div>
                <div class="jp-surface-story__label">overlay</div>
                <jp-surface tone="raised" padding="md" radius="lg" border="subtle" elevation="overlay">
                  Elevation overlay
                </jp-surface>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const roots = canvasElement.querySelectorAll('.jp-surface__root');
    await expect(roots.length).toBe(4);
  },
};
