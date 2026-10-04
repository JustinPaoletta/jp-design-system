import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpButton } from '../button/button';
import { JpIcon } from '../icon/icon';
@Component({
  selector: 'jp-copy-button',
  imports: [JpButton, JpIcon],
  templateUrl: './copy-button.html',
  styleUrl: './copy-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpCopyButton {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly messages = inject(JP_MESSAGES);
  readonly text = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input(this.messages.copy.action);
  readonly pendingLabel = input(this.messages.copy.pending);
  readonly successLabel = input(this.messages.copy.success);
  readonly failureLabel = input(this.messages.copy.failure);
  readonly copied = output<void>();
  readonly copyFailed = output<void>();
  readonly state = signal<'idle' | 'pending' | 'success' | 'failure'>('idle');
  private request = 0;
  constructor() {
    effect(() => {
      this.text();
      this.request++;
      this.state.set('idle');
    });
    inject(DestroyRef).onDestroy(() => this.request++);
  }
  async copy(): Promise<void> {
    if (this.disabled() || this.state() === 'pending') return;
    const text = this.text();
    const request = this.request;
    this.state.set('pending');
    try {
      const clipboard =
        this.host.nativeElement.ownerDocument.defaultView?.navigator.clipboard;
      if (!clipboard?.writeText) throw new Error('Clipboard unavailable');
      await clipboard.writeText(text);
      if (request !== this.request) return;
      this.state.set('success');
      this.copied.emit();
    } catch {
      if (request !== this.request) return;
      this.state.set('failure');
      this.copyFailed.emit();
    }
  }
}
