import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpBox } from './box/box';
import { JpGrid } from './grid/grid';
import { JpHeading } from './heading/heading';
import { JpInline } from './inline/inline';
import { JpStack } from './stack/stack';
import { JpSurface } from './surface/surface';
import { JpText } from './text/text';

type AppShellDashboardArgs = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
};

const meta: Meta<AppShellDashboardArgs> = {
  title: 'Compositions/App Shell Dashboard',
  component: JpAppShell,
  decorators: [
    moduleMetadata({
      imports: [
        JpAppShell,
        JpAppShellNavItem,
        JpBox,
        JpStack,
        JpInline,
        JpGrid,
        JpSurface,
        JpText,
        JpHeading,
      ],
    }),
  ],
  render: (args) => {
    const sidebarCollapsed = signal(Boolean(args.sidebarCollapsed));
    const mobileNavOpen = signal(Boolean(args.mobileNavOpen));
    return {
      props: {
        sidebarCollapsed,
        mobileNavOpen,
        documentAccent:
          document.documentElement.getAttribute('data-jp-accent') ?? 'neon',
        documentDensity:
          document.documentElement.getAttribute('data-jp-density') ?? 'default',
        onSidebarCollapsedChange(next: boolean) {
          sidebarCollapsed.set(next);
        },
        onMobileNavOpenChange(next: boolean) {
          mobileNavOpen.set(next);
        },
      },
      template: `
      <style>
        .jp-app-shell-dashboard-story__accent-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: calc(var(--jp-space-md) + var(--jp-space-sm));
          padding: var(--jp-space-2xs) var(--jp-space-xs);
          border-radius: var(--jp-radius-full);
          background: var(--jp-color-accent-solid);
          color: var(--jp-color-accent-contrast);
          font: var(--jp-font-label-sm);
          font-weight: var(--jp-font-weight-semibold);
          letter-spacing: var(--jp-font-letter-spacing-wide);
          text-transform: uppercase;
        }

        .jp-app-shell-dashboard-story__accent-rule {
          width: 100%;
          height: var(--jp-space-2xs);
          border-radius: var(--jp-radius-full);
          background: linear-gradient(
            90deg,
            var(--jp-color-accent-strong) 0%,
            var(--jp-color-accent-muted) 100%
          );
        }
      </style>

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
            <jp-stack gap="lg">
              <jp-stack gap="sm">
                <jp-inline align="center" gap="sm">
                  <jp-heading as="h1">App Shell Dashboard</jp-heading>
                  <span class="jp-app-shell-dashboard-story__accent-badge">
                    {{ documentAccent }}
                  </span>
                </jp-inline>
                <jp-text tone="secondary">
                  Shell composition with layout content.
                </jp-text>
                <jp-inline gap="sm">
                  <jp-text as="small" tone="muted">accent: {{ documentAccent }}</jp-text>
                  <jp-text as="small" tone="muted">density: {{ documentDensity }}</jp-text>
                </jp-inline>
                <div class="jp-app-shell-dashboard-story__accent-rule" aria-hidden="true"></div>
              </jp-stack>

              <jp-grid mode="auto-fit" minColumn="sm" gap="md">
                <jp-surface padding="md" tone="subtle" border="subtle" elevation="none">
                  <jp-stack gap="xs">
                    <jp-text as="small" tone="muted">Active sessions</jp-text>
                    <jp-text size="body-lg">1,284</jp-text>
                  </jp-stack>
                </jp-surface>
                <jp-surface padding="md" tone="subtle" border="subtle" elevation="none">
                  <jp-stack gap="xs">
                    <jp-text as="small" tone="muted">Error rate</jp-text>
                    <jp-text size="body-lg">0.14%</jp-text>
                  </jp-stack>
                </jp-surface>
                <jp-surface padding="md" tone="subtle" border="subtle" elevation="none">
                  <jp-stack gap="xs">
                    <jp-text as="small" tone="muted">Avg response</jp-text>
                    <jp-text size="body-lg">182ms</jp-text>
                  </jp-stack>
                </jp-surface>
              </jp-grid>

              <jp-grid columns="2" gap="md">
                <jp-surface tone="raised" padding="md">
                  <jp-stack gap="sm">
                    <jp-heading as="h2">Activity</jp-heading>
                    <jp-stack gap="xs">
                      <jp-text tone="secondary">Shell tokens applied</jp-text>
                      <jp-text tone="secondary">Nav active accent signal</jp-text>
                      <jp-text tone="secondary">Mobile drawer ready</jp-text>
                    </jp-stack>
                  </jp-stack>
                </jp-surface>
                <jp-surface tone="raised" padding="md">
                  <jp-stack gap="sm">
                    <jp-heading as="h2">Insights</jp-heading>
                    <jp-text tone="secondary">
                      Accent and density toolbars apply on this composition story.
                    </jp-text>
                  </jp-stack>
                </jp-surface>
              </jp-grid>
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

type Story = StoryObj<AppShellDashboardArgs>;

export const Dashboard: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('jp-app-shell')).toBeTruthy();
    await expect(
      canvasElement.querySelector('.jp-app-shell__sidebar'),
    ).toBeTruthy();
    await expect(canvasElement.querySelector('h1')).toBeTruthy();
    await expect(
      canvasElement.querySelector('.jp-app-shell-nav-item--active'),
    ).toBeTruthy();
    await expect(
      canvasElement.querySelector('.jp-app-shell__collapse-toggle'),
    ).toBeTruthy();
  },
};
