import { JpIcon } from '../icon/icon';
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
import {
  JpAssistantService,
  type JpAssistantResponseMessage,
} from './assistant.service';

const ASSISTANT_MOBILE_MEDIA = '(max-width: 48rem)';

let nextAssistantPanelId = 0;

@Component({
  selector: 'jp-assistant-panel',
  imports: [
    JpIcon,
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
    '[attr.title]': 'null',
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
  private readonly surfaceRef = viewChild<ElementRef<HTMLElement>>('surface');
  private readonly conversationRef =
    viewChild<ElementRef<HTMLElement>>('conversation');
  private readonly messageListRef =
    viewChild<ElementRef<HTMLElement>>('messageList');
  private followingConversation = true;
  private previousMessages: readonly JpAssistantResponseMessage[] | null = null;
  private firstMessageId: number | undefined;
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
  readonly conversationLabel = input(this.jpMessages.assistant.conversation);
  readonly newMessagesLabel = input(this.jpMessages.assistant.newMessages);
  readonly hasNewMessages = signal(false);
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
      const mobile = this.isMobileViewport();

      if (open && !this.lastOpen) {
        this.previousFocus = document.activeElement as HTMLElement | null;
        composer?.focus();
      } else if (
        open &&
        mobile &&
        !this.surfaceRef()?.nativeElement.contains(document.activeElement)
      ) {
        composer?.focus();
      }

      if (!open && this.lastOpen) {
        this.previousFocus?.focus();
        this.previousFocus = null;
      }

      this.lastOpen = open;
    });

    afterRenderEffect(() => {
      const messages = this.messages();
      const log = this.conversationRef()?.nativeElement;
      if (!this.isOpen() || !log) return;
      const changed = this.previousMessages !== messages;
      const firstId = messages[0]?.id;
      if (
        this.firstMessageId !== undefined &&
        firstId !== this.firstMessageId
      ) {
        this.followingConversation = true;
      }
      this.firstMessageId = firstId;
      this.previousMessages = messages;
      if (!messages.length) {
        log.scrollTop = 0;
        this.followingConversation = true;
        this.hasNewMessages.set(false);
      } else if (this.followingConversation) {
        this.scrollConversationToEnd();
      } else if (changed) {
        this.hasNewMessages.set(true);
      }
    });

    afterRenderEffect((onCleanup) => {
      const log = this.conversationRef()?.nativeElement;
      const list = this.messageListRef()?.nativeElement;
      if (!log || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => {
        if (this.isOpen() && this.followingConversation)
          this.scrollConversationToEnd();
      });
      observer.observe(log);
      if (list) observer.observe(list);
      onCleanup(() => observer.disconnect());
    });
  }

  onConversationScroll(): void {
    const log = this.conversationRef()?.nativeElement;
    if (!log) return;
    this.followingConversation =
      log.scrollHeight - log.clientHeight - log.scrollTop <= 48;
    if (this.followingConversation) this.hasNewMessages.set(false);
  }

  showLatestMessages(): void {
    this.followingConversation = true;
    this.scrollConversationToEnd();
    this.conversationRef()?.nativeElement.focus({ preventScroll: true });
  }

  private scrollConversationToEnd(): void {
    const log = this.conversationRef()?.nativeElement;
    if (log) log.scrollTop = Math.max(0, log.scrollHeight - log.clientHeight);
    this.hasNewMessages.set(false);
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
    const composer = event.target as HTMLTextAreaElement;
    this.draft.set(composer.value);
    this.resizeComposer(composer);
  }

  onComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
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
      this.resizeComposer(composer);
    }
  }

  private resizeComposer(composer: HTMLTextAreaElement): void {
    composer.style.height = 'auto';
    composer.style.height = `${composer.scrollHeight}px`;
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
