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
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import {
  indexJpTree,
  type JpTreeEntry,
  type JpTreeNode,
} from '../shared/tree-model';
import type { JpTableAlign, JpTableCellValue } from '../shared/primitive-types';

export interface JpTreeTableRow extends JpTreeNode {
  cells: Readonly<Record<string, JpTableCellValue>>;
  children?: readonly JpTreeTableRow[];
}
export interface JpTreeTableColumn {
  key: string;
  header: string;
  align?: JpTableAlign;
}

/** A native hierarchical data table, with ordinary buttons/checkboxes and Tab order. */
@Component({
  selector: 'jp-tree-table',
  templateUrl: './tree-table.html',
  styleUrl: './tree-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpTreeTable {
  readonly messages = inject(JP_MESSAGES);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly id = input.required<string>();
  readonly caption = input.required<string>();
  readonly nameHeader = input.required<string>();
  readonly columns = input<readonly JpTreeTableColumn[]>([]);
  readonly rows = input<readonly JpTreeTableRow[]>([]);
  readonly expandedKeys = input<readonly string[]>([]);
  readonly expandedKeysChange = output<string[]>();
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly selectedKeys = input<readonly string[]>([]);
  readonly selectedKeysChange = output<string[]>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly state = input<'ready' | 'loading' | 'error'>('ready');
  readonly retryRequested = output<void>();
  readonly index = computed(() => indexJpTree(this.rows()));
  readonly visible = computed(() => {
    const expanded = new Set(this.expandedKeys());
    return this.index().entries.filter((entry) =>
      entry.ancestors.every((key) => expanded.has(key)),
    );
  });
  readonly visibleKeys = computed(
    () => new Set(this.visible().map((entry) => entry.node.key)),
  );
  readonly colCount = computed(
    () => this.columns().length + 1 + Number(this.selectable()),
  );
  private previous = new Map<string, JpTreeEntry<JpTreeTableRow>>();
  private focusedKey: string | null = null;
  private focusedElement: HTMLElement | null = null;
  private hadFocus = false;

  constructor() {
    afterRenderEffect(() => {
      const index = this.index();
      const visible = this.visibleKeys();
      const key = this.focusedKey;
      if (key && !visible.has(key)) {
        const ancestors = this.previous.get(key)?.ancestors ?? [];
        const next =
          [...ancestors].reverse().find((value) => visible.has(value)) ??
          this.visible()[0]?.node.key ??
          null;
        const doc = this.host.nativeElement.ownerDocument;
        if (
          this.hadFocus &&
          (doc.activeElement === doc.body ||
            this.host.nativeElement.contains(doc.activeElement))
        )
          this.focusControl(next);
        this.focusedKey = next;
      }
      this.previous = index.byKey;
    });
  }
  rowId(key: string): string {
    return this.id() + '-row-' + encodeURIComponent(key);
  }
  expanded(key: string): boolean {
    return this.expandedKeys().includes(key);
  }
  branch(row: JpTreeTableRow): boolean {
    return !!row.children?.length;
  }
  unavailable(row: JpTreeTableRow): boolean {
    return this.disabled() || !!row.disabled;
  }
  selected(key: string): boolean {
    return this.selectedKeys().includes(key);
  }
  controls(row: JpTreeTableRow): string | null {
    return (
      row.children?.map((child) => this.rowId(child.key)).join(' ') || null
    );
  }
  parentPath(entry: JpTreeEntry<JpTreeTableRow>): string {
    return entry.ancestors
      .map((key) => this.index().byKey.get(key)?.node.label ?? '')
      .join(' / ');
  }
  display(value: JpTableCellValue): string {
    return value === null || value === undefined ? '—' : String(value);
  }
  toggle(row: JpTreeTableRow): void {
    if (this.unavailable(row) || !this.branch(row)) return;
    const expanded = new Set(this.expandedKeys());
    if (expanded.has(row.key)) {
      const key = this.focusedKey;
      if (key && this.index().byKey.get(key)?.ancestors.includes(row.key))
        this.focusControl(row.key);
      expanded.delete(row.key);
    } else expanded.add(row.key);
    this.expandedKeysChange.emit([...expanded]);
  }
  select(row: JpTreeTableRow, checked: boolean): void {
    if (!this.selectable() || this.unavailable(row)) return;
    const keys = new Set(this.selectedKeys());
    if (checked) keys.add(row.key);
    else keys.delete(row.key);
    this.selectedKeysChange.emit([...keys]);
  }
  onFocus(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    const row = target.closest<HTMLElement>('[data-tree-key]');
    if (!row) return;
    this.focusedKey = row.getAttribute('data-tree-key');
    this.focusedElement = target;
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
      this.visibleKeys().has(this.focusedKey ?? '')
    )
      this.hadFocus = false;
  }
  private focusControl(key: string | null): void {
    const row = key
      ? this.host.nativeElement.ownerDocument.getElementById(this.rowId(key))
      : null;
    const element =
      row?.querySelector<HTMLElement>('button:not(:disabled)') ??
      row?.querySelector<HTMLElement>('input:not(:disabled)');
    (
      element ?? this.host.nativeElement.querySelector<HTMLElement>('.frame')
    )?.focus();
  }
}
