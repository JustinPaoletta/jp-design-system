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
import { JpChart } from './chart/chart';
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
        JpChart,
      ],
    }),
  ],
  render: (args) => {
    const sidebarCollapsed = signal(Boolean(args.sidebarCollapsed));
    const mobileNavOpen = signal(Boolean(args.mobileNavOpen));
    return {
      props: {
        sessionLabels: [
          '00:00',
          '03:00',
          '06:00',
          '09:00',
          '12:00',
          '15:00',
          '18:00',
          '18:30',
        ],
        sessionSeries: [
          {
            id: 'sessions',
            label: 'Active sessions',
            values: [580, 760, 940, 1030, 1280, 1080, 1240, 1284],
          },
        ],
        sidebarCollapsed,
        mobileNavOpen,
        documentAccent:
          document.documentElement.getAttribute('data-jp-accent') ?? 'gold',
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
.dashboard {padding:24px; max-width:1100px; margin-inline:auto; color:var(--jp-color-text-primary);}
.dashboard-topbar {display:flex; align-items:center; justify-content:space-between; padding:12px 24px; border-bottom:1px solid var(--jp-color-border-subtle); color:var(--jp-color-text-secondary); font-size:var(--jp-font-size-caption);}
.dashboard-heading {display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:18px;}
.dashboard-heading h1 {margin:0 0 4px; font-size:28px; letter-spacing:-.025em;}
.dashboard p {margin:0; color:var(--jp-color-text-secondary); font-size:var(--jp-font-size-body);}
.dashboard-period {border:1px solid var(--jp-color-border-default); border-radius:var(--jp-radius-md); background:var(--jp-color-surface-raised); padding:8px 14px; color:var(--jp-color-text-secondary); font:inherit;}
.dashboard-metrics {display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); padding:20px 0; margin:0 0 16px; border:1px solid var(--jp-color-border-subtle); border-radius:var(--jp-radius-md); background:var(--jp-color-surface-raised);}
.dashboard-metrics div {padding-inline:24px;}
.dashboard-metrics div + div {border-inline-start:1px solid var(--jp-color-border-default);}
.dashboard-metrics dt {color:var(--jp-color-text-secondary); font-size:var(--jp-font-size-caption);}
.dashboard-metrics dd {margin:4px 0 0; font-size:32px; line-height:1.2; font-weight:700; letter-spacing:-.025em; font-variant-numeric:tabular-nums;}
.dashboard-panels {display:grid; grid-template-columns:minmax(0,1.7fr) minmax(0,1fr); gap:16px; margin-bottom:16px;}
.dashboard-panel {padding:18px; border:1px solid var(--jp-color-border-subtle); border-radius:var(--jp-radius-md); background:var(--jp-color-surface-raised); min-width:0;}
.dashboard-panel h2 {font-size:var(--jp-font-size-body); margin:0 0 18px;}
.dashboard-activity {list-style:none; padding:0; margin:0; display:grid; gap:24px;}
.dashboard-activity li {display:grid; grid-template-columns:8px 42px 1fr; align-items:start; gap:12px; font-size:var(--jp-font-size-caption);}
.dashboard-activity time {color:var(--jp-color-text-muted); font-variant-numeric:tabular-nums;}
.dashboard-dot {width:6px; height:6px; border-radius:50%; background:var(--jp-color-state-success-border); margin-top:6px;}
.dashboard-dot-neutral {background:var(--jp-color-text-secondary);}
.dashboard-dot-warning {background:var(--jp-color-accent-solid);}
.dashboard-insights {display:grid; grid-template-columns:1fr 1fr auto; gap:24px; align-items:center;}
.dashboard-insights h3 {margin:0 0 6px; font-size:var(--jp-font-size-caption); font-weight:500;}
.dashboard-insights p, .dashboard-updated {font-size:var(--jp-font-size-caption); color:var(--jp-color-text-muted);}
.dashboard-insights > div + div {border-inline-start:1px solid var(--jp-color-border-default); padding-inline-start:24px;}
.dashboard-brand {display:block; padding:8px 8px 28px; font-weight:600; font-size:var(--jp-font-size-body);}
.dashboard-workspace {display:block; padding:0 8px 12px; font-size:11px; color:var(--jp-color-text-muted); letter-spacing:.04em;}
.dashboard-avatar {display:grid; place-items:center; width:28px; height:28px; border-radius:50%; background:var(--jp-color-surface-emphasis); font-size:11px;}
.dashboard-period:focus-visible {outline:2px solid var(--jp-color-focus-ring); outline-offset:2px;}
@media (width > 48rem) { .jp-app-shell--collapsed .dashboard-brand, .jp-app-shell--collapsed .dashboard-workspace {display:none;} }
@media (width <= 48rem) {.dashboard {padding:16px;} .dashboard-panels {grid-template-columns:1fr;} .dashboard-insights {grid-template-columns:1fr;} .dashboard-insights > div + div {border:0; padding:0;} .dashboard-metrics div {padding-inline:12px;} .dashboard-metrics dd {font-size:24px;} .dashboard-topbar {padding-inline:16px;} }
      </style>

      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed()"
        [mobileNavOpen]="mobileNavOpen()"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
        (mobileNavOpenChange)="onMobileNavOpenChange($event)"
      >
        <nav jpAppShellSidebar aria-label="Primary">
          <span class="dashboard-brand">App Shell</span>
          <span class="dashboard-workspace">WORKSPACE</span>
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
<div class="dashboard-topbar"><span>Workspace / Overview</span><span class="dashboard-avatar" aria-label="Jordan Davis">JD</span></div>
<section class="dashboard" aria-labelledby="overview-title">
  <header class="dashboard-heading"><div><h1 id="overview-title">Overview</h1><p>Application performance at a glance.</p></div><span class="dashboard-period">Today</span></header>
  <dl class="dashboard-metrics"><div><dt>Active sessions</dt><dd>1,284</dd></div><div><dt>Error rate</dt><dd>0.14%</dd></div><div><dt>Avg response</dt><dd>182 ms</dd></div></dl>
  <div class="dashboard-panels">
    <section class="dashboard-panel"><jp-chart id="overview-sessions" label="Session activity" description="Today" type="line" [controlsCollapsed]="true" [labels]="sessionLabels" [series]="sessionSeries" [activeIndex]="7" style="--jp-chart-plot-height:14rem"></jp-chart></section>
    <section class="dashboard-panel"><h2>Activity</h2><ol class="dashboard-activity">
      <li><span class="dashboard-dot" aria-hidden="true"></span><time>18:24</time><span>Traffic pattern reviewed</span></li>
      <li><span class="dashboard-dot" aria-hidden="true"></span><time>18:18</time><span>Response check completed</span></li>
      <li><span class="dashboard-dot" aria-hidden="true"></span><time>18:12</time><span>Health check passed</span></li>
      <li><span class="dashboard-dot dashboard-dot-neutral" aria-hidden="true"></span><time>18:06</time><span>Session snapshot recorded</span></li>
      <li><span class="dashboard-dot dashboard-dot-warning" aria-hidden="true"></span><time>18:00</time><span>Error summary updated</span></li>
    </ol></section>
  </div>
  <section class="dashboard-panel"><h2>Insights</h2><div class="dashboard-insights"><div><h3>Session volume is steady.</h3><p>Active sessions remain within a consistent range throughout today.</p></div><div><h3>Response times remain consistent.</h3><p>Average response times are stable with low error volume.</p></div><small class="dashboard-updated">Updated 18:30<br>Oct 11, 2026</small></div></section>
</section>
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

export const Collapsed: Story = {
  args: { sidebarCollapsed: true },
  play: Dashboard.play,
};
