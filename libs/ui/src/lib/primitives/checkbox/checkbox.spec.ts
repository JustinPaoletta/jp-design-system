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
});
