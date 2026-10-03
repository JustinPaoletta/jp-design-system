import { computed, Injectable, signal } from '@angular/core';
import {
  type JpAssistantAddMessageOptions,
  type JpAssistantContext,
  type JpAssistantMessageItem,
  type JpAssistantOpenOptions,
} from '../shared/primitive-types';

export type JpAssistantResponseStatus =
  | 'pending'
  | 'complete'
  | 'error'
  | 'cancelled';
export interface JpAssistantResponseMessage extends JpAssistantMessageItem {
  responseStatus?: JpAssistantResponseStatus;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class JpAssistantService {
  private nextId = 1;
  private readonly openSignal = signal(false);
  private readonly contextSignal = signal<JpAssistantContext | null>(null);
  private readonly messagesSignal = signal<JpAssistantResponseMessage[]>([]);

  readonly isOpen = this.openSignal.asReadonly();
  readonly context = this.contextSignal.asReadonly();
  readonly messages = this.messagesSignal.asReadonly();
  readonly isPending = computed(() =>
    this.messages().some((message) => message.responseStatus === 'pending'),
  );

  /** Return a request ID. Pass it to updates so late responses cannot overwrite a retry. */
  beginResponse(content = ''): number {
    const id = this.nextId++;
    this.messagesSignal.update((current) => [
      ...current,
      { id, role: 'assistant', content, responseStatus: 'pending' },
    ]);
    return id;
  }

  /** Replace the accumulated text while streaming. Updates to settled/cleared requests are ignored. */
  updateResponse(id: number, content: string): void {
    this.updatePending(id, { content });
  }

  completeResponse(id: number, content?: string): void {
    this.updatePending(id, {
      responseStatus: 'complete',
      ...(content === undefined ? {} : { content }),
    });
  }

  failResponse(
    id: number,
    error = 'The response could not be completed. Please try again.',
  ): void {
    this.updatePending(id, { responseStatus: 'error', error });
  }

  /** Consumers should also abort their transport when the panel emits responseCancel. */
  cancelResponse(id: number): void {
    this.updatePending(id, { responseStatus: 'cancelled' });
  }

  /** A new ID prevents updates from the old transport affecting the retried response. */
  retryResponse(id: number): number | null {
    const previous = this.messages().find((message) => message.id === id);
    if (
      !previous ||
      (previous.responseStatus !== 'error' &&
        previous.responseStatus !== 'cancelled')
    ) {
      return null;
    }
    const nextId = this.nextId++;
    this.messagesSignal.update((current) =>
      current.map((message) =>
        message.id === id
          ? {
              id: nextId,
              role: 'assistant',
              content: '',
              responseStatus: 'pending',
            }
          : message,
      ),
    );
    return nextId;
  }

  private updatePending(
    id: number,
    update: Partial<JpAssistantResponseMessage>,
  ): void {
    this.messagesSignal.update((current) =>
      current.map((message) =>
        message.id === id && message.responseStatus === 'pending'
          ? { ...message, ...update }
          : message,
      ),
    );
  }

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
