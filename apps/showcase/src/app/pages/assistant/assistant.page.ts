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
    label: 'World Series Game 5',
    description: 'Dodgers 7, Yankees 6. Final score.',
    entityType: 'game',
    entityId: '775296',
  };

  readonly tableRowContext: JpAssistantContext = {
    label: 'Player Jack Flaherty',
    description: 'Pitcher · Active roster · Started Game 5',
    entityType: 'player',
    entityId: 'jack-flaherty',
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
      content: 'The Dodgers won 7–6 against the New York Yankees.',
    });
    this.assistant.addMessage({
      role: 'assistant',
      content:
        'The Dodgers won 7–6. Freddie Freeman and Mookie Betts drove in runs.',
    });
    this.assistant.addMessage({
      role: 'user',
      content: 'Who started Game 5?',
    });
  }

  onMessageSubmit(content: string): void {
    this.lastReply = content;
    this.assistant.addMessage({
      role: 'assistant',
      content: `Sample game summary for “${content}”: Dodgers 7, Yankees 6.`,
    });
  }
}
