import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, inject } from '@angular/core';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpButton } from './button/button';
import { JpCopyButton } from './copy-button/copy-button';
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
import { JpCard } from './card/card';
import { JpToastOutlet } from './toast/toast-outlet';
import { JpToastService } from './toast/toast.service';
import { JpTooltip } from './tooltip/tooltip';

@Component({
  selector: 'jp-feedback-overlays-composition-host',
  standalone: true,
  imports: [
    JpAppShell,
    JpAppShellNavItem,
    JpInline,
    JpCard,
    JpHeading,
    JpButton,
    JpCopyButton,
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
  styles: [
    `
      .example-page {
        box-sizing: border-box;
        max-inline-size: 60rem;
        margin-inline: auto;
        padding: var(--jp-space-xl) var(--jp-space-lg);
      }
      .example-page__header {
        margin-block-end: var(--jp-space-lg);
      }
      .example-page__header p {
        margin-block: var(--jp-space-xs) 0;
        color: var(--jp-color-text-secondary);
        font-size: var(--jp-font-size-body-sm);
        line-height: var(--jp-font-line-height-normal);
      }
      .example-page__cards {
        display: grid;
        gap: var(--jp-space-lg);
        max-inline-size: 45rem;
      }
      .example-page__cards > .example-page__header {
        margin-block-end: 0;
      }
      .example-page__status {
        margin: 0;
        color: var(--jp-color-text-secondary);
        font-size: var(--jp-font-size-caption);
      }
      @media (width <= 48rem) {
        .example-page {
          padding: var(--jp-space-lg) var(--jp-space-md);
        }
      }
    `,
  ],
  template: `
    <jp-app-shell
      [sidebarCollapsed]="sidebarCollapsed"
      [mobileNavOpen]="mobileNavOpen"
      (sidebarCollapsedChange)="sidebarCollapsed = $event"
      (mobileNavOpenChange)="mobileNavOpen = $event"
    >
      <span jpAppShellBrand>Los Angeles Dodgers</span>
      <nav jpAppShellSidebar>
        <jp-app-shell-nav-item
          href="#"
          [active]="true"
          (click)="$event.preventDefault()"
        >
          <svg
            jpAppShellNavIcon
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          Overlays
        </jp-app-shell-nav-item>
      </nav>
      <main jpAppShellMain>
        <div class="example-page">
          <div class="example-page__cards">
            <header class="example-page__header">
              <jp-heading as="h1">Club alerts</jp-heading>
              <p>Review club messages and player actions.</p>
            </header>

            <jp-card title="World Series Game 5">
              <p>
                Dodgers 7, Yankees 6. Review the final lineup and club messages.
              </p>
              <jp-inline jpCardActions gap="sm" wrap="true">
                <jp-tooltip content="Copy game ID" placement="top">
                  <jp-copy-button text="775296" label="Copy ID" />
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
                  variant="secondary"
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
                    <p>
                      The roster includes the active roster and the injured
                      list.
                    </p>
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
            </jp-card>
          </div>
        </div>
      </main>
    </jp-app-shell>

    <jp-dialog
      [open]="dialogOpen"
      title="Remove player?"
      (openChange)="dialogOpen = $event"
    >
      <p>
        This removes the selected player from the roster. This cannot be undone.
      </p>
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
class FeedbackOverlaysCompositionHost {
  private readonly toasts = inject(JpToastService);

  sidebarCollapsed = false;
  mobileNavOpen = false;
  dialogOpen = false;
  popoverOpen = false;
  menuOpen = false;

  showToast(): void {
    this.toasts.show({ message: 'Lineup saved', tone: 'success' });
  }
}

const meta: Meta = {
  title: 'Compositions/Feedback Overlays',
  component: JpAppShell,
  decorators: [
    moduleMetadata({
      imports: [FeedbackOverlaysCompositionHost],
    }),
  ],
  render: () => ({
    template: `<jp-feedback-overlays-composition-host />`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('h1')?.textContent).toContain(
      'Club alerts',
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

      // Close the dialog so the story doesn't end with a modal scrim
      // blocking every click on the canvas.
      const cancelButton = Array.from(
        canvasElement.querySelectorAll('button'),
      ).find((button) => button.textContent?.trim() === 'Cancel');
      await expect(cancelButton).toBeTruthy();
      if (cancelButton) {
        await userEvent.click(cancelButton);
      }
      await expect(
        canvasElement.querySelector('[role="dialog"][aria-modal="true"]'),
      ).toBeFalsy();
    }
  },
};
