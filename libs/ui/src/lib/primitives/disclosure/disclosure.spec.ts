import { TestBed } from '@angular/core/testing';
import { JpDisclosure } from './disclosure';

describe('JpDisclosure', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpDisclosure],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpDisclosure);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('uses native disclosure semantics and synchronizes native and bound state', async () => {
    const f = await mount({
      title: 'Advanced settings',
      open: true,
      name: 'settings',
    });
    const details = f.nativeElement.querySelector(
      'details',
    ) as HTMLDetailsElement;
    expect(details.open).toBe(true);
    expect(details.getAttribute('name')).toBe('settings');
    const changes = jest.fn();
    f.componentInstance.open.subscribe(changes);
    details.open = false;
    details.dispatchEvent(new Event('toggle'));
    f.detectChanges();
    expect(f.componentInstance.open()).toBe(false);
    expect(changes).toHaveBeenCalledWith(false);
    expect(details.querySelector('summary')?.textContent).toContain(
      'Advanced settings',
    );
  });
});
