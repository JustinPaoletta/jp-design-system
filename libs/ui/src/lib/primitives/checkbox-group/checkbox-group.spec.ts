import { TestBed } from '@angular/core/testing';
import { JpCheckboxGroup } from './checkbox-group';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  imports: [JpCheckboxGroup, ReactiveFormsModule],
  template:
    '<jp-checkbox-group label="Access" [options]="options" [formControl]="control" />',
})
class Host {
  options = [
    { value: 'a', label: 'Admin' },
    { value: 'b', label: 'Blocked', disabled: true },
    { value: 'c', label: 'Contributor' },
  ];
  control = new FormControl(['a']);
}
describe('JpCheckboxGroup', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpCheckboxGroup],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpCheckboxGroup);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('integrates selection, touched and disabled state with Angular reactive forms', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const inputs = f.nativeElement.querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>;
    expect(inputs[0].checked).toBe(true);
    expect(inputs[1].disabled).toBe(true);
    inputs[2].checked = true;
    inputs[2].dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(f.componentInstance.control.value).toEqual(['a', 'c']);
    inputs[0].checked = false;
    inputs[0].dispatchEvent(new Event('change'));
    expect(f.componentInstance.control.value).toEqual(['c']);
    inputs[2].dispatchEvent(new Event('blur'));
    expect(f.componentInstance.control.touched).toBe(true);
    f.componentInstance.control.disable();
    f.detectChanges();
    expect(inputs[0].disabled).toBe(true);
  });
  it('ignores disabled options and disabled-group mutations, normalizes external empty values, and describes errors', async () => {
    const f = await mount({
      label: 'Access',
      options: [
        { value: 'a', label: 'Admin' },
        { value: 'b', label: 'Blocked', disabled: true },
      ],
      hint: 'Select access',
      error: 'Required',
      id: 'access',
    });
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    f.componentInstance.toggle(
      { value: 'b', label: 'Blocked', disabled: true },
      new Event('change'),
    );
    expect(changed).not.toHaveBeenCalled();
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    f.componentInstance.toggle(
      { value: 'a', label: 'Admin' },
      new Event('change'),
    );
    expect(changed).not.toHaveBeenCalled();
    f.componentInstance.writeValue(null);
    f.detectChanges();
    expect(f.componentInstance.value()).toEqual([]);
    expect(
      f.nativeElement
        .querySelector('fieldset')
        .getAttribute('aria-describedby'),
    ).toBe('access-hint access-error');
  });
});
