import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpAppShell } from './app-shell';

type MediaChangeListener = (event: MediaQueryListEvent) => void;

function installMatchMediaMock(initialMatches = false) {
  const listeners = new Set<MediaChangeListener>();
  const mediaQuery: {
    matches: boolean;
    media: string;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    dispatch: (matches: boolean) => void;
  } = {
    matches: initialMatches,
    media: '(max-width: 48rem)',
    addEventListener: jest.fn((type: string, listener: MediaChangeListener) => {
      if (type === 'change') {
        listeners.add(listener);
      }
    }),
    removeEventListener: jest.fn(
      (type: string, listener: MediaChangeListener) => {
        if (type === 'change') {
          listeners.delete(listener);
        }
      },
    ),
    dispatch(matches: boolean) {
      this.matches = matches;
      listeners.forEach((listener) => {
        listener({ matches } as MediaQueryListEvent);
      });
    },
  };

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: jest.fn().mockReturnValue(mediaQuery),
  });

  return mediaQuery;
}

@Component({
  standalone: true,
  imports: [JpAppShell],
  template: `
    <jp-app-shell
      [sidebarCollapsed]="collapsed"
      [mobileNavOpen]="drawerOpen"
      (sidebarCollapsedChange)="collapsed = $event"
      (mobileNavOpenChange)="drawerOpen = $event"
    >
      <nav jpAppShellSidebar>
        <a href="#one">One</a>
        <a href="#two">Two</a>
      </nav>
      <main jpAppShellMain>Content</main>
    </jp-app-shell>
  `,
})
class AppShellHostComponent {
  collapsed = false;
  drawerOpen = false;
}

describe('JpAppShell', () => {
  let fixture: ComponentFixture<JpAppShell>;
  let component: JpAppShell;
  let mediaQuery: ReturnType<typeof installMatchMediaMock>;

  beforeEach(async () => {
    mediaQuery = installMatchMediaMock(false);

    await TestBed.configureTestingModule({
      imports: [JpAppShell],
    }).compileComponents();

    fixture = TestBed.createComponent(JpAppShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('defaults sidebarCollapsed and mobileNavOpen to false', () => {
    expect(component.sidebarCollapsed()).toBe(false);
    expect(component.mobileNavOpen()).toBe(false);
    expect(
      fixture.nativeElement.classList.contains('jp-app-shell--collapsed'),
    ).toBe(false);
    expect(
      fixture.nativeElement.classList.contains('jp-app-shell--mobile-nav-open'),
    ).toBe(false);
  });

  it('wires matchMedia on init and tracks viewport changes', () => {
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 48rem)');
    expect(component.isMobileViewport()).toBe(false);

    mediaQuery.dispatch(true);
    expect(component.isMobileViewport()).toBe(true);
  });

  it('closes mobile nav when viewport leaves mobile while open', () => {
    fixture.componentRef.setInput('mobileNavOpen', true);
    mediaQuery.dispatch(true);
    fixture.detectChanges();

    const emitted: boolean[] = [];
    component.mobileNavOpenChange.subscribe((value) => emitted.push(value));

    mediaQuery.dispatch(false);
    expect(emitted).toEqual([false]);
  });

  it('removes matchMedia listener on destroy', () => {
    fixture.destroy();
    expect(mediaQuery.removeEventListener).toHaveBeenCalled();
  });

  it('applies collapsed host class when sidebarCollapsed is true', () => {
    fixture.componentRef.setInput('sidebarCollapsed', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('jp-app-shell--collapsed'),
    ).toBe(true);
  });

  it('applies mobile-nav-open host class when mobileNavOpen is true', () => {
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('jp-app-shell--mobile-nav-open'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('.jp-app-shell__scrim'),
    ).toBeTruthy();
  });

  it('emits sidebarCollapsedChange when collapse toggle is clicked', () => {
    const emitted: boolean[] = [];
    component.sidebarCollapsedChange.subscribe((value) => emitted.push(value));

    const toggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__collapse-toggle',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    expect(emitted).toEqual([true]);
  });

  it('emits mobileNavOpenChange when menu toggle is clicked', () => {
    const emitted: boolean[] = [];
    component.mobileNavOpenChange.subscribe((value) => emitted.push(value));

    const toggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__menu-toggle',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    expect(emitted).toEqual([true]);
  });

  it('emits false when drawer close button is clicked', () => {
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    const emitted: boolean[] = [];
    component.mobileNavOpenChange.subscribe((value) => emitted.push(value));

    const close = fixture.nativeElement.querySelector(
      '.jp-app-shell__drawer-close',
    ) as HTMLButtonElement;
    close.click();

    expect(emitted).toEqual([false]);
  });

  it('does not emit when closeMobileNav is called while already closed', () => {
    const emitted: boolean[] = [];
    component.mobileNavOpenChange.subscribe((value) => emitted.push(value));

    component.closeMobileNav();
    expect(emitted).toEqual([]);
  });

  it('emits false on Escape when mobile nav is open', () => {
    fixture.componentRef.setInput('mobileNavOpen', true);
    component.isMobileViewport.set(true);
    fixture.detectChanges();

    const emitted: boolean[] = [];
    component.mobileNavOpenChange.subscribe((value) => emitted.push(value));

    component.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape' }),
    );

    expect(emitted).toEqual([false]);
  });

  it('ignores keydown when mobile nav is closed or desktop', () => {
    const emitted: boolean[] = [];
    component.mobileNavOpenChange.subscribe((value) => emitted.push(value));

    component.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape' }),
    );

    fixture.componentRef.setInput('mobileNavOpen', true);
    component.isMobileViewport.set(false);
    fixture.detectChanges();

    component.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape' }),
    );

    expect(emitted).toEqual([]);
  });

  it('emits false when scrim is clicked', () => {
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    const emitted: boolean[] = [];
    component.mobileNavOpenChange.subscribe((value) => emitted.push(value));

    const scrim = fixture.nativeElement.querySelector(
      '.jp-app-shell__scrim',
    ) as HTMLElement;
    scrim.click();

    expect(emitted).toEqual([false]);
  });

  it('exposes accessible collapse toggle attributes', () => {
    const sidebar = fixture.nativeElement.querySelector(
      '.jp-app-shell__sidebar',
    ) as HTMLElement;
    const toggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__collapse-toggle',
    ) as HTMLButtonElement;
    const menuToggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__menu-toggle',
    ) as HTMLButtonElement;

    expect(sidebar.getAttribute('aria-expanded')).toBe('true');
    expect(sidebar.getAttribute('aria-label')).toBe('Primary');
    expect(toggle.getAttribute('aria-label')).toBe('Collapse sidebar');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    expect(menuToggle.getAttribute('aria-controls')).toBe(
      'jp-app-shell-sidebar',
    );
  });

  it('uses custom sidebarLabel and open menu aria-label', () => {
    fixture.componentRef.setInput('sidebarLabel', 'App');
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    const sidebar = fixture.nativeElement.querySelector(
      '.jp-app-shell__sidebar',
    ) as HTMLElement;
    const menuToggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__menu-toggle',
    ) as HTMLButtonElement;

    expect(sidebar.getAttribute('aria-label')).toBe('App');
    expect(menuToggle.getAttribute('aria-label')).toBe('Close navigation');
    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('updates aria state when collapsed', () => {
    fixture.componentRef.setInput('sidebarCollapsed', true);
    fixture.detectChanges();

    const sidebar = fixture.nativeElement.querySelector(
      '.jp-app-shell__sidebar',
    ) as HTMLElement;
    const toggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__collapse-toggle',
    ) as HTMLButtonElement;

    expect(sidebar.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('Expand sidebar');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('marks main inert while mobile drawer is open', () => {
    fixture.componentRef.setInput('mobileNavOpen', true);
    component.isMobileViewport.set(true);
    fixture.detectChanges();

    const main = fixture.nativeElement.querySelector(
      '.jp-app-shell__main',
    ) as HTMLElement;
    expect(main.hasAttribute('inert')).toBe(true);
    expect(main.getAttribute('aria-hidden')).toBe('true');
    expect(component.mainInert()).toBe(true);
  });

  it('focuses the first sidebar control when the mobile drawer opens', () => {
    component.isMobileViewport.set(true);
    fixture.detectChanges();

    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    const firstFocusable = fixture.nativeElement.querySelector(
      '.jp-app-shell__sidebar button, .jp-app-shell__sidebar a',
    ) as HTMLElement;
    expect(document.activeElement).toBe(firstFocusable);
  });

  it('restores focus to the menu toggle when the mobile drawer closes', () => {
    const menuToggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__menu-toggle',
    ) as HTMLButtonElement;
    menuToggle.focus();

    component.isMobileViewport.set(true);
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('mobileNavOpen', false);
    fixture.detectChanges();

    expect(document.activeElement).toBe(menuToggle);
  });

  it('traps Tab focus within the sidebar while the drawer is open', () => {
    component.isMobileViewport.set(true);
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    const focusables = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.jp-app-shell__sidebar button, .jp-app-shell__sidebar a[href]',
      ),
    ) as HTMLElement[];
    expect(focusables.length).toBeGreaterThan(1);

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    last.focus();
    const forward = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    component.onDocumentKeydown(forward);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    first.focus();
    const backward = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    component.onDocumentKeydown(backward);
    expect(backward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it('prevents Tab when the sidebar has no focusable controls', () => {
    component.isMobileViewport.set(true);
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    const sidebar = fixture.nativeElement.querySelector(
      '.jp-app-shell__sidebar',
    ) as HTMLElement;
    sidebar
      .querySelectorAll('button, a[href], [tabindex]')
      .forEach((element) => element.remove());

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    component.onDocumentKeydown(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('does not wrap Tab when focus is between the first and last control', () => {
    component.isMobileViewport.set(true);
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    const sidebarContent = fixture.nativeElement.querySelector(
      '.jp-app-shell__sidebar-content',
    ) as HTMLElement;
    const extra = document.createElement('button');
    extra.type = 'button';
    extra.textContent = 'Extra';
    sidebarContent.appendChild(extra);
    fixture.detectChanges();

    const focusables = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.jp-app-shell__sidebar button:not([disabled]), .jp-app-shell__sidebar a[href]',
      ),
    ) as HTMLElement[];
    expect(focusables.length).toBeGreaterThan(2);

    focusables[1].focus();
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    component.onDocumentKeydown(event);
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(focusables[1]);
  });

  it('handles a missing sidebar element during focus trap', () => {
    component.isMobileViewport.set(true);
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    Object.defineProperty(component, 'sidebarRef', {
      configurable: true,
      value: () => undefined,
    });

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    component.onDocumentKeydown(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('restores focus via the menu toggle when previous focus is unavailable', () => {
    component.isMobileViewport.set(true);
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    const menuToggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__menu-toggle',
    ) as HTMLButtonElement;

    // Simulate open cycle without a retained previousFocus.
    (
      component as unknown as { previousFocus: HTMLElement | null }
    ).previousFocus = null;
    (component as unknown as { lastMobileNavOpen: boolean }).lastMobileNavOpen =
      true;

    fixture.componentRef.setInput('mobileNavOpen', false);
    fixture.detectChanges();

    expect(document.activeElement).toBe(menuToggle);
  });

  it('ignores disabled controls when collecting sidebar focusables', () => {
    component.isMobileViewport.set(true);
    fixture.componentRef.setInput('mobileNavOpen', true);
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.jp-app-shell__sidebar button'),
    ) as HTMLButtonElement[];
    buttons.forEach((button) => button.setAttribute('disabled', ''));

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    component.onDocumentKeydown(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('does not emit when leaving mobile while the drawer is already closed', () => {
    mediaQuery.dispatch(true);
    const emitted: boolean[] = [];
    component.mobileNavOpenChange.subscribe((value) => emitted.push(value));

    mediaQuery.dispatch(false);
    expect(emitted).toEqual([]);
  });

  it('renders projected sidebar and main slots', () => {
    const hostFixture = TestBed.createComponent(AppShellHostComponent);
    hostFixture.detectChanges();

    expect(hostFixture.nativeElement.textContent).toContain('One');
    expect(hostFixture.nativeElement.textContent).toContain('Content');
  });
});

describe('JpAppShell without matchMedia', () => {
  it('skips media query wiring when matchMedia is unavailable', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined,
    });

    await TestBed.configureTestingModule({
      imports: [JpAppShell],
    }).compileComponents();

    const fixture = TestBed.createComponent(JpAppShell);
    fixture.detectChanges();

    expect(fixture.componentInstance.isMobileViewport()).toBe(false);
    fixture.destroy();
  });
});
