import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JpInput } from '../input/input';
import { JpDatePicker } from '../date-picker/date-picker';
import { JpTimePicker } from '../time-picker/time-picker';
import { JP_INPUT_TYPES, type JpInputType } from '../shared/primitive-types';
import { createStringUnionTransform } from '../shared/token-maps';
@Component({
  selector: 'jp-search-field',
  imports: [FormsModule, JpDatePicker, JpTimePicker],
  templateUrl: '../input/input.html',
  styleUrl: '../input/input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpSearchField),
      multi: true,
    },
  ],
})
export class JpSearchField extends JpInput {
  override readonly type = input<JpInputType, unknown>('search', {
    transform: createStringUnionTransform(JP_INPUT_TYPES, 'search'),
  });
  override readonly clearable = input(true, { transform: booleanAttribute });
}
