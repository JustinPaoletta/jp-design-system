import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  JpBox,
  JpGrid,
  JpHeading,
  JpInline,
  JpStack,
  JpSurface,
  JpText,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-layout-dashboard-page',
  imports: [JpBox, JpStack, JpInline, JpGrid, JpSurface, JpText, JpHeading],
  templateUrl: './layout-dashboard.page.html',
  styleUrl: './layout-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutDashboardPage {
  readonly accent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly density =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';
}
