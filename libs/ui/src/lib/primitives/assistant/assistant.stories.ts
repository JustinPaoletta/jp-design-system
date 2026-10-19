import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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
          [jpAssistantContext]="gameContext"
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
        ><jp-stack jpAssistantSuggestions gap="sm"
          ><jp-button
            variant="secondary"
            (click)="ask('Summarize the final score')"
            >Summarize the final score</jp-button
          ><jp-button
            variant="secondary"
            (click)="ask('Who is in the starting lineup?')"
            >Review the starting lineup</jp-button
          ><jp-button
            variant="secondary"
            (click)="ask('When is the next game?')"
            >Find the next game</jp-button
          ></jp-stack
        ></jp-assistant-panel
      >
    </jp-stack>
  `,
})
class AssistantStoryHost {
  private readonly assistant = inject(JpAssistantService);

  readonly gameContext = {
    label: 'Game FAL-1042',
    description: 'Falcons 5, Bears 3. Final score.',
    entityType: 'game',
    entityId: 'FAL-1042',
  };

  seed(): void {
    this.assistant.open({ context: this.gameContext });
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

  ask(content: string): void {
    this.assistant.addMessage({ role: 'user', content });
    this.onSubmit(content);
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
        <jp-button variant="ghost" (click)="start(true)"
          >Show response error</jp-button
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
  private shouldFail = false;

  start(failed = false): void {
    this.shouldFail = failed;
    this.assistant.open({ context: null, clearMessages: true });
    this.assistant.addMessage({
      role: 'user',
      content: 'Summarize this game.',
    });
    this.respond();
  }
  respond(): void {
    this.responseId = this.assistant.beginResponse();
    if (this.shouldFail) {
      this.assistant.failResponse(
        this.responseId,
        'Connection lost. Your question has been preserved.',
      );
    } else {
      this.assistant.updateResponse(
        this.responseId,
        'The Falcons lead 5–3. Checking the final inning…',
      );
    }
  }
  retry(id: number): void {
    this.responseId = id;
    this.assistant.completeResponse(
      id,
      'The final score is Falcons 5, Bears 3. Alex Morgan scored in the ninth inning.',
    );
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
        <jp-assistant-message messageRole="assistant" content="Alex Morgan scored the winning run in the ninth inning." />
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
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Start response' }),
    );
    await expect(canvas.getByRole('progressbar')).toBeInTheDocument();
    await expect(canvasElement.textContent).toContain(
      'Checking the final inning',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Stop response' }),
    );
    await expect(canvasElement.textContent).toContain('Response stopped');
    await expect(canvas.queryByRole('progressbar')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(canvasElement.textContent).toContain(
      'The final score is Falcons 5, Bears 3.',
    );
    await expect(canvas.queryByRole('progressbar')).toBeNull();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Close assistant' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Start response' }),
    );
  },
};

export const FailedAndRetry: Story = {
  render: () => ({ template: '<jp-assistant-async-story-host />' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show response error' }),
    );
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Connection lost',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(canvas.queryByRole('alert')).toBeNull();
    await expect(canvas.queryByRole('progressbar')).toBeNull();
    await expect(canvasElement.textContent).toContain(
      'The final score is Falcons 5, Bears 3.',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Close assistant' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show response error' }),
    );
  },
};
