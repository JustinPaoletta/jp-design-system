import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_ALIGN_ITEMS,
  JP_JUSTIFY_CONTENT,
  JP_LAYOUT_TAGS,
  JP_SPACE_TOKENS,
} from '../shared/primitive-types';
import { JpStack } from './stack';

const meta: Meta<JpStack> = {
  title: 'Primitives/Layout/Stack',
  component: JpStack,
  globals: {
    accent: 'neon',
  },
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <style>
        .jp-stack-story__frame {
          display: grid;
          gap: var(--jp-space-xs);
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-subtle);
        }

        .jp-stack-story__hint {
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }

        .jp-stack-story__viewport {
          display: flex;
          flex-direction: column;
          min-height: calc(var(--jp-space-2xl) * 6);
          padding: var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
          box-sizing: border-box;
        }

        .jp-stack-story__viewport > jp-stack {
          flex: 1;
          min-height: 0;
        }

        .jp-stack-story__item {
          min-width: calc(var(--jp-space-md) * 6);
          padding: var(--jp-space-xs) var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
          background: var(--jp-color-surface-subtle);
          color: var(--jp-color-foreground-primary);
        }
      </style>

      <div class="jp-stack-story__frame">
        <div class="jp-stack-story__hint">
          Vertical flex layout. justify moves items top-to-bottom; align moves items left-to-right. See SpaceBetween and Centered for common presets.
        </div>
        <div class="jp-stack-story__viewport">
          <jp-stack [as]="asTag" [gap]="gap" [align]="align" [justify]="justify">
            <div class="jp-stack-story__item">Item A</div>
            <div class="jp-stack-story__item">Item B</div>
            <div class="jp-stack-story__item">Item C</div>
          </jp-stack>
        </div>
      </div>
    `,
  }),
  argTypes: {
    as: {
      control: 'select',
      options: JP_LAYOUT_TAGS,
    },
    gap: {
      control: 'select',
      options: JP_SPACE_TOKENS,
    },
    align: {
      control: 'select',
      options: JP_ALIGN_ITEMS,
    },
    justify: {
      control: 'select',
      options: JP_JUSTIFY_CONTENT,
    },
  },
  args: {
    as: 'div',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
};

export default meta;
type Story = StoryObj<JpStack>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.jp-stack__root');
    await expect(root).toBeTruthy();
  },
};

export const SpaceBetween: Story = {
  args: {
    justify: 'between',
    gap: 'sm',
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '.jp-stack__root',
    ) as HTMLElement | null;
    await expect(root).toBeTruthy();
    await expect(getComputedStyle(root as HTMLElement).justifyContent).toBe(
      'space-between',
    );
  },
};

export const Centered: Story = {
  args: {
    align: 'center',
    justify: 'center',
    gap: 'md',
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '.jp-stack__root',
    ) as HTMLElement | null;
    await expect(root).toBeTruthy();
    await expect(getComputedStyle(root as HTMLElement).alignItems).toBe(
      'center',
    );
    await expect(getComputedStyle(root as HTMLElement).justifyContent).toBe(
      'center',
    );
  },
};
