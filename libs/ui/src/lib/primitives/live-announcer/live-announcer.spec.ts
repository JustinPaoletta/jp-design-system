import { TestBed } from '@angular/core/testing';
import { JpAnnouncer, JpLiveAnnouncer } from './live-announcer';
describe('JpAnnouncer', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  it('keeps persistent regions and supports repeated identical messages, priorities and cancellation', () => {
    const f = TestBed.createComponent(JpLiveAnnouncer);
    f.detectChanges();
    const a = TestBed.inject(JpAnnouncer);
    expect(f.nativeElement.querySelectorAll('[aria-live]').length).toBe(2);
    a.announce('Saved');
    expect(a.polite()).toBe('');
    jest.advanceTimersByTime(50);
    f.detectChanges();
    expect(
      f.nativeElement.querySelector('[role=status]').textContent.trim(),
    ).toBe('Saved');
    a.announce('Saved');
    expect(a.polite()).toBe('');
    jest.advanceTimersByTime(50);
    expect(a.polite()).toBe('Saved');
    a.announce('Error', 'assertive');
    jest.advanceTimersByTime(50);
    expect(a.assertive()).toBe('Error');
    expect(a.polite()).toBe('');
    a.announce('Replaced');
    a.announce('Latest');
    jest.advanceTimersByTime(50);
    expect(a.polite()).toBe('Latest');
    a.announce('Cancelled');
    a.clear();
    jest.advanceTimersByTime(50);
    expect(a.polite()).toBe('');
    a.announce('Destroyed');
    TestBed.resetTestingModule();
    jest.advanceTimersByTime(50);
    expect(a.polite()).toBe('');
  });
});
