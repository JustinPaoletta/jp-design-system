import {
  afterRenderEffect,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';

import {
  claimOverlayEvent,
  positionOverlay,
  registerOverlay,
} from '../shared/overlay-manager';

export interface JpComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
let nextComboboxId = 0;
@Component({
  selector: 'jp-combobox',
  templateUrl: './combobox.html',
  styleUrl: './combobox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpCombobox),
      multi: true,
    },
  ],
  host: {
    class: 'jp-combobox',
    '(document:keydown)': 'onDocumentKeydown($event)',
    '(document:pointerdown)': 'onDocumentPointerdown($event)',
  },
})
export class JpCombobox implements ControlValueAccessor {
  private readonly messages = inject(JP_MESSAGES);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly control = viewChild<ElementRef<HTMLInputElement>>('control');
  private readonly popup = viewChild<ElementRef<HTMLElement>>('popup');
  private overlayCleanup?: () => void;

  constructor() {
    this.destroyRef.onDestroy(() => this.cleanupOverlay());
    afterRenderEffect(() => {
      const open = this.isOpen();
      const panel = this.popup()?.nativeElement;
      const anchor = this.control()?.nativeElement;
      if (!open) {
        this.cleanupOverlay();
        return;
      }
      if (!panel || !anchor || this.overlayCleanup) return;
      const resize = () => {
        panel.style.width = `${anchor.getBoundingClientRect().width}px`;
      };
      resize();
      const unregister = registerOverlay(this, panel.ownerDocument);
      const unposition = positionOverlay(panel, anchor);
      const observer =
        typeof ResizeObserver === 'undefined'
          ? undefined
          : new ResizeObserver(resize);
      observer?.observe(anchor);
      this.overlayCleanup = () => {
        observer?.disconnect();
        unposition();
        unregister();
      };
    });
  }

  private cleanupOverlay(): void {
    this.overlayCleanup?.();
    this.overlayCleanup = undefined;
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'Escape' &&
      this.isOpen() &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    ) {
      event.preventDefault();
      this.close();
    }
  }

  onDocumentPointerdown(event: PointerEvent): void {
    const target = event.target as Node | null;
    if (
      this.isOpen() &&
      target &&
      !this.host.nativeElement.contains(target) &&
      claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
    )
      this.close();
  }

  private readonly generatedId = `jp-combobox-${++nextComboboxId}`;
  readonly options = input<readonly JpComboboxOption[]>([]);
  readonly placeholder = input(this.messages.combobox.placeholder);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingText = input(this.messages.combobox.loading);
  readonly emptyText = input(this.messages.combobox.empty);
  readonly open = signal(false);
  readonly query = signal('');
  readonly activeIndex = signal(-1);
  readonly label = input('');
  readonly ariaLabel = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly id = input<string | undefined>(undefined);
  readonly name = input('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly value = signal('');
  private readonly cvaDisabled = signal(false);
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly isInvalid = computed(() => this.invalid() || Boolean(this.error()));
  readonly describedBy = computed(() =>
    this.error()
      ? `${this.resolvedId()}-error`
      : this.hint()
        ? `${this.resolvedId()}-hint`
        : null,
  );
  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.cvaDisabled.set(disabled);
    if (disabled) this.close();
  }
  readonly filteredOptions = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return this.options().filter((option) =>
      option.label.toLocaleLowerCase().includes(query),
    );
  });
  readonly selectedLabel = computed(
    () =>
      this.options().find((option) => option.value === this.value())?.label ??
      '',
  );
  readonly displayValue = computed(() =>
    this.open() ? this.query() : this.selectedLabel(),
  );
  readonly isOpen = computed(() => this.open() && !this.isDisabled());
  readonly activeId = computed(() =>
    this.isOpen() &&
    !this.loading() &&
    this.filteredOptions()[this.activeIndex()]
      ? `${this.resolvedId()}-option-${this.activeIndex()}`
      : null,
  );
  onFocus(): void {
    if (this.isDisabled() || this.isOpen()) return;
    this.query.set('');
    this.open.set(true);
    this.activeIndex.set(-1);
  }
  onInput(event: Event): void {
    if (this.isDisabled()) return;
    this.query.set((event.target as HTMLInputElement).value);
    this.open.set(true);
    this.activeIndex.set(-1);
    if (!this.query()) {
      this.value.set('');
      this.onChange('');
    }
  }
  choose(option: JpComboboxOption): void {
    if (this.isDisabled() || option.disabled || this.loading()) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.close();
  }
  close(): void {
    this.cleanupOverlay();
    this.open.set(false);
    this.activeIndex.set(-1);
    this.query.set('');
  }
  onBlur(): void {
    this.close();
    this.onTouched();
  }
  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === 'Escape') {
      this.onDocumentKeydown(event);
      return;
    }
    if (event.key === 'Tab') {
      this.close();
      return;
    }
    if (event.key === 'Enter') {
      if (!this.isOpen()) return;
      event.preventDefault();
      const option = this.filteredOptions()[this.activeIndex()];
      if (option) this.choose(option);
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    if (!this.isOpen() && ['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (!this.isOpen()) this.onFocus();
    if (this.loading()) return;
    const enabled = this.filteredOptions()
      .map((option, i) => (option.disabled ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabled.length) {
      this.activeIndex.set(-1);
      return;
    }
    const position = enabled.indexOf(this.activeIndex());
    const next =
      event.key === 'Home'
        ? enabled[0]
        : event.key === 'End'
          ? enabled[enabled.length - 1]
          : event.key === 'ArrowDown'
            ? enabled[(position + 1) % enabled.length]
            : enabled[position <= 0 ? enabled.length - 1 : position - 1];
    this.activeIndex.set(next);
    // Wait for Angular to render the active descendant before scrolling it.
    const control = event.target as HTMLInputElement;
    queueMicrotask(() =>
      control.ownerDocument
        .getElementById(`${this.resolvedId()}-option-${next}`)
        ?.scrollIntoView?.({ block: 'nearest' }),
    );
  }
}
