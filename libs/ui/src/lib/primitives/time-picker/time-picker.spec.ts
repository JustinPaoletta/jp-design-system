import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { JpTimePicker } from './time-picker';
describe('JpTimePicker', () => {
  function mount() {
    const f = TestBed.createComponent(JpTimePicker);
    f.componentRef.setInput('label', 'Start time');
    f.detectChanges();
    return f;
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
  it('renders native input and keeps readonly/CVA values', () => {
    const f = mount(),
      c = f.componentInstance;
    c.writeValue('12:30');
    f.componentRef.setInput('readonly', true);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input');
    expect(input.type).toBe('time');
    expect(input.value).toBe('12:30');
    expect(input.readOnly).toBe(true);
  });
});
