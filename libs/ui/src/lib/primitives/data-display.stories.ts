import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent, within } from 'storybook/test';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpBadge } from './badge/badge';
import { JpCard } from './card/card';
import { JpButton } from './button/button';
import { JpEmptyState } from './empty-state/empty-state';
import { JpDisclosure } from './disclosure/disclosure';
import { JpHeading } from './heading/heading';
import { JpStack } from './stack/stack';
import { JpSwitch } from './switch/switch';
import { JpTable, JpTableCellDef } from './table/table';

type DataDisplayArgs = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  showEmpty: boolean;
  availableOnly: boolean;
};

const columns = [
  { key: 'name', header: 'Player' },
  { key: 'status', header: 'Game 6' },
];

const rows = [
  {
    name: 'Freddy Peralta',
    env: 'Active roster',
    status: 'Starter',
    region: 'Pitcher',
  },
  {
    name: 'Yandy Díaz',
    env: 'Active roster',
    status: 'Home run',
    region: 'Designated hitter',
  },
  {
    name: 'Taylor Walls',
    env: 'Active roster',
    status: 'Starter',
    region: 'Shortstop',
  },
  {
    name: 'Bryan Baker',
    env: 'Bullpen',
    status: 'Relief',
    region: 'Pitcher',
  },
];

const meta: Meta<DataDisplayArgs> = {
  title: 'Compositions/Data Display',
  component: JpAppShell,
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        JpAppShell,
        JpAppShellNavItem,
        JpCard,
        JpStack,
        JpHeading,
        JpBadge,
        JpButton,
        JpEmptyState,
        JpDisclosure,
        JpTable,
        JpTableCellDef,
        JpSwitch,
      ],
    }),
  ],
  args: {
    sidebarCollapsed: false,
    mobileNavOpen: false,
    showEmpty: false,
    availableOnly: false,
  },
  render: (args) => {
    const sidebarCollapsed = signal(Boolean(args.sidebarCollapsed));
    const mobileNavOpen = signal(Boolean(args.mobileNavOpen));
    const showEmpty = signal(Boolean(args.showEmpty));
    const availableOnly = signal(Boolean(args.availableOnly));
    return {
      props: {
        sidebarCollapsed,
        mobileNavOpen,
        showEmpty,
        availableOnly,
        visibleRows: () =>
          showEmpty()
            ? []
            : rows.filter(
                (row) => !availableOnly() || row.env === 'Active roster',
              ),
        columns,
        rows,
        statusTone(status: string) {
          if (status === 'Starter') {
            return 'success';
          }
          if (status === 'Home run') {
            return 'warning';
          }
          if (status === 'Relief') return 'error';
          return 'neutral';
        },
        onSidebarCollapsedChange(next: boolean) {
          sidebarCollapsed.set(next);
        },
        onMobileNavOpenChange(next: boolean) {
          mobileNavOpen.set(next);
        },
        onShowEmptyChange(next: boolean) {
          showEmpty.set(next);
        },
      },
      template: `
      <style>.roster-page {
  box-sizing: border-box;
  max-inline-size: 60rem;
  margin-inline: auto;
  padding: var(--jp-space-xl) var(--jp-space-lg);
}
.roster-page__header {
  margin-block-end: var(--jp-space-lg);
}
.roster-page__count,
.roster-page__detail,
.roster-page__actions > span {
  color: var(--jp-color-text-secondary);
  font-size: var(--jp-font-size-caption);
}
.roster-page__table {
  margin-block-start: var(--jp-space-lg);
}
.roster-page__name,
.roster-page__detail {
  display: block;
}
.roster-page__name {
  font-weight: var(--jp-font-weight-medium);
}
.roster-page__detail {
  margin-block-start: var(--jp-space-2xs);
}
.roster-page__actions {
  display: flex;
  flex: 1 1 100%;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--jp-space-sm) var(--jp-space-md);
}
.related {
  display: flex;
  flex-wrap: wrap;
  gap: var(--jp-space-lg);
  padding-block: var(--jp-space-md);
  border-block-start: 1px solid var(--jp-color-border-subtle);
  font-size: var(--jp-font-size-body-sm);
}
.preview-settings {
  margin-block-start: var(--jp-space-lg);
  padding-block: var(--jp-space-md);
  color: var(--jp-color-text-secondary);
  font-size: var(--jp-font-size-body-sm);
}
@media (width <= 48rem) {
  .roster-page {
    padding: var(--jp-space-lg) var(--jp-space-md);
  }
}
</style>
      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed()"
        [mobileNavOpen]="mobileNavOpen()"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
        (mobileNavOpenChange)="onMobileNavOpenChange($event)"
      >
        <span jpAppShellBrand>Tampa Bay Rays</span>
      <nav jpAppShellSidebar>
          <jp-stack gap="2xs">
            <jp-app-shell-nav-item
              href="#data"
              [active]="true"
              (click)="$event.preventDefault()"
            >
              <svg jpAppShellNavIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
              Data
            </jp-app-shell-nav-item>
            <jp-app-shell-nav-item
              href="#controls"
              (click)="$event.preventDefault()"
            >
              <svg jpAppShellNavIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              Controls
            </jp-app-shell-nav-item>
          </jp-stack>
        </nav>

        <main jpAppShellMain>
<div class="roster-page">
  <header class="roster-page__header">
    <jp-heading as="h1">Game 6 roster</jp-heading>
  </header>
  <jp-card title="2026 ALCS">
    <span jpCardHeader class="roster-page__count">{{ visibleRows().length }} players</span>
    <p>Review the players and their Game 6 contributions.</p>
    <jp-table
      class="roster-page__table"
      caption="Rays roster"
      [captionHidden]="true"
      [framed]="false"
      [columns]="columns"
      [rows]="visibleRows()"
      [striped]="false"
    >
      <ng-template jpTableCell="name" let-value let-row="row">
        <span class="roster-page__name">{{ value }}</span>
        <span class="roster-page__detail">{{ row.region }} · {{ row.env }}</span>
      </ng-template>
      <ng-template jpTableCell="status" let-value>
        <jp-badge [tone]="statusTone('' + value)">{{ value }}</jp-badge>
      </ng-template>
      <jp-empty-state title="No matching Game 6 players" description="Clear the filters to return to the Game 6 roster.">
        <jp-button variant="secondary" type="button" (click)="showEmpty.set(false); availableOnly.set(false)">Clear filters</jp-button>
      </jp-empty-state>
    </jp-table>
    <div jpCardActions class="roster-page__actions">
      <jp-button [disabled]="showEmpty()" (click)="availableOnly.set(!availableOnly())">{{ availableOnly() ? 'Show all players' : 'Show starters' }}</jp-button>
      <span role="status">{{ availableOnly() ? 'Game 6 starters' : 'Active roster and bullpen' }}</span>
    </div>
  </jp-card>
  <jp-disclosure class="preview-settings" title="Preview settings">
    <aside aria-label="Example controls">
      <jp-switch [ngModel]="showEmpty()" (ngModelChange)="onShowEmptyChange($event)" name="showEmpty">Show empty state</jp-switch>
    </aside>
  </jp-disclosure>
</div>
        </main>
      </jp-app-shell>
    `,
    };
  },
};

export default meta;
type Story = StoryObj<DataDisplayArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('jp-app-shell')).toBeTruthy();
    await expect(canvasElement.querySelector('h1')?.textContent).toContain(
      'Game 6 roster',
    );
    await expect(canvasElement.querySelector('caption')?.textContent).toContain(
      'Rays roster',
    );
    await expect(canvasElement.querySelector('jp-badge')).toBeTruthy();

    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show starters' }),
    );
    await expect(
      canvas.queryByRole('cell', { name: /Bryan Baker/ }),
    ).toBeNull();
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Game 6 starters',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show all players' }),
    );
    await expect(
      canvas.getByRole('table', { name: 'Rays roster' }),
    ).toBeVisible();
    const settings = canvas.getByText('Preview settings');
    await userEvent.click(settings);
    const toggle = canvas.getByRole('switch', { name: 'Show empty state' });
    await userEvent.click(toggle);
    await expect(canvas.getByText('No matching Game 6 players')).toBeVisible();
    await userEvent.click(toggle);
    await expect(
      canvas.getByRole('cell', { name: /Freddy Peralta/ }),
    ).toBeVisible();
    await userEvent.click(settings);
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};

export const Starter: Story = { args: { availableOnly: true } };
export const Empty: Story = { args: { showEmpty: true } };
