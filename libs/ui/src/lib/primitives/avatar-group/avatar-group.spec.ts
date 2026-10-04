import { TestBed } from '@angular/core/testing';
import { JpAvatarGroup } from './avatar-group';

describe('JpAvatarGroup', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpAvatarGroup],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpAvatarGroup);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('limits visible identities while exposing the names of overflow identities', async () => {
    const people = [
      { id: 'a', name: 'Ada', src: '/ada.png' },
      { id: 'b', name: 'Grace' },
      { id: 'c', name: 'Linus' },
    ];
    const f = await mount({ people, max: 1, label: 'Reviewers' });
    expect(f.nativeElement.querySelectorAll('jp-avatar')).toHaveLength(1);
    expect(
      f.nativeElement.querySelector('.overflow').getAttribute('aria-label'),
    ).toBe('Grace, Linus');
    f.componentRef.setInput('max', 0);
    f.detectChanges();
    expect(f.componentInstance.limit()).toBe(1);
    f.componentRef.setInput('max', NaN);
    f.detectChanges();
    expect(f.componentInstance.limit()).toBe(4);
    expect(f.nativeElement.querySelector('.overflow')).toBeNull();
  });
});
