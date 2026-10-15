import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  JpButton,
  JpInput,
  JpCheckbox,
  JpDatePicker,
  JpDateRangePicker,
  JpTimePicker,
  JpErrorSummary,
  JpInlineAlert,
  JpTable,
  JpDialog,
  JpDialogActions,
  type JpDateRangeValue,
  type JpFieldError,
  type JpTableRowKey,
  type JpTableSort,
} from '@jp-design-system/ui';
import { ConsumerContracts } from './contracts';

@Component({
  selector: 'smoke-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    JpButton,
    JpInput,
    JpCheckbox,
    JpDatePicker,
    JpDateRangePicker,
    JpTimePicker,
    JpErrorSummary,
    JpInlineAlert,
    JpTable,
    JpDialog,
    JpDialogActions,
    ConsumerContracts,
  ],
  template: `
    <main>
      <h1>Project settings</h1>
      <jp-error-summary [errors]="errors()" />
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <jp-input
          id="consumer-project"
          label="Project name"
          formControlName="project"
          required
          hint="Use the name shown to members."
          [error]="projectError()"
        />
        <jp-input
          id="consumer-email"
          label="Notification email"
          type="email"
          formControlName="email"
          required
          [error]="emailError()"
        />
        <jp-checkbox formControlName="notifications"
          >Notify members</jp-checkbox
        >
        <jp-date-picker
          label="Launch date"
          formControlName="date"
          required
          min="2026-10-01"
          max="2026-10-31"
        />
        <jp-date-range-picker
          id="consumer-window"
          label="Release window"
          formControlName="window"
          required
          [error]="windowError()"
        />
        <jp-time-picker
          label="Launch time"
          formControlName="time"
          required
          [step]="900"
        />
        <jp-button
          type="submit"
          [loading]="saving()"
          loadingLabel="Saving settings"
          >Save settings</jp-button
        >
      </form>
      @if (saveError()) {
        <jp-inline-alert
          tone="error"
          title="Save failed"
          message="Your entries are preserved."
        >
          <jp-button type="button" (click)="save()">Retry save</jp-button>
        </jp-inline-alert>
      }
      <p role="status">{{ saved() ? 'Settings saved: ' + saved() : '' }}</p>
      <h2>Members</h2>
      <jp-table
        caption="Project members"
        [columns]="columns"
        [rows]="rows()"
        rowKey="id"
        selectable
        [selectedKeys]="selection()"
        (selectionChange)="selection.set($event)"
        [sort]="sort()"
        (sortChange)="sortRows($event)"
      />
      <jp-button
        type="button"
        [disabled]="selection().length === 0"
        (click)="dialogOpen.set(true)"
        >Remove selected</jp-button
      >
      <jp-dialog
        title="Remove selected members?"
        [open]="dialogOpen()"
        (openChange)="dialogOpen.set($event)"
      >
        <p>
          Remove {{ selection().length }} selected members from this project.
        </p>
        <div jpDialogActions>
          <jp-button type="button" (click)="dialogOpen.set(false)"
            >Cancel removal</jp-button
          >
          <jp-button type="button" (click)="remove()"
            >Confirm removal</jp-button
          >
        </div>
      </jp-dialog>
      <p role="status">{{ removed() }}</p>
      @if (showContracts) {
        <consumer-contracts />
      }
    </main>
  `,
})
class ConsumerApp {
  readonly summary = viewChild(JpErrorSummary);
  readonly form = new FormGroup({
    project: new FormControl('Release workspace', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('team@example.com', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    notifications: new FormControl(true, { nonNullable: true }),
    date: new FormControl('2026-10-10', { nonNullable: true }),
    window: new FormControl<JpDateRangeValue>(['2026-10-10', '2026-10-12'], {
      nonNullable: true,
    }),
    time: new FormControl('09:00', { nonNullable: true }),
  });
  readonly submitted = signal(false);
  readonly errors = signal<readonly JpFieldError[]>([]);
  readonly saving = signal(false);
  readonly saveError = signal(false);
  readonly saved = signal('');
  readonly selection = signal<JpTableRowKey[]>([]);
  readonly dialogOpen = signal(false);
  readonly removed = signal('');
  readonly sort = signal<JpTableSort | null>(null);
  readonly columns = [{ key: 'name', header: 'Member', sortable: true }];
  readonly rows = signal([
    { id: 'alex', name: 'Alex' },
    { id: 'sam', name: 'Sam' },
  ]);
  readonly showContracts = false;
  private attempts = 0;
  projectError() {
    return this.submitted() && this.form.controls.project.invalid
      ? 'Enter a project name.'
      : '';
  }
  emailError() {
    return this.submitted() && this.form.controls.email.invalid
      ? 'Enter a valid email.'
      : '';
  }
  windowError() {
    return this.submitted() && this.form.controls.window.invalid
      ? 'Choose an ordered date range.'
      : '';
  }
  async save() {
    if (this.saving()) return;
    this.submitted.set(true);
    this.errors.set(
      [
        { controlId: 'consumer-project', message: this.projectError() },
        { controlId: 'consumer-email', message: this.emailError() },
        { controlId: 'consumer-window-start', message: this.windowError() },
      ].filter((error) => error.message),
    );
    if (this.form.invalid) {
      setTimeout(() => this.summary()?.focus());
      return;
    }
    this.saveError.set(false);
    this.saving.set(true);
    this.form.disable();
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.form.enable();
    this.saving.set(false);
    if (++this.attempts === 1) this.saveError.set(true);
    else this.saved.set(this.form.controls.project.value);
  }
  sortRows(sort: JpTableSort | null) {
    this.sort.set(sort);
    this.rows.update((rows) =>
      [...rows].sort(
        (a, b) =>
          a.name.localeCompare(b.name) * (sort?.direction === 'desc' ? -1 : 1),
      ),
    );
  }
  remove() {
    const count = this.selection().length;
    this.rows.update((rows) =>
      rows.filter((row) => !this.selection().includes(row.id)),
    );
    this.selection.set([]);
    this.dialogOpen.set(false);
    this.removed.set(`Removed ${count} members.`);
  }
}
bootstrapApplication(ConsumerApp).catch(console.error);
