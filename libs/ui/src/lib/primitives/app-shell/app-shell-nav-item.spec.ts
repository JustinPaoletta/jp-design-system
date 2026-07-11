import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpAppShellNavItem } from './app-shell-nav-item';

describe('JpAppShellNavItem', () => {
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
});
