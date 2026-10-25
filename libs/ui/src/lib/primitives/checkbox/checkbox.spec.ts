import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpCheckbox } from './checkbox';

describe('JpCheckbox', () => {
  let fixture: ComponentFixture<JpCheckbox>;
  let component: JpCheckbox;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpCheckbox],
    }).compileComponents();

    fixture = TestBed.createComponent(JpCheckbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates unchecked by default', () => {
    expect(component.checked()).toBe(false);
    expect(component.invalid()).toBe(false);
  });

  it('has no visible selection mark until checked or mixed', () => {
    const mark = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(mark.style.visibility).toBe('hidden');
    component.writeValue(true);
    fixture.detectChanges();
    expect(mark.style.visibility).toBe('');
    component.writeValue(false);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    expect(mark.style.visibility).toBe('');
  });

  it('retains the controlled mixed state after native activation clears it', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    input.click();
    fixture.detectChanges();
    expect(component.indeterminate()).toBe(true);
    expect(input.indeterminate).toBe(true);
    expect(input.checked).toBe(component.checked());
  });

  it('toggles checked state', () => {
    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
    expect(
      (fixture.nativeElement as HTMLElement).classList.contains(
        'jp-checkbox--checked',
      ),
    ).toBe(true);
  });

  it('disables the native input', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('implements ControlValueAccessor', () => {
    const onChange = jest.fn();
    const onTouched = jest.fn();

    component.writeValue(true);
    expect(component.checked()).toBe(true);

    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(component.isDisabled()).toBe(true);

    component.setDisabledState(false);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    input.checked = false;
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(onChange).toHaveBeenCalledWith(false);
    expect(onTouched).toHaveBeenCalled();
  });

  it('exposes native mixed state while keeping the CVA value boolean', () => {
    const change = jest.fn();
    component.registerOnChange(change);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.componentRef.setInput('ariaLabel', 'Select all rows');
    fixture.componentRef.setInput('error', 'Select at least one row');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute('aria-label')).toBe('Select all rows');
    expect(input.getAttribute('aria-describedby')).toContain('-error');
    input.click();
    expect(change).toHaveBeenCalledWith(true);
    fixture.componentRef.setInput('indeterminate', false);
    fixture.detectChanges();
    expect(input.indeterminate).toBe(false);
  });
});
