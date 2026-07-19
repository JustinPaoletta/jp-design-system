import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  JpAppShell,
  JpAppShellNavItem,
  JpBox,
  JpButton,
  JpDialog,
  JpDialogActions,
  JpDropdownMenu,
  JpDropdownMenuItem,
  JpDropdownTrigger,
  JpHeading,
  JpInline,
  JpPopover,
  JpPopoverContent,
  JpPopoverTrigger,
  JpStack,
  JpSurface,
  JpText,
  JpToastOutlet,
  JpToastService,
  JpTooltip,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-overlays-page',
  imports: [
    JpAppShell,
    JpAppShellNavItem,
    JpBox,
    JpStack,
    JpInline,
    JpSurface,
    JpText,
    JpHeading,
    JpButton,
    JpTooltip,
    JpToastOutlet,
    JpDialog,
    JpDialogActions,
    JpPopover,
    JpPopoverTrigger,
    JpPopoverContent,
    JpDropdownMenu,
    JpDropdownTrigger,
    JpDropdownMenuItem,
  ],
  templateUrl: './overlays.page.html',
  styleUrl: './overlays.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlaysPage {
  private readonly toasts = inject(JpToastService);

  sidebarCollapsed = false;
  mobileNavOpen = false;
  dialogOpen = false;
  popoverOpen = false;
  menuOpen = false;
  lastAction = 'None yet';

  readonly accent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly density =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';

  showToast(tone: 'neutral' | 'success' | 'warning' | 'error' | 'info'): void {
    const messages = {
      neutral: 'Background sync queued',
      success: 'Deployment saved',
      warning: 'Quota nearing limit',
      error: 'Deploy failed',
      info: 'New version available',
    } as const;
    this.toasts.show({ message: messages[tone], tone });
  }

  confirmDelete(): void {
    this.dialogOpen = false;
    this.lastAction = 'Deleted deployment';
    this.toasts.show({ message: 'Deployment deleted', tone: 'success' });
  }

  onMenuEdit(): void {
    this.lastAction = 'Edit selected';
  }

  onMenuDelete(): void {
    this.lastAction = 'Delete selected';
    this.dialogOpen = true;
  }
}
