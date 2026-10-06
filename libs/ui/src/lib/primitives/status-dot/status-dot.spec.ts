import { TestBed } from '@angular/core/testing';
import { JpStatusDot } from './status-dot';

describe('JpStatusDot', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpStatusDot],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpStatusDot);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('supports named status and silent decoration with semantic colors', async () => {
    const f = await mount({ tone: 'success', label: 'Online' });
    const span = f.nativeElement.querySelector('span') as HTMLElement;
    expect(span.getAttribute('aria-label')).toBe('Online');
    expect(f.componentInstance.color()).toBe(
      'var(--jp-color-state-success-text)',
    );
    f.componentRef.setInput('tone', 'neutral');
    f.componentRef.setInput('label', '');
    f.detectChanges();
    expect(span.getAttribute('aria-hidden')).toBe('true');
    expect(f.componentInstance.color()).toBe('var(--jp-color-text-muted)');
  });
});
