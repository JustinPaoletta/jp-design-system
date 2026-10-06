import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import {
  JpButton,
  JpCard,
  JpPageHeader,
  JpTreeView,
  JpTreeTable,
  type JpTreeNode,
  type JpTreeTableRow,
  type JpTreeTableColumn,
} from '@jp-design-system/ui';

export const HIERARCHY_ASSETS: readonly JpTreeNode[] = [
  {
    key: 'brand',
    label: 'Brand assets',
    children: [
      {
        key: 'logos',
        label: 'Logos',
        children: [
          {
            key: 'wordmark',
            label: 'Wordmark.svg',
            description: 'Primary wordmark, vector file',
          },
          { key: 'symbol', label: 'Symbol.svg' },
        ],
      },
      { key: 'typography', label: 'Typography.pdf' },
    ],
  },
  {
    key: 'product',
    label: 'Product assets',
    children: [
      { key: 'icons', label: 'Icons.svg' },
      { key: 'illustrations', label: 'Illustrations.svg' },
    ],
  },
  {
    key: 'shared',
    label: 'Shared library',
    hasChildren: true,
    loadState: 'idle',
  },
  {
    key: 'archived',
    label: 'Archived assets',
    disabled: true,
    description: 'Access is restricted',
  },
];

export const HIERARCHY_PROJECTS: readonly JpTreeTableRow[] = [
  {
    key: 'website',
    label: 'Website launch',
    cells: { owner: 'Product', status: 'In progress', hours: 72 },
    children: [
      {
        key: 'design',
        label: 'Design',
        cells: { owner: 'Avery', status: 'In review', hours: 32 },
        children: [
          {
            key: 'landing',
            label: 'Landing page',
            cells: { owner: 'Avery', status: 'Done', hours: 12 },
          },
          {
            key: 'checkout',
            label: 'Checkout',
            cells: { owner: 'Morgan', status: 'In review', hours: 20 },
          },
        ],
      },
      {
        key: 'engineering',
        label: 'Engineering',
        cells: { owner: 'Sam', status: 'In progress', hours: 40 },
      },
    ],
  },
  {
    key: 'mobile',
    label: 'Mobile refresh',
    cells: { owner: 'Platform', status: 'Planned', hours: 48 },
    children: [
      {
        key: 'navigation',
        label: 'Navigation',
        cells: { owner: 'Jordan', status: 'Planned', hours: 24 },
      },
      {
        key: 'settings',
        label: 'Settings',
        cells: { owner: 'Jordan', status: 'Planned', hours: 24 },
      },
    ],
  },
  {
    key: 'legacy',
    label: 'Legacy migration',
    disabled: true,
    cells: { owner: 'Platform', status: 'Archived', hours: 0 },
  },
];

@Component({
  selector: 'app-hierarchy-page',
  imports: [JpButton, JpCard, JpPageHeader, JpTreeView, JpTreeTable],
  templateUrl: './hierarchy.page.html',
  styleUrl: './hierarchy.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchyPage {
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | null = null;
  private loadAttempts = 0;
  readonly assets = signal(HIERARCHY_ASSETS);
  readonly folders = signal<string[]>(['brand', 'logos']);
  readonly selectedAsset = signal<string | null>(null);
  readonly opened = signal('');
  readonly assetName = computed(() => {
    const find = (nodes: readonly JpTreeNode[]): string | null => {
      for (const node of nodes) {
        if (node.key === this.selectedAsset()) return node.label;
        const result = find(node.children ?? []);
        if (result) return result;
      }
      return null;
    };
    return find(this.assets()) ?? 'No asset selected';
  });
  readonly projects = HIERARCHY_PROJECTS;
  readonly columns: readonly JpTreeTableColumn[] = [
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status' },
    { key: 'hours', header: 'Hours', align: 'end' },
  ];
  readonly expandedProjects = signal<string[]>(['website']);
  readonly selectedProjects = signal<string[]>([]);
  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timer !== null) clearTimeout(this.timer);
    });
  }
  load(node: JpTreeNode): void {
    if (node.key !== 'shared' || node.loadState === 'loading') return;
    this.loadAttempts += 1;
    this.updateShared({ loadState: 'loading' });
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      if (this.loadAttempts === 1) this.updateShared({ loadState: 'error' });
      else
        this.updateShared({
          loadState: 'loaded',
          children: [
            { key: 'shared-colors', label: 'Color guidelines.pdf' },
            { key: 'shared-spacing', label: 'Spacing guidelines.pdf' },
          ],
        });
    }, 300);
  }
  private updateShared(patch: Partial<JpTreeNode>): void {
    this.assets.update((nodes) =>
      nodes.map((node) =>
        node.key === 'shared' ? { ...node, ...patch } : node,
      ),
    );
  }
}
