import { TestBed } from '@angular/core/testing';
import { JpSkeleton } from './skeleton';

describe('JpSkeleton', () => {
  it('keeps placeholders out of the accessibility tree', () => {
    const fixture = TestBed.createComponent(JpSkeleton);
    fixture.componentRef.setInput('shape', 'circle');
    fixture.componentRef.setInput('animated', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-hidden')).toBe('true');
    expect(
      fixture.nativeElement.classList.contains('jp-skeleton--circle'),
    ).toBe(true);
    expect(
      fixture.nativeElement.classList.contains('jp-skeleton--animated'),
    ).toBe(false);
  });
});
