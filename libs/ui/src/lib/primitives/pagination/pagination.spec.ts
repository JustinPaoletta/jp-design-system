import { TestBed } from '@angular/core/testing';
import { JpPagination } from './pagination';

describe('JpPagination', () => {
  it('emits controlled page requests without mutating the page input', () => {
    const fixture = TestBed.createComponent(JpPagination);
    fixture.componentRef.setInput('total', 42);
    fixture.detectChanges();
    const requests: number[] = [];
    fixture.componentInstance.pageChange.subscribe((page) =>
      requests.push(page),
    );
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].disabled).toBe(true);
    const next = Array.from(
      fixture.nativeElement.querySelectorAll(
        'button',
      ) as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'Next');
    expect(next).toBeDefined();
    next?.click();
    expect(requests).toEqual([2]);
    expect(fixture.componentInstance.currentPage()).toBe(1);
    fixture.componentRef.setInput('page', 5);
    fixture.detectChanges();
    expect(next?.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('41–42 of 42');
  });

  it('normalizes empty, invalid and out-of-range inputs', () => {
    const fixture = TestBed.createComponent(JpPagination);
    fixture.componentRef.setInput('page', 99);
    fixture.componentRef.setInput('pageSize', 0);
    fixture.componentRef.setInput('total', -3);
    fixture.detectChanges();
    expect(fixture.componentInstance.currentPage()).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('0–0 of 0');
    const emit = jest.spyOn(fixture.componentInstance.pageChange, 'emit');
    fixture.componentInstance.goTo(Number.NaN);
    fixture.componentInstance.goTo(1.5);
    fixture.componentInstance.goTo(0);
    fixture.componentInstance.goTo(2);
    fixture.componentRef.setInput('total', 10);
    fixture.componentRef.setInput('disabled', true);
    fixture.componentInstance.goTo(2);
    expect(emit).not.toHaveBeenCalled();
    fixture.componentRef.setInput('page', Number.NaN);
    fixture.componentRef.setInput('pageSize', Number.POSITIVE_INFINITY);
    fixture.componentRef.setInput('total', Number.NaN);
    expect(fixture.componentInstance.currentPage()).toBe(1);
    expect(fixture.componentInstance.safeSize()).toBe(10);
    expect(fixture.componentInstance.safeTotal()).toBe(0);
  });
});
