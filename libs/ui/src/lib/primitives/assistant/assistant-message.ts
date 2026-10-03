import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type JpAssistantMessageRole,
  JP_ASSISTANT_MESSAGE_ROLES,
} from '../shared/primitive-types';
import { createStringUnionTransform } from '../shared/token-maps';

const ROLE_LABELS: Record<JpAssistantMessageRole, string> = {
  user: 'You',
  assistant: 'Assistant',
  system: 'System',
};

@Component({
  selector: 'jp-assistant-message',
  templateUrl: './assistant-message.html',
  styleUrl: './assistant-message.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-assistant-message',
    '[class.jp-assistant-message--user]': 'messageRole() === "user"',
    '[class.jp-assistant-message--assistant]': 'messageRole() === "assistant"',
    '[class.jp-assistant-message--system]': 'messageRole() === "system"',
  },
})
export class JpAssistantMessage {
  /**
   * Named `messageRole` (not `role`) so templates never set the HTML `role`
   * attribute to non-ARIA values like "system" / "assistant".
   */
  readonly messageRole = input<JpAssistantMessageRole, unknown>('assistant', {
    transform: createStringUnionTransform(
      JP_ASSISTANT_MESSAGE_ROLES,
      'assistant',
    ),
  });

  readonly content = input.required<string>();

  readonly roleLabel = computed(() => ROLE_LABELS[this.messageRole()]);
}
