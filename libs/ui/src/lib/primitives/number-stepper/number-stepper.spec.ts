import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JpNumberStepper } from './number-stepper';
import { JpSlider } from '../slider/slider';
import { JpRangeSlider, type JpRangeValue } from '../range-slider/range-slider';
import { JpChecklist } from '../checklist/checklist';
@Component({
  imports: [
    ReactiveFormsModule,
    JpNumberStepper,
    JpSlider,
    JpRangeSlider,
    JpChecklist,
  ],
  template: ` <jp-number-stepper label="Quantity" [formControl]="number" />
    <jp-slider label="Volume" [formControl]="slider" />
    <jp-range-slider label="Budget" [formControl]="range" />
    <jp-checklist
      label="Tasks"
      [items]="[{ id: 'task', label: 'Task' }]"
      [formControl]="tasks"
    />`,
})
class Host {
  number = new FormControl<number | null>(2);
  slider = new FormControl(20);
  range = new FormControl<JpRangeValue>([10, 30], { nonNullable: true });
  tasks = new FormControl<readonly string[]>([], { nonNullable: true });
}
describe('JpNumberStepper', () => {
  async function mount(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [JpNumberStepper],
    }).compileComponents();
    const f = TestBed.createComponent(JpNumberStepper);
    f.componentRef.setInput('label', 'Quantity');
    for (const [key, value] of Object.entries(inputs))
      f.componentRef.setInput(key, value);
    f.detectChanges();
    return f;
  }
  it('stops at the last valid step when the maximum is off-grid', async () => {
    const f = await mount({ min: 0.1, max: 0.55, step: 0.1 });
    f.componentInstance.writeValue(0.4);
    f.componentInstance.adjust(1);
    f.detectChanges();
    expect(f.componentInstance.value()).toBe(0.5);
    expect(f.componentInstance.canIncrease()).toBe(false);
    const control = f.nativeElement.querySelector('input') as HTMLInputElement;
    expect(control.validity.stepMismatch).toBe(false);
    f.componentInstance.adjust(1);
    expect(f.componentInstance.value()).toBe(0.5);
  });
  it('steps decimal values on the min-based grid, clamps button actions, and handles empty values', async () => {
    const f = await mount({ min: 0.1, max: 0.5, step: 0.1 });
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    f.componentInstance.adjust(1);
    expect(changed).toHaveBeenLastCalledWith(0.1);
    f.componentInstance.adjust(1);
    expect(changed).toHaveBeenLastCalledWith(0.2);
    f.componentInstance.writeValue(0.25);
    f.componentInstance.adjust(1);
    expect(changed).toHaveBeenLastCalledWith(0.3);
    f.componentInstance.adjust(-1);
    expect(changed).toHaveBeenLastCalledWith(0.2);
    f.componentInstance.writeValue(0.5);
    f.componentInstance.adjust(1);
    expect(f.componentInstance.value()).toBe(0.5);
    f.componentInstance.writeValue(0.1);
    f.componentInstance.adjust(-1);
    expect(f.componentInstance.value()).toBe(0.1);
    f.componentInstance.writeValue(null);
    f.componentInstance.adjust(-1);
    expect(f.componentInstance.value()).toBe(0.1);
  });
  it('preserves typed out-of-range numbers for validation, supports clearing, and describes errors', async () => {
    const f = await mount({
      id: 'count',
      min: 1,
      max: 3,
      hint: 'Up to three',
      error: 'Too many',
    });
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '9';
    input.dispatchEvent(new Event('input'));
    expect(f.componentInstance.value()).toBe(9);
    expect(input.getAttribute('aria-describedby')).toBe(
      'count-hint count-error',
    );
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(f.nativeElement.getAttribute('id')).toBeNull();
    expect(input.id).toBe('count');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    expect(f.componentInstance.value()).toBeNull();
    f.componentInstance.writeValue(NaN);
    expect(f.componentInstance.value()).toBeNull();
  });
  it('ignores disabled/read-only actions and normalizes invalid bounds and steps', async () => {
    const f = await mount({ readonly: true });
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    f.componentInstance.adjust(1);
    f.componentInstance.adjust(-1);
    f.componentInstance.onInput(new Event('input'));
    expect(changed).not.toHaveBeenCalled();
    f.componentRef.setInput('readonly', false);
    f.componentInstance.setDisabledState(true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('input').disabled).toBe(true);
    f.componentInstance.onInput(new Event('input'));
    expect(changed).not.toHaveBeenCalled();
    f.componentInstance.setDisabledState(false);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(f.componentInstance.canIncrease()).toBe(false);
    f.componentRef.setInput('disabled', false);
    f.componentRef.setInput('min', NaN);
    f.componentRef.setInput('max', Infinity);
    f.componentRef.setInput('step', 0);
    f.detectChanges();
    expect(f.componentInstance.safeMin()).toBeNull();
    expect(f.componentInstance.safeMax()).toBeNull();
    expect(f.componentInstance.safeStep()).toBe(1);
    f.componentInstance.writeValue(0);
    f.componentInstance.adjust(-1);
    expect(f.componentInstance.value()).toBe(-1);
    f.componentRef.setInput('min', 4);
    f.componentRef.setInput('max', 2);
    f.detectChanges();
    expect(f.componentInstance.safeMax()).toBe(4);
  });
  it('integrates all new selection/numeric controls with reactive forms and touched/disabled state', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const host = f.componentInstance;
    const quantity = f.nativeElement.querySelector(
      'jp-number-stepper input',
    ) as HTMLInputElement;
    expect(quantity.value).toBe('2');
    quantity.value = '4';
    quantity.dispatchEvent(new Event('input'));
    quantity.dispatchEvent(new Event('blur'));
    expect(host.number.value).toBe(4);
    expect(host.number.touched).toBe(true);
    const slider = f.nativeElement.querySelector(
      'jp-slider input',
    ) as HTMLInputElement;
    slider.value = '35';
    slider.dispatchEvent(new Event('input'));
    slider.dispatchEvent(new Event('blur'));
    expect(host.slider.value).toBe(35);
    expect(host.slider.touched).toBe(true);
    const range = f.nativeElement.querySelector(
      'jp-range-slider input',
    ) as HTMLInputElement;
    range.value = '15';
    range.dispatchEvent(new Event('input'));
    range.dispatchEvent(new Event('blur'));
    expect(host.range.value).toEqual([15, 30]);
    expect(host.range.touched).toBe(true);
    const task = f.nativeElement.querySelector(
      'jp-checklist input',
    ) as HTMLInputElement;
    task.checked = true;
    task.dispatchEvent(new Event('change'));
    task.dispatchEvent(new Event('blur'));
    expect(host.tasks.value).toEqual(['task']);
    expect(host.tasks.touched).toBe(true);
    host.number.disable();
    host.slider.disable();
    host.range.disable();
    host.tasks.disable();
    f.detectChanges();
    for (const input of f.nativeElement.querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>)
      expect(input.disabled).toBe(true);
    host.number.enable();
    host.slider.enable();
    host.range.enable();
    host.tasks.enable();
    f.detectChanges();
    expect(quantity.disabled).toBe(false);
  });
});
