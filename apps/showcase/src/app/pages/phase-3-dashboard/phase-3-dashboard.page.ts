import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  JpAppShell,
  JpAppShellNavItem,
  JpBox,
  JpGrid,
  JpHeading,
  JpInline,
  JpStack,
  JpSurface,
  JpText,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-phase-3-dashboard-page',
  imports: [
    JpAppShell,
    JpAppShellNavItem,
    JpBox,
    JpStack,
    JpInline,
    JpGrid,
    JpSurface,
    JpText,
    JpHeading,
  ],
  templateUrl: './phase-3-dashboard.page.html',
  styleUrl: './phase-3-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Phase3DashboardPage {
  sidebarCollapsed = false;
  mobileNavOpen = false;

  readonly accent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly density =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';
}
