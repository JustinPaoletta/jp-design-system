import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpBox } from '../box/box';
import { JpHeading } from '../heading/heading';
import { JpStack } from '../stack/stack';
import { JpSurface } from '../surface/surface';
import { JpText } from '../text/text';
import { JpAppShell } from './app-shell';

type AppShellStoryArgs = {
  sidebarCollapsed: boolean;
};

const meta: Meta<AppShellStoryArgs> = {
  title: 'Primitives/Layout/App Shell',
  component: JpAppShell,
  decorators: [
    moduleMetadata({
      imports: [JpAppShell, JpStack, JpSurface, JpText, JpHeading, JpBox],
    }),
  ],
  render: (args, { updateArgs }) => ({
    props: {
      ...args,
      onSidebarCollapsedChange(next: boolean) {
        updateArgs({ sidebarCollapsed: next });
      },
    },
    template: `
      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
      >
        <nav jpAppShellSidebar aria-label="Primary">
          <jp-stack gap="xs">
            <jp-text tone="secondary" size="caption">Navigation</jp-text>
            <jp-stack gap="2xs">
              <jp-text>Overview</jp-text>
              <jp-text tone="muted">Activity</jp-text>
              <jp-text tone="muted">Settings</jp-text>
            </jp-stack>
          </jp-stack>
        </nav>

        <main jpAppShellMain>
          <jp-box padding="lg" maxWidth="wide">
            <jp-stack gap="md">
              <jp-heading as="h2">Main content</jp-heading>
              <jp-text tone="secondary">
                Shell layout with sidebar collapse. Toggle the control in the sidebar toolbar.
              </jp-text>
              <jp-surface tone="raised" padding="md">
                <jp-text>Projected main region using existing layout primitives.</jp-text>
              </jp-surface>
            </jp-stack>
          </jp-box>
        </main>
      </jp-app-shell>
    `,
  }),
  args: {
    sidebarCollapsed: false,
  },
  argTypes: {
    sidebarCollapsed: {
      control: 'boolean',
      description: 'Collapse the sidebar to the icon rail width.',
    },
  },
};

export default meta;

type Story = StoryObj<AppShellStoryArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const sidebar = canvasElement.querySelector('.jp-app-shell__sidebar');
    const main = canvasElement.querySelector('.jp-app-shell__main');
    const toggle = canvasElement.querySelector('.jp-app-shell__collapse-toggle');

    await expect(sidebar).toBeTruthy();
    await expect(main).toBeTruthy();
    await expect(toggle).toBeTruthy();
    await expect(canvasElement.querySelector('h2')).toBeTruthy();
    await expect(sidebar?.getAttribute('aria-expanded')).toBe('true');
  },
};

export const Collapsed: Story = {
  args: {
    sidebarCollapsed: true,
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.jp-app-shell--collapsed'),
    ).toBeTruthy();
  },
};
