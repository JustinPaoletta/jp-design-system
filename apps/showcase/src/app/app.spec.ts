import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';
import { Phase2DashboardPage } from './pages/phase-2-dashboard/phase-2-dashboard.page';
import { Phase3DashboardPage } from './pages/phase-3-dashboard/phase-3-dashboard.page';
import { Phase4ControlsPage } from './pages/phase-4-controls/phase-4-controls.page';

describe('App', () => {
  beforeEach(async () => {
    document.documentElement.removeAttribute('data-jp-accent');
    document.documentElement.removeAttribute('data-jp-density');

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();
  });

  it('should render routed phase 4 controls page', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/phase-4-controls');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/phase-4-controls');
    expect(compiled.querySelector('app-phase-4-controls-page')).toBeTruthy();
    expect(compiled.querySelector('jp-app-shell')).toBeTruthy();
    expect(compiled.querySelector('jp-button.jp-button--primary')).toBeTruthy();
    expect(compiled.querySelector('jp-input')).toBeTruthy();
  });

  it('should render routed phase 3 dashboard shell', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/phase-3-dashboard');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/phase-3-dashboard');
    expect(compiled.querySelector('app-phase-3-dashboard-page')).toBeTruthy();
    expect(compiled.querySelector('jp-app-shell')).toBeTruthy();
  });

  it('should render routed phase 2 dashboard', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/phase-2-dashboard');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/phase-2-dashboard');
    expect(compiled.querySelector('app-phase-2-dashboard-page')).toBeTruthy();
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Phase 2 Layout Dashboard',
    );
  });

  it('should redirect root to phase 4 controls', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/phase-4-controls');
  });

  it('should toggle shell collapse state from the phase 4 page', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/phase-4-controls');
    fixture.detectChanges();
    await fixture.whenStable();

    const page = fixture.debugElement.query(By.directive(Phase4ControlsPage))
      .componentInstance as Phase4ControlsPage;
    expect(page.sidebarCollapsed).toBe(false);
    expect(page.mobileNavOpen).toBe(false);
    expect(page.accent).toBe('neon');
    expect(page.density).toBe('default');

    const toggle = fixture.nativeElement.querySelector(
      '.jp-app-shell__collapse-toggle',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    expect(page.sidebarCollapsed).toBe(true);
  });
});

describe('Showcase dashboard pages', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-jp-accent');
    document.documentElement.removeAttribute('data-jp-density');
  });

  it('reads default accent and density on phase 2', async () => {
    await TestBed.configureTestingModule({
      imports: [Phase2DashboardPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(Phase2DashboardPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('neon');
    expect(fixture.componentInstance.density).toBe('default');
  });

  it('reads document accent and density attributes on phase 2', async () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');

    await TestBed.configureTestingModule({
      imports: [Phase2DashboardPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(Phase2DashboardPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('cobalt');
    expect(fixture.componentInstance.density).toBe('compact');
  });

  it('reads document accent and density attributes on phase 3', async () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');

    await TestBed.configureTestingModule({
      imports: [Phase3DashboardPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(Phase3DashboardPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('cobalt');
    expect(fixture.componentInstance.density).toBe('compact');
  });

  it('reads document accent and density attributes on phase 4', async () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');

    await TestBed.configureTestingModule({
      imports: [Phase4ControlsPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(Phase4ControlsPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('cobalt');
    expect(fixture.componentInstance.density).toBe('compact');
  });
});
