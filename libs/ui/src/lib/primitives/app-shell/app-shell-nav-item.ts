import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  inject,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { createStringUnionTransform } from '../shared/token-maps';
import { JpAppShell } from './app-shell';
import { JpTooltip } from '../tooltip/tooltip';

export const JP_APP_SHELL_NAV_ITEM_TAGS = ['a', 'button'] as const;

export type JpAppShellNavItemTag = (typeof JP_APP_SHELL_NAV_ITEM_TAGS)[number];

@Component({
  selector: 'jp-app-shell-nav-item',
  imports: [NgTemplateOutlet, JpTooltip],
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
  private readonly shell = inject(JpAppShell, { optional: true });
  private readonly labelRef = viewChild<ElementRef<HTMLElement>>('navLabel');
  readonly tooltipLabel = signal('');
  readonly collapsedHint = computed(
    () => this.shell?.sidebarCollapsed() && !this.shell?.isMobileViewport(),
  );
  constructor() {
    afterRenderEffect((onCleanup) => {
      const label = this.labelRef()?.nativeElement;
      if (!label) return;
      const update = () =>
        this.tooltipLabel.set(label.textContent?.trim() ?? '');
      update();
      const observer = new MutationObserver(update);
      observer.observe(label, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      onCleanup(() => observer.disconnect());
    });
  }
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
