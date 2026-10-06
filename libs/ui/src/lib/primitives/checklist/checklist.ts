import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { JpIcon } from '../icon/icon';
import { JP_MESSAGES } from '../../i18n';
export interface JpChecklistItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  children?: readonly JpChecklistItem[];
}
interface ChecklistRow {
  item: JpChecklistItem;
  depth: number;
  disabled: boolean;
  leaves: readonly { id: string; disabled: boolean }[];
}
@Component({
  selector: 'jp-checklist',
  imports: [NgTemplateOutlet, JpIcon],
  templateUrl: './checklist.html',
  styleUrl: './checklist.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpChecklist),
      multi: true,
    },
  ],
})
export class JpChecklist implements ControlValueAccessor {
  private readonly messages = inject(JP_MESSAGES);
  private readonly formDisabled = signal(false);
  private onChange: (value: readonly string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  readonly items = input.required<readonly JpChecklistItem[]>();
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly summaryLabel = input(this.messages.checklist.completed);
  readonly emptyText = input(this.messages.checklist.empty);
  readonly value = signal<readonly string[]>([]);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly rows = computed(() => {
    const rows: ChecklistRow[] = [];
    const visit = (
      items: readonly JpChecklistItem[],
      depth: number,
      inherited: boolean,
    ): ChecklistRow['leaves'] =>
      items.flatMap((item) => {
        const row: ChecklistRow = {
          item,
          depth,
          disabled: inherited || !!item.disabled,
          leaves: [],
        };
        rows.push(row);
        row.leaves = item.children?.length
          ? visit(item.children, depth + 1, row.disabled)
          : [{ id: item.id, disabled: row.disabled }];
        row.disabled ||= row.leaves.every((leaf) => leaf.disabled);
        return row.leaves;
      });
    visit(this.items(), 0, false);
    return rows;
  });
  readonly total = computed(
    () => this.rows().filter((row) => !row.item.children?.length).length,
  );
  readonly rowById = computed(
    () => new Map(this.rows().map((row) => [row.item.id, row])),
  );
  readonly completed = computed(
    () =>
      this.rows().filter(
        (row) =>
          !row.item.children?.length && this.value().includes(row.item.id),
      ).length,
  );
  checked(row: ChecklistRow): boolean {
    return row.leaves.every((leaf) => this.value().includes(leaf.id));
  }
  mixed(row: ChecklistRow): boolean {
    return (
      !this.checked(row) &&
      row.leaves.some((leaf) => this.value().includes(leaf.id))
    );
  }
  toggle(row: ChecklistRow, event: Event): void {
    if (this.isDisabled() || row.disabled) return;
    const checked = (event.target as HTMLInputElement).checked;
    const next = new Set(this.value());
    for (const leaf of row.leaves) {
      if (leaf.disabled) continue;
      if (checked) next.add(leaf.id);
      else next.delete(leaf.id);
    }
    const value = [...next];
    this.value.set(value);
    this.onChange(value);
  }
  blur(): void {
    this.onTouched();
  }
  writeValue(value: readonly string[] | null): void {
    this.value.set([...new Set(value ?? [])]);
  }
  registerOnChange(fn: (value: readonly string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(value: boolean): void {
    this.formDisabled.set(value);
  }
}
