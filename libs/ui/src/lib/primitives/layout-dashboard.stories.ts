import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpBox } from './box/box';
import { JpGrid } from './grid/grid';
import { JpHeading } from './heading/heading';
import { JpInline } from './inline/inline';
import { JpStack } from './stack/stack';
import { JpSurface } from './surface/surface';
import { JpText } from './text/text';

const meta: Meta = {
  title: 'Compositions/Layout Dashboard',
  component: JpBox,
  decorators: [
    moduleMetadata({
      imports: [JpBox, JpStack, JpInline, JpGrid, JpSurface, JpText, JpHeading],
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
      </style>

      <jp-box padding="lg" maxWidth="wide">
        <jp-stack gap="lg">
          <jp-stack gap="sm" class="jp-layout-dashboard-story__header">
            <jp-inline align="center" gap="sm">
              <jp-heading as="h1">Game overview</jp-heading>
            </jp-inline>
            <jp-text tone="secondary">Riverton Falcons 5–3 Lakeview Bears · October 11, 2026</jp-text>

          </jp-stack>

          <jp-grid mode="auto-fit" minColumn="sm" gap="md">
            <jp-surface padding="lg" tone="subtle" border="subtle" elevation="none">
              <jp-stack gap="xs">
                <jp-text as="small" size="caption" tone="muted">Runs scored</jp-text>
                <span class="jp-layout-dashboard-story__metric">5</span>
              </jp-stack>
            </jp-surface>
            <jp-surface padding="lg" tone="subtle" border="subtle" elevation="none">
              <jp-stack gap="xs">
                <jp-text as="small" size="caption" tone="muted">Hits</jp-text>
                <span class="jp-layout-dashboard-story__metric">9</span>
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
            <jp-surface tone="raised" padding="lg">
              <jp-stack gap="sm">
                <jp-heading as="h2" size="h4">Activity</jp-heading>
                <jp-stack gap="xs">
                  <jp-text tone="secondary">Game report saved</jp-text>
                  <jp-text tone="secondary">League lineup approved</jp-text>
                  <jp-text tone="secondary">Riverton Falcons club dashboard</jp-text>
                </jp-stack>
              </jp-stack>
            </jp-surface>
            <jp-surface tone="raised" padding="lg">
              <jp-stack gap="sm">
                <jp-heading as="h2" size="h4">Insights</jp-heading>
                <jp-text tone="secondary">
                  The Falcons scored five runs on nine hits with no errors.
                </jp-text>
              </jp-stack>
            </jp-surface>
          </jp-grid>

          <jp-surface tone="subtle" padding="lg" border="subtle" elevation="none">
            <jp-stack gap="sm">
              <jp-heading as="h2" size="h4">Recent games</jp-heading>
              <jp-stack gap="xs">
                <jp-inline justify="between">
                  <jp-text>Starting lineup confirmed</jp-text>
                  <jp-text as="small" size="caption" tone="muted">10m ago</jp-text>
                </jp-inline>
                <jp-inline justify="between">
                  <jp-text>Last season archived</jp-text>
                  <jp-text as="small" size="caption" tone="muted">22m ago</jp-text>
                </jp-inline>
                <jp-inline justify="between">
                  <jp-text>Next game scheduled at Riverton Field</jp-text>
                  <jp-text as="small" size="caption" tone="muted">38m ago</jp-text>
                </jp-inline>
              </jp-stack>
            </jp-stack>
          </jp-surface>
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
    const cards = canvasElement.querySelectorAll('.jp-surface__root');
    await expect(cards.length).toBeGreaterThan(3);
  },
};
