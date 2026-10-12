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
          Ask about the game
        </jp-button>
        <jp-button type="button" variant="ghost" (click)="seed()">
          Load game summary
        </jp-button>
        <jp-button type="button" variant="ghost" (click)="openEmpty()">
          Open empty
        </jp-button>
      </jp-inline>
      <jp-assistant-panel
        title="Falcons coach"
        emptyTitle="Ask about the lineup"
        emptyDescription="Ask about players, the final score or the next game."
        (messageSubmit)="onSubmit($event)"
      />
    </jp-stack>
  `,
})
class AssistantStoryHost {
  private readonly assistant = inject(JpAssistantService);

  readonly deploymentContext = {
    label: 'Game FAL-1042',
    description: 'Falcons 5, Bears 3. Final score.',
    entityType: 'game',
    entityId: 'FAL-1042',
  };

  seed(): void {
    this.assistant.open({ context: this.deploymentContext });
    this.assistant.clearMessages();
    this.assistant.addMessage({
      role: 'system',
      content: 'Game FAL-1042 loaded',
    });
    this.assistant.addMessage({
      role: 'assistant',
      content: 'I can summarize the score, key plays and next game.',
    });
    this.assistant.addMessage({
      role: 'user',
      content: 'Who scored in the ninth inning?',
    });
  }

  openEmpty(): void {
    this.assistant.open({ context: null, clearMessages: true });
  }

  onSubmit(content: string): void {
    this.assistant.addMessage({
      role: 'assistant',
      content: `Noted: “${content}”. Sample game result: Falcons 5, Bears 3.`,
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
        title="Falcons coach"
        emptyTitle="Ask about the lineup"
        emptyDescription="Ask about players, the final score or the next game."
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
      content: 'Summarize this game.',
    });
    this.respond();
  }
  respond(): void {
    this.responseId = this.assistant.beginResponse();
  }
  stream(): void {
    this.assistant.updateResponse(
      this.responseId,
      'The Falcons lead 5–3. Checking the final inning…',
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
      'All game checks are complete.',
    );
  }
  retry(id: number): void {
    this.responseId = id;
  }
}

const meta: Meta<JpAssistantPanel> = {
  title: 'Primitives/Assistant/Panel',
  component: JpAssistantPanel,
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
        <jp-assistant-message messageRole="system" content="Game FAL-1042 loaded" />
        <jp-assistant-message messageRole="assistant" content="Assistant reply stays calm and neutral." />
        <jp-assistant-message messageRole="user" content="Who scored in the ninth inning?" />
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
    await expect(canvasElement.textContent).toContain('Ask about the lineup');
  },
};

/** A seeded conversation covering all three message roles inside the panel. */
export const Conversation: Story = {
  render: () => ({
    template: `<jp-assistant-story-host />`,
  }),
  play: async ({ canvasElement }) => {
    const seed = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Load game summary',
    );
    await userEvent.click(seed as HTMLButtonElement);
    await expect(canvasElement.textContent).toContain(
      'I can summarize the score, key plays and next game.',
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
      (button) => button.textContent?.trim() === 'Ask about the game',
    );
    await userEvent.click(trigger as HTMLButtonElement);

    await expect(canvasElement.textContent).toContain('Game FAL-1042');
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
      (button) => button.textContent?.trim() === 'Ask about the game',
    );
    await userEvent.click(trigger as HTMLButtonElement);

    const composer = canvasElement.querySelector(
      '.jp-assistant-panel__composer-input',
    ) as HTMLTextAreaElement;
    await waitFor(() => expect(composer).toBeTruthy());

    await userEvent.type(composer, 'What is the game score?');
    const send = canvasElement.querySelector(
      '.jp-assistant-panel__composer-actions button',
    ) as HTMLButtonElement;
    await expect(send.disabled).toBe(false);

    await userEvent.keyboard('{Enter}');
    await expect(canvasElement.textContent).toContain(
      'What is the game score?',
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
      'Checking the final inning',
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
      'All game checks are complete.',
    );
  },
};
