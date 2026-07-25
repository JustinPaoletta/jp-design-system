import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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
  parameters: {
    a11y: { test: 'error' },
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
  // Angular Storybook does not provide `updateArgs` in render context; keep
  // interactive state in writable signals so collapse/drawer plays work.
  render: (args) => {
    const sidebarCollapsed = signal(Boolean(args.sidebarCollapsed));
    const mobileNavOpen = signal(Boolean(args.mobileNavOpen));
    return {
      props: {
        sidebarCollapsed,
        mobileNavOpen,
        onSidebarCollapsedChange(next: boolean) {
          sidebarCollapsed.set(next);
        },
        onMobileNavOpenChange(next: boolean) {
          mobileNavOpen.set(next);
        },
      },
      template: `
      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed()"
        [mobileNavOpen]="mobileNavOpen()"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
        (mobileNavOpenChange)="onMobileNavOpenChange($event)"
      >
        <nav jpAppShellSidebar aria-label="Primary">
          <jp-stack gap="2xs">
            <jp-app-shell-nav-item
              href="#overview"
              [active]="true"
              (click)="$event.preventDefault()"
            >
              <svg jpAppShellNavIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Overview
            </jp-app-shell-nav-item>
            <jp-app-shell-nav-item
              href="#activity"
              (click)="$event.preventDefault()"
            >
              <svg jpAppShellNavIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Activity
            </jp-app-shell-nav-item>
            <jp-app-shell-nav-item
              href="#settings"
              (click)="$event.preventDefault()"
            >
              <svg jpAppShellNavIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
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
    };
  },
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

/** Default desktop state: expanded rail with an active nav item. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const sidebar = canvasElement.querySelector('.jp-app-shell__sidebar');
    const main = canvasElement.querySelector('.jp-app-shell__main');
    const toggle = canvasElement.querySelector(
      '.jp-app-shell__collapse-toggle',
    );
    const activeNav = canvasElement.querySelector(
      '.jp-app-shell-nav-item--active .jp-app-shell-nav-item__root',
    );

    await expect(sidebar).toBeTruthy();
    await expect(main).toBeTruthy();
    await expect(canvasElement.querySelector('h2')).toBeTruthy();
    // The disclosure state lives on the toggle button, not the landmark.
    await expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    await expect(toggle?.getAttribute('aria-controls')).toBe(
      'jp-app-shell-sidebar',
    );
    await expect(activeNav?.getAttribute('aria-current')).toBe('page');
  },
};

/** Collapsed icon rail (desktop): labels are visually hidden, icons remain. */
export const Collapsed: Story = {
  args: {
    sidebarCollapsed: true,
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.jp-app-shell--collapsed'),
    ).toBeTruthy();
    const toggle = canvasElement.querySelector(
      '.jp-app-shell__collapse-toggle',
    );
    await expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    await expect(toggle?.getAttribute('aria-label')).toBe('Expand sidebar');
  },
};

/** Clicking the toggle collapses the rail, and clicking again expands it. */
export const CollapseToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = await canvas.findByRole('button', {
      name: 'Collapse sidebar',
    });

    await userEvent.click(toggle);
    await waitFor(() =>
      expect(
        canvasElement.querySelector('.jp-app-shell--collapsed'),
      ).toBeTruthy(),
    );

    const expand = await canvas.findByRole('button', {
      name: 'Expand sidebar',
    });
    await userEvent.click(expand);
    await waitFor(() =>
      expect(
        canvasElement.querySelector('.jp-app-shell--collapsed'),
      ).toBeNull(),
    );
  },
};

/** Mobile viewport, drawer closed: top bar hamburger opens the off-canvas nav. */
export const Mobile: Story = {
  // The drawer only exists below the shell's 48rem breakpoint.
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  play: async ({ canvasElement }) => {
    const menuToggle = canvasElement.querySelector(
      '.jp-app-shell__menu-toggle',
    ) as HTMLButtonElement;
    await expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    await expect(menuToggle.getAttribute('aria-label')).toBe('Open navigation');
    await expect(
      canvasElement.querySelector('.jp-app-shell--mobile-nav-open'),
    ).toBeNull();

    await userEvent.click(menuToggle);
    await waitFor(() =>
      expect(
        canvasElement.querySelector('.jp-app-shell--mobile-nav-open'),
      ).toBeTruthy(),
    );
    await expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
  },
};

/** Mobile drawer open: scrim, inert main, Escape closes the drawer. */
export const MobileDrawerOpen: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
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

    const main = canvasElement.querySelector(
      '.jp-app-shell__main',
    ) as HTMLElement;
    await expect(main.hasAttribute('inert')).toBe(true);

    const menuToggle = canvasElement.querySelector(
      '.jp-app-shell__menu-toggle',
    ) as HTMLButtonElement;
    await expect(menuToggle.getAttribute('aria-expanded')).toBe('true');

    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        canvasElement.querySelector('.jp-app-shell--mobile-nav-open'),
      ).toBeNull(),
    );
  },
};
