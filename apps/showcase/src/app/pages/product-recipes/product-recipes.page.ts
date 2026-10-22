import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  JpStack,
  JpCard,
  JpHeading,
  JpButton,
  JpInput,
  JpCombobox,
  JpRadioGroup,
  JpProgress,
  JpInlineAlert,
  JpTable,
  JpPagination,
  JpTableToolbar,
  JpTabs,
  JpTabPanel,
  JpBreadcrumbs,
  JpDialog,
  JpDialogActions,
  type JpTableSort,
  type JpTableRowKey,
  type JpTableCellValue,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-product-recipes-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JpStack,
    JpCard,
    JpHeading,
    JpButton,
    JpInput,
    JpCombobox,
    JpRadioGroup,
    JpProgress,
    JpInlineAlert,
    JpTable,
    JpPagination,
    JpTableToolbar,
    JpTabs,
    JpTabPanel,
    JpBreadcrumbs,
    JpDialog,
    JpDialogActions,
  ],
  templateUrl: './product-recipes.page.html',
  styleUrl: './product-recipes.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRecipesPage {
  private readonly destroyRef = inject(DestroyRef);
  private destroyed = false;
  private failNext = { save: true, refresh: true, delete: true };
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  readonly tab = signal('services');
  readonly tabs = [
    { value: 'services', label: 'Players' },
    { value: 'settings', label: 'Settings' },
  ];
  readonly breadcrumbs = [
    { label: 'Dashboard', href: '/layout-dashboard' },
    { label: 'Club workflows' },
  ];
  readonly regions = [
    { value: 'us', label: 'Pitcher' },
    { value: 'eu', label: 'Catcher' },
    { value: 'ap', label: 'Shortstop' },
  ];
  readonly plans = [
    { value: 'standard', label: 'Club member' },
    { value: 'priority', label: 'Season pass' },
  ];
  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    region: new FormControl('us', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    plan: new FormControl('standard', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  readonly saving = signal(false);
  readonly saveError = signal('');
  private readonly formValue = signal(this.form.getRawValue());
  readonly savedValue = signal<ReturnType<typeof this.form.getRawValue> | null>(
    null,
  );
  readonly saved = computed(() => {
    const saved = this.savedValue();
    const current = this.formValue();
    return (
      !!saved &&
      !this.saving() &&
      !this.saveError() &&
      saved.email === current.email &&
      saved.region === current.region &&
      saved.plan === current.plan
    );
  });
  readonly loading = signal(false);
  readonly loadError = signal('');
  readonly deleting = signal(false);
  readonly deleteError = signal('');
  readonly dialogOpen = signal(false);
  readonly search = signal('');
  readonly page = signal(1);
  readonly pageSize = 2;
  readonly selected = signal<readonly JpTableRowKey[]>([]);
  readonly sort = signal<JpTableSort | null>(null);
  readonly columns = [
    { key: 'name', header: 'Player', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
  ];
  readonly records = signal<Record<string, JpTableCellValue>[]>([
    { id: 'payments', name: 'Shane Baz', status: 'Available' },
    { id: 'search', name: 'Yandy Díaz', status: 'Day to day' },
    { id: 'billing', name: 'Taylor Walls', status: 'Available' },
    { id: 'events', name: 'Josh Lowe', status: 'Available' },
    { id: 'media', name: 'Shane McClanahan', status: 'Injured' },
  ]);
  readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    const rows = this.records().filter((row) =>
      String(row['name']).toLowerCase().includes(query),
    );
    const sort = this.sort();
    return sort
      ? [...rows].sort(
          (a, b) =>
            String(a[sort.key]).localeCompare(String(b[sort.key])) *
            (sort.direction === 'asc' ? 1 : -1),
        )
      : rows;
  });
  readonly visible = computed(() =>
    this.filtered().slice(
      (this.page() - 1) * this.pageSize,
      this.page() * this.pageSize,
    ),
  );
  readonly filters = computed(() =>
    this.search() ? [{ key: 'search', label: this.search() }] : [],
  );
  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formValue.set(this.form.getRawValue());
      });
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      for (const timer of this.timers) clearTimeout(timer);
    });
  }
  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }
  setSort(value: JpTableSort | null): void {
    this.sort.set(value);
    this.page.set(1);
  }
  private request(
    kind: 'save' | 'refresh' | 'delete',
    complete: (failed: boolean) => void,
  ): void {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (this.destroyed) return;
      const failed = this.failNext[kind];
      this.failNext[kind] = false;
      complete(failed);
    }, 500);
    this.timers.add(timer);
  }
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    const submittedValue = this.form.getRawValue();
    this.saving.set(true);
    this.saveError.set('');
    this.request('save', (failed) => {
      this.saving.set(false);
      this.saveError.set(
        failed
          ? 'Settings could not be saved. Your entries are preserved.'
          : '',
      );
      if (!failed) {
        this.savedValue.set(submittedValue);
        if (this.saved()) this.form.markAsPristine();
      }
    });
  }
  refresh(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.loadError.set('');
    this.request('refresh', (failed) => {
      this.loading.set(false);
      this.loadError.set(
        failed
          ? 'The roster could not be refreshed. Existing players remain available.'
          : '',
      );
    });
  }
  confirmDelete(): void {
    if (this.deleting() || !this.selected().length) return;
    this.deleting.set(true);
    this.deleteError.set('');
    this.request('delete', (failed) => {
      this.deleting.set(false);
      if (failed) {
        this.deleteError.set(
          'The selected players could not be removed. Try again.',
        );
        return;
      }
      const keys = new Set(this.selected());
      this.records.update((rows) =>
        rows.filter((row) => !keys.has(String(row['id']))),
      );
      this.selected.set([]);
      this.page.set(1);
      this.dialogOpen.set(false);
    });
  }
}
