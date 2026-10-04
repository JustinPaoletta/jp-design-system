import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';
jest.mock('chart.js', () => ({
  Chart: class {
    static register = jest.fn();
    destroy = jest.fn();
  },
  BarController: {},
  LineController: {},
  BarElement: {},
  LineElement: {},
  PointElement: {},
  CategoryScale: {},
  LinearScale: {},
  Tooltip: {},
}));
describe('Lazy consumer routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    });
  });
  it.each([
    ['hierarchy', 'app-hierarchy-page'],
    ['scheduling', 'app-scheduling-page'],
    ['interaction-tools', 'app-interaction-tools-page'],
    ['data-performance', 'app-data-performance-page'],
    ['advanced-layout', 'app-advanced-layout-page'],
    ['workflows', 'app-workflows-page'],
  ])('opens /%s through the shared shell', async (path, selector) => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/' + path);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(router.url).toBe('/' + path);
    expect(fixture.nativeElement.querySelector(selector)).not.toBeNull();
    expect(fixture.nativeElement.querySelector('jp-app-shell')).not.toBeNull();
  });
});
