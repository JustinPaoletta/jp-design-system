import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injectable,
  inject,
  signal,
} from '@angular/core';
@Injectable({ providedIn: 'root' })
export class JpAnnouncer {
  readonly polite = signal('');
  readonly assertive = signal('');
  private timer: ReturnType<typeof setTimeout> | undefined;
  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());
  }
  /** Install one outlet. Clear/reinsert allows repeated identical messages. */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    this.clear();
    this.timer = setTimeout(() => {
      this.timer = undefined;
      (priority === 'assertive' ? this.assertive : this.polite).set(message);
    }, 50);
  }
  clear(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
    this.polite.set('');
    this.assertive.set('');
  }
}
@Component({
  selector: 'jp-live-announcer',
  templateUrl: './live-announcer.html',
  styleUrl: './live-announcer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpLiveAnnouncer {
  readonly announcer = inject(JpAnnouncer);
}
