import { TestBed } from '@angular/core/testing';
import { JpFormSection } from './form-section';

describe('JpFormSection', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpFormSection],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpFormSection);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('uses a legend and group descriptions and forwards native disabled state', async () => {
    const f = await mount({
      legend: 'Delivery',
      hint: 'Choose destinations',
      error: 'Select one',
      disabled: true,
      id: 'delivery',
    });
    const el = f.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;
    expect(el.disabled).toBe(true);
    expect(el.getAttribute('aria-describedby')).toBe(
      'delivery-hint delivery-error',
    );
    expect(el.getAttribute('aria-invalid')).toBe('true');
    expect(el.querySelector('legend')?.textContent).toBe('Delivery');
    f.componentRef.setInput('hint', '');
    f.componentRef.setInput('error', '');
    f.detectChanges();
    expect(el.hasAttribute('aria-describedby')).toBe(false);
  });
  it('supplies unique description ids when none are given', async () => {
    const f = await mount({ legend: 'Preferences' });
    expect(f.componentInstance.resolvedId()).toMatch(/^jp-form-section-/);
  });
});
