import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';
import { JpIcon } from '../icon/icon';
import { NumericControl } from '../shared/numeric-control';
import { clampNumber, tidyNumber } from '../shared/number-utils';
@Component({
  selector: 'jp-number-stepper',
  imports: [JpIcon],
  templateUrl: './number-stepper.html',
  styleUrl: './number-stepper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.id]': 'null' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpNumberStepper),
      multi: true,
    },
  ],
})
export class JpNumberStepper extends NumericControl {
  private readonly messages = inject(JP_MESSAGES);
  readonly increaseLabel = input(this.messages.numberStepper.increase);
  readonly decreaseLabel = input(this.messages.numberStepper.decrease);
  readonly canIncrease = computed(
    () =>
      !this.isDisabled() &&
      !this.readonly() &&
      (this.value() === null ||
        this.safeMax() === null ||
        (this.value() as number) < this.lastAllowedValue()),
  );
  readonly canDecrease = computed(
    () =>
      !this.isDisabled() &&
      !this.readonly() &&
      (this.value() === null ||
        this.safeMin() === null ||
        (this.value() as number) > (this.safeMin() as number)),
  );
  onInput(event: Event): void {
    if (this.isDisabled() || this.readonly()) return;
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.commit(Number.isFinite(value) ? value : null);
  }
  adjust(direction: 1 | -1): void {
    if (direction === 1 ? !this.canIncrease() : !this.canDecrease()) return;
    const value = this.value();
    const step = this.safeStep();
    const base = this.safeMin() ?? 0;
    const index = value === null ? null : tidyNumber((value - base) / step);
    const next =
      index === null
        ? clampNumber(0, this.safeMin() ?? -Infinity, this.lastAllowedValue())
        : tidyNumber(
            base +
              (direction === 1 ? Math.floor(index) + 1 : Math.ceil(index) - 1) *
                step,
          );
    if (!Number.isFinite(next)) return;
    this.commit(
      clampNumber(next, this.safeMin() ?? -Infinity, this.lastAllowedValue()),
    );
    this.onTouched();
  }
  private lastAllowedValue(): number {
    const max = this.safeMax();
    if (max === null) return Infinity;
    const base = this.safeMin() ?? 0;
    return tidyNumber(
      base +
        Math.floor(tidyNumber((max - base) / this.safeStep())) *
          this.safeStep(),
    );
  }
}
