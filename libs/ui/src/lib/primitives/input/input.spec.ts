import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { JpInput } from './input';

@Component({
  imports: [JpInput, ReactiveFormsModule],
  template: `<jp-input label="Email" [formControl]="control" />`,
})
class InputHost {
  readonly control = new FormControl('hello', { nonNullable: true });
}

describe('JpInput', () => {
  let fixture: ComponentFixture<JpInput>;
  let component: JpInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpInput],
    }).compileComponents();

    fixture = TestBed.createComponent(JpInput);
    fixture.componentRef.setInput('label', 'Email');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates with defaults', () => {
    expect(component.type()).toBe('text');
    expect(component.size()).toBe('md');
    expect(component.invalid()).toBe(false);
    expect(component.resolvedId()).toContain('jp-input-');
  });

  it('uses provided id and wires label', () => {
    fixture.componentRef.setInput('id', 'email-field');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    const label = fixture.nativeElement.querySelector(
      'label',
    ) as HTMLLabelElement;
    expect(input.id).toBe('email-field');
    expect(label.getAttribute('for')).toBe('email-field');
  });

  it('sets aria-invalid and describedby for error', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('error', 'Required');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain('-error');
  });

  it('updates value from user input', () => {
    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('test@example.com');
  });

  it('supports ControlValueAccessor binding', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [InputHost],
    }).compileComponents();

    const hostFixture = TestBed.createComponent(InputHost);
    hostFixture.detectChanges();

    const input = hostFixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(input.value).toBe('hello');

    hostFixture.componentInstance.control.setValue('world');
    hostFixture.detectChanges();
    expect(input.value).toBe('world');

    hostFixture.componentInstance.control.disable();
    hostFixture.detectChanges();
    expect(input.disabled).toBe(true);
  });

  it('links hint via aria-describedby and handles blur', () => {
    const onTouched = jest.fn();
    component.registerOnTouched(onTouched);
    fixture.componentRef.setInput('hint', 'Helpful hint');
    fixture.componentRef.setInput('error', '');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toContain('-hint');
    input.dispatchEvent(new Event('blur'));
    expect(onTouched).toHaveBeenCalled();
  });

  it('writeValue treats null as empty string', () => {
    component.writeValue(null);
    expect(component.value()).toBe('');
  });
});
