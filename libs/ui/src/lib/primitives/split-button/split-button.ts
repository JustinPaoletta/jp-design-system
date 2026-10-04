import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import {
  JpDropdownMenu,
  JpDropdownTrigger,
  JpDropdownMenuItem,
} from '../dropdown-menu/dropdown-menu';
export interface JpMenuAction {
  id: string;
  label: string;
  disabled?: boolean;
}
@Component({
  selector: 'jp-split-button',
  imports: [JpDropdownMenu, JpDropdownTrigger, JpDropdownMenuItem],
  templateUrl: './split-button.html',
  styleUrl: './split-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpSplitButton {
  private readonly messages = inject(JP_MESSAGES);
  readonly label = input.required<string>();
  readonly actions = input<readonly JpMenuAction[]>([]);
  readonly menuLabel = input(this.messages.actions.more);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly primary = output<void>();
  readonly actionSelected = output<string>();
  readonly open = signal(false);
  runPrimary(): void {
    if (!this.disabled()) this.primary.emit();
  }
  select(action: JpMenuAction): void {
    if (this.disabled() || action.disabled) return;
    this.open.set(false);
    this.actionSelected.emit(action.id);
  }
}
