import { TestBed } from '@angular/core/testing';
import { JpOverflowChip } from './overflow-chip';
describe('JpOverflowChip', () => {
  async function mount() {
    await TestBed.configureTestingModule({
      imports: [JpOverflowChip],
    }).compileComponents();
    const f = TestBed.createComponent(JpOverflowChip);
    f.componentRef.setInput('label', 'Other reviewers');
    f.componentRef.setInput('items', [
      { id: 'ada', label: 'Ada', href: '#reviewer-ada' },
      { id: 'grace', label: 'Grace' },
    ]);
    f.detectChanges();
    return f;
  }
  it('exposes every hidden item, opens from a named +N action, and returns focus when closing inside the panel', async () => {
    const f = await mount();
    document.body.appendChild(f.nativeElement);
    const button = f.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('+2');
    expect(button.getAttribute('aria-label')).toBe(
      'Show 2 more items: Other reviewers',
    );
    button.click();
    f.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const link = f.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('#reviewer-ada');
    link.focus();
    f.componentInstance.setOpen(false);
    f.detectChanges();
    expect(document.activeElement).toBe(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    f.nativeElement.remove();
  });
  it('does not steal focus from an outside control and omits an empty overflow action', async () => {
    const f = await mount();
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    f.componentInstance.setOpen(false);
    expect(document.activeElement).toBe(outside);
    outside.remove();
    f.componentRef.setInput('items', []);
    f.detectChanges();
    expect(f.nativeElement.querySelector('button')).toBeNull();
  });
});
