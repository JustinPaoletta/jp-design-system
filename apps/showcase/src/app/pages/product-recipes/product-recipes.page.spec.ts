import { TestBed } from '@angular/core/testing';
import { ProductRecipesPage } from './product-recipes.page';

describe('Product recipe request recovery', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({ imports: [ProductRecipesPage] });
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  function create() {
    return TestBed.createComponent(ProductRecipesPage);
  }
  it('validates before sending and retains input through failure/retry', () => {
    const fixture = create();
    const page = fixture.componentInstance;
    page.save();
    expect(page.saving()).toBe(false);
    expect(page.form.controls.email.touched).toBe(true);
    page.form.controls.email.setValue('justin@example.com');
    page.save();
    page.save();
    expect(page.saving()).toBe(true);
    jest.runOnlyPendingTimers();
    expect(page.saveError()).toContain('preserved');
    expect(page.saved()).toBe(false);
    expect(page.form.controls.email.value).toBe('justin@example.com');
    page.save();
    jest.runOnlyPendingTimers();
    expect(page.saved()).toBe(true);
    expect(page.saveError()).toBe('');
  });
  it('keeps existing records available when refresh fails and supports retry', () => {
    const page = create().componentInstance;
    const records = page.records();
    page.refresh();
    page.refresh();
    jest.runOnlyPendingTimers();
    expect(page.loadError()).toContain('Existing records');
    expect(page.records()).toEqual(records);
    page.refresh();
    jest.runOnlyPendingTimers();
    expect(page.loadError()).toBe('');
    expect(page.loading()).toBe(false);
  });
  it('keeps destructive confirmation open after failure and removes only selection on retry', () => {
    const page = create().componentInstance;
    page.confirmDelete();
    expect(page.deleting()).toBe(false);
    page.selected.set(['payments']);
    page.dialogOpen.set(true);
    page.confirmDelete();
    page.confirmDelete();
    jest.runOnlyPendingTimers();
    expect(page.dialogOpen()).toBe(true);
    expect(page.deleteError()).toContain('could not');
    expect(page.records()).toHaveLength(5);
    page.confirmDelete();
    jest.runOnlyPendingTimers();
    expect(page.records()).toHaveLength(4);
    expect(page.selected()).toEqual([]);
    expect(page.dialogOpen()).toBe(false);
  });
  it('resets paging on search/sort and calculates filtered pages', () => {
    const page = create().componentInstance;
    page.page.set(2);
    page.setSearch('API');
    expect(page.page()).toBe(1);
    expect(page.visible()).toHaveLength(1);
    expect(page.filters()).toHaveLength(1);
    page.setSearch('');
    page.setSort({ key: 'name', direction: 'desc' });
    expect(page.filtered()[0]['name']).toBe('Search index');
    page.setSort({ key: 'name', direction: 'asc' });
    expect(page.filtered()[0]['name']).toBe('Billing worker');
    page.setSort(null);
    expect(page.filtered()).toEqual(page.records());
    expect(page.filters()).toEqual([]);
  });
  it('cancels pending demo timers on route destruction', () => {
    const fixture = create();
    const page = fixture.componentInstance;
    page.refresh();
    fixture.destroy();
    jest.runOnlyPendingTimers();
    expect(page.loading()).toBe(true);
    expect(page.loadError()).toBe('');
  });
});
