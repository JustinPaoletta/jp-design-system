import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_ALIGN_ITEMS,
  JP_JUSTIFY_CONTENT,
  JP_LAYOUT_TAGS,
  JP_SPACE_TOKENS,
} from '../shared/primitive-types';
import { JpInline } from './inline';

const meta: Meta<JpInline> = {
  title: 'Primitives/Layout/Inline',
  component: JpInline,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <style>
        .jp-inline-story__shell {
          inline-size: 100%;
          max-inline-size: 100%;
          padding: var(--jp-space-lg);
          box-sizing: border-box;
        }

        .jp-inline-story__frame {
          display: grid;
          gap: var(--jp-space-xs);
          inline-size: 100%;
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-subtle);
          box-sizing: border-box;
        }

        .jp-inline-story__hint {
          color: var(--jp-color-foreground-secondary);
          font: var(--jp-font-label-sm);
          letter-spacing: var(--jp-font-letter-spacing-wide);
        }

        .jp-inline-story__viewport {
          display: flex;
          flex-direction: column;
          inline-size: 100%;
          min-block-size: calc(var(--jp-space-2xl) * 3);
          padding: var(--jp-space-md);
          border: 1px solid var(--jp-color-border-default);
          box-sizing: border-box;
        }

        .jp-inline-story__viewport > jp-inline {
          flex: 1;
          min-height: 0;
          min-width: 0;
        }

        .jp-inline-story__item {
          display: inline-flex;
          align-items: center;
          padding: var(--jp-space-xs) var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
          background: var(--jp-color-surface-subtle);
          color: var(--jp-color-foreground-primary);
          white-space: nowrap;
        }
      </style>

      <div class="jp-inline-story__shell">
        <div class="jp-inline-story__frame">
          <div class="jp-inline-story__hint">
            justify distributes along the main axis; align along the cross axis.
          </div>
          <div class="jp-inline-story__viewport">
            <jp-inline [as]="asTag" [gap]="gap" [align]="align" [justify]="justify" [wrap]="wrap">
              <span class="jp-inline-story__item">Alpha Item</span>
              <span class="jp-inline-story__item">Beta Item</span>
              <span class="jp-inline-story__item">Gamma Item</span>
            </jp-inline>
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
    wrap: {
      control: 'boolean',
    },
  },
  args: {
    as: 'div',
    gap: 'sm',
    align: 'center',
    justify: 'start',
    wrap: true,
  },
};

export default meta;
type Story = StoryObj<JpInline>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.jp-inline__root');
    await expect(root).toBeTruthy();
  },
};
