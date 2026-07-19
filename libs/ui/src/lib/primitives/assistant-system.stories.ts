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
      <nav jpAppShellSidebar>
        <jp-app-shell-nav-item href="#" [active]="true"
          >Assistant</jp-app-shell-nav-item
        >
      </nav>
      <main jpAppShellMain>
        <jp-box padding="lg" maxWidth="wide">
          <jp-stack gap="lg">
            <jp-stack gap="xs">
              <jp-heading as="h1">Assistant System</jp-heading>
              <jp-text tone="secondary">
                Context triggers open the branded assistant panel with calm
                message tones.
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
              <jp-stack gap="md">
                <jp-heading as="h2">Context triggers</jp-heading>
                <jp-inline gap="sm" wrap="true">
                  <jp-button
                    type="button"
                    variant="secondary"
                    jpAssistantTrigger
                    [jpAssistantContext]="deploymentContext"
                  >
                    Ask about deployment
                  </jp-button>
                  <jp-button
                    type="button"
                    variant="ghost"
                    jpAssistantTrigger
                    [jpAssistantContext]="filterContext"
                    [jpAssistantClearMessages]="true"
                  >
                    Ask about filters
                  </jp-button>
                </jp-inline>
              </jp-stack>
            </jp-surface>
          </jp-stack>
        </jp-box>
      </main>
    </jp-app-shell>

    <jp-assistant-panel (messageSubmit)="onSubmit($event)" />
  `,
})
class AssistantCompositionHost {
  private readonly assistant = inject(JpAssistantService);

  sidebarCollapsed = false;
  mobileNavOpen = false;

  readonly documentAccent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly documentDensity =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';

  readonly deploymentContext = {
    label: 'Deployment dep-1042',
    description: 'Production rollout',
    entityType: 'deployment',
    entityId: 'dep-1042',
  };

  readonly filterContext = {
    label: 'Environment filters',
    description: 'Production + staging',
    entityType: 'filters',
  };

  onSubmit(content: string): void {
    this.assistant.addMessage({
      role: 'assistant',
      content: `Here is a structured answer for “${content}”.`,
    });
  }
}

const meta: Meta = {
  title: 'Compositions/Assistant System',
  component: JpAppShell,
  globals: {
    accent: 'neon',
  },
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
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('h1')?.textContent).toContain(
      'Assistant System',
    );
    const trigger = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Ask about deployment',
    );
    await expect(trigger).toBeTruthy();
    if (trigger) {
      await userEvent.click(trigger);
      await expect(canvasElement.textContent).toContain('Deployment dep-1042');
      await expect(
        canvasElement.querySelector('[role="complementary"]'),
      ).toBeTruthy();
    }
  },
};
