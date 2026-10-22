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
    expect(f.nativeElement.querySelectorAll('.group > jp-avatar')).toHaveLength(
      1,
    );
    expect(
      f.nativeElement.querySelector('.overflow').getAttribute('aria-label'),
    ).toBe('Show 2 more items');
    f.componentRef.setInput('max', 0);
    f.detectChanges();
    expect(f.componentInstance.limit()).toBe(1);
    f.componentRef.setInput('max', NaN);
    f.detectChanges();
    expect(f.componentInstance.limit()).toBe(4);
    expect(f.nativeElement.querySelector('.overflow')).toBeNull();
  });
  it('opens a readable list of all hidden members and restores focus on Escape', async () => {
    const f = await mount({
      people: [
        { id: 'a', name: 'Shane Baz' },
        { id: 'b', name: 'Yandy Díaz' },
        { id: 'c', name: 'Taylor Walls' },
      ],
      max: 1,
      label: 'Players',
    });
    const trigger = f.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    trigger.click();
    f.detectChanges();
    const panel = f.nativeElement.querySelector(
      '[jpPopoverContent]',
    ) as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(panel);
    expect(panel.textContent).toContain('Shane Baz');
    expect(panel.textContent).toContain('Yandy Díaz');
    expect(panel.textContent).toContain('Taylor Walls');
    panel.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    f.detectChanges();
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
    trigger.click();
    f.detectChanges();
    f.componentRef.setInput('people', [{ id: 'a', name: 'Shane Baz' }]);
    f.detectChanges();
    expect(f.componentInstance.open()).toBe(false);
    expect(f.nativeElement.querySelector('button')).toBeNull();
  });
  it('preserves outside focus when the list closes and allows translated labels', async () => {
    const f = await mount({
      people: [
        { id: 'a', name: 'Alex' },
        { id: 'b', name: 'Jordan' },
      ],
      max: 1,
      label: 'Players',
      overflowAriaLabel: (count: number) => `Voir ${count} joueurs`,
    });
    const trigger = f.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(trigger.getAttribute('aria-label')).toBe('Voir 1 joueurs');
    trigger.click();
    f.detectChanges();
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    f.detectChanges();
    expect(f.componentInstance.open()).toBe(false);
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
  it.each(['people', 'max'])(
    'preserves owned focus when %s removes the overflow disclosure',
    async (input) => {
      const f = await mount({
        people: [
          { id: 'a', name: 'Alex' },
          { id: 'b', name: 'Jordan' },
          { id: 'c', name: 'Maya' },
        ],
        max: 1,
        label: 'Players',
      });
      (f.nativeElement.querySelector('button') as HTMLButtonElement).click();
      f.detectChanges();
      expect(document.activeElement).toBe(
        f.nativeElement.querySelector('[jpPopoverContent]'),
      );
      f.componentRef.setInput(
        input,
        input === 'people' ? [{ id: 'a', name: 'Alex' }] : 3,
      );
      f.detectChanges();
      expect(f.nativeElement.querySelector('button')).toBeNull();
      expect(document.activeElement).toBe(
        f.nativeElement.querySelector('[role=group]'),
      );
    },
  );
  it('does not take outside focus when an input removes overflow', async () => {
    const f = await mount({
      people: [
        { id: 'a', name: 'Alex' },
        { id: 'b', name: 'Jordan' },
      ],
      max: 1,
      label: 'Players',
    });
    (f.nativeElement.querySelector('button') as HTMLButtonElement).click();
    f.detectChanges();
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    f.componentRef.setInput('max', 2);
    f.detectChanges();
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
});
