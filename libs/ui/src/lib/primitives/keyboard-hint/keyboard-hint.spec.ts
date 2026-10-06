import { TestBed } from '@angular/core/testing';
import { JpKeyboardHint } from './keyboard-hint';

describe('JpKeyboardHint', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpKeyboardHint],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpKeyboardHint);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('retains keyboard-input semantics without exposing decorative separators', async () => {
    const f = await mount({ keys: ['Control', 'K'] });
    expect(f.nativeElement.querySelectorAll('kbd')).toHaveLength(2);
    expect(
      f.nativeElement.querySelector('.separator').getAttribute('aria-hidden'),
    ).toBe('true');
  });
});
