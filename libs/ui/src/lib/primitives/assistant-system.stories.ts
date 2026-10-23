import { gameSixAnswer } from './game-six.example';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, inject } from '@angular/core';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpAssistantPanel } from './assistant/assistant-panel';
import { JpAssistantTrigger } from './assistant/assistant-trigger';
import { JpAssistantService } from './assistant/assistant.service';
import { JpButton } from './button/button';
import { JpHeading } from './heading/heading';
import { JpInline } from './inline/inline';
import { JpCard } from './card/card';

@Component({
  selector: 'jp-assistant-composition-host',
  standalone: true,
  imports: [
    JpAppShell,
    JpAppShellNavItem,
    JpInline,
    JpCard,
    JpHeading,
    JpButton,
    JpAssistantPanel,
    JpAssistantTrigger,
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
      <span jpAppShellBrand>Tampa Bay Rays</span>
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
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            />
          </svg>
          Assistant
        </jp-app-shell-nav-item>
      </nav>
      <main jpAppShellMain>
        <div class="example-page">
          <div class="example-page__cards">
            <header class="example-page__header">
              <jp-heading as="h1">Game 6 companion</jp-heading>
              <p>Ask about the Rays game or roster.</p>
            </header>

            <jp-card title="Explore Game 6">
              <p>
                Explore the final score, starting lineup and plays that won the
                pennant.
              </p>
              <jp-inline jpCardActions gap="sm" wrap="true">
                <jp-button
                  type="button"
                  variant="primary"
                  jpAssistantTrigger
                  [jpAssistantContext]="deploymentContext"
                >
                  Ask about the game
                </jp-button>
                <jp-button
                  type="button"
                  variant="ghost"
                  jpAssistantTrigger
                  [jpAssistantContext]="filterContext"
                  [jpAssistantClearMessages]="true"
                >
                  Ask about the roster
                </jp-button>
              </jp-inline>
            </jp-card>
          </div>
        </div>
      </main>
    </jp-app-shell>

    <jp-assistant-panel
      title="Game 6 companion"
      emptyTitle="Ask about the lineup"
      emptyDescription="Ask about players, the final score or the ALCS."
      (messageSubmit)="onSubmit($event)"
    />
  `,
})
class AssistantCompositionHost {
  private readonly assistant = inject(JpAssistantService);

  sidebarCollapsed = false;
  mobileNavOpen = false;

  readonly deploymentContext = {
    label: '2026 ALCS Game 6',
    description: 'Rays 7, Guardians 3. Final score.',
    entityType: 'game',
    entityId: '849815',
  };

  readonly filterContext = {
    label: 'Squad filters',
    description: 'Active roster and bullpen',
    entityType: 'filters',
  };

  onSubmit(content: string): void {
    this.assistant.addMessage({
      role: 'assistant',
      content: gameSixAnswer(content),
    });
  }
}

const meta: Meta<JpAppShell> = {
  title: 'Compositions/Assistant System',
  component: JpAppShell,
  decorators: [
    moduleMetadata({
      imports: [AssistantCompositionHost],
    }),
  ],
  render: () => ({
    template: `<jp-assistant-composition-host />`,
  }),
};

export default meta;
type Story = StoryObj<JpAppShell>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('h1')?.textContent).toContain(
      'Game 6 companion',
    );
    const trigger = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Ask about the game',
    );
    await expect(trigger).toBeTruthy();
    if (trigger) {
      await userEvent.click(trigger);
      await expect(canvasElement.textContent).toContain('2026 ALCS Game 6');
      await expect(
        canvasElement.querySelector('[role="complementary"]'),
      ).toBeTruthy();
    }
  },
};

/**
 * Same composition rendered with the compact density token set, so spacing on
 * the shell, triggers, and panel tightens while tones and accent signals hold.
 */
export const Compact: Story = {
  globals: {
    density: 'compact',
  },
};
