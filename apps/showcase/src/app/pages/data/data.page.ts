import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
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
import { injectDocumentTheme } from '../../shared/document-theme';

@Component({
  selector: 'app-data-page',
  imports: [
    FormsModule,
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
  templateUrl: './data.page.html',
  styleUrl: './data.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPage {
  private readonly theme = injectDocumentTheme();

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

  readonly accent = this.theme.accent;
  readonly density = this.theme.density;

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
