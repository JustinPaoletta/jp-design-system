import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent, within } from 'storybook/test';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpBadge } from './badge/badge';
import { JpBox } from './box/box';
import { JpButton } from './button/button';
import { JpEmptyState } from './empty-state/empty-state';
import { JpHeading } from './heading/heading';
import { JpInline } from './inline/inline';
import { JpStack } from './stack/stack';
import { JpSwitch } from './switch/switch';
import { JpTable, JpTableCellDef } from './table/table';
import { JpText } from './text/text';

type DataDisplayArgs = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  showEmpty: boolean;
};

const columns = [
  { key: 'name', header: 'Player' },
  { key: 'env', header: 'Squad' },
  { key: 'status', header: 'Status' },
  { key: 'region', header: 'Position' },
];

const rows = [
  {
    name: 'Alex Morgan',
    env: 'Varsity',
    status: 'Available',
    region: 'Pitcher',
  },
  {
    name: 'Jordan Davis',
    env: 'Varsity',
    status: 'Day to day',
    region: 'Catcher',
  },
  {
    name: 'Maya Chen',
    env: 'Reserve',
    status: 'Available',
    region: 'Shortstop',
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
        JpBox,
        JpStack,
        JpInline,
        JpText,
        JpHeading,
        JpBadge,
        JpButton,
        JpEmptyState,
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
  },
  render: (args) => {
    const sidebarCollapsed = signal(Boolean(args.sidebarCollapsed));
    const mobileNavOpen = signal(Boolean(args.mobileNavOpen));
    const showEmpty = signal(Boolean(args.showEmpty));
    return {
      props: {
        sidebarCollapsed,
        mobileNavOpen,
        showEmpty,
        columns,
        rows,
        statusTone(status: string) {
          if (status === 'Available') {
            return 'success';
          }
          if (status === 'Day to day') {
            return 'warning';
          }
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
      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed()"
        [mobileNavOpen]="mobileNavOpen()"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
        (mobileNavOpenChange)="onMobileNavOpenChange($event)"
      >
        <span jpAppShellBrand>Riverton Falcons</span>
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
          <jp-box padding="lg" maxWidth="wide">
            <jp-stack gap="lg">
              <jp-inline align="center" gap="lg" justify="between" wrap="true">
                <jp-stack gap="xs">
                  <jp-inline align="center" gap="md" wrap="true">
                    <jp-heading as="h1">Player roster</jp-heading>
                    <jp-text size="caption" tone="secondary">{{ showEmpty() ? 0 : rows.length }} players</jp-text>
                  </jp-inline>
                  <jp-text tone="secondary">Review player positions and availability.</jp-text>
                </jp-stack>
                <jp-button>Add player</jp-button>
              </jp-inline>

                  <jp-table
                    caption="Falcons roster"
                    [captionHidden]="true"
                    [columns]="columns"
                    [rows]="showEmpty() ? [] : rows"
                    [striped]="false"
                  >
                    <ng-template jpTableCell="status" let-value>
                      <jp-badge [tone]="statusTone('' + value)">{{ value }}</jp-badge>
                    </ng-template>
                    <jp-empty-state
                      title="No players on the roster"
                      description="No players match these filters."
                    >
                      <jp-button
                        variant="secondary"
                        type="button"
                        (click)="onShowEmptyChange(false)"
                      >
                        Clear filters
                      </jp-button>
                    </jp-empty-state>
                  </jp-table>
              <details style="font-size:var(--jp-font-size-body-sm);color:var(--jp-color-text-secondary)">
                <summary style="cursor:pointer;width:fit-content;padding-block:var(--jp-space-sm)">Preview settings</summary>
                <aside aria-label="Story controls">
                <jp-switch
                      [ngModel]="showEmpty()"
                      (ngModelChange)="onShowEmptyChange($event)"
                      name="showEmpty"
                    >
                      Show empty state
                    </jp-switch>
                </aside>
              </details>
            </jp-stack>
          </jp-box>
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
      'Player roster',
    );
    await expect(canvasElement.querySelector('caption')?.textContent).toContain(
      'Falcons roster',
    );
    await expect(canvasElement.querySelector('jp-badge')).toBeTruthy();

    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('table', { name: 'Falcons roster' }),
    ).toBeVisible();
    const settings = canvas.getByText('Preview settings');
    await userEvent.click(settings);
    const toggle = canvas.getByRole('switch', { name: 'Show empty state' });
    await userEvent.click(toggle);
    await expect(canvas.getByText('No players on the roster')).toBeVisible();
    await userEvent.click(toggle);
    await expect(
      canvas.getByRole('cell', { name: 'Alex Morgan' }),
    ).toBeVisible();
    await userEvent.click(settings);
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
