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
          '1st',
          '2nd',
          '3rd',
          '4th',
          '5th',
          '6th',
          '7th',
          '8th',
          '9th',
        ],
        sessionSeries: [
          {
            id: 'sessions',
            label: 'Rays',
            values: [0, 0, 0, 0, 5, 5, 5, 7, 7],
          },
          {
            id: 'bears',
            label: 'ALCS Game 6',
            values: [3, 4, 5, 5, 5, 6, 6, 6, 6],
          },
        ],
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
      <style>
.dashboard {padding:32px; max-width:1100px; margin-inline:auto; color:var(--jp-color-text-primary);}
.dashboard-topbar {display:flex; align-items:center; justify-content:space-between; box-sizing:border-box; min-height:57px; padding:12px 32px; border-bottom:1px solid var(--jp-color-border-subtle); color:var(--jp-color-text-secondary); font-size:var(--jp-font-size-caption);}
.dashboard-heading {display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:24px;}
.dashboard-heading h1 {margin:0 0 4px; font-size:var(--jp-font-size-heading-h1); letter-spacing:-.025em; font-weight:600;}
.dashboard p {margin:0; color:var(--jp-color-text-secondary); font-size:var(--jp-font-size-body-sm); line-height:1.5;}
.dashboard-period {border:1px solid var(--jp-color-border-default); border-radius:var(--jp-radius-md); background:var(--jp-color-surface-subtle); padding:8px 14px; color:var(--jp-color-text-secondary); font:inherit; font-size:var(--jp-font-size-caption); white-space:nowrap;}
.dashboard-metrics {display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); grid-template-rows:auto auto; padding:24px 0; margin:0 0 24px; border:1px solid var(--jp-color-border-subtle); border-radius:var(--jp-radius-md); background:var(--jp-color-surface-subtle);}
.dashboard-metrics div {display:grid; grid-template-rows:subgrid; grid-row:span 2; padding-inline:24px;}
.dashboard-metrics div + div {border-inline-start:1px solid var(--jp-color-border-default);}
.dashboard-metrics dt {color:var(--jp-color-text-secondary); font-size:var(--jp-font-size-caption);}
.dashboard-metrics dd {margin:4px 0 0; font-size:32px; line-height:1.2; font-weight:600; letter-spacing:-.025em; font-variant-numeric:tabular-nums;}
.dashboard-panels {display:grid; grid-template-columns:minmax(0,1.7fr) minmax(0,1fr); gap:24px; margin-bottom:24px;}
.dashboard-panel {padding:20px; border:1px solid var(--jp-color-border-subtle); border-radius:var(--jp-radius-md); background:var(--jp-color-surface-subtle); min-width:0;}
.dashboard-panel h2 {font-size:var(--jp-font-size-body); margin:0 0 20px; font-weight:600;}
.dashboard-activity {list-style:none; padding:0; margin:0; display:grid; gap:22px;}
.dashboard-activity li {display:grid; grid-template-columns:6px 38px 1fr; align-items:start; gap:12px; font-size:var(--jp-font-size-caption);}
.dashboard-activity time {color:var(--jp-color-text-muted); font-variant-numeric:tabular-nums;}
.dashboard-dot {width:6px; height:6px; border-radius:50%; background:var(--jp-color-state-success-border); margin-top:6px;}
.dashboard-dot-neutral {background:var(--jp-color-text-secondary);}
.dashboard-dot-warning {background:var(--jp-color-accent-solid);}
.dashboard-summary {padding:4px 0 0;}
.dashboard-summary h2 {font-size:var(--jp-font-size-body); font-weight:600; margin:0 0 16px;}
.dashboard-insights {display:grid; grid-template-columns:1fr 1fr auto; gap:24px; align-items:center;}
.dashboard-insights h3 {margin:0 0 6px; font-size:var(--jp-font-size-caption); font-weight:500;}
.dashboard-insights p, .dashboard-updated {font-size:var(--jp-font-size-caption); color:var(--jp-color-text-muted);}
.dashboard-insights > div + div {border-inline-start:1px solid var(--jp-color-border-default); padding-inline-start:24px;}
.dashboard-avatar {display:grid; place-items:center; width:28px; height:28px; border-radius:50%; background:var(--jp-color-surface-emphasis); font-size:11px;}
.dashboard-period:focus-visible {outline:2px solid var(--jp-color-focus-ring); outline-offset:2px;}

@media (width <= 48rem) {.dashboard {padding:16px;} .dashboard-heading {flex-wrap:wrap; align-items:flex-start;} .dashboard-panels {grid-template-columns:1fr;} .dashboard-insights {grid-template-columns:1fr;} .dashboard-insights > div + div {border:0; padding:0;} .dashboard-metrics div {padding-inline:12px;} .dashboard-metrics dd {font-size:24px;} .dashboard-topbar {padding-inline:16px;} }
      </style>

      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed()"
        [mobileNavOpen]="mobileNavOpen()"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
        (mobileNavOpenChange)="onMobileNavOpenChange($event)"
      >
        <span jpAppShellBrand>Tampa Bay Rays</span>
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
<div class="dashboard-topbar"><span>Rays / ALCS Game 6</span><span class="dashboard-avatar" aria-label="Yandy Díaz">YD</span></div>
<section class="dashboard" aria-labelledby="overview-title">
  <header class="dashboard-heading"><div><h1 id="overview-title">Game day</h1><p>Tampa Bay Rays won ALCS Game 6.</p></div><span class="dashboard-period">Final · Game 6</span></header>
  <dl class="dashboard-metrics"><div><dt>Game</dt><dd>6</dd></div><div><dt>Season</dt><dd>2026</dd></div><div><dt>Result</dt><dd>Win</dd></div></dl>
  <div class="dashboard-panels">
    <section class="dashboard-panel"><jp-chart id="overview-sessions" label="Runs by inning" description="Rays (solid). ALCS Game 6 (dashed)." type="line" [controlsCollapsed]="true" [labels]="sessionLabels" [series]="sessionSeries" [activeIndex]="8" [formatOptions]="{ maximumFractionDigits: 0 }" style="--jp-chart-plot-height:13rem"></jp-chart></section>
    <section class="dashboard-panel"><h2>Activity</h2><ol class="dashboard-activity">
      <li><span class="dashboard-dot" aria-hidden="true"></span><time datetime="2026">G6</time><span>The Rays won ALCS Game 6</span></li>
      <li><span class="dashboard-dot" aria-hidden="true"></span><time datetime="2026">G6</time><span>The Rays advanced to the World Series</span></li>
      <li><span class="dashboard-dot" aria-hidden="true"></span><time datetime="2026">G6</time><span>ALCS Game 6 is final</span></li>
      <li><span class="dashboard-dot dashboard-dot-neutral" aria-hidden="true"></span><time datetime="2026">G6</time><span>The Rays clinched the series</span></li>
      <li><span class="dashboard-dot dashboard-dot-warning" aria-hidden="true"></span><time datetime="2026">G6</time><span>World Series berth is set</span></li>
    </ol></section>
  </div>
  <section class="dashboard-summary"><h2>Game notes</h2><div class="dashboard-insights"><div><h3>The Rays won ALCS Game 6.</h3><p>The Rays advanced to the World Series.</p></div><div><h3>World Series berth.</h3><p>The Rays won Game 6 and clinched a World Series berth.</p></div><small class="dashboard-updated">Final<br>2026</small></div></section>
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
