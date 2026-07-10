import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpAppShell } from './app-shell';

@Component({
  standalone: true,
  imports: [JpAppShell],
  template: `
    <jp-app-shell>
      <nav jpAppShellSidebar>Nav</nav>
      <main jpAppShellMain>Content</main>
    </jp-app-shell>
  `,
})
class AppShellHostComponent {}

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

  it('defaults sidebarCollapsed to false', () => {
    expect(component.sidebarCollapsed()).toBe(false);
    expect(
      fixture.nativeElement.classList.contains('jp-app-shell--collapsed'),
    ).toBe(false);
  });

  it('applies collapsed host class when sidebarCollapsed is true', () => {
    fixture.componentRef.setInput('sidebarCollapsed', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('jp-app-shell--collapsed'),
    ).toBe(true);
  });

  it('emits sidebarCollapsedChange when toggle is clicked', () => {
    const emitted: boolean[] = [];
    component.sidebarCollapsedChange.subscribe((value) => emitted.push(value));

    const toggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__collapse-toggle',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    expect(emitted).toEqual([true]);
  });

  it('exposes accessible collapse toggle attributes', () => {
    const sidebar = fixture.nativeElement.querySelector(
      '.jp-app-shell__sidebar',
    ) as HTMLElement;
    const toggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__collapse-toggle',
    ) as HTMLButtonElement;

    expect(sidebar.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Collapse sidebar');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
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

  it('renders projected sidebar and main slots', () => {
    const hostFixture = TestBed.createComponent(AppShellHostComponent);
    hostFixture.detectChanges();

    expect(hostFixture.nativeElement.textContent).toContain('Nav');
    expect(hostFixture.nativeElement.textContent).toContain('Content');
  });
});
