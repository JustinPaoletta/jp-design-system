import { TestBed } from '@angular/core/testing';
import { JpDivider } from './divider';

describe('JpDivider', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpDivider],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpDivider);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('exposes separator orientation and supports purely decorative use', async () => {
    const f = await mount({});
    const span = f.nativeElement.querySelector('span') as HTMLElement;
    expect(span.getAttribute('aria-orientation')).toBe('horizontal');
    f.componentRef.setInput('orientation', 'vertical');
    f.detectChanges();
    expect(span.classList.contains('vertical')).toBe(true);
    f.componentRef.setInput('decorative', true);
    f.detectChanges();
    expect(span.getAttribute('role')).toBeNull();
    expect(span.getAttribute('aria-hidden')).toBe('true');
  });
});
