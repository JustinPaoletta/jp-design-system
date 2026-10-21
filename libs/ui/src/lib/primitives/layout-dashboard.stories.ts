import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpBox } from './box/box';
import { JpGrid } from './grid/grid';
import { JpHeading } from './heading/heading';
import { JpInline } from './inline/inline';
import { JpStack } from './stack/stack';
import { JpSurface } from './surface/surface';
import { JpCard } from './card/card';
import { JpText } from './text/text';

const meta: Meta = {
  title: 'Compositions/Layout Dashboard',
  component: JpBox,
  decorators: [
    moduleMetadata({
      imports: [
        JpBox,
        JpStack,
        JpInline,
        JpGrid,
        JpSurface,
        JpCard,
        JpText,
        JpHeading,
      ],
    }),
  ],
  render: () => ({
    template: `
      <style>
        .jp-layout-dashboard-story__header {
          align-items: flex-start;
        }

        .jp-layout-dashboard-story__metric {
          font-size: var(--jp-font-size-display);
          font-weight: var(--jp-font-weight-semibold);
          font-variant-numeric: tabular-nums;
          line-height: var(--jp-font-line-height-tight);
        }
        .jp-layout-dashboard-story__events {
          list-style: none;
          display: grid;
          gap: var(--jp-space-sm);
          padding: 0;
          margin: 0;
        }
        .jp-layout-dashboard-story__events li {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: var(--jp-space-xs) var(--jp-space-md);
        }
        .jp-layout-dashboard-story__events time {
          color: var(--jp-color-text-muted);
          font-size: var(--jp-font-size-caption);
        }
      </style>

      <jp-box padding="lg" maxWidth="wide">
        <jp-stack gap="lg">
          <jp-stack gap="sm" class="jp-layout-dashboard-story__header">
            <jp-inline align="center" gap="sm">
              <jp-heading as="h1">Game overview</jp-heading>
            </jp-inline>
            <jp-text tone="secondary">Los Angeles Dodgers 7, New York Yankees 6 · October 30, 2024</jp-text>

          </jp-stack>

          <jp-grid mode="auto-fit" minColumn="sm" gap="md">
            <jp-surface padding="lg" tone="subtle" border="subtle" elevation="none">
              <jp-stack gap="xs">
                <jp-text as="small" size="caption" tone="muted">Runs scored</jp-text>
                <span class="jp-layout-dashboard-story__metric">7</span>
              </jp-stack>
            </jp-surface>
            <jp-surface padding="lg" tone="subtle" border="subtle" elevation="none">
              <jp-stack gap="xs">
                <jp-text as="small" size="caption" tone="muted">Hits</jp-text>
                <span class="jp-layout-dashboard-story__metric">7</span>
              </jp-stack>
            </jp-surface>
            <jp-surface padding="lg" tone="subtle" border="subtle" elevation="none">
              <jp-stack gap="xs">
                <jp-text as="small" size="caption" tone="muted">Errors</jp-text>
                <span class="jp-layout-dashboard-story__metric">0</span>
              </jp-stack>
            </jp-surface>
          </jp-grid>

          <jp-grid mode="auto-fit" minColumn="sm" gap="md">
            <jp-card title="Activity">
              <ul class="jp-layout-dashboard-story__events">
                <li>Game report saved</li>
                <li>League lineup approved</li>
                <li>Dodgers roster updated</li>
              </ul>
            </jp-card>
            <jp-card title="Insights">
              <p>The Dodgers scored seven runs on seven hits with no errors.</p>
            </jp-card>
          </jp-grid>

          <jp-card title="Recent club activity">
            <ul class="jp-layout-dashboard-story__events">
              <li><span>Jack Flaherty starts</span><time datetime="2024-10-30T20:08:00-04:00">8:08 p.m.</time></li>
              <li><span>Freddie Freeman drives in two runs</span><time datetime="2024-10-30">5th inning</time></li>
              <li><span>Final at Yankee Stadium</span><time datetime="2024-10-30T23:50:00-04:00">11:50 p.m.</time></li>
            </ul>
          </jp-card>
        </jp-stack>
      </jp-box>
    `,
  }),
};

export default meta;

type Story = StoryObj;

export const Dashboard: Story = {
  play: async ({ canvasElement }) => {
    const dashboardHeading = canvasElement.querySelector('h1.jp-heading__root');
    await expect(dashboardHeading).toBeTruthy();
    const grids = canvasElement.querySelectorAll('.jp-grid__root');
    await expect(grids.length).toBeGreaterThan(1);
    const cards = canvasElement.querySelectorAll('jp-card');
    await expect(cards.length).toBe(3);
  },
};
