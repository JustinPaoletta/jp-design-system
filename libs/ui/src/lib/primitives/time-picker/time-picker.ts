import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TemporalInput } from '../shared/temporal-input';
import type { JpInputType } from '../shared/primitive-types';
@Component({
  selector: 'jp-time-picker',
  templateUrl: '../input/input.html',
  styleUrl: '../input/input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpTimePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => JpTimePicker),
      multi: true,
    },
  ],
})
export class JpTimePicker extends TemporalInput {
  override readonly type = input<JpInputType, unknown>('time', {
    transform: () => 'time',
  });
}
