import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, type NgForm } from '@angular/forms';
import {
  JpButton,
  JpCard,
  JpCheckbox,
  JpDisclosure,
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
    JpCard,
    JpInput,
    JpTextarea,
    JpSelect,
    JpCheckbox,
    JpDisclosure,
    JpSwitch,
  ],
  templateUrl: './controls.page.html',
  styleUrl: './controls.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsPage {
  readonly defaults = {
    email: 'manager@rays.example',
    notes: '',
    role: 'editor',
    subscribe: true,
  };
  saved: typeof this.defaults | null = { ...this.defaults };
  feedback = '';

  email = 'manager@rays.example';
  notes = '';
  role = 'editor';
  subscribe = true;
  compact = false;

  save(form: NgForm): void {
    this.saved = { ...form.value };
    form.form.markAsPristine();
    this.feedback = 'Lineup saved in this preview.';
  }

  cancel(form: NgForm): void {
    form.resetForm(this.saved ?? this.defaults);
    this.feedback = 'Changes canceled.';
  }

  reset(form: NgForm): void {
    form.resetForm(this.defaults);
    this.feedback = 'Default lineup restored.';
  }

  deleteLineup(form: NgForm): void {
    this.saved = null;
    form.resetForm(this.defaults);
    this.feedback = 'Saved lineup removed from this preview.';
  }

  readonly roleOptions = [
    { value: 'admin', label: 'Manager' },
    { value: 'editor', label: 'Scorekeeper' },
    { value: 'viewer', label: 'Fan' },
  ];
}
