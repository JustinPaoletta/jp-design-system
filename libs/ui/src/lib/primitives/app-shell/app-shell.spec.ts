import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpAppShell } from './app-shell';

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
      <nav jpAppShellSidebar>Nav</nav>
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

  beforeEach(async () => {
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
  });

  it('renders projected sidebar and main slots', () => {
    const hostFixture = TestBed.createComponent(AppShellHostComponent);
    hostFixture.detectChanges();

    expect(hostFixture.nativeElement.textContent).toContain('Nav');
    expect(hostFixture.nativeElement.textContent).toContain('Content');
  });
});
