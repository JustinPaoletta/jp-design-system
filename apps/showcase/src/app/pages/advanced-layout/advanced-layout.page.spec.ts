import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdvancedLayoutPage } from './advanced-layout.page';
describe('AdvancedLayoutPage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => jest.restoreAllMocks());
  it('composes split panes, media and interactive table details', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AdvancedLayoutPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('jp-split-pane')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(16);
    fixture.nativeElement.querySelector('.jp-table__expand').click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.jp-table__detail-row'),
    ).toBeTruthy();
  });
  it('restores persisted bounds and handles corrupt or denied storage', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    localStorage.setItem('jp-demo-split-v1', '900');
    localStorage.setItem('jp-demo-table-v1', 'broken');
    const fixture = TestBed.createComponent(AdvancedLayoutPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.size()).toBe(70);
    expect(
      fixture.componentInstance.preferences().visibleColumnKeys,
    ).toHaveLength(4);
    fixture.destroy();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Denied');
    });
    const denied = TestBed.createComponent(AdvancedLayoutPage);
    denied.detectChanges();
    expect(denied.componentInstance.storageStatus()).toContain('session');
  });
  it('validates and persists preferences, resets sizes and handles denied storage', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AdvancedLayoutPage);
    const page = fixture.componentInstance;
    page.updatePreferences({
      visibleColumnKeys: ['status', 'missing'],
      columnWidths: { status: 9000 },
    });
    expect(page.preferences().visibleColumnKeys).toEqual(['status']);
    expect(page.preferences().columnWidths).toEqual({ status: 960 });
    expect(
      JSON.parse(localStorage.getItem('jp-demo-table-v1') ?? '{}'),
    ).toEqual(page.preferences());
    page.resize(60);
    expect(localStorage.getItem('jp-demo-split-v1')).toBe('60');
    page.collapsed.set(true);
    page.reset();
    expect(page.size()).toBe(35);
    expect(page.collapsed()).toBe(false);
    expect(page.preferences().visibleColumnKeys).toHaveLength(4);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Denied');
    });
    page.resize(50);
    page.updatePreferences({ visibleColumnKeys: ['name'] });
    expect(page.storageStatus()).toContain('session');
    jest.restoreAllMocks();
  });
});
