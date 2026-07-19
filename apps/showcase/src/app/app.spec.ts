import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';
import { LayoutDashboardPage } from './pages/layout-dashboard/layout-dashboard.page';
import { AppShellPage } from './pages/app-shell/app-shell.page';
import { ControlsPage } from './pages/controls/controls.page';
import { DataPage } from './pages/data/data.page';
import { OverlaysPage } from './pages/overlays/overlays.page';
import { AssistantPage } from './pages/assistant/assistant.page';

describe('App', () => {
  beforeEach(async () => {
    document.documentElement.removeAttribute('data-jp-accent');
    document.documentElement.removeAttribute('data-jp-density');

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();
  });

  it('should render routed assistant page', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/assistant');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/assistant');
    expect(compiled.querySelector('app-assistant-page')).toBeTruthy();
    expect(compiled.querySelector('jp-app-shell')).toBeTruthy();
    expect(compiled.querySelector('jp-assistant-panel')).toBeTruthy();
  });

  it('should render routed overlays page', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/overlays');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/overlays');
    expect(compiled.querySelector('app-overlays-page')).toBeTruthy();
    expect(compiled.querySelector('jp-app-shell')).toBeTruthy();
    expect(compiled.querySelector('jp-tooltip')).toBeTruthy();
    expect(compiled.querySelector('jp-toast-outlet')).toBeTruthy();
  });

  it('should render routed data page', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/data');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/data');
    expect(compiled.querySelector('app-data-page')).toBeTruthy();
    expect(compiled.querySelector('jp-app-shell')).toBeTruthy();
    expect(compiled.querySelector('jp-table')).toBeTruthy();
    expect(compiled.querySelector('jp-badge')).toBeTruthy();
  });

  it('should render routed controls page', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/controls');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/controls');
    expect(compiled.querySelector('app-controls-page')).toBeTruthy();
    expect(compiled.querySelector('jp-app-shell')).toBeTruthy();
    expect(compiled.querySelector('jp-button.jp-button--primary')).toBeTruthy();
    expect(compiled.querySelector('jp-input')).toBeTruthy();
  });

  it('should render routed app shell dashboard', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/app-shell');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/app-shell');
    expect(compiled.querySelector('app-shell-page')).toBeTruthy();
    expect(compiled.querySelector('jp-app-shell')).toBeTruthy();
  });

  it('should render routed layout dashboard', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/layout-dashboard');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/layout-dashboard');
    expect(compiled.querySelector('app-layout-dashboard-page')).toBeTruthy();
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Layout Dashboard',
    );
  });

  it('should redirect root to assistant', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/assistant');
  });

  it('should toggle shell collapse state from the assistant page', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/assistant');
    fixture.detectChanges();
    await fixture.whenStable();

    const page = fixture.debugElement.query(By.directive(AssistantPage))
      .componentInstance as AssistantPage;
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

  it('reads default accent and density on layout dashboard', async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutDashboardPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(LayoutDashboardPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('neon');
    expect(fixture.componentInstance.density).toBe('default');
  });

  it('reads document accent and density attributes on layout dashboard', async () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');

    await TestBed.configureTestingModule({
      imports: [LayoutDashboardPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(LayoutDashboardPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('cobalt');
    expect(fixture.componentInstance.density).toBe('compact');
  });

  it('reads document accent and density attributes on app shell', async () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');

    await TestBed.configureTestingModule({
      imports: [AppShellPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppShellPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('cobalt');
    expect(fixture.componentInstance.density).toBe('compact');
  });

  it('reads document accent and density attributes on controls', async () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');

    await TestBed.configureTestingModule({
      imports: [ControlsPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(ControlsPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('cobalt');
    expect(fixture.componentInstance.density).toBe('compact');
  });

  it('reads document accent and density attributes on data', async () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');

    await TestBed.configureTestingModule({
      imports: [DataPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(DataPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('cobalt');
    expect(fixture.componentInstance.density).toBe('compact');
  });

  it('reads document accent and density attributes on overlays', async () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');

    await TestBed.configureTestingModule({
      imports: [OverlaysPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(OverlaysPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('cobalt');
    expect(fixture.componentInstance.density).toBe('compact');
  });

  it('reads document accent and density attributes on assistant', async () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');

    await TestBed.configureTestingModule({
      imports: [AssistantPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(AssistantPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.accent).toBe('cobalt');
    expect(fixture.componentInstance.density).toBe('compact');
  });

  it('toggles empty table rows on data page', async () => {
    await TestBed.configureTestingModule({
      imports: [DataPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(DataPage);
    fixture.detectChanges();

    const page = fixture.componentInstance;
    expect(page.visibleRows.length).toBe(4);

    page.showEmpty = true;
    fixture.detectChanges();
    expect(page.visibleRows.length).toBe(0);
    expect(page.statusTone('Healthy')).toBe('success');
    expect(page.statusTone('Degraded')).toBe('warning');
    expect(page.statusTone('Failed')).toBe('error');
    expect(page.statusTone('Unknown')).toBe('neutral');
  });

  it('opens dialog and records menu actions on overlays page', async () => {
    await TestBed.configureTestingModule({
      imports: [OverlaysPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(OverlaysPage);
    fixture.detectChanges();

    const page = fixture.componentInstance;
    expect(page.dialogOpen).toBe(false);
    page.onMenuEdit();
    expect(page.lastAction).toBe('Edit selected');
    page.onMenuDelete();
    expect(page.dialogOpen).toBe(true);
    expect(page.lastAction).toBe('Delete selected');
    page.confirmDelete();
    expect(page.dialogOpen).toBe(false);
    expect(page.lastAction).toBe('Deleted deployment');
  });

  it('seeds tone demo and records assistant replies', async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(AssistantPage);
    fixture.detectChanges();

    const page = fixture.componentInstance;
    page.seedToneDemo();
    expect(page.lastReply).toBe('None yet');
    page.onMessageSubmit('Summarize risks');
    expect(page.lastReply).toBe('Summarize risks');
  });
});
