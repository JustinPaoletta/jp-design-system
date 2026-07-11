import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  JpAppShell,
  JpAppShellNavItem,
  JpBadge,
  type JpBadgeTone,
  JpBox,
  JpButton,
  JpEmptyState,
  JpHeading,
  JpInline,
  JpStack,
  JpSurface,
  JpSwitch,
  JpTable,
  JpTableCellDef,
  type JpTableColumn,
  JpText,
} from '@jp-design-system/ui';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phase-5-data-page',
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
  templateUrl: './phase-5-data.page.html',
  styleUrl: './phase-5-data.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Phase5DataPage {
  sidebarCollapsed = false;
  mobileNavOpen = false;
  showEmpty = false;

  readonly columns: JpTableColumn[] = [
    { key: 'name', header: 'Service' },
    { key: 'env', header: 'Environment' },
    { key: 'status', header: 'Status' },
    { key: 'region', header: 'Region', align: 'end' },
  ];

  readonly rows = [
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
    {
      name: 'notifications',
      env: 'staging',
      status: 'Failed',
      region: 'ap-south-1',
    },
  ];

  readonly accent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly density =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';

  get visibleRows() {
    return this.showEmpty ? [] : this.rows;
  }

  statusTone(status: string): JpBadgeTone {
    switch (status) {
      case 'Healthy':
        return 'success';
      case 'Degraded':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'neutral';
    }
  }
}
