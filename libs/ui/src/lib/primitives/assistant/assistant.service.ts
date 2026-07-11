import { Injectable, signal } from '@angular/core';
import {
  type JpAssistantAddMessageOptions,
  type JpAssistantContext,
  type JpAssistantMessageItem,
  type JpAssistantOpenOptions,
} from '../shared/primitive-types';

@Injectable({ providedIn: 'root' })
export class JpAssistantService {
  private nextId = 1;
  private readonly openSignal = signal(false);
  private readonly contextSignal = signal<JpAssistantContext | null>(null);
  private readonly messagesSignal = signal<JpAssistantMessageItem[]>([]);

  readonly isOpen = this.openSignal.asReadonly();
  readonly context = this.contextSignal.asReadonly();
  readonly messages = this.messagesSignal.asReadonly();

  open(options: JpAssistantOpenOptions = {}): void {
    if (options.clearMessages) {
      this.messagesSignal.set([]);
    }
    if (options.context !== undefined) {
      this.contextSignal.set(options.context);
    }
    this.openSignal.set(true);
  }

  close(): void {
    this.openSignal.set(false);
  }

  toggle(options: JpAssistantOpenOptions = {}): void {
    if (this.openSignal()) {
      this.close();
      return;
    }
    this.open(options);
  }

  setContext(context: JpAssistantContext | null): void {
    this.contextSignal.set(context);
  }

  clearContext(): void {
    this.contextSignal.set(null);
  }

  addMessage(options: JpAssistantAddMessageOptions): number {
    const id = this.nextId++;
    const item: JpAssistantMessageItem = {
      id,
      role: options.role,
      content: options.content,
    };
    this.messagesSignal.update((current) => [...current, item]);
    return id;
  }

  clearMessages(): void {
    this.messagesSignal.set([]);
  }
}
