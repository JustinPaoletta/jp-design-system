import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { JpVisuallyHidden } from './accessibility';

@Component({
  imports: [JpVisuallyHidden],
  template: `<button type="button">
    <span jpVisuallyHidden>Expand details</span
    ><span aria-hidden="true">+</span>
  </button>`,
})
class Host {}

describe('JpVisuallyHidden', () => {
  it('keeps an icon action name in the DOM without hiding it from assistive technology', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const label: HTMLElement =
      fixture.nativeElement.querySelector('[jpVisuallyHidden]');
    expect(label.textContent).toBe('Expand details');
    expect(label.hidden).toBe(false);
    expect(label.hasAttribute('aria-hidden')).toBe(false);
    expect(label.style.display).not.toBe('none');
    expect(label.style.visibility).not.toBe('hidden');
    expect(label.style.clipPath).toBe('inset(50%)');
    expect(label.style.width).toBe('1px');
    expect(label.style.height).toBe('1px');
  });
});
