import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  JpButton,
  JpCard,
  JpLink,
  JpMedia,
  JpPageHeader,
  JpSplitPane,
  JpTable,
  JpTableRowDetail,
  normalizeJpTablePreferences,
  parseJpTablePreferences,
  type JpSortableTableColumn,
  type JpTablePreferences,
  type JpTableRowKey,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-advanced-layout-page',
  imports: [
    RouterLink,
    JpButton,
    JpCard,
    JpLink,
    JpMedia,
    JpPageHeader,
    JpSplitPane,
    JpTable,
    JpTableRowDetail,
  ],
  templateUrl: './advanced-layout.page.html',
  styleUrl: './advanced-layout.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedLayoutPage {
  private readonly doc = inject(DOCUMENT);
  readonly columns: JpSortableTableColumn[] = [
    {
      key: 'name',
      header: 'Service',
      width: 220,
      minWidth: 140,
      maxWidth: 480,
    },
    { key: 'owner', header: 'Owner', width: 190 },
    { key: 'region', header: 'Region', width: 240 },
    { key: 'status', header: 'Status', width: 190 },
  ];
  readonly rows = Array.from({ length: 16 }, (_, index) => ({
    id: 'service-' + index,
    name:
      ['API gateway', 'Background jobs', 'Search index', 'Asset service'][
        index % 4
      ] +
      ' ' +
      (index + 1),
    owner: index % 2 ? 'Platform' : 'Product',
    region: index % 2 ? 'eu-west-1' : 'us-east-1',
    status: index % 3 ? 'Healthy' : 'Review needed',
  }));
  readonly preferences = signal(
    normalizeJpTablePreferences(null, this.columns),
  );
  readonly expanded = signal<JpTableRowKey[]>([]);
  readonly selected = signal<JpTableRowKey[]>([]);
  readonly size = signal(35);
  readonly collapsed = signal(false);
  readonly mediaSource = signal('/media-preview.svg');
  readonly storageStatus = signal('Preferences are saved on this device.');
  readonly detailAction = signal('');
  constructor() {
    afterNextRender(() => {
      try {
        const storage = this.doc.defaultView?.localStorage;
        this.preferences.set(
          parseJpTablePreferences(
            storage?.getItem('jp-demo-table-v1') ?? null,
            this.columns,
          ),
        );
        const saved = storage?.getItem('jp-demo-split-v1');
        if (
          saved !== null &&
          saved !== undefined &&
          Number.isFinite(Number(saved))
        )
          this.size.set(Math.max(20, Math.min(70, Number(saved))));
      } catch {
        this.storageStatus.set(
          'Storage unavailable. Preferences apply for this session.',
        );
      }
    });
  }
  updatePreferences(patch: Partial<JpTablePreferences>): void {
    const next = normalizeJpTablePreferences(
      { ...this.preferences(), ...patch },
      this.columns,
    );
    this.preferences.set(next);
    try {
      this.doc.defaultView?.localStorage.setItem(
        'jp-demo-table-v1',
        JSON.stringify(next),
      );
    } catch {
      this.storageStatus.set(
        'Storage unavailable. Preferences apply for this session.',
      );
    }
  }
  resize(value: number): void {
    this.size.set(value);
    try {
      this.doc.defaultView?.localStorage.setItem(
        'jp-demo-split-v1',
        String(value),
      );
    } catch {
      this.storageStatus.set(
        'Storage unavailable. Preferences apply for this session.',
      );
    }
  }
  reset(): void {
    this.updatePreferences(normalizeJpTablePreferences(null, this.columns));
    this.resize(35);
    this.collapsed.set(false);
  }
}
