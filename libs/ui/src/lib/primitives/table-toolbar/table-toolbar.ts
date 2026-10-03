import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { JpButton } from '../button/button';

export interface JpTableFilter {
  key: string;
  label: string;
}

/** Project search, filters, and bulk actions; the consumer owns their state. */
@Component({
  selector: 'jp-table-toolbar',
  imports: [JpButton],
  templateUrl: './table-toolbar.html',
  styleUrl: './table-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpTableToolbar {
  readonly label = input('Table controls');
  readonly activeFilters = input<readonly JpTableFilter[]>([]);
  readonly selectedCount = input(0);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly removeFilter = output<string>();
  readonly clearFilters = output<void>();
  remove(key: string): void {
    if (!this.disabled()) this.removeFilter.emit(key);
  }
  clear(): void {
    if (!this.disabled()) this.clearFilters.emit();
  }
}
