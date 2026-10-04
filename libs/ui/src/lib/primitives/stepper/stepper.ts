import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpIcon } from '../icon/icon';
export interface JpStep {
  id: string;
  label: string;
  description?: string;
  state?: 'upcoming' | 'complete' | 'error';
  disabled?: boolean;
}
@Component({
  selector: 'jp-stepper',
  imports: [JpIcon],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpStepper {
  private readonly messages = inject(JP_MESSAGES);
  readonly steps = input.required<readonly JpStep[]>();
  readonly label = input.required<string>();
  readonly currentId = input.required<string>();
  readonly navigable = input(false, { transform: booleanAttribute });
  readonly completeLabel = input(this.messages.stepper.complete);
  readonly errorLabel = input(this.messages.stepper.error);
  readonly stepSelected = output<string>();
  select(step: JpStep): void {
    if (this.navigable() && !step.disabled) this.stepSelected.emit(step.id);
  }
}
