import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, inject } from '@angular/core';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpAssistantPanel } from './assistant/assistant-panel';
import { JpAssistantTrigger } from './assistant/assistant-trigger';
import { JpAssistantService } from './assistant/assistant.service';
import { JpBox } from './box/box';
import { JpButton } from './button/button';
import { JpHeading } from './heading/heading';
import { JpInline } from './inline/inline';
import { JpStack } from './stack/stack';
import { JpSurface } from './surface/surface';
import { JpText } from './text/text';

@Component({
  selector: 'jp-assistant-composition-host',
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
    JpAssistantPanel,
    JpAssistantTrigger,
  ],
  template: `
    <jp-app-shell
      [sidebarCollapsed]="sidebarCollapsed"
      [mobileNavOpen]="mobileNavOpen"
      (sidebarCollapsedChange)="sidebarCollapsed = $event"
      (mobileNavOpenChange)="mobileNavOpen = $event"
    >
      <span jpAppShellBrand>Riverton Falcons</span>
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
        <jp-box padding="lg" maxWidth="wide">
          <jp-stack gap="lg">
            <jp-stack gap="xs">
              <jp-heading as="h1">Falcons assistant</jp-heading>
              <jp-text tone="secondary">
                Ask about the Falcons game or roster.
              </jp-text>
            </jp-stack>

            <jp-surface
              tone="raised"
              padding="md"
              border="subtle"
              elevation="none"
            >
              <jp-stack gap="md">
                <jp-heading as="h2" size="h4">Ask the coach</jp-heading>
                <jp-inline gap="sm" wrap="true">
                  <jp-button
                    type="button"
                    variant="secondary"
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
              </jp-stack>
            </jp-surface>
          </jp-stack>
        </jp-box>
      </main>
    </jp-app-shell>

    <jp-assistant-panel
      title="Falcons coach"
      emptyTitle="Ask about the lineup"
      emptyDescription="Ask about players, the final score or the next game."
      (messageSubmit)="onSubmit($event)"
    />
  `,
})
class AssistantCompositionHost {
  private readonly assistant = inject(JpAssistantService);

  sidebarCollapsed = false;
  mobileNavOpen = false;

  readonly deploymentContext = {
    label: 'Game FAL-1042',
    description: 'Falcons 5, Bears 3. Final score.',
    entityType: 'game',
    entityId: 'FAL-1042',
  };

  readonly filterContext = {
    label: 'Squad filters',
    description: 'Varsity + reserve',
    entityType: 'filters',
  };

  onSubmit(content: string): void {
    this.assistant.addMessage({
      role: 'assistant',
      content: `Sample game summary for “${content}”: Falcons 5, Bears 3.`,
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
      'Falcons assistant',
    );
    const trigger = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Ask about the game',
    );
    await expect(trigger).toBeTruthy();
    if (trigger) {
      await userEvent.click(trigger);
      await expect(canvasElement.textContent).toContain('Game FAL-1042');
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
