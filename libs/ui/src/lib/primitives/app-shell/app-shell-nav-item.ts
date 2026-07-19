import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { createStringUnionTransform } from '../shared/token-maps';

export const JP_APP_SHELL_NAV_ITEM_TAGS = ['a', 'button'] as const;

export type JpAppShellNavItemTag = (typeof JP_APP_SHELL_NAV_ITEM_TAGS)[number];

@Component({
  selector: 'jp-app-shell-nav-item',
  imports: [CommonModule],
  templateUrl: './app-shell-nav-item.html',
  styleUrl: './app-shell-nav-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-app-shell-nav-item',
    '[class.jp-app-shell-nav-item--active]': 'active()',
    '[class.jp-app-shell-nav-item--disabled]': 'disabled()',
  },
})
export class JpAppShellNavItem {
  readonly as = input<JpAppShellNavItemTag, unknown>('a', {
    transform: createStringUnionTransform(JP_APP_SHELL_NAV_ITEM_TAGS, 'a'),
  });

  readonly href = input<string | null>(null);

  readonly active = input(false, { transform: booleanAttribute });

  readonly disabled = input(false, { transform: booleanAttribute });

  readonly tag = computed(() => this.as());

  readonly resolvedHref = computed(() => {
    if (this.tag() !== 'a' || this.disabled()) {
      return null;
    }

    return this.href() ?? '#';
  });

  readonly ariaCurrent = computed(() =>
    this.active() && !this.disabled() ? 'page' : null,
  );

  readonly tabIndex = computed(() => (this.disabled() ? -1 : null));
}
