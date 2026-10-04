import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpDialog } from '../dialog/dialog';
import { JpKeyboardHint } from '../keyboard-hint/keyboard-hint';
export interface JpCommand {
  id: string;
  label: string;
  description?: string;
  section?: string;
  keywords?: readonly string[];
  shortcut?: readonly string[];
  disabled?: boolean;
}
let nextPalette = 0;
@Component({
  selector: 'jp-command-palette',
  imports: [JpDialog, JpKeyboardHint],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onShortcut($event)' },
})
export class JpCommandPalette {
  private readonly messages = inject(JP_MESSAGES);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly search = viewChild<ElementRef<HTMLInputElement>>('search');
  private wasOpen = false;
  readonly prefix = 'jp-command-' + ++nextPalette;
  readonly open = input(false, { transform: booleanAttribute });
  readonly shortcutEnabled = input(false, { transform: booleanAttribute });
  readonly title = input(this.messages.commands.title);
  readonly searchLabel = input(this.messages.commands.search);
  readonly emptyText = input(this.messages.commands.empty);
  readonly commands = input<readonly JpCommand[]>([]);
  readonly openChange = output<boolean>();
  readonly commandSelected = output<string>();
  readonly query = signal('');
  readonly active = signal('');
  readonly groups = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    const map = new Map<string, JpCommand[]>();
    for (const command of this.commands()) {
      if (
        query &&
        ![command.label, command.description ?? '', ...(command.keywords ?? [])]
          .join(' ')
          .toLocaleLowerCase()
          .includes(query)
      )
        continue;
      const group = command.section ?? '';
      const items = map.get(group) ?? [];
      items.push(command);
      map.set(group, items);
    }
    return Array.from(map, ([label, items]) => ({ label, items }));
  });
  readonly filtered = computed(() => this.groups().flatMap((g) => g.items));
  readonly activeId = computed(() =>
    this.filtered().some((c) => c.id === this.active() && !c.disabled)
      ? this.optionId(this.active())
      : null,
  );
  constructor() {
    effect(() => {
      const open = this.open();
      const items = this.filtered();
      this.query();
      this.active.set(open ? (items.find((c) => !c.disabled)?.id ?? '') : '');
    });
    afterRenderEffect(() => {
      const open = this.open();
      if (open && !this.wasOpen) this.search()?.nativeElement.focus();
      this.wasOpen = open;
    });
  }
  optionId(id: string): string {
    return this.prefix + '-' + encodeURIComponent(id);
  }
  close(): void {
    this.openChange.emit(false);
    this.query.set('');
  }
  choose(command: JpCommand): void {
    if (command.disabled || !this.open()) return;
    this.close();
    this.commandSelected.emit(command.id);
  }
  searchInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
  keydown(event: KeyboardEvent): void {
    const items = this.filtered().filter((c) => !c.disabled);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!items.length) return;
      const current = items.findIndex((c) => c.id === this.active());
      const index =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? items.length - 1
            : event.key === 'ArrowDown'
              ? (current + 1) % items.length
              : (current - 1 + items.length) % items.length;
      this.active.set(items[index].id);
      this.host.nativeElement.ownerDocument
        .getElementById(this.optionId(items[index].id))
        ?.scrollIntoView?.({ block: 'nearest' });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = items.find((c) => c.id === this.active());
      if (command) this.choose(command);
    }
  }
  onShortcut(event: KeyboardEvent): void {
    if (
      !this.shortcutEnabled() ||
      event.defaultPrevented ||
      this.open() ||
      !(event.ctrlKey || event.metaKey || event.altKey)
    )
      return;
    if (
      event.target instanceof Element &&
      event.target.closest(
        'input,textarea,select,[contenteditable]:not([contenteditable="false"])',
      )
    )
      return;
    if (
      (event.ctrlKey || event.metaKey) &&
      !event.altKey &&
      !event.shiftKey &&
      event.key.toLowerCase() === 'k'
    ) {
      event.preventDefault();
      this.openChange.emit(true);
      return;
    }
    const command = this.commands().find(
      (command) =>
        !command.disabled &&
        this.matchesShortcut(event, command.shortcut ?? []),
    );
    if (command) {
      event.preventDefault();
      this.commandSelected.emit(command.id);
    }
  }
  private matchesShortcut(
    event: KeyboardEvent,
    keys: readonly string[],
  ): boolean {
    if (keys.length < 2) return false;
    const modifiers = new Set(
      keys.slice(0, -1).map((key) => key.toLowerCase()),
    );
    if (
      [...modifiers].some(
        (key) =>
          ![
            'mod',
            'control',
            'ctrl',
            'meta',
            'command',
            'alt',
            'option',
            'shift',
          ].includes(key),
      )
    )
      return false;
    const mod = modifiers.has('mod');
    const control = modifiers.has('control') || modifiers.has('ctrl');
    const meta = modifiers.has('meta') || modifiers.has('command');
    if (
      mod
        ? !(event.ctrlKey || event.metaKey)
        : event.ctrlKey !== control || event.metaKey !== meta
    )
      return false;
    return (
      event.altKey === (modifiers.has('alt') || modifiers.has('option')) &&
      event.shiftKey === modifiers.has('shift') &&
      event.key.toLowerCase() === keys[keys.length - 1].toLowerCase()
    );
  }
}
