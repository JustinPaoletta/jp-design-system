import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';
import { JpIcon } from '../icon/icon';
import {
  claimOverlayEvent,
  positionOverlay,
  registerOverlay,
} from '../shared/overlay-manager';
import type { JpInputType } from '../shared/primitive-types';
import { TemporalInput } from '../shared/temporal-input';
import { timeSeconds } from '../shared/temporal-value';

type TimePart = 'hour' | 'minute' | 'second';

@Component({
  selector: 'jp-time-picker',
  imports: [JpIcon],
  templateUrl: './time-picker.html',
  styleUrl: './time-picker.scss',
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
  host: {
    '(document:pointerdown)': 'onDocumentPointerdown($event)',
    '(document:keydown)': 'onDocumentKeydown($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class JpTimePicker extends TemporalInput {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fieldControl =
    viewChild<ElementRef<HTMLInputElement>>('control');
  private readonly anchor = viewChild<ElementRef<HTMLElement>>('anchor');
  private readonly popup = viewChild<ElementRef<HTMLElement>>('popup');
  private readonly nativeError = signal('');
  private overlayCleanup?: () => void;
  private focusOnOpen = false;

  readonly timeMessages = inject(JP_MESSAGES);
  override readonly type = input<JpInputType, unknown>('time', {
    transform: () => 'time',
  });
  readonly open = signal(false);
  readonly hour = signal('00');
  readonly minute = signal('00');
  readonly second = signal('00');
  readonly isOpen = computed(
    () => this.open() && !this.isDisabled() && !this.readonly(),
  );
  readonly displayedError = computed(() => this.error() || this.nativeError());
  override readonly isInvalid = computed(
    () => this.invalid() || Boolean(this.displayedError()),
  );
  override readonly describedBy = computed(() => {
    const ids = this.displayedError()
      ? [this.errorId()]
      : this.hint()
        ? [this.hintId()]
        : [];
    if (this.ariaDescribedBy()) ids.push(this.ariaDescribedBy());
    return ids.join(' ') || null;
  });
  readonly showSeconds = computed(() => {
    const step = this.step();
    return (
      [this.value(), this.min(), this.max()].some(
        (value) => typeof value === 'string' && value.split(':').length > 2,
      ) ||
      step === 'any' ||
      (step !== null && Number(step) % 60 !== 0)
    );
  });
  readonly parts = computed(() => [
    { key: 'hour' as const, label: this.timeMessages.dates.hour, max: 23 },
    { key: 'minute' as const, label: this.timeMessages.dates.minute, max: 59 },
    ...(this.showSeconds()
      ? [
          {
            key: 'second' as const,
            label: this.timeMessages.dates.second,
            max: 59.999,
          },
        ]
      : []),
  ]);
  readonly draftValue = computed(() => {
    const hour = this.hour();
    const minute = this.minute();
    const second = this.second();
    if (!/^\d{1,2}$/.test(hour) || !/^\d{1,2}$/.test(minute)) return '';
    if (this.showSeconds() && !/^\d{1,2}(?:\.\d{1,3})?$/.test(second))
      return '';
    const [wholeSecond, fraction] = second.split('.');
    const canonicalSecond =
      wholeSecond.padStart(2, '0') + (fraction ? '.' + fraction : '');
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}${this.showSeconds() ? ':' + canonicalSecond : ''}`;
  });
  readonly validDraft = computed(
    () =>
      this.draftValue() !== '' &&
      !this.validate(new FormControl(this.draftValue())),
  );

  constructor() {
    super();
    this.destroyRef.onDestroy(() => this.cleanupOverlay());
    effect(() => {
      const inactive = this.isDisabled() || this.readonly();
      if (inactive) untracked(() => this.close());
    });
    afterRenderEffect(() => {
      const control = this.fieldControl()?.nativeElement;
      const errors = this.validate(new FormControl(this.value()));
      control?.setCustomValidity(errors ? this.validationMessage() : '');
      if (!errors) untracked(() => this.nativeError.set(''));
      const panel = this.popup()?.nativeElement;
      const anchor = this.anchor()?.nativeElement;
      if (!this.isOpen()) {
        this.cleanupOverlay();
        return;
      }
      if (!panel || !anchor) return;
      if (!this.overlayCleanup) {
        const unregister = registerOverlay(this, panel.ownerDocument);
        const unposition = positionOverlay(panel, anchor);
        this.overlayCleanup = () => {
          unposition();
          unregister();
        };
      }
      if (this.focusOnOpen) {
        this.focusOnOpen = false;
        panel
          .querySelector<HTMLInputElement>('[role="spinbutton"]')
          ?.focus({ preventScroll: true });
      }
    });
  }

  override writeValue(value: string | null): void {
    super.writeValue(value);
    this.nativeError.set('');
    this.close();
  }

  override setDisabledState(disabled: boolean): void {
    super.setDisabledState(disabled);
    if (disabled) this.close();
  }

  override onInput(event: Event): void {
    if (this.isDisabled() || this.readonly()) return;
    this.nativeError.set('');
    super.onInput(event);
  }

  private validationMessage(): string {
    return !this.value() && this.required()
      ? this.timeMessages.dates.requiredTime
      : this.timeMessages.dates.invalidTime;
  }

  onNativeInvalid(event: Event): void {
    event.preventDefault();
    this.nativeError.set(this.validationMessage());
    this.fieldControl()?.nativeElement.focus({ preventScroll: true });
  }

  toggle(): void {
    if (this.isOpen()) this.close(true);
    else this.show();
  }

  show(): void {
    if (this.isDisabled() || this.readonly()) return;
    const current = timeSeconds(this.value());
    const lower = this.min() ? timeSeconds(String(this.min())) : 0;
    const upper = this.max() ? timeSeconds(String(this.max())) : 86399.999;
    const clamped = Math.max(
      lower ?? 0,
      Math.min(current ?? lower ?? 0, upper ?? 86399.999),
    );
    const next = this.alignedTime(clamped, 1);
    const previous = this.alignedTime(clamped, -1);
    const nearest =
      next === null
        ? previous
        : previous === null
          ? next
          : next - clamped < clamped - previous
            ? next
            : previous;
    this.setDraft(nearest ?? lower ?? current ?? 0);
    this.focusOnOpen = true;
    this.open.set(true);
  }

  close(restoreFocus = false): void {
    this.cleanupOverlay();
    this.open.set(false);
    this.focusOnOpen = false;
    if (restoreFocus && !this.isDisabled())
      this.fieldControl()?.nativeElement.focus({ preventScroll: true });
  }

  private cleanupOverlay(): void {
    this.overlayCleanup?.();
    this.overlayCleanup = undefined;
  }

  partValue(part: TimePart): string {
    return this[part]();
  }

  partNumber(part: TimePart): number | null {
    const value = this.partValue(part);
    return value.trim() !== '' && Number.isFinite(Number(value))
      ? Number(value)
      : null;
  }

  editPart(part: TimePart, event: Event): void {
    this[part].set((event.target as HTMLInputElement).value);
  }

  private setDraft(seconds: number): void {
    const millis = Math.round(seconds * 1000);
    this.hour.set(String(Math.floor(millis / 3600000)).padStart(2, '0'));
    this.minute.set(String(Math.floor(millis / 60000) % 60).padStart(2, '0'));
    const wholeSeconds = String(Math.floor(millis / 1000) % 60).padStart(
      2,
      '0',
    );
    const fraction = millis % 1000;
    this.second.set(
      wholeSeconds +
        (fraction
          ? '.' + String(fraction).padStart(3, '0').replace(/0+$/, '')
          : ''),
    );
  }

  /** Candidate periods use whole milliseconds; the original validator checks each result. */
  private alignedTime(target: number, direction: 1 | -1): number | null {
    const lower = this.min() ? timeSeconds(String(this.min())) : 0;
    const upper = this.max() ? timeSeconds(String(this.max())) : 86399.999;
    const step = this.step() === 'any' ? null : Number(this.step() ?? 60);
    if (
      lower === null ||
      upper === null ||
      lower > upper ||
      (step !== null && (!(step > 0) || !Number.isFinite(step)))
    )
      return null;
    const anchor = Math.round(lower * 1000);
    const targetMillis = Math.round(target * 1000);
    let closest: number | null = null;
    const consider = (millis: number) => {
      const seconds = millis / 1000;
      if (
        seconds < lower ||
        seconds > upper ||
        (seconds - target) * direction < -1e-7
      )
        return;
      const hour = String(Math.floor(millis / 3600000)).padStart(2, '0');
      const minute = String(Math.floor(millis / 60000) % 60).padStart(2, '0');
      const wholeSecond = String(Math.floor(millis / 1000) % 60).padStart(
        2,
        '0',
      );
      const fraction = millis % 1000;
      const value = `${hour}:${minute}:${wholeSecond}${fraction ? '.' + String(fraction).padStart(3, '0') : ''}`;
      if (this.validate(new FormControl(value))) return;
      if (
        closest === null ||
        Math.abs(seconds - target) < Math.abs(closest - target)
      )
        closest = seconds;
    };
    if (step === null) {
      consider(targetMillis);
      return closest;
    }
    // A convergent p/q of the step in milliseconds suggests p milliseconds
    // between representable times. Bound the work even for tiny decimal steps.
    let fraction = step * 1000;
    let previousNumerator = 1;
    let previousPreviousNumerator = 0;
    let previousDenominator = 0;
    let previousPreviousDenominator = 1;
    for (let index = 0; index < 24; index++) {
      const whole = Math.floor(fraction);
      const numerator = whole * previousNumerator + previousPreviousNumerator;
      const denominator =
        whole * previousDenominator + previousPreviousDenominator;
      if (
        !Number.isSafeInteger(numerator) ||
        !Number.isSafeInteger(denominator)
      )
        break;
      if (numerator > 0) {
        const offset = (targetMillis - anchor) / numerator;
        const multiple =
          direction === 1 ? Math.ceil(offset) : Math.floor(offset);
        consider(anchor + multiple * numerator);
        if (closest === target) break;
      }
      const remainder = fraction - whole;
      if (remainder === 0 || numerator > 86400000) break;
      previousPreviousNumerator = previousNumerator;
      previousNumerator = numerator;
      previousPreviousDenominator = previousDenominator;
      previousDenominator = denominator;
      fraction = 1 / remainder;
    }
    return closest;
  }

  nextTime(part: TimePart, direction: 1 | -1): number | null {
    const current = timeSeconds(this.draftValue());
    if (current === null) return null;
    const delta = part === 'hour' ? 3600 : part === 'minute' ? 60 : 1;
    const result = this.alignedTime(current + delta * direction, direction);
    return result !== null && (result - current) * direction > 0
      ? result
      : null;
  }

  adjust(part: TimePart, direction: 1 | -1): void {
    const next = this.nextTime(part, direction);
    if (next !== null) this.setDraft(next);
  }

  onPartKeydown(part: TimePart, event: KeyboardEvent): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.adjust(part, event.key === 'ArrowUp' ? 1 : -1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.apply();
    }
  }

  onFieldKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      this.show();
    }
  }

  apply(): void {
    if (!this.isOpen() || !this.validDraft()) return;
    this.commitValue(this.draftValue());
    this.nativeError.set('');
    this.onBlur();
    this.close(true);
  }

  clear(): void {
    if (!this.isOpen()) return;
    this.commitValue('');
    this.nativeError.set('');
    this.onBlur();
    this.close(true);
  }

  onButtonPointerdown(event: PointerEvent): void {
    const button =
      event.target instanceof Element ? event.target.closest('button') : null;
    if (!button || button.disabled) return;
    // Safari does not focus buttons on pointer activation. Keep focus inside
    // the picker until the button's click has committed or dismissed its draft.
    event.preventDefault();
    button.focus({ preventScroll: true });
  }

  onDocumentPointerdown(event: PointerEvent): void {
    if (
      this.isOpen() &&
      event.target instanceof Node &&
      !this.host.nativeElement.contains(event.target) &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    )
      this.close();
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (
      this.isOpen() &&
      event.key === 'Escape' &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (
      this.isOpen() &&
      event.relatedTarget instanceof Node &&
      !this.host.nativeElement.contains(event.relatedTarget)
    ) {
      this.close();
      this.onBlur();
    }
  }
}
