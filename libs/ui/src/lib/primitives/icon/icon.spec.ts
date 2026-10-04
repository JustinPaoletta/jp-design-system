import { TestBed } from '@angular/core/testing';
import { JpIcon } from './icon';

describe('JpIcon', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpIcon],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpIcon);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('keeps decorative glyphs silent and exposes a single name for meaningful glyphs', async () => {
    const f = await mount({ name: 'check' });
    const svg = f.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('role')).toBeNull();
    f.componentRef.setInput('label', 'Complete');
    f.componentRef.setInput('size', 'lg');
    f.detectChanges();
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Complete');
    expect(svg.hasAttribute('aria-hidden')).toBe(false);
    expect(svg.style.width).toBe('var(--jp-size-icon-lg)');
  });
});
