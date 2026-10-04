import { TestBed } from '@angular/core/testing';
import { JpRangeSlider } from './range-slider';
describe('JpRangeSlider', () => {
  async function mount(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [JpRangeSlider],
    }).compileComponents();
    const f = TestBed.createComponent(JpRangeSlider);
    f.componentRef.setInput('label', 'Budget');
    for (const [key, value] of Object.entries(inputs))
      f.componentRef.setInput(key, value);
    f.detectChanges();
    return f;
  }
  it('normalizes reversed external endpoints and prevents crossing from either numeric alternative', async () => {
    const f = await mount({ step: 5 });
    f.componentInstance.writeValue([80, 20]);
    f.detectChanges();
    expect(f.componentInstance.displayedValue()).toEqual([20, 80]);
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    const numbers = f.nativeElement.querySelectorAll(
      'input[type=number]',
    ) as NodeListOf<HTMLInputElement>;
    numbers[0].value = '95';
    numbers[0].dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(changed).toHaveBeenLastCalledWith([80, 80]);
    numbers[1].value = '15';
    numbers[1].dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(changed).toHaveBeenLastCalledWith([80, 80]);
    numbers[0].value = '32';
    numbers[0].dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(changed).toHaveBeenLastCalledWith([30, 80]);
    numbers[1].value = '';
    numbers[1].dispatchEvent(new Event('change'));
    expect(numbers[1].value).toBe('80');
  });
  it('repairs invalid bounds/values, keeps endpoints named, and exposes hint/error descriptions', async () => {
    const f = await mount({
      min: NaN,
      max: Infinity,
      step: -1,
      id: 'budget',
      hint: 'Choose a range',
      error: 'Check budget',
      lowerLabel: 'From',
      upperLabel: 'To',
    });
    f.componentInstance.writeValue([NaN, 10]);
    expect(f.componentInstance.displayedValue()).toEqual([0, 100]);
    f.componentInstance.writeValue(null);
    f.detectChanges();
    const ranges = f.nativeElement.querySelectorAll(
      'input[type=range]',
    ) as NodeListOf<HTMLInputElement>;
    expect(ranges[0].id).toBe('budget-0');
    expect(ranges[1].id).toBe('budget-1');
    expect(ranges[0].getAttribute('aria-describedby')).toBe(
      'budget-hint budget-error',
    );
    expect(f.nativeElement.textContent).toContain('From');
    expect(f.nativeElement.textContent).toContain('To');
    f.componentRef.setInput('min', 40);
    f.componentRef.setInput('max', 30);
    f.detectChanges();
    expect(f.componentInstance.safeMax()).toBe(140);
  });
  it('ignores disabled/read-only changes and supports slider-only presentation', async () => {
    const f = await mount();
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    f.componentRef.setInput('readonly', true);
    f.detectChanges();
    input.value = '20';
    input.dispatchEvent(new Event('input'));
    expect(changed).not.toHaveBeenCalled();
    f.componentRef.setInput('readonly', false);
    f.componentInstance.setDisabledState(true);
    f.detectChanges();
    input.dispatchEvent(new Event('input'));
    expect(changed).not.toHaveBeenCalled();
    f.componentInstance.setDisabledState(false);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(input.disabled).toBe(true);
    f.componentRef.setInput('showNumberInputs', false);
    f.detectChanges();
    expect(f.nativeElement.querySelectorAll('input')).toHaveLength(2);
  });
});
