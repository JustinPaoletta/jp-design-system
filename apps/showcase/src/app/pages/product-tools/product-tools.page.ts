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
      label: 'Quality checks',
      children: [
        { id: 'tests', label: 'Run tests' },
        { id: 'accessibility', label: 'Review accessibility' },
        { id: 'approval', label: 'External approval', disabled: true },
      ],
    },
    {
      id: 'notes',
      label: 'Write release notes',
      description: 'Describe changes for consumers.',
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
        description: 'Notification email and seat count',
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
      title: 'Project created',
      timeLabel: '4 October, 10:00 UTC',
      dateTime: '2026-10-04T10:00:00Z',
      description: 'Ada created the workspace.',
    },
    {
      id: 'reviewed',
      title: 'Review completed',
      timeLabel: '4 October, 11:30 UTC',
      dateTime: '2026-10-04T11:30:00Z',
    },
    { id: 'deployment', title: 'Deployment started', timeLabel: 'Just now' },
  ];
  readonly overflow = [
    { id: 'ada', label: 'Ada Lovelace', href: '#reviewer-ada' },
    { id: 'grace', label: 'Grace Hopper' },
    { id: 'linus', label: 'Linus Torvalds' },
  ];
  readonly example =
    '<jp-number-stepper label="Seats" [min]="1" [max]="10" [formControl]="seats" />';
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
              message: 'Choose between one and ten seats.',
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
