import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpButton } from '../button/button';

/** Controlled, one-based pagination; fetch and slice data in the consumer. */
@Component({
  selector: 'jp-pagination',
  imports: [JpButton],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpPagination {
  private readonly messages = inject(JP_MESSAGES);
  readonly page = input(1);
  readonly pageSize = input(10);
  readonly total = input(0);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input(this.messages.pagination.label);
  readonly pageChange = output<number>();
  readonly safeSize = computed(() =>
    Number.isFinite(this.pageSize())
      ? Math.max(1, Math.floor(this.pageSize()))
      : 10,
  );
  readonly safeTotal = computed(() =>
    Number.isFinite(this.total()) ? Math.max(0, Math.floor(this.total())) : 0,
  );
  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.safeTotal() / this.safeSize())),
  );
  readonly currentPage = computed(() =>
    Number.isFinite(this.page())
      ? Math.min(this.pageCount(), Math.max(1, Math.floor(this.page())))
      : 1,
  );
  readonly start = computed(() =>
    this.safeTotal() === 0 ? 0 : (this.currentPage() - 1) * this.safeSize() + 1,
  );
  readonly end = computed(() =>
    Math.min(this.currentPage() * this.safeSize(), this.safeTotal()),
  );

  goTo(page: number): void {
    if (
      !Number.isInteger(page) ||
      this.disabled() ||
      page < 1 ||
      page > this.pageCount() ||
      page === this.currentPage()
    )
      return;
    this.pageChange.emit(page);
  }
}
