import { TestBed } from '@angular/core/testing';
import { JpFormField } from './form-field';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { JpFieldControl } from './form-field';
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [JpFormField, JpFieldControl],
  template:
    '<jp-form-field controlId="email" label="Email" hint="Work address" [error]="error()" required><input jpFieldControl ariaDescribedBy="extra" /><p id="extra">Extra help</p></jp-form-field>',
})
class Host {
  error = signal('');
}
describe('JpFormField', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpFormField],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpFormField);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('associates a native control with label, hint and error, preserving additional descriptions', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.id).toBe('email');
    expect(f.nativeElement.querySelector('label').htmlFor).toBe('email');
    expect(input.getAttribute('aria-describedby')).toBe(
      'extra email-field-hint',
    );
    f.componentInstance.error.set('Use a valid email');
    f.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain(
      'email-field-error',
    );
    expect(input.getAttribute('aria-required')).toBe('true');
  });
  it('omits absent descriptions and required markers', async () => {
    const f = await mount({ controlId: 'name', label: 'Name' });
    expect(f.componentInstance.describedBy()).toBeNull();
  });
});
