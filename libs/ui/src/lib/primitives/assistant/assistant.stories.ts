import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { Component, inject } from '@angular/core';
import { JpButton } from '../button/button';
import { JpInline } from '../inline/inline';
import { JpStack } from '../stack/stack';
import { JpText } from '../text/text';
import { JpAssistantMessage } from './assistant-message';
import { JpAssistantPanel } from './assistant-panel';
import { JpAssistantTrigger } from './assistant-trigger';
import { JpAssistantService } from './assistant.service';

@Component({
  selector: 'jp-assistant-story-host',
  standalone: true,
  imports: [JpButton, JpAssistantPanel, JpAssistantTrigger, JpInline, JpStack],
  template: `
    <jp-stack gap="md">
      <jp-inline gap="sm" wrap="true">
        <jp-button
          type="button"
          variant="secondary"
          jpAssistantTrigger
          [jpAssistantContext]="deploymentContext"
        >
          Ask about deployment
        </jp-button>
        <jp-button type="button" variant="ghost" (click)="seed()">
          Seed messages
        </jp-button>
      </jp-inline>
      <jp-assistant-panel (messageSubmit)="onSubmit($event)" />
    </jp-stack>
  `,
})
class AssistantStoryHost {
  private readonly assistant = inject(JpAssistantService);

  readonly deploymentContext = {
    label: 'Deployment dep-1042',
    description: 'Production rollout',
    entityType: 'deployment',
    entityId: 'dep-1042',
  };

  seed(): void {
    this.assistant.open();
    this.assistant.clearMessages();
    this.assistant.addMessage({
      role: 'system',
      content: 'Context loaded for dep-1042',
    });
    this.assistant.addMessage({
      role: 'assistant',
      content: 'I can summarize status, risks, and next steps.',
    });
  }

  onSubmit(content: string): void {
    this.assistant.addMessage({
      role: 'assistant',
      content: `Noted: “${content}”. Here is a calm, structured reply.`,
    });
  }
}

const meta: Meta = {
  title: 'Primitives/Assistant/Panel',
  component: JpAssistantPanel,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    moduleMetadata({
      imports: [
        JpAssistantPanel,
        JpAssistantMessage,
        JpAssistantTrigger,
        JpButton,
        JpStack,
        JpText,
        AssistantStoryHost,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const MessageRoles: Story = {
  render: () => ({
    template: `
      <div class="jp-assistant-message-story" style="display:flex;flex-direction:column;gap:0.75rem;max-width:22rem;padding:1rem;">
        <jp-assistant-message role="system" content="System: context attached" />
        <jp-assistant-message role="assistant" content="Assistant reply stays calm and neutral." />
        <jp-assistant-message role="user" content="User question about this deployment." />
      </div>
    `,
  }),
};

export const ContextTrigger: Story = {
  render: () => ({
    template: `<jp-assistant-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(button);
    await expect(canvasElement.textContent).toContain('Deployment dep-1042');
    await expect(
      canvasElement.querySelector('[role="complementary"]'),
    ).toBeTruthy();
  },
};
