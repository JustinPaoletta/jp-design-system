import { TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JpRadioGroup } from './radio-group';

@Component({
  imports: [JpRadioGroup, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<jp-radio-group
    label="Role"
    [options]="options"
    [formControl]="control"
  />`,
})
class Host {
  readonly options = [
    { value: 'a', label: 'Admin' },
    { value: 'b', label: 'Blocked', disabled: true },
    { value: 'c', label: 'Contributor' },
  ];
  readonly control = new FormControl('a');
}
describe('JpRadioGroup', () => {
  it('binds forms, skips disabled options, wraps keyboard selection and marks touched', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const radios = fixture.nativeElement.querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>;
    expect(radios[0].checked).toBe(true);
    expect(radios[1].disabled).toBe(true);
    radios[0].dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('c');
    expect(radios[2].checked).toBe(true);
    radios[2].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('a');
    radios[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    expect(fixture.componentInstance.control.value).toBe('c');
    radios[2].dispatchEvent(new Event('blur'));
    expect(fixture.componentInstance.control.touched).toBe(true);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(radios[0].disabled).toBe(true);
  });
  it('links error/hint and supports accessible name without a legend', async () => {
    await TestBed.configureTestingModule({
      imports: [JpRadioGroup],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpRadioGroup);
    fixture.componentRef.setInput('ariaLabel', 'Access level');
    fixture.componentRef.setInput('hint', 'Choose a role');
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('fieldset');
    expect(group.getAttribute('aria-label')).toBe('Access level');
    expect(group.getAttribute('aria-describedby')).toContain('-hint');
    fixture.componentRef.setInput('error', 'A role is required');
    fixture.detectChanges();
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-describedby')).toContain('-error');
  });

  it('supports reverse navigation, Home, and ignores disabled-only groups', async () => {
    await TestBed.configureTestingModule({
      imports: [JpRadioGroup],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpRadioGroup);
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ]);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const changes = jest.fn();
    component.registerOnChange(changes);
    const radios = fixture.nativeElement.querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>;
    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(component.value()).toBe('b');
    radios[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(component.value()).toBe('a');
    component.setDisabledState(true);
    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(changes).toHaveBeenCalledTimes(2);
    component.setDisabledState(false);
    component.select({ value: 'blocked', label: 'Blocked', disabled: true });
    expect(component.value()).toBe('a');
    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(component.value()).toBe('a');
    component.writeValue(null);
    expect(component.value()).toBe('');
    fixture.componentRef.setInput('options', [
      { value: 'b', label: 'Blocked', disabled: true },
    ]);
    fixture.detectChanges();
    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }), 0);
    expect(component.value()).toBe('');
  });
});
