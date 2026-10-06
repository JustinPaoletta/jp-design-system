import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { ProductToolsPage } from './product-tools.page';
describe('ProductToolsPage', () => {
  it('blocks invalid wizard progression, recovers without losing entered values, and saves only from review', async () => {
    await TestBed.configureTestingModule({
      imports: [ProductToolsPage],
      providers: [provideRouter([])],
    }).compileComponents();
    const f = TestBed.createComponent(ProductToolsPage);
    f.detectChanges();
    f.componentInstance.save();
    expect(f.componentInstance.saved()).toBe(false);
    f.componentInstance.next();
    f.detectChanges();
    await f.whenStable();
    expect(f.componentInstance.current()).toBe('details');
    expect(f.componentInstance.errors()).toHaveLength(1);
    f.componentInstance.email.setValue('ada@example.com');
    f.componentInstance.seats.setValue(11);
    f.componentInstance.next();
    expect(f.componentInstance.errors()).toHaveLength(1);
    f.componentInstance.seats.setValue(3);
    f.componentInstance.next();
    f.detectChanges();
    await f.whenStable();
    expect(f.componentInstance.current()).toBe('review');
    f.componentInstance.save();
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Project saved.');
    f.componentInstance.back();
    f.detectChanges();
    expect(f.componentInstance.email.value).toBe('ada@example.com');
    expect(f.componentInstance.seats.value).toBe(3);
    f.componentInstance.selectStep('review');
    expect(f.componentInstance.current()).toBe('details');
    f.componentInstance.next();
    f.detectChanges();
    f.componentInstance.selectStep('details');
    expect(f.componentInstance.current()).toBe('details');
  });
});
