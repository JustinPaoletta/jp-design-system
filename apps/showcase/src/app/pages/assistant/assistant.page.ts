import { gameSixAnswer } from '@jp-design-system/ui/primitives/game-six.example';
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
    label: '2026 ALCS Game 6',
    description: 'Rays 7, Guardians 3. Final score.',
    entityType: 'game',
    entityId: '849815',
  };

  readonly tableRowContext: JpAssistantContext = {
    label: 'Player Freddy Peralta',
    description: 'Pitcher · Active roster · Started Game 6',
    entityType: 'player',
    entityId: '642547',
  };

  readonly filterContext: JpAssistantContext = {
    label: 'Squad filters',
    description: 'Active roster and bullpen',
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
      content: 'The Rays won 7–3 against the Cleveland Guardians.',
    });
    this.assistant.addMessage({
      role: 'assistant',
      content:
        'The Rays won 7–3. Yandy Díaz and Junior Caminero drove in runs.',
    });
    this.assistant.addMessage({
      role: 'user',
      content: 'Who started Game 6?',
    });
  }

  onMessageSubmit(content: string): void {
    this.lastReply = content;
    this.assistant.addMessage({
      role: 'assistant',
      content: gameSixAnswer(content),
    });
  }
}
