import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumericControl } from '../shared/numeric-control';
import { snapNumber } from '../shared/number-utils';
@Component({
  selector: 'jp-slider',
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.id]': 'null' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpSlider),
      multi: true,
    },
  ],
})
export class JpSlider extends NumericControl {
  readonly showNumberInput = input(true, { transform: booleanAttribute });
  readonly valueText = input<(value: number) => string>((value) =>
    String(value),
  );
  readonly lower = computed(() => this.safeMin() ?? 0);
  readonly upper = computed(() =>
    this.safeMax() !== null && (this.safeMax() as number) > this.lower()
      ? (this.safeMax() as number)
      : this.lower() + 100,
  );
  readonly displayedValue = computed(() =>
    snapNumber(
      this.value() ?? this.lower(),
      this.lower(),
      this.upper(),
      this.safeStep(),
    ),
  );
  change(event: Event): void {
    const control = event.target as HTMLInputElement;
    if (
      !this.isDisabled() &&
      !this.readonly() &&
      Number.isFinite(control.valueAsNumber)
    )
      this.commit(
        snapNumber(
          control.valueAsNumber,
          this.lower(),
          this.upper(),
          this.safeStep(),
        ),
      );
    control.value = String(this.displayedValue());
  }
}
