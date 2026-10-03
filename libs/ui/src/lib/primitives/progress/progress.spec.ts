import { TestBed } from '@angular/core/testing';
import { JpProgress } from './progress';

describe('JpProgress', () => {
  it('omits aria-valuenow for indeterminate progress and supplies a name', () => {
    const fixture = TestBed.createComponent(JpProgress);
    fixture.componentRef.setInput('label', 'Uploading files');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('progressbar');
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe(
      'Uploading files',
    );
    expect(fixture.nativeElement.hasAttribute('aria-valuenow')).toBe(false);
  });

  it('normalizes invalid ranges, clamps values, and scales the visual fill', () => {
    const fixture = TestBed.createComponent(JpProgress);
    fixture.componentRef.setInput('max', 200);
    fixture.componentRef.setInput('value', 50);
    fixture.detectChanges();
    expect(fixture.componentInstance.percent()).toBe(25);
    expect(fixture.nativeElement.getAttribute('aria-valuenow')).toBe('50');
    fixture.componentRef.setInput('value', 300);
    fixture.detectChanges();
    expect(fixture.componentInstance.safeValue()).toBe(200);
    fixture.componentRef.setInput('max', 0);
    fixture.componentRef.setInput('value', -5);
    fixture.detectChanges();
    expect(fixture.componentInstance.safeMax()).toBe(100);
    expect(fixture.componentInstance.safeValue()).toBe(0);
    fixture.componentRef.setInput('value', Number.NaN);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('aria-valuenow')).toBe(false);
  });
});
