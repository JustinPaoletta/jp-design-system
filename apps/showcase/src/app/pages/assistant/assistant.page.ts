import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import {
  JpAssistantPanel,
  JpAssistantService,
  JpAssistantTrigger,
  JpButton,
  JpHeading,
  JpInline,
  JpCard,
  type JpAssistantContext,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-assistant-page',
  imports: [
    JpInline,
    JpCard,
    JpHeading,
    JpButton,
    JpAssistantPanel,
    JpAssistantTrigger,
  ],
  templateUrl: './assistant.page.html',
  styleUrl: './assistant.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantPage implements OnDestroy {
  private readonly assistant = inject(JpAssistantService);

  lastReply = 'None yet';

  readonly deploymentContext: JpAssistantContext = {
    label: 'ALCS Game 6',
    description: 'The Rays won ALCS Game 6.',
    entityType: 'game',
    entityId: 'ALCS-G6',
  };

  readonly tableRowContext: JpAssistantContext = {
    label: 'Player Shane Baz',
    description: 'Pitcher · Active roster · ALCS Game 6',
    entityType: 'player',
    entityId: 'shane-baz',
  };

  readonly filterContext: JpAssistantContext = {
    label: 'Squad filters',
    description: 'Active roster and injured list',
    entityType: 'filters',
  };

  ngOnDestroy(): void {
    // Panel only mounts on this route; clear root service state so returning
    // does not remount an already-open panel with a stale conversation.
    this.assistant.close();
    this.assistant.clearContext();
    this.assistant.clearMessages();
  }

  seedToneDemo(): void {
    this.assistant.open({ clearMessages: true, context: null });
    this.assistant.addMessage({
      role: 'system',
      content: 'The Rays won ALCS Game 6 and advanced to the World Series.',
    });
    this.assistant.addMessage({
      role: 'assistant',
      content: 'The Rays won ALCS Game 6 and advanced to the World Series.',
    });
    this.assistant.addMessage({
      role: 'user',
      content: 'Who won ALCS Game 6?',
    });
  }

  onMessageSubmit(content: string): void {
    this.lastReply = content;
    this.assistant.addMessage({
      role: 'assistant',
      content: `Sample game summary for “${content}”: the Rays won ALCS Game 6.`,
    });
  }
}
