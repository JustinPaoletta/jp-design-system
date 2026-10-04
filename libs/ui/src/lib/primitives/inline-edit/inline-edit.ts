import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
export type JpInlineSave = (
  value: string,
  signal: AbortSignal,
) => Promise<void>;
@Component({
  selector: 'jp-inline-edit',
  templateUrl: './inline-edit.html',
  styleUrl: './inline-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpInlineEdit {
  private readonly messages = inject(JP_MESSAGES);
  private readonly injector = inject(Injector);
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  private readonly editButton =
    viewChild<ElementRef<HTMLButtonElement>>('editButton');
  private controller?: AbortController;
  private version = 0;
  private acceptedValue: string | null = null;
  readonly label = input.required<string>();
  readonly value = input('');
  readonly save = input.required<JpInlineSave>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly maxLength = input<number | null>(null);
  readonly validate = input<(value: string) => string>(() => '');
  readonly editLabel = input(this.messages.inlineEdit.edit);
  readonly saveLabel = input(this.messages.inlineEdit.save);
  readonly cancelLabel = input(this.messages.inlineEdit.cancel);
  readonly savingLabel = input(this.messages.inlineEdit.saving);
  readonly savedLabel = input(this.messages.inlineEdit.saved);
  readonly failureLabel = input(this.messages.inlineEdit.failed);
  readonly emptyLabel = input(this.messages.inlineEdit.empty);
  readonly valueChange = output<string>();
  readonly editing = signal(false);
  readonly pending = signal(false);
  readonly draft = signal('');
  readonly error = signal('');
  readonly feedback = signal('');
  private readonly idValue =
    'jp-inline-' + Math.random().toString(36).slice(2, 9);
  readonly fieldId = this.idValue;
  constructor() {
    inject(DestroyRef).onDestroy(() => this.abort());
    effect(() => {
      const value = this.value();
      if (value === this.acceptedValue) {
        this.acceptedValue = null;
        this.draft.set(value);
        return;
      }
      this.abort();
      this.draft.set(value);
      this.editing.set(false);
      this.error.set('');
      this.feedback.set('');
    });
    effect(() => {
      if (this.disabled()) {
        this.abort();
        this.editing.set(false);
      }
    });
  }
  private abort(): void {
    this.version++;
    this.controller?.abort();
    this.controller = undefined;
    this.pending.set(false);
  }
  private focusEdit(): void {
    afterNextRender(() => this.editButton()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }
  edit(): void {
    if (this.disabled()) return;
    this.draft.set(this.value());
    this.error.set('');
    this.feedback.set('');
    this.editing.set(true);
    afterNextRender(() => this.field()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }
  cancel(): void {
    this.abort();
    this.draft.set(this.value());
    this.editing.set(false);
    this.error.set('');
    this.feedback.set('');
    this.focusEdit();
  }
  input(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }
  keydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.cancel();
    }
  }
  async commit(): Promise<void> {
    if (this.disabled() || this.pending() || !this.editing()) return;
    const field = this.field()?.nativeElement;
    const error = this.validate()(this.draft());
    if (error || (field && !field.checkValidity())) {
      this.error.set(error || field?.validationMessage || this.failureLabel());
      field?.focus();
      return;
    }
    this.abort();
    const version = this.version,
      controller = new AbortController();
    this.controller = controller;
    this.pending.set(true);
    this.error.set('');
    const next = this.draft();
    try {
      await this.save()(next, controller.signal);
      if (controller.signal.aborted || version !== this.version) return;
      this.pending.set(false);
      this.controller = undefined;
      this.acceptedValue = next;
      this.editing.set(false);
      this.feedback.set(this.savedLabel());
      this.valueChange.emit(next);
      this.focusEdit();
    } catch {
      if (controller.signal.aborted || version !== this.version) return;
      this.pending.set(false);
      this.controller = undefined;
      this.error.set(this.failureLabel());
      afterNextRender(() => this.field()?.nativeElement.focus(), {
        injector: this.injector,
      });
    }
  }
}
