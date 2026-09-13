import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  focusFirstElement,
  getFocusableElements,
  JpFocusTrap,
  trapTabKey,
} from './focus-trap';

@Component({
  standalone: true,
  imports: [JpFocusTrap],
  template: `
    <div id="trap" [jpFocusTrap]="true">
      <button type="button" id="first">First</button>
      <button type="button" id="second">Second</button>
    </div>
  `,
})
class FocusTrapHost {}

@Component({
  standalone: true,
  imports: [JpFocusTrap],
  template: `
    <div id="trap" [jpFocusTrap]="false">
      <button type="button" id="first">First</button>
      <button type="button" id="second">Second</button>
    </div>
  `,
})
class FocusTrapInactiveHost {}

describe('JpFocusTrap', () => {
  it('wraps focus from last to first on Tab', async () => {
    await TestBed.configureTestingModule({
      imports: [FocusTrapHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(FocusTrapHost);
    fixture.detectChanges();

    const first = fixture.nativeElement.querySelector('#first') as HTMLElement;
    const second = fixture.nativeElement.querySelector(
      '#second',
    ) as HTMLElement;
    const container = fixture.nativeElement.querySelector(
      '#trap',
    ) as HTMLElement;

    second.focus();
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(first);
  });

  it('wraps focus from first to last on Shift+Tab', async () => {
    await TestBed.configureTestingModule({
      imports: [FocusTrapHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(FocusTrapHost);
    fixture.detectChanges();

    const first = fixture.nativeElement.querySelector('#first') as HTMLElement;
    const last = fixture.nativeElement.querySelector('#second') as HTMLElement;
    const container = fixture.nativeElement.querySelector(
      '#trap',
    ) as HTMLElement;

    first.focus();
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(last);
  });

  it('does not trap when inactive', async () => {
    await TestBed.configureTestingModule({
      imports: [FocusTrapInactiveHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(FocusTrapInactiveHost);
    fixture.detectChanges();

    const second = fixture.nativeElement.querySelector(
      '#second',
    ) as HTMLElement;
    const container = fixture.nativeElement.querySelector(
      '#trap',
    ) as HTMLElement;

    second.focus();
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    const prevented = !container.dispatchEvent(event);

    expect(prevented).toBe(false);
    expect(document.activeElement).toBe(second);
  });

  it('exposes focusable helper', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <button type="button">A</button>
      <button type="button" disabled>B</button>
      <a href="#x">C</a>
      <button type="button" aria-hidden="true">Hidden</button>
      <span tabindex="0" disabled>Weird</span>
    `;
    document.body.appendChild(root);
    expect(
      getFocusableElements(root).map((el) => el.textContent?.trim()),
    ).toEqual(['A', 'C']);

    const focusables = getFocusableElements(root);
    focusables[1].focus();
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    trapTabKey(event, root);
    expect(document.activeElement).toBe(focusables[0]);
    root.remove();
  });

  it('trapTabKey ignores non-Tab and empty containers', () => {
    const empty = document.createElement('div');
    document.body.appendChild(empty);
    const enter = new KeyboardEvent('keydown', {
      key: 'Enter',
      cancelable: true,
    });
    trapTabKey(enter, empty);
    expect(enter.defaultPrevented).toBe(false);

    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      cancelable: true,
    });
    trapTabKey(tab, empty);
    expect(tab.defaultPrevented).toBe(true);

    focusFirstElement(empty);
    empty.remove();
  });
});
