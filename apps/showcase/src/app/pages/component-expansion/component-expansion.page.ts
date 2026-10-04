import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  JpPageHeader,
  JpCard,
  JpIcon,
  JpLink,
  JpDivider,
  JpDisclosure,
  JpAccordion,
  JpAvatar,
  JpAvatarGroup,
  JpStatusDot,
  JpSpinner,
  JpMeter,
  JpKeyboardHint,
  JpDescriptionList,
  JpList,
  JpListItemTemplate,
  JpFormField,
  JpFieldControl,
  JpFormSection,
  JpErrorSummary,
  JpBanner,
  JpDrawer,
  JpCheckboxGroup,
  JpSegmentedControl,
  JpMultiSelect,
  JpSearchField,
  JpPasswordField,
  JpInput,
  JpButton,
  type JpFieldError,
} from '@jp-design-system/ui';
@Component({
  selector: 'app-component-expansion-page',
  imports: [
    ReactiveFormsModule,
    JpPageHeader,
    JpCard,
    JpIcon,
    JpLink,
    JpDivider,
    JpDisclosure,
    JpAccordion,
    JpAvatar,
    JpAvatarGroup,
    JpStatusDot,
    JpSpinner,
    JpMeter,
    JpKeyboardHint,
    JpDescriptionList,
    JpList,
    JpListItemTemplate,
    JpFormField,
    JpFieldControl,
    JpFormSection,
    JpErrorSummary,
    JpBanner,
    JpDrawer,
    JpCheckboxGroup,
    JpSegmentedControl,
    JpMultiSelect,
    JpSearchField,
    JpPasswordField,
    JpInput,
    JpButton,
  ],
  templateUrl: './component-expansion.page.html',
  styleUrl: './component-expansion.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentExpansionPage {
  private readonly injector = inject(Injector);
  readonly summary = viewChild(JpErrorSummary);
  readonly submitted = signal(false);
  readonly saved = signal(false);
  readonly bannerVisible = signal(true);
  readonly drawerOpen = signal(false);
  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    channels: new FormControl<readonly string[]>(['email'], {
      nonNullable: true,
    }),
    reviewers: new FormControl<readonly string[]>(['ada'], {
      nonNullable: true,
    }),
    view: new FormControl('active', { nonNullable: true }),
  });
  readonly search = new FormControl('', { nonNullable: true });
  readonly channels = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push', disabled: true },
  ];
  readonly reviewers = [
    { value: 'ada', label: 'Ada Lovelace' },
    { value: 'grace', label: 'Grace Hopper' },
    { value: 'linus', label: 'Linus Torvalds' },
    { value: 'unavailable', label: 'Unavailable reviewer', disabled: true },
  ];
  readonly views = [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ];
  readonly people = [
    { id: 'ada', name: 'Ada Lovelace' },
    { id: 'grace', name: 'Grace Hopper' },
    { id: 'linus', name: 'Linus Torvalds' },
  ];
  readonly details = [
    { term: 'Environment', description: 'Production' },
    { term: 'Region', description: 'us-east-1' },
    { term: 'Retries', description: 0 },
  ];
  readonly services = [
    {
      id: 'gateway',
      title: 'API gateway',
      description: 'Production',
      meta: 'Healthy',
    },
    { id: 'worker', title: 'Worker', description: 'Staging', meta: 'Paused' },
  ];
  emailError(): string {
    return this.submitted() && this.form.controls.email.invalid
      ? 'Enter a valid email address.'
      : '';
  }
  errors(): JpFieldError[] {
    if (!this.submitted()) return [];
    const errors: JpFieldError[] = [];
    if (this.form.controls.email.invalid)
      errors.push({
        controlId: 'expansion-email',
        message: 'Enter a valid email address.',
      });
    if (this.form.controls.password.invalid)
      errors.push({
        controlId: 'expansion-password',
        message: 'Enter a password.',
      });
    return errors;
  }
  submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.saved.set(this.form.valid);
    if (this.form.invalid)
      afterNextRender(() => this.summary()?.focus(), {
        injector: this.injector,
      });
  }
}
