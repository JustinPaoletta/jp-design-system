import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();
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
    expect(compiled.querySelectorAll('.jp-grid__root').length).toBeGreaterThan(
      1,
    );
    expect(
      compiled.querySelectorAll('.jp-surface__root').length,
    ).toBeGreaterThan(3);
  });
});
