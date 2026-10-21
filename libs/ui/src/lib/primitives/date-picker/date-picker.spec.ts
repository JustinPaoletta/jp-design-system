import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { JpDatePicker } from './date-picker';
import { claimOverlayEvent, registerOverlay } from '../shared/overlay-manager';
describe('JpDatePicker', () => {
  async function mount() {
    const f = TestBed.createComponent(JpDatePicker);
    f.componentRef.setInput('label', 'Launch date');
    f.detectChanges();
    return f;
  }
  it.each(['mouse', 'touch'])(
    'keeps button focus without cancelling %s activation',
    async (pointerType) => {
      const f = await mount();
      const trigger = f.nativeElement.querySelector('.jp-date-picker__trigger');
      const event = new Event('pointerdown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'pointerType', { value: pointerType });
      const input = f.nativeElement.querySelector('input');
      input.focus();
      trigger.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(pointerType === 'mouse');
      expect(document.activeElement).toBe(
        pointerType === 'touch' ? input : trigger,
      );
      const mouse = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      trigger.dispatchEvent(mouse);
      expect(mouse.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(trigger);
    },
  );
  it('validates local dates, Gregorian leap years, configured bounds, and required emptiness', async () => {
    const f = await mount(),
      c = f.componentInstance;
    for (const value of ['2024-02-29', '2000-02-29', '0001-01-01'])
      expect(c.validate(new FormControl(value))).toBeNull();
    for (const value of [
      '2023-02-29',
      '1900-02-29',
      '2026-13-01',
      '2026-00-01',
      '2026-01-00',
      '0000-01-01',
      '10/10/2026',
      42,
    ])
      expect(c.validate(new FormControl(value))).toEqual({ date: true });
    expect(c.validate(new FormControl(''))).toBeNull();
    f.componentRef.setInput('required', true);
    f.detectChanges();
    expect(c.validate(new FormControl(null))).toEqual({ required: true });
    f.componentRef.setInput('min', '2026-10-01');
    f.componentRef.setInput('max', '2026-10-31');
    f.detectChanges();
    expect(c.validate(new FormControl('2026-09-30'))).toHaveProperty('minDate');
    expect(c.validate(new FormControl('2026-11-01'))).toHaveProperty('maxDate');
    f.componentRef.setInput('step', 2);
    f.detectChanges();
    expect(c.validate(new FormControl('2026-10-02'))).toHaveProperty(
      'stepDate',
    );
    expect(c.validate(new FormControl('2026-10-03'))).toBeNull();
    f.componentRef.setInput('step', 'any');
    f.detectChanges();
    expect(c.validate(new FormControl('2026-10-02'))).toBeNull();
    f.componentRef.setInput('step', 0);
    f.detectChanges();
    expect(c.validate(new FormControl('2026-10-02'))).toEqual({
      dateStep: true,
    });
    f.componentRef.setInput('step', null);
    f.detectChanges();
    f.componentRef.setInput('max', '2026-09-01');
    f.detectChanges();
    expect(c.validate(new FormControl('2026-10-10'))).toEqual({
      dateBounds: true,
    });
    f.componentRef.setInput('min', 'bad');
    f.detectChanges();
    expect(c.validate(new FormControl('2026-10-10'))).toEqual({
      dateBounds: true,
    });
  });
  it('uses a labelled date text field and notifies Angular forms when constraints change', async () => {
    const f = await mount(),
      c = f.componentInstance,
      changed = jest.fn(),
      touched = jest.fn(),
      validation = jest.fn();
    c.registerOnChange(changed);
    c.registerOnTouched(touched);
    c.registerOnValidatorChange(validation);
    c.writeValue('2026-10-10');
    f.detectChanges();
    const input = f.nativeElement.querySelector('input');
    expect(input.type).toBe('text');
    expect(input.value).toBe('2026-10-10');
    input.value = '2026-10-12';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(changed).toHaveBeenCalledWith('2026-10-12');
    expect(touched).toHaveBeenCalled();
    f.componentRef.setInput('max', '2026-10-20');
    f.detectChanges();
    expect(validation).toHaveBeenCalled();
    c.setDisabledState(true);
    f.detectChanges();
    expect(input.disabled).toBe(true);
    c.writeValue(null);
    f.detectChanges();
    expect(input.value).toBe('');
  });
  it('opens a themed calendar, commits a date once, and returns focus to its trigger', async () => {
    const f = await mount(),
      c = f.componentInstance,
      changed = jest.fn(),
      touched = jest.fn();
    c.registerOnChange(changed);
    c.registerOnTouched(touched);
    c.writeValue('2024-02-29');
    c.show();
    f.detectChanges();
    const panel = f.nativeElement.querySelector('[role="dialog"]');
    expect(panel.getAttribute('aria-label')).toBe('Launch date calendar');
    expect(panel.querySelector('[role="grid"]').textContent).toContain('29');
    expect(document.activeElement).toBe(
      panel.querySelector('[data-date="2024-02-29"]'),
    );
    panel.querySelector('[data-date="2024-02-28"]').click();
    f.detectChanges();
    expect(changed).toHaveBeenCalledTimes(1);
    expect(changed).toHaveBeenCalledWith('2024-02-28');
    expect(touched).toHaveBeenCalled();
    expect(c.isOpen()).toBe(false);
    expect(document.activeElement).toBe(
      f.nativeElement.querySelector('.jp-date-picker__trigger'),
    );
  });
  it('preserves required, min, max and step constraints for calendar selection and native forms', async () => {
    const f = await mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    f.componentRef.setInput('min', '2026-10-01');
    f.componentRef.setInput('max', '2026-10-10');
    f.componentRef.setInput('step', 2);
    f.componentRef.setInput('required', true);
    f.componentRef.setInput('name', 'gameDate');
    c.writeValue('2026-10-03');
    c.show();
    f.detectChanges();
    const day = (value: string) =>
      f.nativeElement.querySelector(
        `[data-date="${value}"]`,
      ) as HTMLButtonElement;
    for (const value of ['2026-09-30', '2026-10-02', '2026-10-11']) {
      expect(day(value).getAttribute('aria-disabled')).toBe('true');
      day(value).click();
      expect(changed).not.toHaveBeenCalled();
      expect(c.isOpen()).toBe(true);
    }
    day('2026-10-05').click();
    f.detectChanges();
    expect(changed).toHaveBeenCalledWith('2026-10-05');
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.name).toBe('gameDate');
    c.writeValue('2026-10-02');
    f.detectChanges();
    expect(input.validity.customError).toBe(true);
    input.dispatchEvent(new Event('invalid', { cancelable: true }));
    f.detectChanges();
    expect(
      f.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain('Enter a valid date');
    c.writeValue(null);
    f.detectChanges();
    expect(input.validity.valueMissing).toBe(true);
  });
  it('moves across weeks, months, leap years and year boundaries without committing navigation', async () => {
    const f = await mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    c.writeValue('2024-01-31');
    c.show();
    f.detectChanges();
    const key = (key: string, shiftKey = false) => {
      c.onDayKeydown(
        new KeyboardEvent('keydown', { key, shiftKey, cancelable: true }),
      );
      f.detectChanges();
    };
    key('PageDown');
    expect(c.activeDate()).toBe('2024-02-29');
    key('PageUp', true);
    expect(c.activeDate()).toBe('2023-02-28');
    key('Home');
    expect(c.activeDate()).toBe('2023-02-26');
    key('End');
    expect(c.activeDate()).toBe('2023-03-04');
    key('ArrowUp');
    expect(c.activeDate()).toBe('2023-02-25');
    key('ArrowLeft');
    expect(c.activeDate()).toBe('2023-02-24');
    key('ArrowDown');
    expect(c.activeDate()).toBe('2023-03-03');
    f.nativeElement.style.direction = 'rtl';
    key('ArrowLeft');
    expect(c.activeDate()).toBe('2023-03-04');
    expect(changed).not.toHaveBeenCalled();
    c.writeValue('0001-01-01');
    c.show();
    f.detectChanges();
    key('ArrowUp');
    expect(c.activeDate()).toBe('0001-01-01');
    expect(c.canMoveMonth(-1)).toBe(false);
    c.writeValue('9999-12-31');
    c.show();
    f.detectChanges();
    key('ArrowRight');
    expect(c.activeDate()).toBe('9999-12-30');
    expect(c.canMoveMonth(1)).toBe(false);
  });
  it.each(['Enter', ' '])(
    'commits the active date before the next render with %s',
    async (key) => {
      const f = await mount(),
        c = f.componentInstance,
        changed = jest.fn();
      c.registerOnChange(changed);
      c.writeValue('2026-10-31');
      c.show(true);
      f.detectChanges();
      const oldDay = f.nativeElement.querySelector('[data-date="2026-10-31"]');
      oldDay.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          cancelable: true,
        }),
      );
      // Enter can arrive before Angular moves focus or renders the next month.
      const activation = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
      });
      oldDay.dispatchEvent(activation);
      expect(activation.defaultPrevented).toBe(true);
      expect(changed).toHaveBeenCalledTimes(1);
      expect(changed).toHaveBeenCalledWith('2026-11-01');
      expect(c.isOpen()).toBe(false);
      f.detectChanges();
      expect(document.activeElement).toBe(
        f.nativeElement.querySelector('input'),
      );
    },
  );
  it('supports text entry, ArrowDown, Escape, and dismissal outside the control', async () => {
    const f = await mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '2026-10-12';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }),
    );
    f.detectChanges();
    expect(c.activeDate()).toBe('2026-10-12');
    expect(c.isOpen()).toBe(true);
    c.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }),
    );
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    expect(document.activeElement).toBe(input);
    expect(changed).toHaveBeenCalledTimes(1);
    c.show();
    f.detectChanges();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    c.show();
    f.detectChanges();
    c.onFocusout(new FocusEvent('focusout', { relatedTarget: document.body }));
    expect(c.isOpen()).toBe(false);
  });
  it('closes on reset or disable and cannot open or commit while disabled or read-only', async () => {
    const f = await mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    c.writeValue('2026-10-12');
    c.show();
    f.detectChanges();
    c.writeValue(null);
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    c.show();
    c.setDisabledState(true);
    f.detectChanges();
    c.show();
    c.choose('2026-10-13');
    expect(c.isOpen()).toBe(false);
    expect(c.value()).toBe('');
    c.setDisabledState(false);
    f.componentRef.setInput('readonly', true);
    f.detectChanges();
    c.show();
    c.choose('2026-10-13');
    expect(c.isOpen()).toBe(false);
    expect(changed).not.toHaveBeenCalled();
    expect(f.nativeElement.querySelector('input').readOnly).toBe(true);
    expect(
      f.nativeElement.querySelector('.jp-date-picker__trigger').disabled,
    ).toBe(true);
  });
  it('uses localized Gregorian month and weekday names and an explicit week start', async () => {
    const f = await mount(),
      c = f.componentInstance;
    f.componentRef.setInput('locale', 'fr-FR');
    f.componentRef.setInput('weekStartsOn', 1);
    c.writeValue('2024-02-29');
    c.show();
    f.detectChanges();
    expect(c.monthLabel()).toBe('février 2024');
    expect(c.weekdays()[0].long).toBe('lundi');
    expect(c.weeks()[0][0].value).toBe('2024-01-29');
    f.componentRef.setInput('locale', 'invalid_locale');
    f.componentRef.setInput('weekStartsOn', NaN);
    f.detectChanges();
    expect(c.monthLabel()).toBe('February 2024');
    expect(c.weekdays()[0].long).toBe('Sunday');
  });
  it('coordinates nested Escape dismissal and unregisters its overlay on destruction', async () => {
    const f = await mount(),
      c = f.componentInstance;
    c.show();
    f.detectChanges();
    const owner = {},
      cleanup = registerOverlay(owner, document);
    c.onDocumentKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(c.isOpen()).toBe(true);
    cleanup();
    f.destroy();
    expect(claimOverlayEvent(owner, new Event('pointerdown'), document)).toBe(
      true,
    );
  });
  it('clamps an empty or out-of-bounds initial date and safely handles boundary navigation', async () => {
    const f = await mount(),
      c = f.componentInstance;
    expect(c.monthLabel()).toBe('');
    expect(c.weeks()).toEqual([]);
    expect(c.canMoveMonth(-1)).toBe(false);
    expect(c.canChoose('')).toBe(false);
    c.changeMonth(1);
    c.onDayKeydown(new KeyboardEvent('keydown', { key: 'PageDown' }));
    f.componentRef.setInput('min', '9999-12-01');
    c.show();
    f.detectChanges();
    expect(c.activeDate()).toBe('9999-12-01');
    c.changeMonth(1);
    expect(c.activeDate()).toBe('9999-12-01');
    c.close();
    f.componentRef.setInput('min', null);
    f.componentRef.setInput('max', '0001-01-31');
    c.show();
    f.detectChanges();
    expect(c.activeDate()).toBe('0001-01-31');
    c.changeMonth(-1);
    expect(c.activeDate()).toBe('0001-01-31');
  });
  it('keeps the popup open for internal focus, toggles it, and ignores unavailable or unrelated input', async () => {
    const f = await mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    c.writeValue('2026-10-12');
    const trigger = f.nativeElement.querySelector(
      '.jp-date-picker__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    f.detectChanges();
    c.onFocusout(new FocusEvent('focusout', { relatedTarget: trigger }));
    expect(c.isOpen()).toBe(true);
    c.onDocumentPointerdown(new Event('pointerdown') as PointerEvent);
    for (const event of [
      new KeyboardEvent('keydown', { key: 'F1' }),
      new KeyboardEvent('keydown', { key: 'ArrowDown', ctrlKey: true }),
    ])
      c.onDayKeydown(event);
    expect(c.activeDate()).toBe('2026-10-12');
    trigger.click();
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    f.componentRef.setInput('readonly', true);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '2026-10-13';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(c.value()).toBe('2026-10-12');
    expect(c.isOpen()).toBe(false);
    expect(changed).not.toHaveBeenCalled();
  });
  it('shows its own required message and clears stale inline errors when constraints become valid', async () => {
    const f = await mount(),
      c = f.componentInstance;
    f.componentRef.setInput('required', true);
    f.componentRef.setInput('hint', 'Use the season calendar.');
    f.componentRef.setInput('ariaDescribedBy', 'season-hint');
    f.detectChanges();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toBe(
      `${c.hintId()} season-hint`,
    );
    input.dispatchEvent(new Event('invalid', { cancelable: true }));
    f.detectChanges();
    expect(c.displayedError()).toBe('Enter a date.');
    expect(input.getAttribute('aria-describedby')).toBe(
      `${c.errorId()} season-hint`,
    );
    c.writeValue('2026-10-12');
    f.componentRef.setInput('max', '2026-10-10');
    f.detectChanges();
    input.dispatchEvent(new Event('invalid', { cancelable: true }));
    f.detectChanges();
    expect(c.displayedError()).toContain('Enter a valid date');
    f.componentRef.setInput('max', '2026-10-31');
    f.detectChanges();
    expect(c.displayedError()).toBe('');
    expect(input.validity.valid).toBe(true);
  });
  it('keeps pointer actions focused inside the calendar before changing months', () => {
    const f = TestBed.createComponent(JpDatePicker);
    f.componentRef.setInput('label', 'Game date');
    f.detectChanges();
    f.componentInstance.writeValue('2024-10-30');
    f.componentInstance.show();
    f.detectChanges();
    const popup: HTMLElement = f.nativeElement.querySelector(
      '.jp-date-picker__popup',
    );
    const next: HTMLButtonElement = popup.querySelector(
      '[aria-label="Next month"]',
    ) as HTMLButtonElement;
    const pointer = new Event('pointerdown', {
      bubbles: true,
      cancelable: true,
    });
    next.dispatchEvent(pointer);
    expect(pointer.defaultPrevented).toBe(true);
    next.click();
    f.detectChanges();
    expect(f.componentInstance.isOpen()).toBe(true);
    expect(f.componentInstance.monthLabel()).toBe('November 2024');
    const surface = new Event('pointerdown', {
      bubbles: true,
      cancelable: true,
    });
    popup.dispatchEvent(surface);
    expect(surface.defaultPrevented).toBe(false);
  });
});
