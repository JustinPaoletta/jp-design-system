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
});
