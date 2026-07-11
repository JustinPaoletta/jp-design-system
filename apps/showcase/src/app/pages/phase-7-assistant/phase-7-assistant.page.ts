import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  JpAppShell,
  JpAppShellNavItem,
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

@Component({
  selector: 'app-phase-7-assistant-page',
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
  templateUrl: './phase-7-assistant.page.html',
  styleUrl: './phase-7-assistant.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Phase7AssistantPage {
  private readonly assistant = inject(JpAssistantService);

  sidebarCollapsed = false;
  mobileNavOpen = false;
  lastReply = 'None yet';

  readonly accent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly density =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';

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
