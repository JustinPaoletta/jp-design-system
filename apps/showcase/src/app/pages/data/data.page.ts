import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  JpLink,
  JpBadge,
  type JpBadgeTone,
  JpCard,
  JpButton,
  JpEmptyState,
  JpDisclosure,
  JpHeading,
  JpSwitch,
  JpTable,
  JpTableCellDef,
  type JpTableColumn,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-data-page',
  imports: [
    FormsModule,
    JpLink,
    JpCard,
    JpHeading,
    JpBadge,
    JpButton,
    JpEmptyState,
    JpDisclosure,
    JpTable,
    JpTableCellDef,
    JpSwitch,
  ],
  templateUrl: './data.page.html',
  styleUrl: './data.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPage {
  showEmpty = false;
  availableOnly = false;

  readonly columns: JpTableColumn[] = [
    { key: 'name', header: 'Player' },
    { key: 'status', header: 'Availability' },
  ];

  readonly rows = [
    {
      name: 'Shane Baz',
      env: 'Active roster',
      status: 'Available',
      region: 'Pitcher',
    },
    {
      name: 'Yandy Díaz',
      env: 'Active roster',
      status: 'Day to day',
      region: 'First base',
    },
    {
      name: 'Taylor Walls',
      env: 'Active roster',
      status: 'Available',
      region: 'Shortstop',
    },
    {
      name: 'Shane McClanahan',
      env: 'Injured list',
      status: 'Injured',
      region: 'Pitcher',
    },
  ];

  get visibleRows() {
    return this.showEmpty
      ? []
      : this.rows.filter(
          (row) => !this.availableOnly || row.status === 'Available',
        );
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
