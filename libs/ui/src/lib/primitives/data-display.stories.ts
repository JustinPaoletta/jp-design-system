import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent } from 'storybook/test';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpBadge } from './badge/badge';
import { JpBox } from './box/box';
import { JpButton } from './button/button';
import { JpEmptyState } from './empty-state/empty-state';
import { JpHeading } from './heading/heading';
import { JpInline } from './inline/inline';
import { JpStack } from './stack/stack';
import { JpSurface } from './surface/surface';
import { JpSwitch } from './switch/switch';
import { JpTable, JpTableCellDef } from './table/table';
import { JpText } from './text/text';

type DataDisplayArgs = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  showEmpty: boolean;
};

const columns = [
  { key: 'name', header: 'Service' },
  { key: 'env', header: 'Environment' },
  { key: 'status', header: 'Status' },
  { key: 'region', header: 'Region', align: 'end' as const },
];

const rows = [
  {
    name: 'api-gateway',
    env: 'production',
    status: 'Healthy',
    region: 'us-east-1',
  },
  {
    name: 'worker',
    env: 'production',
    status: 'Degraded',
    region: 'eu-west-1',
  },
  {
    name: 'ingest',
    env: 'staging',
    status: 'Healthy',
    region: 'us-west-2',
  },
];

const meta: Meta<DataDisplayArgs> = {
  title: 'Compositions/Data Display',
  component: JpAppShell,
  globals: {
    accent: 'neon',
  },
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        JpAppShell,
        JpAppShellNavItem,
        JpBox,
        JpStack,
        JpInline,
        JpSurface,
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
  render: (args, { updateArgs }) => ({
    props: {
      ...args,
      columns,
      rows,
      documentAccent:
        document.documentElement.getAttribute('data-jp-accent') ?? 'neon',
      documentDensity:
        document.documentElement.getAttribute('data-jp-density') ?? 'default',
      statusTone(status: string) {
        if (status === 'Healthy') {
          return 'success';
        }
        if (status === 'Degraded') {
          return 'warning';
        }
        return 'neutral';
      },
      onSidebarCollapsedChange(next: boolean) {
        updateArgs({ sidebarCollapsed: next });
      },
      onMobileNavOpenChange(next: boolean) {
        updateArgs({ mobileNavOpen: next });
      },
      onShowEmptyChange(next: boolean) {
        updateArgs({ showEmpty: next });
      },
    },
    template: `
      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed"
        [mobileNavOpen]="mobileNavOpen"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
        (mobileNavOpenChange)="onMobileNavOpenChange($event)"
      >
        <nav jpAppShellSidebar>
          <jp-stack gap="2xs">
            <jp-app-shell-nav-item href="#data" [active]="true">
              Data
            </jp-app-shell-nav-item>
            <jp-app-shell-nav-item href="#controls">
              Controls
            </jp-app-shell-nav-item>
          </jp-stack>
        </nav>

        <main jpAppShellMain>
          <jp-box padding="lg" maxWidth="wide">
            <jp-stack gap="lg">
              <jp-stack gap="xs">
                <jp-heading as="h1">Data Display</jp-heading>
                <jp-text tone="secondary">
                  Table, badge, and empty-state composition.
                </jp-text>
                <jp-inline gap="sm">
                  <jp-text as="small" tone="muted">accent: {{ documentAccent }}</jp-text>
                  <jp-text as="small" tone="muted">density: {{ documentDensity }}</jp-text>
                </jp-inline>
              </jp-stack>

              <jp-inline gap="sm" wrap="true">
                <jp-badge tone="success">Healthy</jp-badge>
                <jp-badge tone="warning">Degraded</jp-badge>
                <jp-badge tone="error">Failed</jp-badge>
                <jp-badge tone="accent">Accent</jp-badge>
              </jp-inline>

              <jp-surface tone="raised" padding="md" border="subtle" elevation="none">
                <jp-stack gap="md">
                  <jp-inline align="center" gap="sm" justify="between" wrap="true">
                    <jp-heading as="h2">Deployments</jp-heading>
                    <jp-switch
                      [ngModel]="showEmpty"
                      (ngModelChange)="onShowEmptyChange($event)"
                      name="showEmpty"
                    >
                      Show empty state
                    </jp-switch>
                  </jp-inline>

                  <jp-table
                    caption="Recent deployments"
                    [columns]="columns"
                    [rows]="showEmpty ? [] : rows"
                    [striped]="true"
                  >
                    <ng-template jpTableCell="status" let-value>
                      <jp-badge [tone]="statusTone('' + value)">{{ value }}</jp-badge>
                    </ng-template>
                    <jp-empty-state
                      title="No deployments"
                      description="Nothing matches the current filters."
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
                </jp-stack>
              </jp-surface>
            </jp-stack>
          </jp-box>
        </main>
      </jp-app-shell>
    `,
  }),
};

export default meta;
type Story = StoryObj<DataDisplayArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('jp-app-shell')).toBeTruthy();
    await expect(canvasElement.querySelector('h1')?.textContent).toContain(
      'Data Display',
    );
    await expect(canvasElement.querySelector('caption')?.textContent).toContain(
      'Recent deployments',
    );
    await expect(canvasElement.querySelector('jp-badge')).toBeTruthy();

    const toggle = canvasElement.querySelector(
      'jp-switch button, jp-switch [role="switch"]',
    ) as HTMLElement | null;
    if (toggle) {
      await userEvent.click(toggle);
    }
  },
};
