import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DataPerformancePage } from './data-performance.page';
describe('DataPerformancePage', () => {
  it('controls real 10,000-row inventory sorting and selection', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const f = TestBed.createComponent(DataPerformancePage);
    f.detectChanges();
    expect(f.componentInstance.rows()).toHaveLength(10000);
    f.componentInstance.sort.set({ key: 'requests', direction: 'desc' });
    expect(f.componentInstance.rows()[0].id).toBe('service-10000');
    f.componentInstance.sort.set({ key: 'name', direction: 'asc' });
    expect(f.componentInstance.rows()[0].name).toBe('Service 00001');
    f.componentInstance.selected.set(['service-1']);
    expect(f.componentInstance.selected()).toEqual(['service-1']);
  });
});
