import { TestBed } from '@angular/core/testing';
import { JpSearchField } from './search-field';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  imports: [JpSearchField, ReactiveFormsModule],
  template:
    '<jp-search-field label="Field" [formControl]="control" autocomplete="off" />',
})
class Host {
  control = new FormControl('secret');
}
describe('JpSearchField', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpSearchField],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpSearchField);
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
    expect(input.type).toBe('search');
    expect(input.value).toBe('secret');
    const button = f.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    f.detectChanges();
    expect(f.componentInstance.control.value).toBe('');
    expect(document.activeElement).toBe(input);
    f.componentInstance.control.disable();
    f.detectChanges();
    expect(input.disabled).toBe(true);
    expect(f.nativeElement.querySelector('button')).toBeNull();
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
