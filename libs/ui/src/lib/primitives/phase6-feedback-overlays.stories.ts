import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, inject } from '@angular/core';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpBox } from './box/box';
import { JpButton } from './button/button';
import { JpDialog, JpDialogActions } from './dialog/dialog';
import {
  JpDropdownMenu,
  JpDropdownMenuItem,
  JpDropdownTrigger,
} from './dropdown-menu/dropdown-menu';
import { JpHeading } from './heading/heading';
import { JpInline } from './inline/inline';
import {
  JpPopover,
  JpPopoverContent,
  JpPopoverTrigger,
} from './popover/popover';
import { JpStack } from './stack/stack';
import { JpSurface } from './surface/surface';
import { JpText } from './text/text';
import { JpToastOutlet } from './toast/toast-outlet';
import { JpToastService } from './toast/toast.service';
import { JpTooltip } from './tooltip/tooltip';

@Component({
  selector: 'jp-phase6-composition-host',
  standalone: true,
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
  template: `
    <jp-app-shell
      [sidebarCollapsed]="sidebarCollapsed"
      [mobileNavOpen]="mobileNavOpen"
      (sidebarCollapsedChange)="sidebarCollapsed = $event"
      (mobileNavOpenChange)="mobileNavOpen = $event"
    >
      <nav jpAppShellSidebar>
        <jp-app-shell-nav-item href="#" [active]="true"
          >Overlays</jp-app-shell-nav-item
        >
      </nav>
      <main jpAppShellMain>
        <jp-box padding="lg" maxWidth="wide">
          <jp-stack gap="lg">
            <jp-stack gap="xs">
              <jp-heading as="h1">Feedback & Overlays</jp-heading>
              <jp-text tone="secondary">
                Composition of tooltip, toast, dialog, popover, and dropdown.
              </jp-text>
              <jp-inline gap="sm">
                <jp-text as="small" tone="muted"
                  >accent: {{ documentAccent }}</jp-text
                >
                <jp-text as="small" tone="muted"
                  >density: {{ documentDensity }}</jp-text
                >
              </jp-inline>
            </jp-stack>

            <jp-surface
              tone="raised"
              padding="md"
              border="subtle"
              elevation="none"
            >
              <jp-inline gap="sm" wrap="true">
                <jp-tooltip content="Copy deployment ID" placement="top">
                  <jp-button type="button" variant="secondary"
                    >Copy ID</jp-button
                  >
                </jp-tooltip>
                <jp-button
                  type="button"
                  variant="primary"
                  (click)="showToast()"
                >
                  Show toast
                </jp-button>
                <jp-button
                  type="button"
                  variant="destructive"
                  (click)="dialogOpen = true"
                >
                  Delete
                </jp-button>
                <jp-popover
                  [open]="popoverOpen"
                  (openChange)="popoverOpen = $event"
                >
                  <jp-button jpPopoverTrigger type="button" variant="secondary"
                    >Filters</jp-button
                  >
                  <div jpPopoverContent>
                    <jp-text>Filter panel</jp-text>
                  </div>
                </jp-popover>
                <jp-dropdown-menu
                  [open]="menuOpen"
                  (openChange)="menuOpen = $event"
                >
                  <jp-button jpDropdownTrigger type="button" variant="secondary"
                    >Actions</jp-button
                  >
                  <button
                    type="button"
                    jpDropdownMenuItem
                    (itemSelect)="menuOpen = false"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    jpDropdownMenuItem
                    (itemSelect)="dialogOpen = true"
                  >
                    Delete…
                  </button>
                </jp-dropdown-menu>
              </jp-inline>
            </jp-surface>
          </jp-stack>
        </jp-box>
      </main>
    </jp-app-shell>

    <jp-dialog
      [open]="dialogOpen"
      title="Delete deployment?"
      (openChange)="dialogOpen = $event"
    >
      <jp-text>This cannot be undone.</jp-text>
      <div jpDialogActions>
        <jp-button
          type="button"
          variant="secondary"
          (click)="dialogOpen = false"
          >Cancel</jp-button
        >
        <jp-button
          type="button"
          variant="destructive"
          (click)="dialogOpen = false"
          >Delete</jp-button
        >
      </div>
    </jp-dialog>

    <jp-toast-outlet />
  `,
})
class Phase6CompositionHost {
  private readonly toasts = inject(JpToastService);

  sidebarCollapsed = false;
  mobileNavOpen = false;
  dialogOpen = false;
  popoverOpen = false;
  menuOpen = false;

  readonly documentAccent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly documentDensity =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';

  showToast(): void {
    this.toasts.show({ message: 'Deployment saved', tone: 'success' });
  }
}

const meta: Meta = {
  title: 'Compositions/Feedback Overlays',
  component: JpAppShell,
  globals: {
    accent: 'neon',
  },
  decorators: [
    moduleMetadata({
      imports: [Phase6CompositionHost],
    }),
  ],
  render: () => ({
    template: `<jp-phase6-composition-host />`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('h1')?.textContent).toContain(
      'Feedback & Overlays',
    );
    const deleteButton = Array.from(
      canvasElement.querySelectorAll('button'),
    ).find((button) => button.textContent?.trim() === 'Delete');
    await expect(deleteButton).toBeTruthy();
    if (deleteButton) {
      await userEvent.click(deleteButton);
      await expect(
        canvasElement.querySelector('[role="dialog"][aria-modal="true"]'),
      ).toBeTruthy();
    }
  },
};
