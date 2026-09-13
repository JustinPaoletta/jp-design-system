import { booleanAttribute, Directive, inject, input } from '@angular/core';
import { type JpAssistantContext } from '../shared/primitive-types';
import { JpAssistantService } from './assistant.service';

@Directive({
  selector: '[jpAssistantTrigger]',
  standalone: true,
  host: {
    class: 'jp-assistant-trigger',
    '(click)': 'onClick()',
  },
})
export class JpAssistantTrigger {
  private readonly assistant = inject(JpAssistantService);

  readonly jpAssistantContext = input<JpAssistantContext | null>(null);
  readonly jpAssistantClearMessages = input(false, {
    transform: booleanAttribute,
  });

  onClick(): void {
    this.assistant.open({
      context: this.jpAssistantContext(),
      clearMessages: this.jpAssistantClearMessages(),
    });
  }
}
