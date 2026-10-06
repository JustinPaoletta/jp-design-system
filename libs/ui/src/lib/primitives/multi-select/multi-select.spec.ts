import { TestBed } from '@angular/core/testing';
import { JpMultiSelect } from './multi-select';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { registerOverlay } from '../shared/overlay-manager';
@Component({
  imports: [JpMultiSelect, ReactiveFormsModule],
  template:
    '<jp-multi-select id="static-control" label="People" [options]="options" [formControl]="control" />',
})
class Host {
  options = [
    { value: 'a', label: 'Admin' },
    { value: 'b', label: 'Blocked', disabled: true },
    { value: 'c', label: 'Contributor' },
  ];
  control = new FormControl<readonly string[]>(['a']);
}
describe('JpMultiSelect', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpMultiSelect],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpMultiSelect);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('supports multiple keyboard selections while keeping the popup open and skips disabled options', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    expect(f.nativeElement.querySelector('jp-multi-select').id).toBe('');
    expect(f.nativeElement.querySelector('label').control).toBe(input);
    input.dispatchEvent(new Event('focus'));
    f.detectChanges();
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(
      f.nativeElement
        .querySelector('[role=listbox]')
        .getAttribute('aria-multiselectable'),
    ).toBe('true');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    f.detectChanges();
    expect(f.componentInstance.control.value).toEqual(['a', 'c']);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    f.detectChanges();
    expect(f.componentInstance.control.value).toEqual(['a']);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    f.detectChanges();
    expect(input.getAttribute('aria-activedescendant')).toMatch(/-option-2$/);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    f.detectChanges();
    expect(input.getAttribute('aria-activedescendant')).toMatch(/-option-0$/);
    input.dispatchEvent(new Event('blur'));
    expect(f.componentInstance.control.touched).toBe(true);
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }),
    );
    f.detectChanges();
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(f.componentInstance.control.value).toEqual(['a']);
    f.componentInstance.control.disable();
    f.detectChanges();
    expect(input.disabled).toBe(true);
  });
  it('filters without dropping selected values and removes selected chips through forms', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'con';
    input.dispatchEvent(new Event('input'));
    f.detectChanges();
    expect(f.nativeElement.querySelectorAll('[role=option]')).toHaveLength(1);
    (f.nativeElement.querySelector('[role=option]') as HTMLElement).click();
    f.detectChanges();
    expect(f.componentInstance.control.value).toEqual(['a', 'c']);
    (
      f.nativeElement.querySelector('jp-chip button') as HTMLButtonElement
    ).click();
    f.detectChanges();
    expect(f.componentInstance.control.value).toEqual(['c']);
    expect(document.activeElement).toBe(input);
  });
  it('announces loading and empty results, ignores unavailable options, and links hints/errors', async () => {
    const f = await mount({
      label: 'People',
      options: [],
      hint: 'Choose people',
      error: 'Required',
      required: true,
      id: 'people',
    });
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    f.componentInstance.open();
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role=status]').textContent).toBe(
      'No results found.',
    );
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(f.componentInstance.activeIndex()).toBe(-1);
    f.componentRef.setInput('loading', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role=status]').textContent).toBe(
      'Loading options…',
    );
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    f.componentInstance.toggle({ value: 'a', label: 'Admin' });
    expect(changed).not.toHaveBeenCalled();
    f.componentRef.setInput('loading', false);
    f.componentInstance.toggle({ value: 'a', label: 'Admin', disabled: true });
    f.componentInstance.remove({ value: 'a', label: 'Admin', disabled: true });
    expect(changed).not.toHaveBeenCalled();
    expect(input.getAttribute('aria-describedby')).toBe(
      'people-hint people-error',
    );
    expect(input.getAttribute('aria-required')).toBe('true');
    f.componentInstance.writeValue(['orphan', 'orphan']);
    f.detectChanges();
    expect(f.componentInstance.selected()).toEqual([
      { value: 'orphan', label: 'orphan' },
    ]);
    f.componentInstance.writeValue(null);
    f.detectChanges();
    expect(f.componentInstance.value()).toEqual([]);
  });
  it('closes on outside pointer/focus or Tab, retains nested overlay event ownership, and cleans up on destruction', async () => {
    const f = await mount({
      label: 'People',
      options: [{ value: 'a', label: 'Admin' }],
    });
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(f.componentInstance.isOpen()).toBe(false);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    f.detectChanges();
    expect(f.componentInstance.isOpen()).toBe(true);
    const unregister = registerOverlay({}, document);
    f.componentInstance.onKeydown(
      new KeyboardEvent('keydown', { key: 'Escape' }),
    );
    expect(f.componentInstance.isOpen()).toBe(true);
    unregister();
    const inside = new Event('pointerdown', { bubbles: true });
    input.dispatchEvent(inside);
    expect(f.componentInstance.isOpen()).toBe(true);
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    f.detectChanges();
    expect(f.componentInstance.isOpen()).toBe(false);
    f.componentInstance.open();
    f.detectChanges();
    f.componentInstance.onFocusOut(
      new FocusEvent('focusout', { relatedTarget: input }),
    );
    expect(f.componentInstance.isOpen()).toBe(true);
    f.componentInstance.onFocusOut(new FocusEvent('focusout'));
    expect(f.componentInstance.isOpen()).toBe(false);
    f.componentInstance.open();
    f.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(f.componentInstance.isOpen()).toBe(false);
    f.componentInstance.open();
    f.detectChanges();
    f.destroy();
  });
  it('guards disabled interaction and loads a popup without selecting on navigation', async () => {
    const f = await mount({
      label: 'People',
      options: [{ value: 'a', label: 'Admin' }],
      disabled: true,
    });
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    f.componentInstance.open();
    f.componentInstance.toggle({ value: 'a', label: 'Admin' });
    f.componentInstance.remove({ value: 'a', label: 'Admin' });
    f.componentInstance.onInput(new Event('input'));
    f.componentInstance.onKeydown(
      new KeyboardEvent('keydown', { key: 'Enter' }),
    );
    expect(changed).not.toHaveBeenCalled();
    expect(f.componentInstance.isOpen()).toBe(false);
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    f.componentInstance.onKeydown(
      new KeyboardEvent('keydown', { key: 'Enter' }),
    );
    f.componentInstance.onKeydown(new KeyboardEvent('keydown', { key: 'x' }));
    expect(changed).not.toHaveBeenCalled();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    f.detectChanges();
    f.componentRef.setInput('loading', true);
    f.detectChanges();
    f.componentInstance.onKeydown(new KeyboardEvent('keydown', { key: 'End' }));
    expect(changed).not.toHaveBeenCalled();
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(f.componentInstance.isOpen()).toBe(false);
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
    expect(input.getAttribute('aria-controls')).toBeNull();
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    expect(f.componentInstance.isOpen()).toBe(false);
  });
});
