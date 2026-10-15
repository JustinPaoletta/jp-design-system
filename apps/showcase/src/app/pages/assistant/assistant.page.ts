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
  JpBox,
  JpButton,
  JpHeading,
  JpInline,
  JpStack,
  JpSurface,
  JpText,
  type JpAssistantContext,
} from '@jp-design-system/ui';
import { injectDocumentTheme } from '../../shared/document-theme';

@Component({
  selector: 'app-assistant-page',
  imports: [
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
  templateUrl: './assistant.page.html',
  styleUrl: './assistant.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantPage implements OnDestroy {
  private readonly assistant = inject(JpAssistantService);
  private readonly theme = injectDocumentTheme();

  lastReply = 'None yet';

  readonly accent = this.theme.accent;
  readonly density = this.theme.density;

  readonly deploymentContext: JpAssistantContext = {
    label: 'Game FAL-1042',
    description: 'Falcons 5, Bears 3. Final score.',
    entityType: 'game',
    entityId: 'FAL-1042',
  };

  readonly tableRowContext: JpAssistantContext = {
    label: 'Player Alex Morgan',
    description: 'Status: Day to day',
    entityType: 'service',
    entityId: 'payments-api',
  };

  readonly filterContext: JpAssistantContext = {
    label: 'Squad filters',
    description: 'Varsity + reserve',
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
      content: 'The Falcons won 5–3 against the Lakeview Bears.',
    });
    this.assistant.addMessage({
      role: 'assistant',
      content:
        'The Falcons won 5–3. Alex Morgan and Jordan Davis drove in runs.',
    });
    this.assistant.addMessage({
      role: 'user',
      content: 'Who is pitching in the next game?',
    });
  }

  onMessageSubmit(content: string): void {
    this.lastReply = content;
    this.assistant.addMessage({
      role: 'assistant',
      content: `Structured reply for “${content}”. Status looks healthy with one degraded dependency.`,
    });
  }
}
