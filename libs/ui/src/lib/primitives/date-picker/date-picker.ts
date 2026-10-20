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
  LOCALE_ID,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';
import { TemporalInput } from '../shared/temporal-input';
import { dateErrors, isCalendarDate } from '../shared/temporal-value';
import type { JpInputType } from '../shared/primitive-types';
import {
  claimOverlayEvent,
  positionOverlay,
  registerOverlay,
} from '../shared/overlay-manager';

const DAY = 86400000;
function asDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  const result = new Date(0);
  result.setUTCFullYear(year, month - 1, day);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}
function asValue(date: Date): string {
  const year = date.getUTCFullYear();
  return year < 1 || year > 9999
    ? ''
    : `${String(year).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

@Component({
  selector: 'jp-date-picker',
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpDatePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => JpDatePicker),
      multi: true,
    },
  ],
  host: {
    class: 'jp-date-picker',
    '[attr.id]': 'null',
    '(document:keydown)': 'onDocumentKeydown($event)',
    '(document:pointerdown)': 'onDocumentPointerdown($event)',
    '(focusout)': 'onFocusout($event)',
  },
})
export class JpDatePicker extends TemporalInput {
  readonly dateMessages = inject(JP_MESSAGES).dates;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly control = viewChild<ElementRef<HTMLInputElement>>('control');
  private readonly trigger =
    viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly popup = viewChild<ElementRef<HTMLElement>>('popup');
  private overlayCleanup?: () => void;
  private focusRequested = false;
  private returnFocusToInput = false;
  private readonly nativeError = signal('');
  override readonly type = input<JpInputType, unknown>('date', {
    transform: () => 'date',
  });
  readonly locale = input(inject(LOCALE_ID));
  readonly weekStartsOn = input(0);
  readonly open = signal(false);
  readonly activeDate = signal('');
  readonly shownMonth = signal('');
  readonly isOpen = computed(
    () => this.open() && !this.isDisabled() && !this.readonly(),
  );
  readonly displayedError = computed(() => this.error() || this.nativeError());
  readonly fieldDescription = computed(
    () =>
      [
        this.displayedError()
          ? this.errorId()
          : this.hint()
            ? this.hintId()
            : '',
        this.ariaDescribedBy(),
      ]
        .filter(Boolean)
        .join(' ') || null,
  );
  readonly firstWeekday = computed(() =>
    Number.isInteger(this.weekStartsOn())
      ? Math.max(0, Math.min(6, this.weekStartsOn()))
      : 0,
  );
  readonly weekdays = computed(() =>
    Array.from({ length: 7 }, (_, index) => {
      const date = new Date(
        Date.UTC(2024, 0, 7 + ((index + this.firstWeekday()) % 7)),
      );
      return {
        short: this.format(date, { weekday: 'short' }),
        long: this.format(date, { weekday: 'long' }),
      };
    }),
  );
  readonly monthLabel = computed(() =>
    this.shownMonth()
      ? this.format(asDate(this.shownMonth()), {
          month: 'long',
          year: 'numeric',
        })
      : '',
  );
  readonly weeks = computed(() => {
    if (!this.shownMonth()) return [];
    const first = asDate(this.shownMonth());
    const offset = (first.getUTCDay() - this.firstWeekday() + 7) % 7;
    const days = Array.from({ length: 42 }, (_, index) => {
      const date = new Date(first.getTime() + (index - offset) * DAY);
      const value = asValue(date);
      return {
        value,
        day: date.getUTCDate(),
        label: this.format(date, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        outside: date.getUTCMonth() !== first.getUTCMonth(),
        unavailable: !value || !this.canChoose(value),
      };
    });
    return Array.from({ length: 6 }, (_, index) =>
      days.slice(index * 7, index * 7 + 7),
    );
  });

  constructor() {
    super();
    this.destroyRef.onDestroy(() => this.cleanupOverlay());
    effect(() => {
      const unavailable = this.isDisabled() || this.readonly();
      untracked(() => {
        if (unavailable) this.close();
      });
    });
    afterRenderEffect(() => {
      const input = this.control()?.nativeElement;
      const errors = dateErrors(
        this.value(),
        this.min(),
        this.max(),
        false,
        this.step(),
      );
      input?.setCustomValidity(errors ? this.dateMessages.invalidDate : '');
      if (!errors && (!this.required() || this.value()))
        untracked(() => this.nativeError.set(''));
      const open = this.isOpen();
      const panel = this.popup()?.nativeElement;
      const anchor = this.control()?.nativeElement.parentElement;
      const active = this.activeDate();
      if (!open) {
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
      if (this.focusRequested) {
        this.focusRequested = false;
        panel
          .querySelector<HTMLButtonElement>(`[data-date="${active}"]`)
          ?.focus({ preventScroll: true });
      }
    });
  }
  private format(date: Date, options: Intl.DateTimeFormatOptions): string {
    try {
      return new Intl.DateTimeFormat(this.locale(), {
        ...options,
        calendar: 'gregory',
        timeZone: 'UTC',
      }).format(date);
    } catch {
      return new Intl.DateTimeFormat('en-US', {
        ...options,
        calendar: 'gregory',
        timeZone: 'UTC',
      }).format(date);
    }
  }
  canChoose(value: string): boolean {
    return (
      isCalendarDate(value) &&
      !dateErrors(value, this.min(), this.max(), false, this.step())
    );
  }
  private initialDate(): string {
    const today = new Date();
    let value = isCalendarDate(this.value())
      ? this.value()
      : `${String(today.getFullYear()).padStart(4, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const min = String(this.min() ?? ''),
      max = String(this.max() ?? '');
    if (isCalendarDate(min) && value < min) value = min;
    if (isCalendarDate(max) && value > max) value = max;
    return value;
  }
  show(returnFocusToInput = false): void {
    if (this.isDisabled() || this.readonly()) return;
    this.returnFocusToInput = returnFocusToInput;
    const value = this.initialDate();
    this.activeDate.set(value);
    this.shownMonth.set(`${value.slice(0, 7)}-01`);
    this.focusRequested = true;
    this.open.set(true);
  }
  toggle(): void {
    if (this.isOpen()) this.close(true);
    else this.show();
  }
  close(restoreFocus = false): void {
    this.cleanupOverlay();
    this.open.set(false);
    this.focusRequested = false;
    if (restoreFocus)
      (this.returnFocusToInput
        ? this.control()
        : this.trigger()
      )?.nativeElement.focus({ preventScroll: true });
  }
  private cleanupOverlay(): void {
    this.overlayCleanup?.();
    this.overlayCleanup = undefined;
  }
  override writeValue(value: string | null): void {
    this.close();
    this.nativeError.set('');
    super.writeValue(value);
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
  choose(value: string): void {
    if (this.isDisabled() || this.readonly() || !this.canChoose(value)) return;
    this.commitValue(value);
    this.nativeError.set('');
    this.onBlur();
    this.close(true);
  }
  onInvalid(event: Event): void {
    event.preventDefault();
    this.nativeError.set(
      this.control()?.nativeElement.validity.valueMissing
        ? this.dateMessages.requiredDate
        : this.dateMessages.invalidDate,
    );
    this.control()?.nativeElement.focus();
  }
  onFocusout(event: FocusEvent): void {
    if (
      event.relatedTarget instanceof Node &&
      this.host.nativeElement.contains(event.relatedTarget)
    )
      return;
    this.close();
    this.onBlur();
  }
  onPopupPointerdown(event: PointerEvent): void {
    const button =
      event.target instanceof Element ? event.target.closest('button') : null;
    if (!button || button.disabled) return;
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
      event.key === 'Escape' &&
      this.isOpen() &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
    }
  }
  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !this.isDisabled() && !this.readonly()) {
      event.preventDefault();
      this.show(true);
    }
  }
  changeMonth(offset: number, focus = false): void {
    if (!this.isOpen() || !isCalendarDate(this.activeDate())) return;
    const current = asDate(this.activeDate());
    const day = current.getUTCDate();
    current.setUTCDate(1);
    current.setUTCMonth(current.getUTCMonth() + offset);
    const last = new Date(current);
    last.setUTCMonth(last.getUTCMonth() + 1, 0);
    current.setUTCDate(Math.min(day, last.getUTCDate()));
    const value = asValue(current);
    if (!value) return;
    this.focusRequested = focus;
    this.activeDate.set(value);
    this.shownMonth.set(`${value.slice(0, 7)}-01`);
  }
  canMoveMonth(offset: number): boolean {
    if (!this.shownMonth()) return false;
    const current = asDate(this.shownMonth());
    current.setUTCMonth(current.getUTCMonth() + offset);
    return Boolean(asValue(current));
  }
  onDayKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;
    if (event.key === 'Escape') {
      this.onDocumentKeydown(event);
      return;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      this.changeMonth(
        (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1),
        true,
      );
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const rtl =
      this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(
        this.host.nativeElement,
      ).direction === 'rtl';
    const current = asDate(this.activeDate());
    const weekday = (current.getUTCDay() - this.firstWeekday() + 7) % 7;
    const offsets: Record<string, number> = {
      ArrowLeft: rtl ? 1 : -1,
      ArrowRight: rtl ? -1 : 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -weekday,
      End: 6 - weekday,
    };
    if (!(event.key in offsets)) return;
    event.preventDefault();
    const value = asValue(
      new Date(current.getTime() + offsets[event.key] * DAY),
    );
    if (!value) return;
    this.focusRequested = true;
    this.activeDate.set(value);
    this.shownMonth.set(`${value.slice(0, 7)}-01`);
  }
}
