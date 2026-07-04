import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_BOX_MAX_WIDTHS,
  JP_LAYOUT_TAGS,
  JP_SPACE_TOKENS,
} from '../shared/primitive-types';
import { JpBox } from './box';

const AXIS_PADDING_OPTIONS = ['inherit', ...JP_SPACE_TOKENS] as const;

type BoxStoryArgs = {
  as: (typeof JP_LAYOUT_TAGS)[number];
  padding: (typeof JP_SPACE_TOKENS)[number];
  paddingX: (typeof AXIS_PADDING_OPTIONS)[number];
  paddingY: (typeof AXIS_PADDING_OPTIONS)[number];
  maxWidth: (typeof JP_BOX_MAX_WIDTHS)[number];
};

const meta: Meta<BoxStoryArgs> = {
  title: 'Primitives/Layout/Box',
  component: JpBox,
  globals: {
    accent: 'neon',
  },
  render: (args) => ({
    props: {
      ...args,
      asTag: args.as,
      paddingXValue: args.paddingX === 'inherit' ? null : args.paddingX,
      paddingYValue: args.paddingY === 'inherit' ? null : args.paddingY,
    },
    template: `
      <style>
        .jp-box-story__frame {
          display: grid;
          gap: var(--jp-space-xs);
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-subtle);
          max-width: 100%;
        }

        .jp-box-story__hint {
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }

        .jp-box-story__viewport jp-box .jp-box__root {
          outline: 1px dashed var(--jp-color-border-default);
          outline-offset: -1px;
        }

        .jp-box-story__content {
          min-height: calc(var(--jp-space-3xl) + var(--jp-space-md));
          padding: var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
          background: var(--jp-color-surface-subtle);
          color: var(--jp-color-foreground-primary);
          box-sizing: border-box;
        }
      </style>

      <div class="jp-box-story__frame">
        <div class="jp-box-story__hint">
          Structural wrapper — padding and max-width only, no fill or border. Dashed outline marks jp-box bounds; solid inner block is slotted content.
        </div>
        <div class="jp-box-story__viewport">
          <jp-box [as]="asTag" [padding]="padding" [paddingX]="paddingXValue" [paddingY]="paddingYValue" [maxWidth]="maxWidth">
            <div class="jp-box-story__content" data-testid="box-content">
              Box content
            </div>
          </jp-box>
        </div>
      </div>
    `,
  }),
  argTypes: {
    as: {
      control: 'select',
      options: JP_LAYOUT_TAGS,
    },
    padding: {
      control: 'select',
      options: JP_SPACE_TOKENS,
    },
    paddingX: {
      control: 'select',
      options: AXIS_PADDING_OPTIONS,
    },
    paddingY: {
      control: 'select',
      options: AXIS_PADDING_OPTIONS,
    },
    maxWidth: {
      control: 'select',
      options: JP_BOX_MAX_WIDTHS,
    },
  },
  args: {
    as: 'div',
    padding: 'md',
    paddingX: 'inherit',
    paddingY: 'inherit',
    maxWidth: 'none',
  },
};

export default meta;
type Story = StoryObj<BoxStoryArgs>;

function resolveExpectedTag(value: unknown): (typeof JP_LAYOUT_TAGS)[number] {
  if (
    typeof value === 'string' &&
    (JP_LAYOUT_TAGS as readonly string[]).includes(value)
  ) {
    return value as (typeof JP_LAYOUT_TAGS)[number];
  }

  return 'div';
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector(
      `${resolveExpectedTag(args.as)}.jp-box__root`,
    ) as HTMLElement | null;
    await expect(root).toBeTruthy();
    await expect(getComputedStyle(root as HTMLElement).display).toBe('block');
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

/** Base padding lg with horizontal axis cleared — vertical padding should remain. */
export const PaddingXOverride: Story = {
  args: {
    padding: 'lg',
    paddingX: 'none',
    paddingY: 'inherit',
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '.jp-box__root',
    ) as HTMLElement | null;
    await expect(root).toBeTruthy();
    const styles = getComputedStyle(root as HTMLElement);
    await expect(styles.paddingTop).not.toBe('0px');
    await expect(styles.paddingLeft).toBe('0px');
  },
};

/** Base padding lg with vertical axis cleared — horizontal padding should remain. */
export const PaddingYOverride: Story = {
  args: {
    padding: 'lg',
    paddingX: 'inherit',
    paddingY: 'none',
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '.jp-box__root',
    ) as HTMLElement | null;
    await expect(root).toBeTruthy();
    const styles = getComputedStyle(root as HTMLElement);
    await expect(styles.paddingTop).toBe('0px');
    await expect(styles.paddingLeft).not.toBe('0px');
  },
};

/** Shows max-width token cap — compare with Default (none) via controls. */
export const MaxWidthNarrow: Story = {
  args: {
    padding: 'md',
    maxWidth: 'narrow',
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '.jp-box__root',
    ) as HTMLElement | null;
    await expect(root).toBeTruthy();
    await expect(getComputedStyle(root as HTMLElement).maxWidth).not.toBe(
      'none',
    );
  },
};
