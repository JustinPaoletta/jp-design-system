import { TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  JpPopover,
  JpPopoverTrigger,
  JpPopoverContent,
} from '../popover/popover';
import { JpCombobox } from './combobox';

@Component({
  imports: [JpCombobox, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<jp-combobox
    label="Role"
    name="role"
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
@Component({
  imports: [JpCombobox, JpPopover, JpPopoverTrigger, JpPopoverContent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<jp-popover [open]="outerOpen" (openChange)="outerOpen = $event">
    <button jpPopoverTrigger>Filters</button>
    <div jpPopoverContent><jp-combobox label="Role" [options]="options" /></div>
  </jp-popover>`,
})
class NestedHost {
  outerOpen = true;
  readonly options = [{ value: 'a', label: 'Admin' }];
}

describe('JpCombobox', () => {
  it('filters, uses active descendants, skips disabled options and commits with Enter', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type=text]',
    ) as HTMLInputElement;
    expect(input.value).toBe('Admin');
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    const active = input.getAttribute('aria-activedescendant');
    expect(
      fixture.nativeElement.querySelector(`[id="${active}"]`).textContent,
    ).toContain('Admin');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('c');
    expect(input.value).toBe('Contributor');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(
      fixture.nativeElement.querySelector('input[type=hidden]').value,
    ).toBe('c');
    input.dispatchEvent(new Event('focus'));
    input.value = 'adm';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role=option]').length).toBe(
      1,
    );
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('a');
    input.dispatchEvent(new Event('blur'));
    expect(fixture.componentInstance.control.touched).toBe(true);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });
  it('shows no-results/loading states and Escape preserves the committed value', async () => {
    await TestBed.configureTestingModule({
      imports: [JpCombobox],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpCombobox);
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'Admin' }]);
    fixture.componentRef.setInput('error', 'Choose a role');
    fixture.componentInstance.writeValue('a');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type=text]',
    ) as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    input.value = 'missing';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role=status]').textContent,
    ).toContain('No results');
    expect(input.getAttribute('aria-describedby')).toContain('-error');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(input.value).toBe('Admin');
    input.dispatchEvent(new Event('focus'));
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('[role=listbox]')
        .getAttribute('aria-busy'),
    ).toBe('true');
    expect(
      fixture.nativeElement.querySelector('[role=status]').textContent,
    ).toContain('Loading');
    expect(fixture.nativeElement.querySelectorAll('[role=option]').length).toBe(
      0,
    );
  });

  it('supports reverse/end navigation, blur cancellation, clearing and focused reopening', async () => {
    await TestBed.configureTestingModule({
      imports: [JpCombobox],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpCombobox);
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
      { value: 'c', label: 'Gamma', disabled: true },
    ]);
    fixture.componentRef.setInput('hint', 'Choose a role');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type=text]',
    ) as HTMLInputElement;
    const change = jest.fn();
    fixture.componentInstance.registerOnChange(change);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(fixture.componentInstance.isOpen()).toBe(false);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(input.value).toBe('Beta');
    input.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen()).toBe(true);
    input.value = 'uncommitted text';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(input.value).toBe('Beta');
    input.click();
    fixture.detectChanges();
    input.value = '';
    input.dispatchEvent(new Event('input'));
    expect(change).toHaveBeenLastCalledWith('');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    fixture.detectChanges();
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-describedby')).toContain('-hint');
    fixture.componentInstance.writeValue(null);
    expect(fixture.componentInstance.value()).toBe('');
  });

  it('prevents selecting disabled/loading choices and ignores empty or disabled navigation', async () => {
    await TestBed.configureTestingModule({
      imports: [JpCombobox],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpCombobox);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector(
      'input[type=text]',
    ) as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(component.activeIndex()).toBe(-1);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(component.value()).toBe('');
    component.choose({ value: 'b', label: 'Blocked', disabled: true });
    expect(component.value()).toBe('');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    component.choose({ value: 'a', label: 'Alpha' });
    expect(component.value()).toBe('');
    component.setDisabledState(true);
    fixture.detectChanges();
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    component.choose({ value: 'a', label: 'Alpha' });
    expect(component.isOpen()).toBe(false);
    expect(component.value()).toBe('');
  });

  it('uses the native top layer, sizes to its anchor, and cleans up on close/destroy', async () => {
    await TestBed.configureTestingModule({
      imports: [JpCombobox],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpCombobox);
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'Admin' }]);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type=text]',
    ) as HTMLInputElement;
    const popup = fixture.nativeElement.querySelector(
      '.jp-combobox__popup',
    ) as HTMLElement;
    const show = jest.fn();
    const hide = jest.fn();
    Object.defineProperty(popup, 'showPopover', { value: show });
    Object.defineProperty(popup, 'hidePopover', { value: hide });
    jest.spyOn(input, 'getBoundingClientRect').mockReturnValue({
      left: 40,
      right: 240,
      top: 40,
      bottom: 80,
      width: 200,
      height: 40,
      x: 40,
      y: 40,
      toJSON: () => undefined,
    });
    input.click();
    fixture.detectChanges();
    expect(show).toHaveBeenCalledTimes(1);
    expect(popup.getAttribute('popover')).toBe('manual');
    expect(popup.style.position).toBe('fixed');
    expect(popup.style.width).toBe('200px');
    fixture.componentInstance.close();
    fixture.detectChanges();
    expect(hide).toHaveBeenCalledTimes(1);
    expect(popup.hidden).toBe(true);
    input.click();
    fixture.detectChanges();
    fixture.destroy();
    expect(hide).toHaveBeenCalledTimes(2);
  });

  it('claims Escape/outside dismissal without closing a containing popover', async () => {
    await TestBed.configureTestingModule({
      imports: [NestedHost],
    }).compileComponents();
    const fixture = TestBed.createComponent(NestedHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type=text]',
    ) as HTMLInputElement;
    input.click();
    fixture.detectChanges();
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.componentInstance.outerOpen).toBe(true);
    input.click();
    fixture.detectChanges();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.componentInstance.outerOpen).toBe(true);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.outerOpen).toBe(false);
  });
});
