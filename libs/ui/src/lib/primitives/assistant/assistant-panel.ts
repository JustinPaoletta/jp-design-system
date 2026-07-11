import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  NgZone,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { JpButton } from '../button/button';
import { JpEmptyState } from '../empty-state/empty-state';
import { JpAssistantMessage } from './assistant-message';
import { JpAssistantService } from './assistant.service';

let nextAssistantPanelId = 0;

@Component({
  selector: 'jp-assistant-panel',
  imports: [JpAssistantMessage, JpButton, JpEmptyState],
  templateUrl: './assistant-panel.html',
  styleUrl: './assistant-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-assistant-panel',
    '[class.jp-assistant-panel--open]': 'isOpen()',
  },
})
export class JpAssistantPanel {
  private readonly assistantService = inject(JpAssistantService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  private readonly composerRef =
    viewChild<ElementRef<HTMLTextAreaElement>>('composer');
  private previousFocus: HTMLElement | null = null;
  private lastOpen = false;
  readonly composerId = `jp-assistant-composer-${++nextAssistantPanelId}`;

  readonly isOpen = this.assistantService.isOpen;
  readonly context = this.assistantService.context;
  readonly messages = this.assistantService.messages;

  readonly title = input('JP Assistant');
  readonly closeLabel = input('Close assistant');
  readonly clearContextLabel = input('Clear context');
  readonly composerLabel = input('Message the assistant');
  readonly sendLabel = input('Send');
  readonly emptyTitle = input('Ask about this surface');
  readonly emptyDescription = input(
    'Open the assistant from a context trigger, then send a question.',
  );
  readonly placeholder = input('Ask a question…');

  readonly messageSubmit = output<string>();

  readonly draft = signal('');

  constructor() {
    afterRenderEffect(() => {
      const open = this.isOpen();
      const composer = this.composerRef()?.nativeElement;

      if (open && !this.lastOpen) {
        this.previousFocus = document.activeElement as HTMLElement | null;
        composer?.focus();
      }

      if (!open && this.lastOpen) {
        this.previousFocus?.focus();
        this.previousFocus = null;
      }

      this.lastOpen = open;
    });

    if (typeof document !== 'undefined') {
      const onKeydown = (event: KeyboardEvent) => {
        this.onDocumentKeydown(event);
      };
      document.addEventListener('keydown', onKeydown);
      this.destroyRef.onDestroy(() => {
        document.removeEventListener('keydown', onKeydown);
      });
    }
  }

  close(): void {
    this.assistantService.close();
  }

  clearContext(): void {
    this.assistantService.clearContext();
  }

  onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  onComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  onSurfaceKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  submit(): void {
    const content = this.draft().trim();
    if (!content) {
      return;
    }

    this.assistantService.addMessage({ role: 'user', content });
    this.draft.set('');
    this.messageSubmit.emit(content);

    const composer = this.composerRef()?.nativeElement;
    if (composer) {
      composer.value = '';
    }
  }

  onScrimClick(): void {
    this.close();
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isOpen() || event.key !== 'Escape') {
      return;
    }
    event.preventDefault();
    this.zone.run(() => this.close());
  }
}
