import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
/** Original JP outline glyphs, drawn on a 16-unit grid. */
export const JP_ICON_PATHS = {
  check: 'M3 8.5l3 3L13 4',
  close: 'M4 4l8 8M12 4l-8 8',
  search: 'M10.8 10.8l3.4 3.4M12 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  'chevron-down': 'M3.5 6l4.5 4 4.5-4',
  'chevron-right': 'M6 3.5l4 4.5-4 4.5',
  plus: 'M8 3v10M3 8h10',
  minus: 'M3 8h10',
  info: 'M8 7.5v4M8 4.5h.01M14 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0',
  warning: 'M8 2L1.5 14h13L8 2zM8 6v4M8 12h.01',
  user: 'M2.5 14v-1a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v1M10.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0',
  copy: 'M6.5 6.5h7v7h-7zM9.5 4V2.5h-7v7H4',
  'external-link': 'M10 2.5h3.5V6M13.5 2.5L7 9M7 2.5H2.5v11h11V9',
} as const;
export type JpIconName = keyof typeof JP_ICON_PATHS;
@Component({
  selector: 'jp-icon',

  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpIcon {
  readonly name = input.required<JpIconName>();
  readonly size = input<'sm' | 'md' | 'lg'>('lg');
  /** Empty labels make icons decorative. Name actions on their containing control. */
  readonly label = input('');
  readonly path = computed(() => JP_ICON_PATHS[this.name()]);
  readonly dimension = computed(() => `var(--jp-size-icon-${this.size()})`);
}
