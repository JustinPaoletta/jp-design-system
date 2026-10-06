import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import {
  type JpAssistantMessageRole,
  JP_ASSISTANT_MESSAGE_ROLES,
} from '../shared/primitive-types';
import { createStringUnionTransform } from '../shared/token-maps';

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
  private readonly messages = inject(JP_MESSAGES);
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

  readonly roleLabel = computed(
    () => this.messages.assistant.roles[this.messageRole()],
  );
}
