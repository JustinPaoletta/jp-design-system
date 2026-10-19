import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpBreadcrumbs } from './breadcrumbs';

describe('JpBreadcrumbs', () => {
  let fixture: ComponentFixture<JpBreadcrumbs>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpBreadcrumbs],
    }).compileComponents();
    fixture = TestBed.createComponent(JpBreadcrumbs);
    fixture.componentRef.setInput('items', [
      { label: 'Projects', href: '/projects' },
      { label: 'Design system', href: '/projects/design' },
      { label: 'Settings', href: '/projects/design/settings' },
    ]);
    fixture.detectChanges();
  });

  it('renders a named navigation landmark with an ordered hierarchy', () => {
    expect(
      fixture.nativeElement.querySelector('nav').getAttribute('aria-label'),
    ).toBe('Breadcrumb');
    expect(fixture.nativeElement.querySelectorAll('ol > li')).toHaveLength(3);
    const links = fixture.nativeElement.querySelectorAll(
      'a',
    ) as NodeListOf<HTMLAnchorElement>;
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('/projects');
    const current = fixture.nativeElement.querySelector(
      '[aria-current="page"]',
    ) as HTMLElement;
    expect(current.textContent).toBe('Settings');
    expect(current.tagName).toBe('SPAN');
    expect(
      fixture.nativeElement.querySelectorAll('[aria-hidden="true"]'),
    ).toHaveLength(2);
  });

  it('accepts a custom accessible name and non-link ancestors', () => {
    fixture.componentRef.setInput('ariaLabel', 'Project hierarchy');
    fixture.componentRef.setInput('items', [
      { label: 'Workspace' },
      { label: 'Settings' },
    ]);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('nav').getAttribute('aria-label'),
    ).toBe('Project hierarchy');
    expect(fixture.nativeElement.querySelectorAll('a')).toHaveLength(0);
    expect(
      fixture.nativeElement.querySelectorAll('[aria-current="page"]'),
    ).toHaveLength(1);
  });

  it('does not add a separator or link for a single current page', () => {
    fixture.componentRef.setInput('items', [{ label: 'Home', href: '/' }]);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('a, [aria-hidden]'),
    ).toHaveLength(0);
    expect(
      fixture.nativeElement.querySelector('[aria-current="page"]').textContent,
    ).toBe('Home');
  });
  it('collapses middle destinations into a keyboard menu while keeping the current page as text', () => {
    fixture.componentRef.setInput('maxItems', 2);
    fixture.componentRef.setInput('items', [
      { label: 'League', href: '#league' },
      { label: 'Clubs', href: '#clubs' },
      { label: 'Riverton Falcons', href: '#falcons' },
      { label: 'Roster' },
    ]);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(trigger.getAttribute('aria-label')).toBe('Show 2 more items');
    trigger.click();
    fixture.detectChanges();
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('[role=menuitem]'),
    ) as HTMLAnchorElement[];
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#clubs',
      '#falcons',
    ]);
    expect(document.activeElement).toBe(links[0]);
    links[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    expect(document.activeElement).toBe(links[1]);
    links[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(
      fixture.nativeElement.querySelector('[aria-current]').textContent,
    ).toBe('Roster');
  });
  it('adapts to container width, preserves focused destinations, and cleans up the resize observer', () => {
    fixture.destroy();
    const original = globalThis.ResizeObserver;
    let resized: ResizeObserverCallback | undefined;
    const disconnect = jest.fn();
    globalThis.ResizeObserver = jest.fn((callback: ResizeObserverCallback) => {
      resized = callback;
      return { observe: jest.fn(), disconnect, unobserve: jest.fn() };
    }) as unknown as typeof ResizeObserver;
    try {
      fixture = TestBed.createComponent(JpBreadcrumbs);
      fixture.componentRef.setInput('items', [
        { label: 'League', href: '#league' },
        { label: 'Clubs', href: '#clubs' },
        { label: 'Falcons', href: '#falcons' },
        { label: 'Roster' },
      ]);
      fixture.detectChanges();
      const second = fixture.nativeElement.querySelector(
        'a[href="#clubs"]',
      ) as HTMLElement;
      second.focus();
      resized?.(
        [{ contentRect: { width: 320 } } as ResizeObserverEntry],
        {} as ResizeObserver,
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.hiddenCount()).toBe(1);
      expect(document.activeElement).toBe(
        fixture.nativeElement.querySelector('button'),
      );
      resized?.(
        [{ contentRect: { width: 800 } } as ResizeObserverEntry],
        {} as ResizeObserver,
      );
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button')).toBeNull();
      expect(document.activeElement?.getAttribute('href')).toBe('#clubs');
      fixture.destroy();
      expect(disconnect).toHaveBeenCalled();
    } finally {
      globalThis.ResizeObserver = original;
    }
  });
  it('keeps non-link ancestors readable and clamps invalid limits', () => {
    fixture.componentRef.setInput('maxItems', 0);
    fixture.componentRef.setInput('items', [
      { label: 'League', href: '#league' },
      { label: 'Clubhouse' },
      { label: 'Roster' },
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance.limit()).toBe(2);
    expect(
      fixture.nativeElement
        .querySelector('[role=menuitem]')
        .getAttribute('aria-disabled'),
    ).toBe('true');
    fixture.componentRef.setInput('maxItems', NaN);
    fixture.detectChanges();
    expect(fixture.componentInstance.limit()).toBe(5);
  });
  it.each(['maxItems', 'items'])(
    'keeps focus on a surviving destination when %s removes its menu',
    (input) => {
      const items = [
        { label: 'League', href: '#league' },
        { label: 'Clubs', href: '#clubs' },
        { label: 'Falcons', href: '#falcons' },
        { label: 'Roster' },
      ];
      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('maxItems', 2);
      fixture.detectChanges();
      (
        fixture.nativeElement.querySelector('button') as HTMLButtonElement
      ).click();
      fixture.detectChanges();
      const link = fixture.nativeElement.querySelector(
        '[role=menuitem][href="#clubs"]',
      ) as HTMLAnchorElement;
      expect(document.activeElement).toBe(link);
      fixture.componentRef.setInput(
        input,
        input === 'maxItems'
          ? 5
          : items.filter((item) => item.href !== '#clubs'),
      );
      fixture.detectChanges();
      expect(document.activeElement?.getAttribute('href')).toBe(
        input === 'maxItems' ? '#clubs' : '#league',
      );
    },
  );
  it('does not steal outside focus when input changes remove an open menu', () => {
    fixture.componentRef.setInput('maxItems', 2);
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector('button') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    fixture.componentRef.setInput('maxItems', 5);
    fixture.detectChanges();
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
});
