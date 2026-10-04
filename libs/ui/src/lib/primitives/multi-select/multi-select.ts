import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  DestroyRef,
  ElementRef,
  effect,
  forwardRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JP_MESSAGES } from '../../i18n';
import { JpChip } from '../chip/chip';
import { JpIcon } from '../icon/icon';
import { type JpChoiceOption } from '../shared/selection-types';
import {
  claimOverlayEvent,
  positionOverlay,
  registerOverlay,
} from '../shared/overlay-manager';
let nextMultiId = 0;
@Component({
  selector: 'jp-multi-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpMultiSelect),
      multi: true,
    },
  ],
  host: {
    '[attr.id]': 'null',
    '(document:pointerdown)': 'onDocumentPointer($event)',
  },
  imports: [JpChip, JpIcon],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpMultiSelect implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messages = inject(JP_MESSAGES);
  private readonly control = viewChild<ElementRef<HTMLInputElement>>('control');
  private readonly popup = viewChild<ElementRef<HTMLElement>>('popup');
  private overlayCleanup?: () => void;
  private readonly cvaDisabled = signal(false);
  private readonly generatedId = `jp-multi-select-${++nextMultiId}`;
  private onChange: (values: readonly string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  readonly options = input.required<readonly JpChoiceOption[]>();
  readonly label = input.required<string>();
  readonly id = input('');
  readonly placeholder = input(this.messages.combobox.placeholder);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingText = input(this.messages.combobox.loading);
  readonly emptyText = input(this.messages.combobox.empty);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly hint = input('');
  readonly error = input('');
  readonly value = signal<readonly string[]>([]);
  readonly query = signal('');
  readonly isOpen = signal(false);
  readonly activeIndex = signal(-1);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly filteredOptions = computed(() =>
    this.options().filter((option) =>
      option.label
        .toLocaleLowerCase()
        .includes(this.query().toLocaleLowerCase()),
    ),
  );
  readonly selected = computed(() =>
    this.value().map(
      (value) =>
        this.options().find((option) => option.value === value) ?? {
          value,
          label: value,
        },
    ),
  );
  readonly describedBy = computed(
    () =>
      [
        this.hint() ? `${this.resolvedId()}-hint` : '',
        this.error() ? `${this.resolvedId()}-error` : '',
      ]
        .filter(Boolean)
        .join(' ') || null,
  );
  readonly activeId = computed(() =>
    this.isOpen() &&
    !this.isDisabled() &&
    !this.loading() &&
    this.filteredOptions()[this.activeIndex()] &&
    !this.filteredOptions()[this.activeIndex()].disabled
      ? `${this.resolvedId()}-option-${this.activeIndex()}`
      : null,
  );
  constructor() {
    this.destroyRef.onDestroy(() => this.cleanup());
    effect(() => {
      if (this.isDisabled()) this.close();
    });
    afterRenderEffect(() => {
      const open = this.isOpen() && !this.isDisabled();
      if (!open) {
        this.cleanup();
        return;
      }
      if (this.overlayCleanup) return;
      const control = this.control()?.nativeElement;
      const popup = this.popup()?.nativeElement;
      if (!control || !popup) return;
      const unregister = registerOverlay(this, control.ownerDocument);
      const unposition = positionOverlay(popup, control);
      this.overlayCleanup = () => {
        unposition();
        unregister();
      };
    });
  }
  private cleanup(): void {
    this.overlayCleanup?.();
    this.overlayCleanup = undefined;
  }
  writeValue(values: readonly string[] | null): void {
    this.value.set([...new Set(values ?? [])]);
  }
  registerOnChange(fn: (values: readonly string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(value: boolean): void {
    this.cvaDisabled.set(value);
    if (value) this.close();
  }
  open(): void {
    if (this.isDisabled()) return;
    this.isOpen.set(true);
    this.activeIndex.set(
      this.filteredOptions().findIndex((option) => !option.disabled),
    );
  }
  close(): void {
    this.isOpen.set(false);
    this.query.set('');
    this.activeIndex.set(-1);
    this.cleanup();
  }
  onInput(event: Event): void {
    if (this.isDisabled()) return;
    this.query.set((event.target as HTMLInputElement).value);
    this.open();
  }
  toggle(option: JpChoiceOption): void {
    if (this.isDisabled() || option.disabled || this.loading()) return;
    const values = new Set(this.value());
    if (values.has(option.value)) values.delete(option.value);
    else values.add(option.value);
    const next = [...values];
    this.value.set(next);
    this.onChange(next);
  }
  remove(option: JpChoiceOption): void {
    if (this.isDisabled() || option.disabled) return;
    const next = this.value().filter((value) => value !== option.value);
    this.value.set(next);
    this.onChange(next);
    this.control()?.nativeElement.focus();
    afterNextRender(() => this.control()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }
  onBlur(): void {
    this.onTouched();
  }
  onFocusOut(event: FocusEvent): void {
    if (
      !(event.relatedTarget instanceof Node) ||
      !this.host.nativeElement.contains(event.relatedTarget)
    )
      this.close();
  }
  onDocumentPointer(event: PointerEvent): void {
    if (
      !this.isOpen() ||
      this.host.nativeElement.contains(event.target as Node)
    )
      return;
    if (claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument))
      this.close();
  }
  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === 'Escape') {
      if (
        this.isOpen() &&
        claimOverlayEvent(this, event, this.host.nativeElement.ownerDocument)
      ) {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      }
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
      if (option) this.toggle(option);
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    if (!this.isOpen() && ['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (!this.isOpen()) {
      this.open();
      return;
    }
    if (this.loading()) return;
    const enabled = this.filteredOptions()
      .map((option, index) => (option.disabled ? -1 : index))
      .filter((index) => index >= 0);
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
    queueMicrotask(() =>
      this.host.nativeElement.ownerDocument
        .getElementById(`${this.resolvedId()}-option-${next}`)
        ?.scrollIntoView?.({ block: 'nearest' }),
    );
  }
}
