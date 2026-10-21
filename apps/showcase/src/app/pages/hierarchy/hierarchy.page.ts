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
    label: 'Club documents',
    children: [
      {
        key: 'logos',
        label: 'Lineup sheets',
        children: [
          {
            key: 'wordmark',
            label: 'Lineup.svg',
            description: 'Starting lineup, vector file',
          },
          { key: 'symbol', label: 'Field.svg' },
        ],
      },
      { key: 'typography', label: 'Club-rules.pdf' },
    ],
  },
  {
    key: 'product',
    label: 'Game documents',
    children: [
      { key: 'icons', label: 'Field-positions.svg' },
      { key: 'illustrations', label: 'Field-diagram.svg' },
    ],
  },
  {
    key: 'shared',
    label: 'Training guides',
    hasChildren: true,
    loadState: 'idle',
  },
  {
    key: 'archived',
    label: 'Previous season',
    disabled: true,
    description: 'Access is restricted',
  },
];

export const HIERARCHY_PROJECTS: readonly JpTreeTableRow[] = [
  {
    key: 'website',
    label: '2024 Dodgers',
    cells: { owner: 'Dave Roberts', status: 'Available', hours: 26 },
    children: [
      {
        key: 'design',
        label: 'Position players',
        cells: { owner: 'Freddie Freeman', status: 'Available', hours: 13 },
        children: [
          {
            key: 'landing',
            label: 'Infield',
            cells: { owner: 'Freddie Freeman', status: 'Available', hours: 5 },
          },
          {
            key: 'checkout',
            label: 'Outfield',
            cells: { owner: 'Mookie Betts', status: 'Available', hours: 5 },
          },
          {
            key: 'catchers',
            label: 'Catchers',
            cells: { owner: 'Will Smith', status: 'Available', hours: 2 },
          },
          {
            key: 'dh',
            label: 'Designated hitter',
            cells: { owner: 'Shohei Ohtani', status: 'Available', hours: 1 },
          },
        ],
      },
      {
        key: 'engineering',
        label: 'Pitchers',
        cells: { owner: 'Jack Flaherty', status: 'Available', hours: 13 },
      },
    ],
  },
  {
    key: 'legacy',
    label: 'Injured list',
    disabled: true,
    cells: { owner: 'Clayton Kershaw', status: 'Injured', hours: 1 },
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
    return find(this.assets()) ?? 'No club document selected';
  });
  readonly projects = HIERARCHY_PROJECTS;
  readonly columns: readonly JpTreeTableColumn[] = [
    { key: 'owner', header: 'Lead' },
    { key: 'status', header: 'Status' },
    { key: 'hours', header: 'Players', align: 'end' },
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
            { key: 'shared-colors', label: 'Uniform-guide.pdf' },
            { key: 'shared-spacing', label: 'Field-guide.pdf' },
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
