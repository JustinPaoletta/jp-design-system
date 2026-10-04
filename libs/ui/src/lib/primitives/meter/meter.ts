import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'jp-meter',

  templateUrl: './meter.html',
  styleUrl: './meter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpMeter {
  readonly label = input.required<string>();
  readonly value = input(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly valueText = input('');
  readonly safeMin = computed(() =>
    Number.isFinite(this.min()) ? this.min() : 0,
  );
  readonly safeMax = computed(() =>
    Number.isFinite(this.max()) && this.max() > this.safeMin()
      ? this.max()
      : this.safeMin() + 1,
  );
  readonly safeValue = computed(() =>
    Number.isFinite(this.value())
      ? Math.min(this.safeMax(), Math.max(this.safeMin(), this.value()))
      : this.safeMin(),
  );
  readonly percent = computed(
    () =>
      ((this.safeValue() - this.safeMin()) /
        (this.safeMax() - this.safeMin())) *
      100,
  );
}
