import {
  afterRenderEffect,
  booleanAttribute,
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
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JpIcon } from '../icon/icon';
import {
  type JpControlSize,
  JP_CONTROL_SIZES,
} from '../shared/primitive-types';
import {
  controlSizeToCssVar,
  createStringUnionTransform,
} from '../shared/token-maps';
import {
  claimOverlayEvent,
  positionOverlay,
  registerOverlay,
} from '../shared/overlay-manager';

export type JpSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

let nextSelectId = 0;

@Component({
  selector: 'jp-select',
  imports: [JpIcon],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JpSelect),
      multi: true,
    },
  ],
  host: {
    class: 'jp-select',
    '[attr.id]': 'null',
    '[class.jp-select--sm]': 'size() === "sm"',
    '[class.jp-select--md]': 'size() === "md"',
    '[class.jp-select--lg]': 'size() === "lg"',
    '[class.jp-select--invalid]': 'isInvalid()',
    '[class.jp-select--disabled]': 'isDisabled()',
    '(document:keydown)': 'onDocumentKeydown($event)',
    '(document:pointerdown)': 'onDocumentPointerdown($event)',
  },
})
export class JpSelect implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly control =
    viewChild<ElementRef<HTMLButtonElement>>('control');
  private readonly popup = viewChild<ElementRef<HTMLElement>>('popup');
  private readonly nativeControl =
    viewChild<ElementRef<HTMLSelectElement>>('nativeControl');
  private readonly generatedId = `jp-select-${++nextSelectId}`;
  private readonly cvaDisabled = signal(false);
  private readonly nativeError = signal('');
  private overlayCleanup?: () => void;
  private typeahead = '';
  private lastTypeahead = 0;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly value = signal('');
  readonly open = signal(false);
  readonly activeIndex = signal(-1);
  readonly ariaLabel = input('');
  readonly name = input('');
  readonly autocomplete = input('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly id = input<string | undefined>(undefined);
  readonly options = input<readonly JpSelectOption[]>([]);
  readonly size = input<JpControlSize, unknown>('md', {
    transform: createStringUnionTransform(JP_CONTROL_SIZES, 'md'),
  });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly hintId = computed(() => `${this.resolvedId()}-hint`);
  readonly errorId = computed(() => `${this.resolvedId()}-error`);
  readonly displayedError = computed(() => this.error() || this.nativeError());
  readonly describedBy = computed(() =>
    this.displayedError() ? this.errorId() : this.hint() ? this.hintId() : null,
  );
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly isInvalid = computed(
    () => this.invalid() || Boolean(this.displayedError()),
  );
  readonly isOpen = computed(() => this.open() && !this.isDisabled());
  readonly controlHeight = computed(() => controlSizeToCssVar(this.size()));
  readonly selectedOption = computed(() =>
    this.options().find((option) => option.value === this.value()),
  );
  readonly hasEmptyOption = computed(() =>
    this.options().some((option) => option.value === ''),
  );
  readonly activeId = computed(() =>
    this.isOpen() &&
    this.options()[this.activeIndex()] &&
    !this.options()[this.activeIndex()].disabled
      ? `${this.resolvedId()}-option-${this.activeIndex()}`
      : null,
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.cleanupOverlay());
    effect(() => {
      const disabled = this.isDisabled();
      const options = this.options();
      const value = this.value();
      untracked(() => {
        if (disabled) this.close();
        else if (this.isOpen())
          this.activeIndex.set(this.initialIndex(options, value));
      });
    });
    afterRenderEffect(() => {
      const open = this.isOpen();
      const panel = this.popup()?.nativeElement;
      const anchor = this.control()?.nativeElement;
      const activeId = this.activeId();
      if (!open) {
        this.cleanupOverlay();
        return;
      }
      if (!panel || !anchor) return;
      if (!this.overlayCleanup) {
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
      }
      if (activeId)
        panel.ownerDocument
          .getElementById(activeId)
          ?.scrollIntoView?.({ block: 'nearest' });
    });
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
    this.nativeError.set('');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    if (isDisabled) this.close();
  }
  toggle(): void {
    if (this.isOpen()) this.close();
    else this.show();
  }
  private show(last = false): void {
    if (this.isDisabled()) return;
    this.activeIndex.set(this.initialIndex(this.options(), this.value(), last));
    this.open.set(true);
  }
  private initialIndex(
    options: readonly JpSelectOption[],
    value: string,
    last = false,
  ): number {
    const selected = options.findIndex(
      (option) => option.value === value && !option.disabled,
    );
    if (selected >= 0) return selected;
    if (last) {
      for (let index = options.length - 1; index >= 0; index--) {
        if (!options[index].disabled) return index;
      }
      return -1;
    }
    return options.findIndex((option) => !option.disabled);
  }
  choose(option: JpSelectOption): void {
    if (this.isDisabled() || option.disabled) return;
    if (this.value() !== option.value) {
      this.value.set(option.value);
      this.onChange(option.value);
    }
    this.nativeError.set('');
    this.close();
    this.control()?.nativeElement.focus({ preventScroll: true });
  }
  close(): void {
    this.cleanupOverlay();
    this.open.set(false);
    this.activeIndex.set(-1);
    this.typeahead = '';
  }
  private cleanupOverlay(): void {
    this.overlayCleanup?.();
    this.overlayCleanup = undefined;
  }
  onSelectChange(event: Event): void {
    const next = (event.target as HTMLSelectElement).value;
    const option = this.options().find((option) => option.value === next);
    if (option) this.choose(option);
  }
  onNativeInvalid(event: Event): void {
    event.preventDefault();
    this.nativeError.set(
      this.nativeControl()?.nativeElement.validationMessage ?? '',
    );
    this.focusControl();
  }
  focusControl(): void {
    this.control()?.nativeElement.focus({ preventScroll: true });
  }
  onBlur(): void {
    this.close();
    this.onTouched();
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
      this.close();
    }
  }
  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (Date.now() - this.lastTypeahead > 700) this.typeahead = '';
    if (event.key === 'Escape') {
      this.onDocumentKeydown(event);
      return;
    }
    if (event.key === 'Tab') {
      this.close();
      return;
    }
    if (event.altKey && event.key === 'ArrowUp') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Enter' || (event.key === ' ' && !this.typeahead)) {
      event.preventDefault();
      if (!this.isOpen()) this.show();
      else {
        const option = this.options()[this.activeIndex()];
        if (option) this.choose(option);
      }
      return;
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      this.typeahead = '';
      const wasOpen = this.isOpen();
      if (!wasOpen) this.show(event.key === 'ArrowUp' || event.key === 'End');
      const enabled = this.options()
        .map((option, index) => (option.disabled ? -1 : index))
        .filter((index) => index >= 0);
      if (!enabled.length) return;
      const position = enabled.indexOf(this.activeIndex());
      if (event.key === 'Home') this.activeIndex.set(enabled[0]);
      else if (event.key === 'End')
        this.activeIndex.set(enabled[enabled.length - 1]);
      else if (wasOpen)
        this.activeIndex.set(
          event.key === 'ArrowDown'
            ? enabled[(position + 1) % enabled.length]
            : enabled[position <= 0 ? enabled.length - 1 : position - 1],
        );
      return;
    }
    if (event.key.length === 1) {
      event.preventDefault();
      const now = Date.now();
      if (now - this.lastTypeahead > 700) this.typeahead = '';
      this.lastTypeahead = now;
      this.typeahead += event.key.toLocaleLowerCase();
      if (!this.isOpen()) this.show();
      const repeated = [...this.typeahead].every(
        (letter) => letter === this.typeahead[0],
      );
      const query = repeated ? this.typeahead[0] : this.typeahead;
      const options = this.options();
      const start = this.activeIndex() + (repeated ? 1 : 0);
      for (let offset = 0; offset < options.length; offset++) {
        const index = (Math.max(0, start) + offset) % options.length;
        const option = options[index];
        if (
          !option.disabled &&
          option.label.trim().toLocaleLowerCase().startsWith(query)
        ) {
          this.activeIndex.set(index);
          break;
        }
      }
    }
  }
}
