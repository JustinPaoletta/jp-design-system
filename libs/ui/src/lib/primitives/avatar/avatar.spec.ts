import { TestBed } from '@angular/core/testing';
import { JpAvatar } from './avatar';

describe('JpAvatar', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpAvatar],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpAvatar);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('names the identity and falls back to initials on failed images, then retries a new URL', async () => {
    const f = await mount({ name: 'Ada Lovelace', src: '/broken.png' });
    const img = f.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.alt).toBe('');
    expect(
      f.nativeElement.querySelector('[role=img]').getAttribute('aria-label'),
    ).toBe('Ada Lovelace');
    img.dispatchEvent(new Event('error'));
    f.detectChanges();
    expect(f.nativeElement.querySelector('img')).toBeNull();
    expect(f.nativeElement.textContent).toContain('AL');
    f.componentRef.setInput('src', '/new.png');
    f.detectChanges();
    expect(f.nativeElement.querySelector('img')).not.toBeNull();
  });
  it('handles single names, whitespace, Unicode, and empty initials without inventing an identity', async () => {
    const f = await mount({ name: '  李  ' });
    expect(f.componentInstance.initials()).toBe('李');
    f.componentRef.setInput('name', '');
    f.detectChanges();
    expect(f.componentInstance.initials()).toBe('');
  });
});
