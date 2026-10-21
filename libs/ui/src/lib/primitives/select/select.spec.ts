import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { JpSelect } from './select';

@Component({
  imports: [JpSelect, ReactiveFormsModule],
  template: `<form>
    <jp-select
      label="Role"
      name="role"
      required
      [options]="options"
      [formControl]="role"
    />
  </form>`,
})
class FormHost {
  readonly role = new FormControl('editor', {
    nonNullable: true,
    validators: Validators.required,
  });
  readonly options = [
    { value: 'admin', label: 'Manager' },
    { value: 'editor', label: 'Scorekeeper' },
  ];
}

describe('JpSelect', () => {
  let fixture: ComponentFixture<JpSelect>;
  let component: JpSelect;
  const options = [
    { value: 'admin', label: 'Manager' },
    { value: 'disabled', label: 'Medical staff', disabled: true },
    { value: 'editor', label: 'Scorekeeper' },
    { value: 'viewer', label: 'Fan' },
  ];
  const trigger = () =>
    fixture.nativeElement.querySelector(
      '[role="combobox"]',
    ) as HTMLButtonElement;
  const key = (value: string, extra: KeyboardEventInit = {}) => {
    trigger().dispatchEvent(
      new KeyboardEvent('keydown', {
        key: value,
        bubbles: true,
        cancelable: true,
        ...extra,
      }),
    );
    fixture.detectChanges();
  };
  const open = () => {
    trigger().click();
    fixture.detectChanges();
  };
  const choice = (value: string) => {
    const result = Array.from(
      fixture.nativeElement.querySelectorAll(
        '[role="option"]',
      ) as NodeListOf<HTMLButtonElement>,
    ).find((element) => element.textContent?.trim() === value);
    if (!result) throw new Error(`Missing option: ${value}`);
    return result;
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(JpSelect);
    fixture.componentRef.setInput('label', 'Club role');
    fixture.componentRef.setInput('options', options);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows an explicit placeholder for an unset or missing value, not a false selection', () => {
    fixture.componentRef.setInput('placeholder', 'Choose a role');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Choose a role');
    component.writeValue('unknown');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Choose a role');
    component.writeValue('editor');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Scorekeeper');
    expect(component.size()).toBe('md');
  });

  it('commits a clicked option once and keeps selected and active states distinct', () => {
    const change = jest.fn();
    component.registerOnChange(change);
    component.writeValue('editor');
    fixture.detectChanges();
    open();
    expect(choice('Scorekeeper').getAttribute('aria-selected')).toBe('true');
    choice('Manager').click();
    fixture.detectChanges();
    expect(component.value()).toBe('admin');
    expect(change).toHaveBeenCalledTimes(1);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger());
    open();
    choice('Manager').click();
    expect(change).toHaveBeenCalledTimes(1);
  });

  it('skips disabled choices, wraps arrows, and supports Home, End and keyboard commit', () => {
    key('Enter');
    expect(component.activeIndex()).toBe(0);
    key('ArrowDown');
    expect(component.activeIndex()).toBe(2);
    key('End');
    expect(component.activeIndex()).toBe(3);
    key('ArrowDown');
    expect(component.activeIndex()).toBe(0);
    key('ArrowUp');
    expect(component.activeIndex()).toBe(3);
    key('Home');
    key('ArrowDown');
    key('Enter');
    expect(component.value()).toBe('editor');
    key('ArrowUp');
    expect(component.activeIndex()).toBe(2);
    key('Escape');
    component.writeValue(null);
    fixture.detectChanges();
    key('ArrowUp');
    expect(component.activeIndex()).toBe(3);
  });

  it('cancels active navigation with Escape, Tab, outside pointer and blur', () => {
    component.writeValue('editor');
    const change = jest.fn(),
      touched = jest.fn();
    component.registerOnChange(change);
    component.registerOnTouched(touched);
    for (const closeKey of ['Escape', 'Tab']) {
      key('Enter');
      key('Home');
      key(closeKey);
      expect(component.isOpen()).toBe(false);
      expect(component.value()).toBe('editor');
    }
    open();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
    open();
    trigger().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
    expect(touched).toHaveBeenCalledTimes(1);
    expect(change).not.toHaveBeenCalled();
  });

  it('supports typeahead, repeated letters and Space after its timeout', () => {
    const now = jest.spyOn(Date, 'now').mockReturnValue(1000);
    key('s');
    expect(component.activeIndex()).toBe(2);
    key('c');
    expect(component.activeIndex()).toBe(2);
    now.mockReturnValue(2000);
    key(' ');
    expect(component.value()).toBe('editor');
    key('m');
    key('m');
    expect(component.activeIndex()).toBe(0);
    key('Escape');
    key('ArrowDown', { ctrlKey: true });
    expect(component.isOpen()).toBe(false);
    now.mockRestore();
  });

  it('keeps options and disabled state synchronized while open', () => {
    component.writeValue('editor');
    open();
    fixture.componentRef.setInput('options', [
      { value: 'viewer', label: 'Fan' },
    ]);
    fixture.detectChanges();
    expect(component.activeIndex()).toBe(0);
    expect(trigger().textContent?.trim()).toBe('');
    fixture.componentRef.setInput('options', [
      { value: 'x', label: 'Unavailable', disabled: true },
    ]);
    fixture.detectChanges();
    key('ArrowDown');
    key('Enter');
    expect(component.value()).toBe('editor');
    expect(trigger().getAttribute('aria-activedescendant')).toBeNull();
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
    expect(trigger().disabled).toBe(true);
    component.choose(options[0]);
    key('Enter');
    expect(component.value()).toBe('editor');
    component.setDisabledState(false);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(trigger().disabled).toBe(true);
  });

  it('retains native submission, validation, accessible naming and descriptions', () => {
    fixture.componentRef.setInput('ariaLabel', 'Account role');
    fixture.componentRef.setInput('name', 'role');
    fixture.componentRef.setInput('autocomplete', 'organization-title');
    fixture.componentRef.setInput('required', true);
    fixture.componentRef.setInput('hint', 'Choose a role');
    fixture.detectChanges();
    const backing = fixture.nativeElement.querySelector(
      'select',
    ) as HTMLSelectElement;
    expect(backing.name).toBe('role');
    expect(backing.required).toBe(true);
    expect(backing.getAttribute('autocomplete')).toBe('organization-title');
    expect(backing.getAttribute('aria-hidden')).toBe('true');
    expect(backing.tabIndex).toBe(-1);
    expect(trigger().getAttribute('aria-label')).toBe('Account role');
    expect(trigger().getAttribute('aria-describedby')).toContain('-hint');
    expect(backing.checkValidity()).toBe(false);
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger());
    expect(trigger().getAttribute('aria-invalid')).toBe('true');
    open();
    choice('Manager').click();
    fixture.detectChanges();
    expect(backing.checkValidity()).toBe(true);
    expect(backing.value).toBe('admin');
    fixture.componentRef.setInput('error', 'Select a role');
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-describedby')).toContain('-error');
    expect(
      fixture.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain('Select a role');
  });

  it('updates the displayed value and native form data after reactive resets and disabled changes', () => {
    const host = TestBed.createComponent(FormHost);
    host.detectChanges();
    const control = host.nativeElement.querySelector(
      '[role="combobox"]',
    ) as HTMLButtonElement;
    control.click();
    host.detectChanges();
    (
      host.nativeElement.querySelector('[role="option"]') as HTMLButtonElement
    ).click();
    host.detectChanges();
    expect(host.componentInstance.role.value).toBe('admin');
    expect(
      new FormData(host.nativeElement.querySelector('form')).get('role'),
    ).toBe('admin');
    host.componentInstance.role.reset();
    host.detectChanges();
    expect(control.textContent).toContain('Scorekeeper');
    host.componentInstance.role.setValue('');
    host.detectChanges();
    expect(host.componentInstance.role.invalid).toBe(true);
    host.componentInstance.role.disable();
    host.detectChanges();
    expect(control.disabled).toBe(true);
    expect(
      new FormData(host.nativeElement.querySelector('form')).has('role'),
    ).toBe(false);
    host.destroy();
  });

  it('supports an explicit empty choice and closes safely on teardown', () => {
    fixture.componentRef.setInput('options', [{ value: '', label: 'No role' }]);
    fixture.detectChanges();
    open();
    expect(choice('No role').getAttribute('aria-selected')).toBe('true');
    key('ArrowUp', { altKey: true });
    expect(component.isOpen()).toBe(false);
    open();
    fixture.destroy();
  });
});
