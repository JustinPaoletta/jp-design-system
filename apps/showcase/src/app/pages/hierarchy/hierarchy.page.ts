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
    label: 'Season preparation',
    cells: { owner: 'Sam Rivera', status: 'In training', hours: 72 },
    children: [
      {
        key: 'design',
        label: 'Batting drills',
        cells: { owner: 'Casey Brooks', status: 'Coach review', hours: 32 },
        children: [
          {
            key: 'landing',
            label: 'Batting order',
            cells: { owner: 'Casey Brooks', status: 'Done', hours: 12 },
          },
          {
            key: 'checkout',
            label: 'Base running',
            cells: { owner: 'Alex Morgan', status: 'Coach review', hours: 20 },
          },
        ],
      },
      {
        key: 'engineering',
        label: 'Pitching drills',
        cells: { owner: 'Sam Rivera', status: 'In training', hours: 40 },
      },
    ],
  },
  {
    key: 'mobile',
    label: 'Fielding drills',
    cells: { owner: 'Sam Rivera', status: 'Planned', hours: 48 },
    children: [
      {
        key: 'navigation',
        label: 'Outfield routes',
        cells: { owner: 'Jordan Davis', status: 'Planned', hours: 24 },
      },
      {
        key: 'settings',
        label: 'Infield throws',
        cells: { owner: 'Jordan Davis', status: 'Planned', hours: 24 },
      },
    ],
  },
  {
    key: 'legacy',
    label: 'Last season review',
    disabled: true,
    cells: { owner: 'Sam Rivera', status: 'Archived', hours: 0 },
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
    { key: 'hours', header: 'Minutes', align: 'end' },
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
