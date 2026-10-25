import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JpScrollOverflow } from './scroll-overflow';
@Component({
  imports: [JpScrollOverflow],
  template: '<div jpScrollOverflow><table></table></div>',
})
class Host {}
describe('table scroll cues', () => {
  it('updates the visible edge when writing direction changes', async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const frame = f.nativeElement.querySelector('div') as HTMLElement;
    const cue = f.debugElement
      .query(By.directive(JpScrollOverflow))
      .injector.get(JpScrollOverflow);
    Object.defineProperty(frame, 'clientWidth', { value: 300 });
    Object.defineProperty(frame, 'scrollWidth', { value: 600 });
    cue.measure();
    expect(cue.hasRight()).toBe(true);
    frame.style.direction = 'rtl';
    await Promise.resolve();
    expect(cue.hasLeft()).toBe(true);
    expect(cue.hasRight()).toBe(false);
    f.destroy();
  });
  it('updates after content resize and disconnects on destruction', () => {
    const original = window.ResizeObserver;
    const observe = jest.fn(),
      disconnect = jest.fn();
    let resize = () => undefined;
    window.ResizeObserver = jest.fn().mockImplementation((callback) => {
      resize = callback;
      return { observe, disconnect };
    });
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const frame = f.nativeElement.querySelector('div') as HTMLElement;
    const cue = f.debugElement
      .query(By.directive(JpScrollOverflow))
      .injector.get(JpScrollOverflow);
    expect(observe).toHaveBeenCalledWith(frame);
    expect(observe).toHaveBeenCalledWith(frame.querySelector('table'));
    Object.defineProperty(frame, 'clientWidth', { value: 300 });
    Object.defineProperty(frame, 'scrollWidth', { value: 600 });
    resize();
    expect(cue.overflowing()).toBe(true);
    f.destroy();
    expect(disconnect).toHaveBeenCalledTimes(1);
    window.ResizeObserver = original;
  });
  it.each([false, true])(
    'tracks both edges and removes unnecessary hints (RTL: %s)',
    (rtl) => {
      const f = TestBed.createComponent(Host);
      f.detectChanges();
      const frame = f.nativeElement.querySelector('div') as HTMLElement;
      const cue = f.debugElement
        .query(By.directive(JpScrollOverflow))
        .injector.get(JpScrollOverflow);
      frame.style.direction = rtl ? 'rtl' : 'ltr';
      Object.defineProperty(frame, 'clientWidth', {
        configurable: true,
        value: 300,
      });
      Object.defineProperty(frame, 'scrollWidth', {
        configurable: true,
        value: 600,
      });
      cue.measure();
      expect(cue.overflowing()).toBe(true);
      expect(cue.hasLeft()).toBe(rtl);
      expect(cue.hasRight()).toBe(!rtl);
      frame.scrollLeft = rtl ? -300 : 300;
      frame.dispatchEvent(new Event('scroll'));
      expect(cue.hasLeft()).toBe(!rtl);
      expect(cue.hasRight()).toBe(rtl);
      Object.defineProperty(frame, 'scrollWidth', { value: 300 });
      cue.measure();
      expect(cue.overflowing()).toBe(false);
      expect(cue.hasLeft()).toBe(false);
      expect(cue.hasRight()).toBe(false);
    },
  );
});
