import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { JpDateRangePicker } from './date-range-picker';
describe('JpDateRangePicker', () => {
  function mount() {
    const f = TestBed.createComponent(JpDateRangePicker);
    f.componentRef.setInput('label', 'Event dates');
    f.detectChanges();
    return f;
  }
  it('preserves invalid pairs for recovery and validates missing, ordered and bounded dates', () => {
    const f = mount(),
      c = f.componentInstance;
    expect(c.validate(new FormControl(null))).toBeNull();
    expect(c.validate(new FormControl(['', '']))).toBeNull();
    expect(c.validate(new FormControl(['2026-10-01', '']))).toEqual({
      dateRangeIncomplete: true,
    });
    expect(c.validate(new FormControl('invalid'))).toEqual({ dateRange: true });
    expect(c.validate(new FormControl(['2026-10-02', '2026-10-01']))).toEqual({
      dateOrder: true,
    });
    expect(
      c.validate(new FormControl(['2026-10-01', '2026-10-01'])),
    ).toBeNull();
    c.writeValue(['2026-10-02', '2026-10-01']);
    expect(c.value()).toEqual(['2026-10-02', '2026-10-01']);
    f.componentRef.setInput('required', true);
    f.detectChanges();
    expect(c.validate(new FormControl(null))).toEqual({ required: true });
    expect(c.validate(new FormControl(['', '']))).toHaveProperty('dateRange');
    f.componentRef.setInput('min', '2026-10-01');
    f.componentRef.setInput('max', '2026-10-31');
    f.detectChanges();
    expect(
      c.validate(new FormControl(['2026-09-01', '2026-10-01'])),
    ).toHaveProperty('dateRange');
  });
  it('connects native controls to CVA and blocks disabled/readonly mutations', () => {
    const f = mount(),
      c = f.componentInstance,
      changed = jest.fn(),
      touched = jest.fn(),
      validation = jest.fn();
    c.registerOnChange(changed);
    c.registerOnTouched(touched);
    c.registerOnValidatorChange(validation);
    f.componentRef.setInput('hint', 'Local dates');
    f.detectChanges();
    expect(c.describedBy()).toContain('-hint');
    f.componentRef.setInput('error', 'Wrong dates');
    f.detectChanges();
    expect(c.describedBy()).toContain('-error');
    const inputs = f.nativeElement.querySelectorAll('input');
    inputs[0].value = '2026-10-10';
    inputs[0].dispatchEvent(new Event('input'));
    expect(changed).toHaveBeenLastCalledWith(['2026-10-10', '']);
    inputs[1].value = '2026-10-12';
    inputs[1].dispatchEvent(new Event('input'));
    inputs[1].dispatchEvent(new Event('blur'));
    expect(changed).toHaveBeenLastCalledWith(['2026-10-10', '2026-10-12']);
    expect(touched).toHaveBeenCalled();
    c.setDisabledState(true);
    f.detectChanges();
    changed.mockClear();
    c.update(0, { target: inputs[0] } as unknown as Event);
    expect(changed).not.toHaveBeenCalled();
    c.setDisabledState(false);
    f.componentRef.setInput('readonly', true);
    f.componentRef.setInput('max', '2026-10-31');
    f.detectChanges();
    c.update(1, { target: inputs[1] } as unknown as Event);
    expect(changed).not.toHaveBeenCalled();
    expect(validation).toHaveBeenCalled();
    c.writeValue(null);
    expect(c.value()).toEqual(['', '']);
  });
});
