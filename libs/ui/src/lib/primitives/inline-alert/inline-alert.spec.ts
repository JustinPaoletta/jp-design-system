import { TestBed } from '@angular/core/testing';
import { JpInlineAlert } from './inline-alert';

describe('JpInlineAlert', () => {
  it('announces errors assertively and emits a keyboard-operable retry action', () => {
    const fixture = TestBed.createComponent(JpInlineAlert);
    fixture.componentRef.setInput('tone', 'error');
    fixture.componentRef.setInput('message', 'Save failed');
    fixture.componentRef.setInput('actionLabel', 'Retry');
    const action = jest.fn();
    fixture.componentInstance.action.subscribe(action);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');
    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.textContent).toContain('Retry');
    button.click();
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('uses polite status semantics and does not render an empty action', () => {
    const fixture = TestBed.createComponent(JpInlineAlert);
    fixture.componentRef.setInput('tone', 'invalid');
    fixture.detectChanges();
    expect(fixture.componentInstance.tone()).toBe('info');
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});
