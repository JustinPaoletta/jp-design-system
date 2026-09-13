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
import { injectDocumentTheme } from '../../shared/document-theme';

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
  private readonly theme = injectDocumentTheme();

  dialogOpen = false;
  popoverOpen = false;
  menuOpen = false;
  lastAction = 'None yet';

  readonly accent = this.theme.accent;
  readonly density = this.theme.density;

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
