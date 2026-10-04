import { TestBed } from '@angular/core/testing';
import { InteractionToolsPage } from './interaction-tools.page';
describe('InteractionToolsPage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => jest.restoreAllMocks());
  it('composes priorities and reference cards and restores normalized saved priorities', () => {
    localStorage.setItem(
      'jp-demo-priorities-v1',
      JSON.stringify(['release', 'missing', 'release']),
    );
    const fixture = TestBed.createComponent(InteractionToolsPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.order()).toEqual([
      'release',
      'audit',
      'docs',
      'feedback',
    ]);
    expect(fixture.nativeElement.querySelector('jp-reorder')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('jp-carousel')).toBeTruthy();
    fixture.componentInstance.save(['feedback', 'audit']);
    expect(localStorage.getItem('jp-demo-priorities-v1')).toBe(
      '["feedback","audit"]',
    );
    fixture.componentInstance.reset();
    expect(fixture.componentInstance.order()).toEqual([
      'audit',
      'docs',
      'release',
      'feedback',
    ]);
  });
  it('handles denied storage and corrupt persisted data', () => {
    localStorage.setItem('jp-demo-priorities-v1', 'broken');
    const fixture = TestBed.createComponent(InteractionToolsPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.storageStatus()).toContain('session');
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Denied');
    });
    fixture.componentInstance.save(['docs']);
    expect(fixture.componentInstance.storageStatus()).toContain('session');
    const input = document.createElement('input');
    input.value = 'Prioritize accessibility';
    fixture.componentInstance.updateNote({ target: input } as unknown as Event);
    expect(fixture.componentInstance.note()).toBe('Prioritize accessibility');
  });
  it('starts with default priorities when nothing has been saved', () => {
    const fixture = TestBed.createComponent(InteractionToolsPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.order()).toEqual([
      'audit',
      'docs',
      'release',
      'feedback',
    ]);
    expect(
      fixture.nativeElement.querySelector('jp-reorder li').textContent,
    ).toContain('Accessibility audit');
    expect(localStorage.getItem('jp-demo-priorities-v1')).toBeNull();
  });
  it.each([JSON.stringify({ order: ['docs'] }), JSON.stringify(['docs', 3])])(
    'ignores a saved value with an invalid schema: %s',
    (raw) => {
      localStorage.setItem('jp-demo-priorities-v1', raw);
      const fixture = TestBed.createComponent(InteractionToolsPage);
      fixture.detectChanges();
      expect(fixture.componentInstance.order()).toEqual([
        'audit',
        'docs',
        'release',
        'feedback',
      ]);
      expect(
        fixture.nativeElement.querySelector('jp-reorder li').textContent,
      ).toContain('Accessibility audit');
    },
  );
  it('uses the current session if storage cannot be read, without preventing reordering', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Denied');
    });
    const fixture = TestBed.createComponent(InteractionToolsPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Storage unavailable');
    root
      .querySelector<HTMLButtonElement>(
        'jp-reorder button[data-item=audit][data-action=down]',
      )
      ?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.order()).toEqual([
      'docs',
      'audit',
      'release',
      'feedback',
    ]);
    expect(root.querySelectorAll('jp-reorder li')[1].textContent).toContain(
      'Accessibility audit',
    );
  });
  it('commits click reordering and resets through page controls even if saving is denied', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Denied');
    });
    const fixture = TestBed.createComponent(InteractionToolsPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root
      .querySelector<HTMLButtonElement>(
        'jp-reorder button[data-item=audit][data-action=down]',
      )
      ?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.order()).toEqual([
      'docs',
      'audit',
      'release',
      'feedback',
    ]);
    expect(root.textContent).toContain('Priorities apply for this session');
    const reset = Array.from(
      root.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent?.trim() === 'Reset priorities');
    expect(reset).toBeTruthy();
    reset?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.order()).toEqual([
      'audit',
      'docs',
      'release',
      'feedback',
    ]);
    expect(root.querySelector('jp-reorder li')?.textContent).toContain(
      'Accessibility audit',
    );
  });
  it('connects carousel navigation, card actions, and note editing to consumer state', () => {
    const fixture = TestBed.createComponent(InteractionToolsPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const carousel = root.querySelector('jp-carousel');
    if (!carousel) throw new Error('Expected reference cards');
    const button = (name: string) => {
      const element = Array.from(
        carousel.querySelectorAll<HTMLButtonElement>('button'),
      ).find((item) => item.textContent?.trim() === name);
      if (!element) throw new Error('Expected card control: ' + name);
      return element;
    };
    button('Open invitations').click();
    fixture.detectChanges();
    expect(root.querySelector('jp-carousel + p')?.textContent).toContain(
      'Invitations opened',
    );
    button('Next slide').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.slide()).toBe(1);
    const input = root.querySelector<HTMLInputElement>('#workspace-note');
    if (!input) throw new Error('Expected workspace note');
    input.value = 'Confirm owners before release';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.note()).toBe(
      'Confirm owners before release',
    );
    button('Next slide').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.slide()).toBe(2);
    button('Schedule a review').click();
    fixture.detectChanges();
    expect(root.querySelector('jp-carousel + p')?.textContent).toContain(
      'Review scheduled',
    );
    button('Previous slide').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.slide()).toBe(1);
    expect(root.querySelector<HTMLInputElement>('#workspace-note')?.value).toBe(
      'Confirm owners before release',
    );
  });
});
