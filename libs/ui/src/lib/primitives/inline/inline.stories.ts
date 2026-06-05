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
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <style>
        .jp-inline-story__frame {
          max-width: calc(var(--jp-space-2xl) * 6);
          padding: var(--jp-space-sm);
          border: 1px dashed var(--jp-color-border-subtle);
        }

        .jp-inline-story__frame jp-inline .jp-inline__root {
          padding: var(--jp-space-sm);
          border: 1px solid var(--jp-color-border-default);
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

      <div class="jp-inline-story__frame">
        <jp-inline [as]="asTag" [gap]="gap" [align]="align" [justify]="justify" [wrap]="wrap">
          <span class="jp-inline-story__item">Alpha Item</span>
          <span class="jp-inline-story__item">Beta Item</span>
          <span class="jp-inline-story__item">Gamma Item</span>
        </jp-inline>
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
