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
    { key: 'status', header: 'Game 6' },
  ];

  readonly rows = [
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

  get visibleRows() {
    return this.showEmpty
      ? []
      : this.rows.filter(
          (row) => !this.availableOnly || row.env === 'Active roster',
        );
  }

  statusTone(status: string): JpBadgeTone {
    switch (status) {
      case 'Starter':
        return 'success';
      case 'Home run':
        return 'warning';
      case 'Relief':
        return 'error';
      default:
        return 'neutral';
    }
  }
}
