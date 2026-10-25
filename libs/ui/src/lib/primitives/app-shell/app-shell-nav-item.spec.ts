import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpAppShellNavItem } from './app-shell-nav-item';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { JpAppShell } from './app-shell';
@Component({
  imports: [JpAppShell, JpAppShellNavItem],
  template: `<jp-app-shell [sidebarCollapsed]="collapsed()"
    ><nav jpAppShellSidebar>
      <jp-app-shell-nav-item
        ><span jpAppShellNavIcon>◇</span>{{ label() }}</jp-app-shell-nav-item
      >
    </nav>
    <main jpAppShellMain>Club</main></jp-app-shell
  >`,
})
class ShellHost {
  collapsed = signal(true);
  label = signal('Roster');
}

describe('JpAppShellNavItem', () => {
  it('shows the current collapsed label without a repeated accessible description', async () => {
    const f = TestBed.createComponent(ShellHost);
    f.detectChanges();
    await f.whenStable();
    const link = f.nativeElement.querySelector(
      'jp-app-shell-nav-item a',
    ) as HTMLAnchorElement;
    link.focus();
    f.detectChanges();
    expect(
      f.nativeElement.querySelector('[role=tooltip]').textContent,
    ).toContain('Roster');
    expect(link.getAttribute('aria-describedby')).toBeNull();
    f.componentInstance.label.set('Game archive');
    f.changeDetectorRef.markForCheck();
    f.detectChanges();
    // MutationObserver delivers the projected text update before Angular schedules its render.
    await Promise.resolve();
    expect(
      f.nativeElement.querySelector('.jp-app-shell-nav-item__label')
        .textContent,
    ).toContain('Game archive');
    await f.whenStable();
    expect(
      f.nativeElement.querySelector('[role=tooltip]').textContent,
    ).toContain('Game archive');
    const shell = f.debugElement.query(By.directive(JpAppShell))
      .componentInstance as JpAppShell;
    shell.isMobileViewport.set(true);
    f.detectChanges();
    await f.whenStable();
    expect(f.nativeElement.querySelector('[role=tooltip]')).toBeNull();
    shell.isMobileViewport.set(false);
    f.componentInstance.collapsed.set(false);
    f.changeDetectorRef.markForCheck();
    f.detectChanges();
    await f.whenStable();
    link.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role=tooltip]')).toBeNull();
  });
  let fixture: ComponentFixture<JpAppShellNavItem>;
  let component: JpAppShellNavItem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpAppShellNavItem],
    }).compileComponents();

    fixture = TestBed.createComponent(JpAppShellNavItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to an anchor with inactive state', () => {
    expect(component.as()).toBe('a');
    expect(component.active()).toBe(false);
    expect(
      fixture.nativeElement.classList.contains('jp-app-shell-nav-item--active'),
    ).toBe(false);

    const root = fixture.nativeElement.querySelector(
      '.jp-app-shell-nav-item__root',
    ) as HTMLAnchorElement;
    expect(root.tagName).toBe('A');
    expect(root.getAttribute('href')).toBe('#');
    expect(root.getAttribute('aria-current')).toBeNull();
  });

  it('applies active class and aria-current', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('jp-app-shell-nav-item--active'),
    ).toBe(true);

    const root = fixture.nativeElement.querySelector(
      '.jp-app-shell-nav-item__root',
    ) as HTMLElement;
    expect(root.getAttribute('aria-current')).toBe('page');
  });

  it('renders as a button when as is button', () => {
    fixture.componentRef.setInput('as', 'button');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector(
      '.jp-app-shell-nav-item__root',
    ) as HTMLButtonElement;
    expect(root.tagName).toBe('BUTTON');
    expect(root.getAttribute('type')).toBe('button');
    expect(root.getAttribute('href')).toBeNull();
    expect(component.resolvedHref()).toBeNull();
  });

  it('uses provided href on anchors', () => {
    fixture.componentRef.setInput('href', '/overview');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector(
      '.jp-app-shell-nav-item__root',
    ) as HTMLAnchorElement;
    expect(root.getAttribute('href')).toBe('/overview');
  });

  it('falls back to anchor for invalid as values', () => {
    fixture.componentRef.setInput('as', 'div' as never);
    fixture.detectChanges();

    expect(component.as()).toBe('a');
  });

  it('disables button nav items', () => {
    fixture.componentRef.setInput('as', 'button');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains(
        'jp-app-shell-nav-item--disabled',
      ),
    ).toBe(true);

    const root = fixture.nativeElement.querySelector(
      '.jp-app-shell-nav-item__root',
    ) as HTMLButtonElement;
    expect(root.disabled).toBe(true);
  });

  it('marks disabled anchors as non-navigable', () => {
    fixture.componentRef.setInput('href', '/settings');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector(
      '.jp-app-shell-nav-item__root',
    ) as HTMLAnchorElement;
    expect(root.getAttribute('href')).toBeNull();
    expect(root.getAttribute('aria-disabled')).toBe('true');
    expect(root.getAttribute('tabindex')).toBe('-1');
    expect(root.getAttribute('aria-current')).toBeNull();
  });
});
