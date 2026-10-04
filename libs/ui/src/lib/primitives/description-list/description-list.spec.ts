import { TestBed } from '@angular/core/testing';
import { JpDescriptionList } from './description-list';

describe('JpDescriptionList', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpDescriptionList],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpDescriptionList);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('pairs terms and values using description-list semantics and retains zero-valued data', async () => {
    const f = await mount({
      items: [
        { term: 'Retries', description: 0 },
        { term: 'Owner', description: 'Ada' },
      ],
    });
    expect(f.nativeElement.querySelectorAll('dl > div > dt')).toHaveLength(2);
    expect(f.nativeElement.querySelector('dd').textContent).toBe('0');
  });
});
