import { TestBed } from '@angular/core/testing';
import { JpPasswordField } from './password-field';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  imports: [JpPasswordField, ReactiveFormsModule],
  template:
    '<jp-password-field id="static-control" label="Field" [formControl]="control" autocomplete="current-password" />',
})
class Host {
  control = new FormControl('secret');
}
describe('JpPasswordField', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpPasswordField],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpPasswordField);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('retains the input form contract and exposes the specialized native input type', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    expect(f.nativeElement.querySelector('jp-password-field').id).toBe('');
    expect(f.nativeElement.querySelector('label').control).toBe(input);
    expect(input.type).toBe('password');
    expect(input.value).toBe('secret');
    const button = f.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    f.detectChanges();
    expect(input.type).toBe('text');
    expect(f.componentInstance.control.value).toBe('secret');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    button.click();
    f.detectChanges();
    expect(input.type).toBe('password');
    f.componentInstance.control.disable();
    f.detectChanges();
    expect(input.disabled).toBe(true);
    expect(button.disabled).toBe(true);
  });
  it('merges outer descriptions and handles guarded actions without changing disabled values', async () => {
    const f = await mount({
      label: 'Field',
      ariaDescribedBy: 'outer-help',
      hint: 'Inner help',
      id: 'field',
    });
    expect(
      f.nativeElement.querySelector('input').getAttribute('aria-describedby'),
    ).toBe('field-hint outer-help');
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    f.componentInstance.clearSearch(input);
    f.componentInstance.togglePassword();
    expect(f.componentInstance.passwordVisible()).toBe(false);
    f.componentRef.setInput('disabled', false);
    f.componentRef.setInput('readonly', true);
    f.detectChanges();
    f.componentInstance.writeValue('kept');
    f.componentInstance.clearSearch(input);
    expect(f.componentInstance.value()).toBe('kept');
  });
});
