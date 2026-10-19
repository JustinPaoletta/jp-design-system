import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  JpLink,
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
    JpLink,
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
    { key: 'name', header: 'Player' },
    { key: 'env', header: 'Squad' },
    { key: 'status', header: 'Status' },
    { key: 'region', header: 'Position' },
  ];

  readonly rows = [
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
    {
      name: 'Taylor Reed',
      env: 'Reserve',
      status: 'Injured',
      region: 'Right field',
    },
  ];

  readonly accent = this.theme.accent;
  readonly density = this.theme.density;

  get visibleRows() {
    return this.showEmpty ? [] : this.rows;
  }

  statusTone(status: string): JpBadgeTone {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Day to day':
        return 'warning';
      case 'Injured':
        return 'error';
      default:
        return 'neutral';
    }
  }
}
