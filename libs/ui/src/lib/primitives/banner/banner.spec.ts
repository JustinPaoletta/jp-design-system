import { TestBed } from '@angular/core/testing';
import { JpBanner } from './banner';

describe('JpBanner', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpBanner],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpBanner);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('names a persistent region, permits opt-in announcements, and emits dismissal', async () => {
    const f = await mount({
      title: 'Scheduled maintenance',
      message: 'Tonight',
      dismissible: true,
    });
    const region = f.nativeElement.querySelector('section') as HTMLElement;
    expect(region.getAttribute('role')).toBe('region');
    const dismissed = jest.fn();
    f.componentInstance.dismissed.subscribe(dismissed);
    (f.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(dismissed).toHaveBeenCalled();
    f.componentRef.setInput('announce', true);
    f.componentRef.setInput('tone', 'error');
    f.detectChanges();
    expect(region.getAttribute('role')).toBe('alert');
    f.componentRef.setInput('tone', 'success');
    f.detectChanges();
    expect(region.getAttribute('role')).toBe('status');
  });
});
