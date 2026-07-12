import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpBox } from '../box/box';
import { JpHeading } from '../heading/heading';
import { JpStack } from '../stack/stack';
import { JpSurface } from '../surface/surface';
import { JpText } from '../text/text';
import { JpAppShellNavItem } from './app-shell-nav-item';
import { JpAppShell } from './app-shell';

type AppShellStoryArgs = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
};

const meta: Meta<AppShellStoryArgs> = {
  title: 'Primitives/Layout/App Shell',
  component: JpAppShell,
  globals: {
    accent: 'neon',
  },
  decorators: [
    moduleMetadata({
      imports: [
        JpAppShell,
        JpAppShellNavItem,
        JpStack,
        JpSurface,
        JpText,
        JpHeading,
        JpBox,
      ],
    }),
  ],
  render: (args, { updateArgs }) => ({
    props: {
      ...args,
      onSidebarCollapsedChange(next: boolean) {
        updateArgs({ sidebarCollapsed: next });
      },
      onMobileNavOpenChange(next: boolean) {
        updateArgs({ mobileNavOpen: next });
      },
    },
    template: `
      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed"
        [mobileNavOpen]="mobileNavOpen"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
        (mobileNavOpenChange)="onMobileNavOpenChange($event)"
      >
        <nav jpAppShellSidebar aria-label="Primary">
          <jp-stack gap="2xs">
            <jp-app-shell-nav-item href="#overview" [active]="true">
              Overview
            </jp-app-shell-nav-item>
            <jp-app-shell-nav-item href="#activity">
              Activity
            </jp-app-shell-nav-item>
            <jp-app-shell-nav-item href="#settings">
              Settings
            </jp-app-shell-nav-item>
          </jp-stack>
        </nav>

        <main jpAppShellMain>
          <jp-box padding="lg" maxWidth="wide">
            <jp-stack gap="md">
              <jp-heading as="h2">Main content</jp-heading>
              <jp-text tone="secondary">
                Shell layout with sidebar collapse and mobile drawer.
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
    mobileNavOpen: false,
  },
  argTypes: {
    sidebarCollapsed: {
      control: 'boolean',
      description: 'Collapse the sidebar to the icon rail width.',
    },
    mobileNavOpen: {
      control: 'boolean',
      description: 'Open the mobile navigation drawer.',
    },
  },
};

export default meta;

type Story = StoryObj<AppShellStoryArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const sidebar = canvasElement.querySelector('.jp-app-shell__sidebar');
    const main = canvasElement.querySelector('.jp-app-shell__main');
    const toggle = canvasElement.querySelector(
      '.jp-app-shell__collapse-toggle',
    );
    const activeNav = canvasElement.querySelector(
      '.jp-app-shell-nav-item--active',
    );

    await expect(sidebar).toBeTruthy();
    await expect(main).toBeTruthy();
    await expect(toggle).toBeTruthy();
    await expect(canvasElement.querySelector('h2')).toBeTruthy();
    await expect(sidebar?.getAttribute('aria-expanded')).toBe('true');
    await expect(activeNav).toBeTruthy();
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

export const MobileDrawerOpen: Story = {
  args: {
    sidebarCollapsed: false,
    mobileNavOpen: true,
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.jp-app-shell--mobile-nav-open'),
    ).toBeTruthy();
    await expect(
      canvasElement.querySelector('.jp-app-shell__scrim'),
    ).toBeTruthy();

    const menuToggle = canvasElement.querySelector(
      '.jp-app-shell__menu-toggle',
    ) as HTMLButtonElement;
    await expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
  },
};
