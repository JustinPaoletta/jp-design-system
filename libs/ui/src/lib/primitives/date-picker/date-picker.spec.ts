import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { JpDatePicker } from './date-picker';
describe('JpDatePicker', () => {
  async function mount() {
    const f = TestBed.createComponent(JpDatePicker);
    f.componentRef.setInput('label', 'Launch date');
    f.detectChanges();
    return f;
  }
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
  it('uses a labelled native date input and notifies Angular forms when constraints change', async () => {
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
    expect(input.type).toBe('date');
    expect(input.value).toBe('2026-10-10');
    input.value = '2026-10-12';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
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
});
