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
    label: 'Deployment dep-1042',
    description: 'Production rollout',
    entityType: 'deployment',
    entityId: 'dep-1042',
  };

  readonly tableRowContext: JpAssistantContext = {
    label: 'Service payments-api',
    description: 'Status: Degraded',
    entityType: 'service',
    entityId: 'payments-api',
  };

  readonly filterContext: JpAssistantContext = {
    label: 'Environment filters',
    description: 'Production + staging',
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
      content: 'Tone refinement demo — system meta stays muted.',
    });
    this.assistant.addMessage({
      role: 'assistant',
      content:
        'Assistant replies use a calm sunken surface. Accent is reserved for send and context.',
    });
    this.assistant.addMessage({
      role: 'user',
      content: 'How should assistant chrome use accent?',
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
