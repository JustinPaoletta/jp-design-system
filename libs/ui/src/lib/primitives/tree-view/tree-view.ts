import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import {
  indexJpTree,
  jpTreeHasChildren,
  type JpTreeEntry,
  type JpTreeNode,
} from '../shared/tree-model';

export type { JpTreeNode, JpTreeLoadState } from '../shared/tree-model';
export type JpTreeSelection = 'single' | 'none';

@Component({
  selector: 'jp-tree-view',
  imports: [NgTemplateOutlet],
  templateUrl: './tree-view.html',
  styleUrl: './tree-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpTreeView {
  readonly messages = inject(JP_MESSAGES).tree;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly nodes = input<readonly JpTreeNode[]>([]);
  readonly expandedKeys = input<readonly string[]>([]);
  readonly expandedKeysChange = output<string[]>();
  readonly selection = input<JpTreeSelection>('single');
  readonly selectedKey = input<string | null>(null);
  readonly selectedKeyChange = output<string | null>();
  readonly activated = output<JpTreeNode>();
  readonly loadRequested = output<JpTreeNode>();
  readonly retryRequested = output<void>();
  readonly state = input<'ready' | 'loading' | 'error'>('ready');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly index = computed(() => indexJpTree(this.nodes()));
  readonly visible = computed(() => {
    const expanded = new Set(this.expandedKeys());
    return this.index().entries.filter((entry) =>
      entry.ancestors.every((key) => expanded.has(key)),
    );
  });
  readonly busy = computed(
    () =>
      this.state() === 'loading' ||
      this.visible().some((entry) => entry.node.loadState === 'loading'),
  );
  private readonly focusedKey = signal<string | null>(null);
  readonly tabKey = computed(() => {
    const rows = this.visible();
    return (
      rows.find((entry) => entry.node.key === this.focusedKey())?.node.key ??
      rows.find((entry) => entry.node.key === this.selectedKey())?.node.key ??
      rows[0]?.node.key ??
      null
    );
  });
  private previous = new Map<string, JpTreeEntry<JpTreeNode>>();
  private focusedElement: HTMLElement | null = null;
  private hadFocus = false;
  private typeBuffer = '';
  private typedAt = 0;

  constructor() {
    afterRenderEffect(() => {
      const rows = this.visible();
      const index = this.index();
      const oldKey = this.focusedKey();
      if (oldKey && !rows.some((entry) => entry.node.key === oldKey)) {
        const ancestors = this.previous.get(oldKey)?.ancestors ?? [];
        const next =
          [...ancestors]
            .reverse()
            .find((key) => rows.some((entry) => entry.node.key === key)) ??
          rows[0]?.node.key ??
          null;
        this.focusedKey.set(next);
        const doc = this.host.nativeElement.ownerDocument;
        if (
          this.hadFocus &&
          (doc.activeElement === doc.body ||
            this.host.nativeElement.contains(doc.activeElement))
        )
          this.focus(next);
      }
      this.previous = index.byKey;
    });
  }

  entry(key: string): JpTreeEntry<JpTreeNode> {
    const entry = this.index().byKey.get(key);
    if (!entry) throw new Error('Unknown hierarchy key.');
    return entry;
  }
  itemId(key: string): string {
    return this.id() + '-node-' + encodeURIComponent(key);
  }
  expanded(key: string): boolean {
    return this.expandedKeys().includes(key);
  }
  branch(node: JpTreeNode): boolean {
    return jpTreeHasChildren(node);
  }
  unavailable(node: JpTreeNode): boolean {
    return this.disabled() || !!node.disabled;
  }
  selected(node: JpTreeNode): boolean {
    return this.selection() === 'single' && this.selectedKey() === node.key;
  }

  onFocus(event: FocusEvent, key: string): void {
    if (event.target !== event.currentTarget) return;
    this.focusedKey.set(key);
    this.focusedElement = event.target as HTMLElement;
    this.hadFocus = true;
  }
  onFocusOut(event: FocusEvent): void {
    if (
      event.relatedTarget &&
      !this.host.nativeElement.contains(event.relatedTarget as Node)
    )
      this.hadFocus = false;
    else if (
      !event.relatedTarget &&
      this.focusedElement?.isConnected &&
      this.visible().some((entry) => entry.node.key === this.focusedKey())
    )
      this.hadFocus = false;
  }
  private focus(key: string | null): void {
    this.focusedKey.set(key);
    const target = key
      ? this.host.nativeElement.ownerDocument.getElementById(this.itemId(key))
      : this.host.nativeElement.querySelector<HTMLElement>('[role=tree]');
    target?.focus();
  }
  toggle(node: JpTreeNode, force?: boolean): void {
    if (this.unavailable(node) || !this.branch(node)) return;
    const expanded = new Set(this.expandedKeys());
    const open = force ?? !expanded.has(node.key);
    if (open === expanded.has(node.key)) return;
    if (open) expanded.add(node.key);
    else {
      expanded.delete(node.key);
      const active = this.host.nativeElement.ownerDocument.activeElement;
      if (
        this.host.nativeElement.ownerDocument
          .getElementById(this.itemId(node.key))
          ?.contains(active)
      )
        this.focus(node.key);
    }
    this.expandedKeysChange.emit([...expanded]);
    if (
      open &&
      node.hasChildren &&
      !node.children?.length &&
      (!node.loadState || node.loadState === 'idle')
    )
      this.loadRequested.emit(node);
  }
  retry(node: JpTreeNode, event?: Event): void {
    event?.stopPropagation();
    if (this.unavailable(node) || node.loadState !== 'error') return;
    this.focus(node.key);
    this.loadRequested.emit(node);
  }
  activate(node: JpTreeNode, action = true): void {
    if (this.unavailable(node)) return;
    if (this.selection() === 'single') this.selectedKeyChange.emit(node.key);
    if (action) this.activated.emit(node);
  }
  clickNode(node: JpTreeNode): void {
    this.focus(node.key);
    this.activate(node);
  }
  clickItem(event: MouseEvent, node: JpTreeNode): void {
    if (
      (event.target as HTMLElement).closest('[role=treeitem]') !==
      event.currentTarget
    )
      return;
    this.clickNode(node);
  }
  clickDisclosure(node: JpTreeNode, event: Event): void {
    event.stopPropagation();
    this.focus(node.key);
    this.toggle(node);
  }
  onKey(event: KeyboardEvent, key: string): void {
    if (
      event.target !== event.currentTarget ||
      event.altKey ||
      event.metaKey ||
      event.ctrlKey
    )
      return;
    const rows = this.visible();
    const position = rows.findIndex((entry) => entry.node.key === key);
    const entry = rows[position];
    if (!entry) return;
    const rtl =
      this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(
        this.host.nativeElement,
      ).direction === 'rtl';
    const openKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const closeKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === 'ArrowDown')
      this.focus(rows[Math.min(position + 1, rows.length - 1)].node.key);
    else if (event.key === 'ArrowUp')
      this.focus(rows[Math.max(position - 1, 0)].node.key);
    else if (event.key === 'Home') this.focus(rows[0].node.key);
    else if (event.key === 'End')
      this.focus(rows[rows.length - 1]?.node.key ?? null);
    else if (event.key === openKey) {
      if (this.branch(entry.node) && !this.expanded(key))
        this.toggle(entry.node, true);
      else if (this.expanded(key) && rows[position + 1]?.parentKey === key)
        this.focus(rows[position + 1].node.key);
    } else if (event.key === closeKey) {
      if (this.branch(entry.node) && this.expanded(key))
        this.toggle(entry.node, false);
      else if (entry.parentKey) this.focus(entry.parentKey);
    } else if (event.key === 'Enter') {
      if (entry.node.loadState === 'error' && this.expanded(key))
        this.retry(entry.node);
      else this.activate(entry.node);
    } else if (event.key === ' ') {
      if (this.selection() === 'single') this.activate(entry.node, false);
      else this.toggle(entry.node);
    } else if (event.key.length === 1) {
      const now = Date.now();
      this.typeBuffer =
        now - this.typedAt > 700
          ? event.key.toLocaleLowerCase()
          : this.typeBuffer + event.key.toLocaleLowerCase();
      this.typedAt = now;
      const text = [...this.typeBuffer].every(
        (char) => char === this.typeBuffer[0],
      )
        ? this.typeBuffer[0]
        : this.typeBuffer;
      const match = [
        ...rows.slice(position + 1),
        ...rows.slice(0, position + 1),
      ].find((row) => row.node.label.toLocaleLowerCase().startsWith(text));
      if (match) this.focus(match.node.key);
    } else return;
    event.preventDefault();
    event.stopPropagation();
  }
}
