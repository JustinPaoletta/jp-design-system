import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_GRID_COLUMNS,
  JP_GRID_MIN_COLUMNS,
  JP_GRID_MODES,
  JP_LAYOUT_TAGS,
  JP_SPACE_TOKENS,
} from '../shared/primitive-types';
import { JpGrid } from './grid';

const meta: Meta<JpGrid> = {
  title: 'Primitives/Layout/Grid',
  component: JpGrid,
  globals: {
    accent: 'neon',
  },
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <style>
        .jp-grid-story__frame {
          display: grid;
          gap: var(--jp-space-xs);
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-subtle);
        }

        .jp-grid-story__hint {
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }

        .jp-grid-story__frame jp-grid .jp-grid__root {
          padding: var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
        }

        .jp-grid-story__card {
          min-height: calc(var(--jp-space-3xl) + var(--jp-space-md));
          padding: var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
          background: var(--jp-color-surface-subtle);
          color: var(--jp-color-foreground-primary);
          box-sizing: border-box;
        }
      </style>

      <div class="jp-grid-story__frame">
        <div class="jp-grid-story__hint">
          Fixed mode — columns sets equal tracks (try 2, 4, or 6). See AutoFit story to test responsive reflow at narrow widths.
        </div>
        <jp-grid [as]="asTag" [gap]="gap" [columns]="columns" [mode]="mode" [minColumn]="minColumn">
          <div class="jp-grid-story__card">Card 1</div>
          <div class="jp-grid-story__card">Card 2</div>
          <div class="jp-grid-story__card">Card 3</div>
        </jp-grid>
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
    columns: {
      control: 'select',
      options: JP_GRID_COLUMNS,
    },
    mode: {
      control: 'select',
      options: JP_GRID_MODES,
    },
    minColumn: {
      control: 'select',
      options: JP_GRID_MIN_COLUMNS,
    },
  },
  args: {
    as: 'div',
    gap: 'md',
    columns: 3,
    mode: 'fixed',
    minColumn: 'md',
  },
};

export default meta;
type Story = StoryObj<JpGrid>;

function resolveExpectedTemplateColumns(args: {
  mode?: unknown;
  columns?: unknown;
}): string {
  if (args.mode === 'auto-fit') {
    return 'auto-fit';
  }

  if (
    typeof args.columns === 'number' &&
    (JP_GRID_COLUMNS as readonly number[]).includes(args.columns)
  ) {
    return `repeat(${args.columns}, minmax(0px, 1fr))`;
  }

  return 'repeat(3, minmax(0px, 1fr))';
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector(
      '.jp-grid__root',
    ) as HTMLElement | null;
    await expect(root).toBeTruthy();
    await expect(root?.style.gridTemplateColumns).toContain(
      resolveExpectedTemplateColumns(args),
    );
  },
};

export const AutoFit: Story = {
  args: {
    mode: 'auto-fit',
    minColumn: 'lg',
  },
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <style>
        .jp-grid-story__frame {
          display: grid;
          gap: var(--jp-space-xs);
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-subtle);
        }

        .jp-grid-story__hint {
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }

        .jp-grid-story__frame jp-grid .jp-grid__root {
          padding: var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
        }

        .jp-grid-story__card {
          min-height: calc(var(--jp-space-3xl) + var(--jp-space-md));
          padding: var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
          background: var(--jp-color-surface-subtle);
          color: var(--jp-color-foreground-primary);
          box-sizing: border-box;
        }
      </style>

      <div class="jp-grid-story__frame">
        <div class="jp-grid-story__hint">
          Resize to a mobile width — cards reflow to fewer columns with no horizontal overflow.
        </div>
        <jp-grid [as]="asTag" [gap]="gap" [columns]="columns" [mode]="mode" [minColumn]="minColumn">
          <div class="jp-grid-story__card">Card 1</div>
          <div class="jp-grid-story__card">Card 2</div>
          <div class="jp-grid-story__card">Card 3</div>
          <div class="jp-grid-story__card">Card 4</div>
          <div class="jp-grid-story__card">Card 5</div>
          <div class="jp-grid-story__card">Card 6</div>
        </jp-grid>
      </div>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector(
      '.jp-grid__root',
    ) as HTMLElement | null;
    await expect(root).toBeTruthy();
    await expect(root?.style.gridTemplateColumns).toContain(
      resolveExpectedTemplateColumns(args),
    );
    const cards = canvasElement.querySelectorAll('.jp-grid-story__card');
    await expect(cards.length).toBe(6);
  },
};
