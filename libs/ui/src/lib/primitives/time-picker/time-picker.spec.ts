import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { JpTimePicker } from './time-picker';

describe('JpTimePicker', () => {
  function mount() {
    const fixture = TestBed.createComponent(JpTimePicker);
    fixture.componentRef.setInput('label', 'First pitch');
    fixture.detectChanges();
    return fixture;
  }
  it.each(['mouse', 'touch'])(
    'keeps button focus without cancelling %s activation',
    (pointerType) => {
      const f = mount();
      const trigger = f.nativeElement.querySelector('.jp-time-picker__trigger');
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
  const field = (fixture: ComponentFixture<JpTimePicker>) =>
    fixture.nativeElement.querySelector(
      '.jp-input__control',
    ) as HTMLInputElement;
  const open = (fixture: ComponentFixture<JpTimePicker>, value = '20:00') => {
    fixture.componentInstance.writeValue(value);
    fixture.componentInstance.show();
    fixture.detectChanges();
  };
  function edit(
    fixture: ComponentFixture<JpTimePicker>,
    part: 'hour' | 'minute' | 'second',
    value: string,
  ) {
    const input = fixture.nativeElement.querySelector(
      `[id="${fixture.componentInstance.resolvedId()}-${part}"]`,
    ) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('validates local wall time, bounds and step without timezone conversion', () => {
    const f = mount(),
      c = f.componentInstance;
    expect(c.validate(new FormControl('09:00'))).toBeNull();
    expect(c.validate(new FormControl(null))).toBeNull();
    for (const value of ['24:00', '23:60', '9:00', '09:00:60', 10])
      expect(c.validate(new FormControl(value))).toEqual({ time: true });
    f.componentRef.setInput('required', true);
    f.detectChanges();
    expect(c.validate(new FormControl(''))).toEqual({ required: true });
    f.componentRef.setInput('min', '09:00');
    f.componentRef.setInput('max', '17:00');
    f.componentRef.setInput('step', 900);
    f.detectChanges();
    expect(c.validate(new FormControl('08:45'))).toHaveProperty('minTime');
    expect(c.validate(new FormControl('17:15'))).toHaveProperty('maxTime');
    expect(c.validate(new FormControl('09:10'))).toHaveProperty('stepTime');
    expect(c.validate(new FormControl('09:15'))).toBeNull();
    f.componentRef.setInput('step', 'any');
    f.detectChanges();
    expect(c.validate(new FormControl('09:15:30.125'))).toBeNull();
    f.componentRef.setInput('step', 0);
    f.detectChanges();
    expect(c.validate(new FormControl('09:15'))).toEqual({ timeStep: true });
    f.componentRef.setInput('min', '18:00');
    f.detectChanges();
    expect(c.validate(new FormControl('09:15'))).toEqual({ timeBounds: true });
    f.componentRef.setInput('min', 'bad');
    f.detectChanges();
    expect(c.validate(new FormControl('09:15'))).toEqual({ timeBounds: true });
    f.componentRef.setInput('min', null);
    f.componentRef.setInput('max', 'bad');
    f.detectChanges();
    expect(c.validate(new FormControl('09:15'))).toEqual({ timeBounds: true });
  });

  it('uses themed text controls while preserving submission attributes and readonly values', () => {
    const f = mount();
    f.componentInstance.writeValue('12:30');
    f.componentRef.setInput('readonly', true);
    f.componentRef.setInput('name', 'firstPitch');
    f.componentRef.setInput('id', 'pitch-time');
    f.componentRef.setInput('ariaDescribedBy', 'external-hint');
    f.componentRef.setInput('hint', 'Local ballpark time.');
    f.componentRef.setInput('size', 'sm');
    f.detectChanges();
    expect(field(f).type).toBe('text');
    expect(field(f).value).toBe('12:30');
    expect(field(f).readOnly).toBe(true);
    expect(field(f).name).toBe('firstPitch');
    expect(field(f).id).toBe('pitch-time');
    expect(field(f).getAttribute('aria-describedby')).toBe(
      'pitch-time-hint external-hint',
    );
    f.componentInstance.show();
    expect(f.componentInstance.isOpen()).toBe(false);
    expect(f.nativeElement.querySelector('button').disabled).toBe(true);
    expect(
      f.nativeElement.querySelector(
        'input[type="time"], input[type="number"], select',
      ),
    ).toBeNull();
  });

  it('commits an aligned popup choice once, marks touched, and clears without resetting bounds', () => {
    const f = mount(),
      c = f.componentInstance;
    const changed = jest.fn(),
      touched = jest.fn();
    c.registerOnChange(changed);
    c.registerOnTouched(touched);
    f.componentRef.setInput('min', '09:00');
    f.componentRef.setInput('max', '22:00');
    f.componentRef.setInput('step', 900);
    open(f);
    expect(changed).not.toHaveBeenCalled();
    expect(c.isOpen()).toBe(true);
    c.adjust('minute', 1);
    f.detectChanges();
    expect(c.draftValue()).toBe('20:15');
    c.apply();
    f.detectChanges();
    expect(changed).toHaveBeenCalledTimes(1);
    expect(changed).toHaveBeenLastCalledWith('20:15');
    expect(touched).toHaveBeenCalled();
    expect(field(f).value).toBe('20:15');
    expect(c.isOpen()).toBe(false);
    c.show();
    f.detectChanges();
    c.clear();
    f.detectChanges();
    expect(changed).toHaveBeenLastCalledWith('');
    expect(field(f).value).toBe('');
    expect(c.min()).toBe('09:00');
  });

  it('preserves fractional seconds and repairs one-digit popup parts into canonical values', () => {
    const f = mount(),
      c = f.componentInstance;
    const changed = jest.fn();
    c.registerOnChange(changed);
    f.componentRef.setInput('min', '09:00:00.125');
    f.componentRef.setInput('step', 0.25);
    open(f, '09:15:30.125');
    expect(c.parts()).toHaveLength(3);
    expect(c.validDraft()).toBe(true);
    c.adjust('second', 1);
    f.detectChanges();
    expect(c.draftValue()).toBe('09:15:31.125');
    edit(f, 'second', '0.125');
    expect(c.draftValue()).toBe('09:15:00.125');
    c.apply();
    expect(changed).toHaveBeenLastCalledWith('09:15:00.125');
  });

  it('blocks invalid popup edits, steps and out-of-bounds actions', () => {
    const f = mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    f.componentRef.setInput('min', '20:00');
    f.componentRef.setInput('max', '20:30');
    f.componentRef.setInput('step', 900);
    open(f);
    expect(c.nextTime('minute', -1)).toBeNull();
    expect(c.nextTime('hour', 1)).toBeNull();
    c.adjust('hour', 1);
    expect(c.draftValue()).toBe('20:00');
    edit(f, 'minute', '12');
    expect(c.validDraft()).toBe(false);
    expect(f.nativeElement.querySelector('[role="status"]')).not.toBeNull();
    c.apply();
    expect(changed).not.toHaveBeenCalled();
    edit(f, 'minute', '');
    expect(c.draftValue()).toBe('');
    expect(c.partNumber('minute')).toBeNull();
    expect(c.nextTime('minute', 1)).toBeNull();
    edit(f, 'minute', '15');
    edit(f, 'hour', '24');
    expect(c.validDraft()).toBe(false);
    edit(f, 'hour', '20');
    expect(c.validDraft()).toBe(true);
    f.componentRef.setInput('step', 0);
    f.detectChanges();
    expect(c.nextTime('minute', 1)).toBeNull();
    f.componentRef.setInput('min', 'bad');
    f.detectChanges();
    expect(c.nextTime('minute', 1)).toBeNull();
  });

  it('supports keyboard increments, Enter and Escape without emitting abandoned drafts', () => {
    const f = mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    const down = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      altKey: true,
      cancelable: true,
    });
    field(f).dispatchEvent(down);
    f.detectChanges();
    expect(down.defaultPrevented).toBe(true);
    expect(c.isOpen()).toBe(true);
    const minute = f.nativeElement.querySelector(
      '[id$="-minute"]',
    ) as HTMLInputElement;
    minute.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      }),
    );
    minute.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }),
    );
    f.detectChanges();
    expect(c.draftValue()).toBe('00:00');
    minute.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      }),
    );
    minute.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      }),
    );
    f.detectChanges();
    expect(changed).toHaveBeenLastCalledWith('00:01');
    c.show();
    f.detectChanges();
    c.adjust('hour', 1);
    const escape = new KeyboardEvent('keydown', {
      key: 'Escape',
      cancelable: true,
    });
    c.onDocumentKeydown(escape);
    f.detectChanges();
    expect(escape.defaultPrevented).toBe(true);
    expect(c.isOpen()).toBe(false);
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('keeps exact typed time values and shows own inline validation instead of browser bubbles', () => {
    const f = mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    f.componentRef.setInput('required', true);
    f.detectChanges();
    const invalid = new Event('invalid', { cancelable: true });
    field(f).dispatchEvent(invalid);
    f.detectChanges();
    expect(invalid.defaultPrevented).toBe(true);
    expect(
      f.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain('Enter a time.');
    field(f).value = '25:00';
    field(f).dispatchEvent(new Event('input'));
    f.detectChanges();
    expect(changed).toHaveBeenLastCalledWith('25:00');
    expect(field(f).checkValidity()).toBe(false);
    f.detectChanges();
    expect(
      f.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain(c.timeMessages.dates.invalidTime);
    field(f).value = '20:08';
    field(f).dispatchEvent(new Event('input'));
    f.detectChanges();
    expect(field(f).checkValidity()).toBe(true);
    expect(f.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('closes for external resets, disabled/readonly changes, outside focus and teardown', () => {
    const f = mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    open(f);
    c.writeValue('10:15');
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    expect(field(f).value).toBe('10:15');
    c.toggle();
    f.detectChanges();
    c.toggle();
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    c.show();
    f.detectChanges();
    c.setDisabledState(true);
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    expect(field(f).disabled).toBe(true);
    c.show();
    expect(c.isOpen()).toBe(false);
    field(f).value = '19:00';
    c.onInput({ target: field(f) } as unknown as Event);
    expect(changed).not.toHaveBeenCalled();
    c.setDisabledState(false);
    c.show();
    f.detectChanges();
    f.componentRef.setInput('readonly', true);
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    f.componentRef.setInput('readonly', false);
    c.show();
    f.detectChanges();
    c.onFocusOut(
      new FocusEvent('focusout', {
        relatedTarget: document.createElement('button'),
      }),
    );
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    c.show();
    f.detectChanges();
    const outside = document.createElement('button');
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    c.onDocumentPointerdown({ target: outside } as unknown as PointerEvent);
    f.detectChanges();
    expect(c.isOpen()).toBe(false);
    c.show();
    f.detectChanges();
    const popup = f.nativeElement.querySelector(
      '[role="dialog"]',
    ) as HTMLElement;
    expect(popup.style.position).toBe('fixed');
    f.destroy();
    expect(popup.style.position).toBe('');
  });
  it('clears stale inline validation errors when changed constraints accept the current value', () => {
    const f = mount(),
      c = f.componentInstance;
    f.componentRef.setInput('required', true);
    f.detectChanges();
    field(f).dispatchEvent(new Event('invalid', { cancelable: true }));
    f.detectChanges();
    expect(c.displayedError()).toBe('Enter a time.');
    f.componentRef.setInput('required', false);
    f.detectChanges();
    expect(c.displayedError()).toBe('');
    expect(field(f).getAttribute('aria-invalid')).toBeNull();
    c.writeValue('21:00');
    f.componentRef.setInput('max', '20:00');
    f.detectChanges();
    field(f).dispatchEvent(new Event('invalid', { cancelable: true }));
    f.detectChanges();
    expect(c.displayedError()).toBe(c.timeMessages.dates.invalidTime);
    f.componentRef.setInput('max', '22:00');
    f.detectChanges();
    expect(c.displayedError()).toBe('');
    expect(field(f).validity.valid).toBe(true);
  });

  it('seeds out-of-bounds and off-step drafts with the nearest available bounded choice without emitting', () => {
    const f = mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    f.componentRef.setInput('min', '09:00');
    f.componentRef.setInput('max', '10:00');
    f.componentRef.setInput('step', 900);
    open(f, '00:00');
    expect(c.draftValue()).toBe('09:00');
    expect(c.validDraft()).toBe(true);
    c.adjust('minute', 1);
    expect(c.draftValue()).toBe('09:15');
    open(f, '23:00');
    expect(c.draftValue()).toBe('10:00');
    open(f, '09:08');
    expect(c.draftValue()).toBe('09:15');
    open(f, 'bad');
    expect(c.draftValue()).toBe('09:00');
    expect(changed).not.toHaveBeenCalled();
    expect(c.value()).toBe('bad');
    f.componentRef.setInput('max', '09:14');
    open(f, '10:00');
    expect(c.draftValue()).toBe('09:00');
    expect(c.validDraft()).toBe(true);
  });

  it('finds representable fractional-step choices instead of rounding to an invalid millisecond', () => {
    const f = mount(),
      c = f.componentInstance;
    f.componentRef.setInput('min', '00:00');
    f.componentRef.setInput('step', 0.0015);
    open(f, '00:00:00');
    c.adjust('second', 1);
    f.detectChanges();
    expect(c.draftValue()).toBe('00:00:01.002');
    expect(c.validDraft()).toBe(true);
    c.adjust('second', -1);
    f.detectChanges();
    expect(c.draftValue()).toBe('00:00:00');
    expect(c.validDraft()).toBe(true);
    f.componentRef.setInput('step', 1 / 3);
    open(f, '00:00:00');
    c.adjust('second', 1);
    f.detectChanges();
    expect(c.draftValue()).toBe('00:00:01');
    expect(c.validDraft()).toBe(true);
    f.componentRef.setInput('step', 0.000001);
    open(f, '00:00:00');
    c.adjust('second', 1);
    f.detectChanges();
    expect(c.validDraft()).toBe(true);
    expect(c.draftValue()).toBe('00:00:01');
    f.componentRef.setInput('step', 'any');
    open(f, '00:00:00.125');
    c.adjust('second', 1);
    f.detectChanges();
    expect(c.draftValue()).toBe('00:00:01.125');
    expect(c.validDraft()).toBe(true);
  });
  it('keeps pointer focus inside popup buttons until their click commits the draft', () => {
    const f = mount(),
      c = f.componentInstance,
      changed = jest.fn();
    c.registerOnChange(changed);
    f.componentRef.setInput('step', 900);
    open(f);
    c.adjust('minute', 1);
    f.detectChanges();
    const popup = f.nativeElement.querySelector(
      '.jp-time-picker__popup',
    ) as HTMLElement;
    const apply = popup.querySelector(
      '.jp-time-picker__apply',
    ) as HTMLButtonElement;
    const pointer = new MouseEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
    });
    apply.dispatchEvent(pointer);
    expect(pointer.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(apply);
    expect(c.isOpen()).toBe(true);
    expect(changed).not.toHaveBeenCalled();
    apply.click();
    f.detectChanges();
    expect(changed).toHaveBeenCalledWith('20:15');
    expect(c.isOpen()).toBe(false);
    expect(document.activeElement).toBe(field(f));
    c.show();
    f.detectChanges();
    const input = popup.querySelector('input') as HTMLInputElement;
    const textPointer = new MouseEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(textPointer);
    expect(textPointer.defaultPrevented).toBe(false);
    const button = popup.querySelector('button') as HTMLButtonElement;
    button.disabled = true;
    const disabledPointer = new MouseEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(disabledPointer);
    expect(disabledPointer.defaultPrevented).toBe(false);
  });
});
