import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'jp-avatar',

  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpAvatar {
  readonly name = input.required<string>();
  readonly src = input('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly failed = signal(false);
  readonly initials = computed(() => {
    const words = this.name().trim().split(/\s+/).filter(Boolean);
    return (
      (Array.from(words[0] ?? '')[0] ?? '') +
      (words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? '') : '')
    );
  });
  constructor() {
    effect(() => {
      this.src();
      this.failed.set(false);
    });
  }
}
