import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpSwitch } from './switch';

describe('JpSwitch', () => {
  let fixture: ComponentFixture<JpSwitch>;
  let component: JpSwitch;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpSwitch],
    }).compileComponents();

    fixture = TestBed.createComponent(JpSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates off by default with switch role', () => {
    expect(component.checked()).toBe(false);
    const control = fixture.nativeElement.querySelector(
      '[role="switch"]',
    ) as HTMLButtonElement;
    expect(control.getAttribute('aria-checked')).toBe('false');
  });

  it('toggles on click', () => {
    const control = fixture.nativeElement.querySelector(
      '[role="switch"]',
    ) as HTMLButtonElement;
    control.click();
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
    expect(control.getAttribute('aria-checked')).toBe('true');
    expect(
      (fixture.nativeElement as HTMLElement).classList.contains(
        'jp-switch--checked',
      ),
    ).toBe(true);
  });

  it('does not toggle when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const control = fixture.nativeElement.querySelector(
      '[role="switch"]',
    ) as HTMLButtonElement;
    control.click();
    fixture.detectChanges();

    expect(component.checked()).toBe(false);
  });

  it('toggles with Space and Enter', () => {
    const control = fixture.nativeElement.querySelector(
      '[role="switch"]',
    ) as HTMLButtonElement;

    control.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
    );
    fixture.detectChanges();
    expect(component.checked()).toBe(true);

    control.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(component.checked()).toBe(false);
  });

  it('implements ControlValueAccessor', () => {
    const onChange = jest.fn();
    const onTouched = jest.fn();

    component.writeValue(true);
    expect(component.checked()).toBe(true);

    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);

    component.setDisabledState(false);
    component.toggle();
    component.onBlur();

    expect(onChange).toHaveBeenCalledWith(false);
    expect(onTouched).toHaveBeenCalled();
  });
});
