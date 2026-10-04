import { TestBed } from '@angular/core/testing';
import { JpToggleButton } from './toggle-button';
describe('JpToggleButton', () => {
  it('keeps a stable label, exposes pressed state, and integrates with CVA', () => {
    const f = TestBed.createComponent(JpToggleButton);
    f.componentRef.setInput('label', 'Favorite');
    f.detectChanges();
    const c = f.componentInstance,
      changed = jest.fn(),
      touched = jest.fn(),
      pressed = jest.fn();
    c.registerOnChange(changed);
    c.registerOnTouched(touched);
    c.pressedChange.subscribe(pressed);
    const button = f.nativeElement.querySelector('button');
    button.click();
    f.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.textContent.trim()).toBe('Favorite');
    expect(changed).toHaveBeenCalledWith(true);
    expect(pressed).toHaveBeenCalledWith(true);
    button.dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalled();
    c.setDisabledState(true);
    f.detectChanges();
    c.toggle();
    expect(changed).toHaveBeenCalledTimes(1);
    c.setDisabledState(false);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(button.disabled).toBe(true);
    c.writeValue(null);
    f.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
