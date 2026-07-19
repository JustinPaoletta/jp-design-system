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
  selector: 'app-shell-page',
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
  templateUrl: './app-shell.page.html',
  styleUrl: './app-shell.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellPage {
  sidebarCollapsed = false;
  mobileNavOpen = false;

  readonly accent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly density =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';
}
