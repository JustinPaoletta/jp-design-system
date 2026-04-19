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
  title: 'Compositions/Phase 2/Layout Dashboard',
  component: JpBox,
  decorators: [
    moduleMetadata({
      imports: [JpBox, JpStack, JpInline, JpGrid, JpSurface, JpText, JpHeading],
    }),
  ],
  render: () => ({
    template: `
      <jp-box padding="lg" maxWidth="wide">
        <jp-stack gap="lg">
          <jp-stack gap="xs">
            <jp-heading as="h1">Phase 2 Layout Dashboard</jp-heading>
            <jp-text tone="secondary">Layout-only composition with primitives.</jp-text>
            <jp-inline gap="sm">
              <jp-text as="small" tone="muted">accent: {{ documentAccent }}</jp-text>
              <jp-text as="small" tone="muted">density: {{ documentDensity }}</jp-text>
            </jp-inline>
          </jp-stack>

          <jp-grid mode="auto-fit" minColumn="sm" gap="md">
            <jp-surface padding="md" tone="subtle" border="subtle" elevation="none">
              <jp-stack gap="xs">
                <jp-text as="small" tone="muted">Active sessions</jp-text>
                <jp-heading as="h3" size="title">1,284</jp-heading>
              </jp-stack>
            </jp-surface>
            <jp-surface padding="md" tone="subtle" border="subtle" elevation="none">
              <jp-stack gap="xs">
                <jp-text as="small" tone="muted">Error rate</jp-text>
                <jp-heading as="h3" size="title">0.14%</jp-heading>
              </jp-stack>
            </jp-surface>
            <jp-surface padding="md" tone="subtle" border="subtle" elevation="none">
              <jp-stack gap="xs">
                <jp-text as="small" tone="muted">Avg response</jp-text>
                <jp-heading as="h3" size="title">182ms</jp-heading>
              </jp-stack>
            </jp-surface>
          </jp-grid>

          <jp-grid columns="2" gap="md">
            <jp-surface tone="raised" padding="md">
              <jp-stack gap="sm">
                <jp-heading as="h3">Activity</jp-heading>
                <jp-stack gap="xs">
                  <jp-text tone="secondary">Design token sync completed</jp-text>
                  <jp-text tone="secondary">Storybook interaction checks passing</jp-text>
                  <jp-text tone="secondary">Playground route composed with primitives</jp-text>
                </jp-stack>
              </jp-stack>
            </jp-surface>
            <jp-surface tone="raised" padding="md">
              <jp-stack gap="sm">
                <jp-heading as="h3">Insights</jp-heading>
                <jp-text tone="secondary">
                  Component APIs are token-only and semantic-first.
                </jp-text>
              </jp-stack>
            </jp-surface>
          </jp-grid>

          <jp-surface tone="subtle" padding="md" border="subtle" elevation="none">
            <jp-stack gap="sm">
              <jp-heading as="h3">Recent Events</jp-heading>
              <jp-stack gap="xs">
                <jp-inline justify="between">
                  <jp-text>Grid min-column tokens added</jp-text>
                  <jp-text as="small" tone="muted">10m ago</jp-text>
                </jp-inline>
                <jp-inline justify="between">
                  <jp-text>Legacy lib-ui marked deprecated</jp-text>
                  <jp-text as="small" tone="muted">22m ago</jp-text>
                </jp-inline>
                <jp-inline justify="between">
                  <jp-text>CI updated with Playwright dashboard check</jp-text>
                  <jp-text as="small" tone="muted">38m ago</jp-text>
                </jp-inline>
              </jp-stack>
            </jp-stack>
          </jp-surface>
        </jp-stack>
      </jp-box>
    `,
    props: {
      documentAccent:
        document.documentElement.getAttribute('data-jp-accent') ?? 'neon',
      documentDensity:
        document.documentElement.getAttribute('data-jp-density') ?? 'default',
    },
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
