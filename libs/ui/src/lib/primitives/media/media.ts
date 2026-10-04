import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { inject } from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
/** Static image frame. Use native audio/video controls for playable media. */
@Component({
  selector: 'jp-media',
  templateUrl: './media.html',
  styleUrl: './media.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpMedia {
  private readonly messages = inject(JP_MESSAGES);
  readonly src = input.required<string>();
  /** Explicitly supply an empty alt only for a decorative image. */
  readonly alt = input.required<string>();
  readonly caption = input('');
  readonly aspectRatio = input(16 / 9);
  readonly fit = input<'cover' | 'contain'>('cover');
  readonly loading = input<'lazy' | 'eager'>('lazy');
  readonly srcset = input('');
  readonly sizes = input('');
  readonly loadingLabel = input(this.messages.media.loading);
  readonly errorLabel = input(this.messages.media.error);
  readonly loaded = output<void>();
  readonly failed = output<void>();
  private readonly state = signal<{
    src: string;
    phase: 'loaded' | 'failed';
  } | null>(null);
  readonly phase = computed(() =>
    this.state()?.src === this.src() ? this.state()?.phase : 'loading',
  );
  readonly ratio = computed(() =>
    Number.isFinite(this.aspectRatio()) && this.aspectRatio() > 0
      ? this.aspectRatio()
      : 16 / 9,
  );
  onLoad(event: Event): void {
    if ((event.target as HTMLImageElement).getAttribute('src') !== this.src())
      return;
    this.state.set({ src: this.src(), phase: 'loaded' });
    this.loaded.emit();
  }
  onError(event: Event): void {
    if ((event.target as HTMLImageElement).getAttribute('src') !== this.src())
      return;
    this.state.set({ src: this.src(), phase: 'failed' });
    this.failed.emit();
  }
}
