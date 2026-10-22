import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  JpPageHeader,
  JpLink,
  JpCard,
  JpStepper,
  JpChecklist,
  JpNumberStepper,
  JpSlider,
  JpRangeSlider,
  JpTimeline,
  JpCodeBlock,
  JpInlineCode,
  JpOverflowChip,
  JpButton,
  JpInput,
  JpErrorSummary,
  type JpStep,
  type JpRangeValue,
} from '@jp-design-system/ui';
@Component({
  selector: 'app-product-tools-page',
  imports: [
    RouterLink,
    JpLink,
    ReactiveFormsModule,
    JpPageHeader,
    JpCard,
    JpStepper,
    JpChecklist,
    JpNumberStepper,
    JpSlider,
    JpRangeSlider,
    JpTimeline,
    JpCodeBlock,
    JpInlineCode,
    JpOverflowChip,
    JpButton,
    JpInput,
    JpErrorSummary,
  ],
  templateUrl: './product-tools.page.html',
  styleUrl: './product-tools.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductToolsPage {
  private readonly injector = inject(Injector);
  readonly stepHeading = viewChild<ElementRef<HTMLElement>>('stepHeading');
  readonly summary = viewChild(JpErrorSummary);
  readonly current = signal<'details' | 'review'>('details');
  readonly submitted = signal(false);
  readonly saved = signal(false);
  readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  readonly seats = new FormControl<number | null>(2, {
    validators: [Validators.required, Validators.min(1), Validators.max(10)],
  });
  readonly volume = new FormControl(40);
  readonly budget = new FormControl<JpRangeValue>([20, 80], {
    nonNullable: true,
  });
  readonly tasks = new FormControl<readonly string[]>(['tests'], {
    nonNullable: true,
  });
  readonly checklist = [
    {
      id: 'quality',
      label: 'Game preparation',
      children: [
        { id: 'tests', label: 'Check the lineup' },
        { id: 'accessibility', label: 'Check the equipment' },
        { id: 'approval', label: 'League approval', disabled: true },
      ],
    },
    {
      id: 'notes',
      label: 'Write the game report',
      description: 'Record the score and key plays.',
    },
  ];
  steps(): readonly JpStep[] {
    return [
      {
        id: 'details',
        label: 'Details',
        state:
          this.current() === 'review'
            ? 'complete'
            : this.submitted() && (this.email.invalid || this.seats.invalid)
              ? 'error'
              : 'upcoming',
        description: 'Manager email and player count',
      },
      {
        id: 'review',
        label: 'Review',
        disabled: this.current() !== 'review',
        description: 'Confirm before saving',
      },
    ];
  }
  readonly events = [
    {
      id: 'created',
      title: 'Injured list sample',
      timeLabel: 'Sample',
      dateTime: '2024-10-05',
      description: 'The injured-list row is a sample status for the Rays.',
    },
    {
      id: 'reviewed',
      title: 'Day to day sample',
      timeLabel: 'Sample',
      dateTime: '2024-10-07',
      description: 'The status sample is day to day.',
    },
    {
      id: 'deployment',
      title: 'ALCS Game 6 final',
      timeLabel: 'ALCS Game 6',
      dateTime: '2024-10-30T23:50:00-04:00',
      description: 'The Rays won ALCS Game 6.',
    },
  ];
  readonly overflow = [
    { id: 'ada', label: 'Shane Baz', href: '#reviewer-ada' },
    { id: 'grace', label: 'Yandy Díaz' },
    { id: 'linus', label: 'Taylor Walls' },
  ];
  readonly example =
    '<jp-number-stepper label="Players" [min]="1" [max]="10" [formControl]="seats" />';
  errors() {
    if (!this.submitted()) return [];
    return [
      ...(this.email.invalid
        ? [
            {
              controlId: 'wizard-email',
              message: 'Enter a valid email address.',
            },
          ]
        : []),
      ...(this.seats.invalid
        ? [
            {
              controlId: 'wizard-seats',
              message: 'Choose between one and ten players.',
            },
          ]
        : []),
    ];
  }
  next(): void {
    this.submitted.set(true);
    this.email.markAsTouched();
    this.seats.markAsTouched();
    if (this.errors().length) {
      afterNextRender(() => this.summary()?.focus(), {
        injector: this.injector,
      });
      return;
    }
    this.current.set('review');
    this.focusStep();
  }
  back(): void {
    this.current.set('details');
    this.saved.set(false);
    this.focusStep();
  }
  private focusStep(): void {
    afterNextRender(() => this.stepHeading()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }
  selectStep(id: string): void {
    if (id === 'details') this.back();
  }
  save(): void {
    if (this.current() === 'review' && this.email.valid && this.seats.valid)
      this.saved.set(true);
  }
}
