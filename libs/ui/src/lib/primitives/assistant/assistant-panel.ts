import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpButton } from '../button/button';
import { JpInlineAlert } from '../inline-alert/inline-alert';
import { JpProgress } from '../progress/progress';
import { JpEmptyState } from '../empty-state/empty-state';
import { JpFocusTrap } from '../shared/focus-trap';
import { JpAssistantMessage } from './assistant-message';
import { JpAssistantService } from './assistant.service';

const ASSISTANT_MOBILE_MEDIA = '(max-width: 48rem)';

let nextAssistantPanelId = 0;

@Component({
  selector: 'jp-assistant-panel',
  imports: [
    JpAssistantMessage,
    JpButton,
    JpEmptyState,
    JpFocusTrap,
    JpInlineAlert,
    JpProgress,
  ],
  templateUrl: './assistant-panel.html',
  styleUrl: './assistant-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-assistant-panel',
    '[class.jp-assistant-panel--open]': 'isOpen()',
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
})
export class JpAssistantPanel implements OnInit {
  private readonly jpMessages = inject(JP_MESSAGES);
  private readonly assistantService = inject(JpAssistantService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly composerRef =
    viewChild<ElementRef<HTMLTextAreaElement>>('composer');
  private previousFocus: HTMLElement | null = null;
  private lastOpen = false;
  private mobileMediaQuery: MediaQueryList | null = null;
  readonly composerId = `jp-assistant-composer-${++nextAssistantPanelId}`;

  readonly isMobileViewport = signal(false);
  readonly trapFocus = computed(() => this.isOpen() && this.isMobileViewport());

  readonly isOpen = this.assistantService.isOpen;
  readonly context = this.assistantService.context;
  readonly messages = this.assistantService.messages;
  readonly isPending = this.assistantService.isPending;

  readonly title = input(this.jpMessages.assistant.title);
  readonly closeLabel = input(this.jpMessages.assistant.close);
  readonly clearContextLabel = input(this.jpMessages.assistant.clearContext);
  readonly composerLabel = input(this.jpMessages.assistant.composerLabel);
  readonly sendLabel = input(this.jpMessages.assistant.send);
  readonly pendingLabel = input(this.jpMessages.assistant.pending);
  readonly cancelLabel = input(this.jpMessages.assistant.cancel);
  readonly retryLabel = input(this.jpMessages.assistant.retry);
  readonly cancelledLabel = input(this.jpMessages.assistant.cancelled);
  readonly responseCancel = output<number>();
  readonly responseRetry = output<{ previousId: number; responseId: number }>();
  readonly emptyTitle = input(this.jpMessages.assistant.emptyTitle);
  readonly emptyDescription = input(this.jpMessages.assistant.emptyDescription);
  readonly placeholder = input(this.jpMessages.assistant.placeholder);

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
  }

  ngOnInit(): void {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    this.mobileMediaQuery = window.matchMedia(ASSISTANT_MOBILE_MEDIA);
    this.isMobileViewport.set(this.mobileMediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      this.isMobileViewport.set(event.matches);
    };

    this.mobileMediaQuery.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => {
      this.mobileMediaQuery?.removeEventListener('change', onChange);
    });
  }

  cancelResponse(id: number): void {
    this.assistantService.cancelResponse(id);
    this.responseCancel.emit(id);
  }

  retryResponse(id: number): void {
    const responseId = this.assistantService.retryResponse(id);
    if (responseId !== null) {
      this.responseRetry.emit({ previousId: id, responseId });
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

  submit(): void {
    const content = this.draft().trim();
    if (!content || this.isPending()) {
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
    this.close();
  }
}
