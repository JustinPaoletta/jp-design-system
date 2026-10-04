import { TestBed } from '@angular/core/testing';
import { JpSlider } from './slider';
describe('JpSlider', () => {
  async function mount(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [JpSlider],
    }).compileComponents();
    const f = TestBed.createComponent(JpSlider);
    f.componentRef.setInput('label', 'Volume');
    for (const [key, value] of Object.entries(inputs))
      f.componentRef.setInput(key, value);
    f.detectChanges();
    return f;
  }
  it('normalizes values to bounds and steps while providing a numeric alternative', async () => {
    const f = await mount({
      min: 0.1,
      max: 0.55,
      step: 0.1,
      valueText: (v: number) => `${v} litres`,
    });
    f.componentInstance.writeValue(0.56);
    f.detectChanges();
    expect(f.componentInstance.displayedValue()).toBe(0.5);
    const controls = f.nativeElement.querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>;
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    controls[1].value = '0.32';
    controls[1].dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(changed).toHaveBeenLastCalledWith(0.3);
    expect(controls[0].value).toBe('0.3');
    expect(controls[0].getAttribute('aria-valuetext')).toBe('0.3 litres');
    controls[1].value = '';
    controls[1].dispatchEvent(new Event('change'));
    expect(controls[1].value).toBe('0.3');
  });
  it('uses safe defaults, guards disabled/read-only controls, and can hide the numeric alternative', async () => {
    const f = await mount({
      id: 'volume',
      hint: 'Set volume',
      error: 'Check volume',
      max: -1,
      step: NaN,
    });
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    expect(f.componentInstance.lower()).toBe(0);
    expect(f.componentInstance.upper()).toBe(100);
    f.componentInstance.writeValue(null);
    expect(f.componentInstance.displayedValue()).toBe(0);
    f.componentRef.setInput('readonly', true);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '40';
    input.dispatchEvent(new Event('input'));
    expect(changed).not.toHaveBeenCalled();
    f.componentRef.setInput('readonly', false);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    input.dispatchEvent(new Event('input'));
    expect(changed).not.toHaveBeenCalled();
    expect(input.getAttribute('aria-describedby')).toBe(
      'volume-hint volume-error',
    );
    f.componentRef.setInput('showNumberInput', false);
    f.detectChanges();
    expect(f.nativeElement.querySelectorAll('input')).toHaveLength(1);
  });
});
