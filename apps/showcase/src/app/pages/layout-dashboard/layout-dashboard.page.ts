import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  JpBox,
  JpCard,
  JpGrid,
  JpHeading,
  JpStack,
  JpSurface,
  JpText,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-layout-dashboard-page',
  imports: [JpBox, JpCard, JpStack, JpGrid, JpSurface, JpText, JpHeading],
  templateUrl: './layout-dashboard.page.html',
  styleUrl: './layout-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutDashboardPage {}
