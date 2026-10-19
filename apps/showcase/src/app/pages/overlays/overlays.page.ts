import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
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

  dialogOpen = false;
  popoverOpen = false;
  menuOpen = false;
  lastAction = 'None yet';

  showToast(tone: 'neutral' | 'success' | 'warning' | 'error' | 'info'): void {
    const messages = {
      neutral: 'Roster update queued',
      success: 'Lineup saved',
      warning: 'Roster nearly full',
      error: 'Lineup unavailable',
      info: 'New version available',
    } as const;
    this.toasts.show({ message: messages[tone], tone });
  }

  confirmDelete(): void {
    this.dialogOpen = false;
    this.lastAction = 'Player removed';
    this.toasts.show({ message: 'Player removed', tone: 'success' });
  }

  onMenuEdit(): void {
    this.lastAction = 'Edit player';
  }

  onMenuDelete(): void {
    this.lastAction = 'Remove player';
    this.dialogOpen = true;
  }
}
