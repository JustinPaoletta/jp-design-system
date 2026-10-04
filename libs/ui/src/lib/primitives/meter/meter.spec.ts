import { TestBed } from '@angular/core/testing';
import { JpMeter } from './meter';

describe('JpMeter', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpMeter],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpMeter);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('exposes a measurement, clamps out-of-range values, and handles invalid bounds', async () => {
    const f = await mount({
      label: 'Storage',
      min: 20,
      max: 120,
      value: 70,
      valueText: '70 GB used',
    });
    const el = f.nativeElement.querySelector('[role=meter]') as HTMLElement;
    expect(f.componentInstance.percent()).toBe(50);
    expect(el.getAttribute('aria-valuetext')).toBe('70 GB used');
    f.componentRef.setInput('value', 200);
    f.detectChanges();
    expect(el.getAttribute('aria-valuenow')).toBe('120');
    f.componentRef.setInput('value', NaN);
    f.componentRef.setInput('max', 10);
    f.detectChanges();
    expect(f.componentInstance.safeMax()).toBe(21);
    expect(f.componentInstance.percent()).toBe(0);
    f.componentRef.setInput('min', NaN);
    f.componentRef.setInput('max', NaN);
    f.detectChanges();
    expect(f.componentInstance.safeMin()).toBe(0);
    expect(f.componentInstance.safeMax()).toBe(1);
  });
});
