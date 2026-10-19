import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  JpButton,
  JpCheckbox,
  JpHeading,
  JpInput,
  JpSelect,
  JpSwitch,
  JpTextarea,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-controls-page',
  imports: [
    FormsModule,
    JpHeading,
    JpButton,
    JpInput,
    JpTextarea,
    JpSelect,
    JpCheckbox,
    JpSwitch,
  ],
  templateUrl: './controls.page.html',
  styleUrl: './controls.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsPage {
  email = 'coach@falcons.example';
  notes = '';
  role = 'editor';
  subscribe = true;
  compact = false;

  readonly roleOptions = [
    { value: 'admin', label: 'Coach' },
    { value: 'editor', label: 'Scorekeeper' },
    { value: 'viewer', label: 'Fan' },
  ];
}
