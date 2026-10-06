import { TestBed } from '@angular/core/testing';
import { JpSpinner } from './spinner';

describe('JpSpinner', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpSpinner],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpSpinner);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('provides a textual loading announcement only when the caller needs one', async () => {
    const f = await mount({ label: 'Refreshing reports' });
    expect(
      f.nativeElement.querySelector('[role=status]').textContent,
    ).toContain('Refreshing reports');
    f.componentRef.setInput('decorative', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role=status]')).toBeNull();
    expect(f.nativeElement.querySelector('[jpVisuallyHidden]')).toBeNull();
  });
});
