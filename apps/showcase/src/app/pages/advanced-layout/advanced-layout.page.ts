import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT, LowerCasePipe } from '@angular/common';
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
    LowerCasePipe,
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
      header: 'Player',
      width: 220,
      minWidth: 140,
      maxWidth: 480,
    },
    { key: 'owner', header: 'Manager', width: 190 },
    { key: 'region', header: 'Position', width: 240 },
    { key: 'status', header: 'Status', width: 190 },
  ];
  readonly rows = [
    ['Shane Baz', 'Pitcher', 'Available'],
    ['Yandy Díaz', 'First base', 'Day to day'],
    ['Taylor Walls', 'Shortstop', 'Available'],
    ['Josh Lowe', 'Right field', 'Available'],
    ['Shane McClanahan', 'Pitcher', 'Injured'],
    ['Ben Rortvedt', 'Catcher', 'Available'],
    ['Junior Caminero', 'Designated hitter', 'Available'],
    ['Kameron Misner', 'Left field', 'Available'],
    ['Jonny DeLuca', 'Center field', 'Available'],
    ['Brandon Lowe', 'Second base', 'Available'],
    ['Curtis Mead', 'Third base', 'Available'],
    ['Logan Driscoll', 'Catcher', 'Bench'],
    ['Taj Bradley', 'Pitcher', 'Available'],
    ['Ryan Pepiot', 'Pitcher', 'Available'],
    ['Pete Fairbanks', 'Pitcher', 'Available'],
    ['Jose Caballero', 'Shortstop', 'Available'],
  ].map(([name, region, status], index) => ({
    id: 'service-' + index,
    name,
    owner: 'Kevin Cash',
    region,
    status,
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
