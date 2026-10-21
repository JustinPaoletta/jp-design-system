import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JpDatePicker } from '../date-picker/date-picker';
import { JpTimePicker } from '../time-picker/time-picker';
import { JpInputControl } from '../shared/input-control';

@Component({
  selector: 'jp-input',
  imports: [FormsModule, JpDatePicker, JpTimePicker],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpInput),
      multi: true,
    },
  ],
})
export class JpInput extends JpInputControl {}
