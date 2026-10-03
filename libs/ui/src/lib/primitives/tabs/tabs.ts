import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  signal,
  TemplateRef,
  viewChildren,
} from '@angular/core';

export type JpTab = {
  value: string;
  label: string;
  disabled?: boolean;
};

/** Project panel content with <ng-template jpTabPanel="settings">. */
@Directive({ selector: 'ng-template[jpTabPanel]', standalone: true })
export class JpTabPanel {
  readonly value = input.required<string>({ alias: 'jpTabPanel' });
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

let nextTabsId = 0;

/** Horizontal tabs with manual activation: arrows focus; Enter/Space selects. */
@Component({
  selector: 'jp-tabs',
  imports: [NgTemplateOutlet],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'jp-tabs' },
})
export class JpTabs {
  private readonly generatedId = `jp-tabs-${++nextTabsId}`;
  private readonly buttons =
    viewChildren<ElementRef<HTMLButtonElement>>('tabButton');
  private readonly panels = contentChildren(JpTabPanel);
  private readonly focusedValue = signal<string | null>(null);

  /** Values must be unique; each tab should have a matching projected panel. */
  readonly tabs = input<readonly JpTab[]>([]);
  readonly ariaLabel = input('Tabs');
  /** Supply a stable id when rendering the same tabs on server and client. */
  readonly id = input(this.generatedId);
  readonly selectedValue = model('');
  readonly activeValue = computed(() => {
    const tabs = this.tabs();
    return (
      tabs.find((tab) => tab.value === this.selectedValue() && !tab.disabled)
        ?.value ??
      tabs.find((tab) => !tab.disabled)?.value ??
      null
    );
  });
  readonly rovingValue = computed(
    () =>
      this.tabs().find(
        (tab) => tab.value === this.focusedValue() && !tab.disabled,
      )?.value ?? this.activeValue(),
  );

  tabId(index: number): string {
    return `${this.id()}-tab-${index}`;
  }

  panelId(index: number): string {
    return `${this.id()}-panel-${index}`;
  }

  panelTemplate(value: string): TemplateRef<unknown> | null {
    return (
      this.panels().find((panel) => panel.value() === value)?.template ?? null
    );
  }

  select(tab: JpTab): void {
    if (tab.disabled) return;
    this.focusedValue.set(tab.value);
    this.selectedValue.set(tab.value);
  }

  onFocus(value: string): void {
    this.focusedValue.set(value);
  }

  onListFocusout(event: FocusEvent): void {
    const list = event.currentTarget as HTMLElement;
    if (!list.contains(event.relatedTarget as Node | null)) {
      this.focusedValue.set(null);
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const enabled = this.tabs()
      .map((tab, i) => (tab.disabled ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabled.length) return;
    const current = enabled.indexOf(index);
    let target: number;
    const element = event.currentTarget as HTMLElement;
    const rtl =
      element.ownerDocument.defaultView?.getComputedStyle(element).direction ===
      'rtl';
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft': {
        const forward = (event.key === 'ArrowRight') !== rtl;
        target =
          enabled[
            (current + (forward ? 1 : -1) + enabled.length) % enabled.length
          ];
        break;
      }
      case 'Home':
        target = enabled[0];
        break;
      case 'End':
        target = enabled[enabled.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    this.focusedValue.set(this.tabs()[target].value);
    this.buttons()[target]?.nativeElement.focus();
  }
}
