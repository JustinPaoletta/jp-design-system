import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
    '[class.jp-assistant-message--user]': 'role() === "user"',
    '[class.jp-assistant-message--assistant]': 'role() === "assistant"',
    '[class.jp-assistant-message--system]': 'role() === "system"',
  },
})
export class JpAssistantMessage {
  readonly role = input<JpAssistantMessageRole, unknown>('assistant', {
    transform: createStringUnionTransform(
      JP_ASSISTANT_MESSAGE_ROLES,
      'assistant',
    ),
  });

  readonly content = input.required<string>();
}
