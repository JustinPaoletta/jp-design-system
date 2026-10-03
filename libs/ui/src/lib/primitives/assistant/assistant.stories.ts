import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent, waitFor } from 'storybook/test';
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
          Seed conversation
        </jp-button>
        <jp-button type="button" variant="ghost" (click)="openEmpty()">
          Open empty
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
    this.assistant.open({ context: this.deploymentContext });
    this.assistant.clearMessages();
    this.assistant.addMessage({
      role: 'system',
      content: 'Context loaded for dep-1042',
    });
    this.assistant.addMessage({
      role: 'assistant',
      content: 'I can summarize status, risks, and next steps.',
    });
    this.assistant.addMessage({
      role: 'user',
      content: 'What changed in this rollout?',
    });
  }

  openEmpty(): void {
    this.assistant.open({ context: null, clearMessages: true });
  }

  onSubmit(content: string): void {
    this.assistant.addMessage({
      role: 'assistant',
      content: `Noted: “${content}”. Here is a calm, structured reply.`,
    });
  }
}

@Component({
  selector: 'jp-assistant-async-story-host',
  imports: [JpButton, JpAssistantPanel, JpInline, JpStack],
  template: `
    <jp-stack gap="md">
      <jp-inline gap="sm" wrap="true">
        <jp-button variant="secondary" (click)="start()"
          >Start response</jp-button
        >
        <jp-button variant="ghost" (click)="stream()">Stream chunk</jp-button>
        <jp-button variant="ghost" (click)="fail()">Fail response</jp-button>
        <jp-button variant="ghost" (click)="complete()"
          >Complete response</jp-button
        >
      </jp-inline>
      <jp-assistant-panel
        (messageSubmit)="respond()"
        (responseRetry)="retry($event.responseId)"
      />
    </jp-stack>
  `,
})
class AssistantAsyncStoryHost {
  private readonly assistant = inject(JpAssistantService);
  private responseId = 0;

  start(): void {
    this.assistant.open({ context: null, clearMessages: true });
    this.assistant.addMessage({
      role: 'user',
      content: 'Summarize this deployment.',
    });
    this.respond();
  }
  respond(): void {
    this.responseId = this.assistant.beginResponse();
  }
  stream(): void {
    this.assistant.updateResponse(
      this.responseId,
      'The deployment is healthy. Checking the final stage…',
    );
  }
  fail(): void {
    this.assistant.failResponse(
      this.responseId,
      'Connection lost. Your question has been preserved.',
    );
  }
  complete(): void {
    this.assistant.completeResponse(
      this.responseId,
      'All stages completed successfully.',
    );
  }
  retry(id: number): void {
    this.responseId = id;
  }
}

const meta: Meta<JpAssistantPanel> = {
  title: 'Primitives/Assistant/Panel',
  component: JpAssistantPanel,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
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
        AssistantAsyncStoryHost,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<JpAssistantPanel>;

/**
 * Message role tones stay neutral: system is muted, assistant sits on a sunken
 * surface, user is a subtle right-aligned bubble. Accent is reserved as a signal
 * elsewhere (context chip + Send button), not on message bodies.
 */
export const MessageRoles: Story = {
  render: () => ({
    template: `
      <div
        class="jp-assistant-panel__message-list"
        style="display:flex;flex-direction:column;gap:0.75rem;max-width:22rem;padding:1rem;"
      >
        <jp-assistant-message messageRole="system" content="Context loaded for dep-1042" />
        <jp-assistant-message messageRole="assistant" content="Assistant reply stays calm and neutral." />
        <jp-assistant-message messageRole="user" content="User question about this deployment." />
      </div>
    `,
  }),
};

/** Empty state shown when the panel is open but no messages exist yet. */
export const EmptyState: Story = {
  render: () => ({
    template: `<jp-assistant-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const openEmpty = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Open empty',
    );
    await userEvent.click(openEmpty as HTMLButtonElement);
    await expect(canvasElement.textContent).toContain('Ask about this surface');
  },
};

/** A seeded conversation covering all three message roles inside the panel. */
export const Conversation: Story = {
  render: () => ({
    template: `<jp-assistant-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const seed = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Seed conversation',
    );
    await userEvent.click(seed as HTMLButtonElement);
    await expect(canvasElement.textContent).toContain(
      'I can summarize status, risks, and next steps.',
    );
    await expect(
      canvasElement.querySelectorAll('jp-assistant-message').length,
    ).toBe(3);
  },
};

/**
 * Opening from a context trigger attaches the accent-signalled context chip and
 * moves focus to the composer. The Send button is disabled until text is typed.
 */
export const ContextTrigger: Story = {
  render: () => ({
    template: `<jp-assistant-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const trigger = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Ask about deployment',
    );
    await userEvent.click(trigger as HTMLButtonElement);

    await expect(canvasElement.textContent).toContain('Deployment dep-1042');
    await expect(
      canvasElement.querySelector('[role="complementary"]'),
    ).toBeTruthy();

    const composer = canvasElement.querySelector(
      '.jp-assistant-panel__composer-input',
    ) as HTMLTextAreaElement;
    await waitFor(() => expect(document.activeElement).toBe(composer));

    const send = canvasElement.querySelector(
      '.jp-assistant-panel__composer-actions button',
    ) as HTMLButtonElement;
    await expect(send.disabled).toBe(true);
  },
};

/**
 * Composer behavior: empty draft cannot send, typing enables Send, and Enter
 * submits (Shift+Enter would insert a newline instead).
 */
export const ComposerInteraction: Story = {
  render: () => ({
    template: `<jp-assistant-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const trigger = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Ask about deployment',
    );
    await userEvent.click(trigger as HTMLButtonElement);

    const composer = canvasElement.querySelector(
      '.jp-assistant-panel__composer-input',
    ) as HTMLTextAreaElement;
    await waitFor(() => expect(composer).toBeTruthy());

    await userEvent.type(composer, 'What is the deployment status?');
    const send = canvasElement.querySelector(
      '.jp-assistant-panel__composer-actions button',
    ) as HTMLButtonElement;
    await expect(send.disabled).toBe(false);

    await userEvent.keyboard('{Enter}');
    await expect(canvasElement.textContent).toContain(
      'What is the deployment status?',
    );
    await expect(canvasElement.textContent).toContain('Noted:');
  },
};

export const PendingAndStreaming: Story = {
  render: () => ({ template: '<jp-assistant-async-story-host />' }),
  play: async ({ canvasElement }) => {
    const button = (label: string) =>
      Array.from(canvasElement.querySelectorAll('button')).find(
        (item) => item.textContent?.trim() === label,
      ) as HTMLButtonElement;
    await userEvent.click(button('Start response'));
    await expect(
      canvasElement.querySelector('[role="progressbar"]'),
    ).toBeTruthy();
    await userEvent.click(button('Stream chunk'));
    await expect(canvasElement.textContent).toContain(
      'Checking the final stage',
    );
    await userEvent.click(button('Stop response'));
    await expect(canvasElement.textContent).toContain('Response stopped');
    await expect(
      canvasElement.querySelector('[role="progressbar"]'),
    ).toBeNull();
  },
};

export const FailedAndRetry: Story = {
  render: () => ({ template: '<jp-assistant-async-story-host />' }),
  play: async ({ canvasElement }) => {
    const button = (label: string) =>
      Array.from(canvasElement.querySelectorAll('button')).find(
        (item) => item.textContent?.trim() === label,
      ) as HTMLButtonElement;
    await userEvent.click(button('Start response'));
    await userEvent.click(button('Fail response'));
    await expect(canvasElement.textContent).toContain('Connection lost');
    await userEvent.click(button('Retry'));
    await expect(
      canvasElement.querySelector('[role="progressbar"]'),
    ).toBeTruthy();
    await userEvent.click(button('Complete response'));
    await expect(canvasElement.textContent).toContain(
      'All stages completed successfully.',
    );
  },
};
