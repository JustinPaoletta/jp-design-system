import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { JpTableToolbar } from './table-toolbar';

@Component({
  imports: [JpTableToolbar],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<jp-table-toolbar [activeFilters]="filters" [selectedCount]="2"
    ><input jpTableSearch aria-label="Find deployments" /><button
      jpTableBulkActions
      type="button"
    >
      Archive selected
    </button></jp-table-toolbar
  >`,
})
class Host {
  filters = [{ key: 'healthy', label: 'Healthy' }];
}

describe('JpTableToolbar', () => {
  it('projects search and bulk actions and announces selection', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('input')?.getAttribute('aria-label'),
    ).toBe('Find deployments');
    expect(
      fixture.nativeElement.querySelector('[role=status]')?.textContent,
    ).toContain('2 selected');
    expect(fixture.nativeElement.textContent).toContain('Archive selected');
  });
  it('requests individual or all filter removal and respects disabled', () => {
    const fixture = TestBed.createComponent(JpTableToolbar);
    fixture.componentRef.setInput('activeFilters', [
      { key: 'healthy', label: 'Healthy' },
    ]);
    fixture.detectChanges();
    const remove = jest.spyOn(fixture.componentInstance.removeFilter, 'emit');
    const clear = jest.spyOn(fixture.componentInstance.clearFilters, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].textContent).toContain('Remove filter: Healthy');
    buttons[0].click();
    buttons[1].click();
    expect(remove).toHaveBeenCalledWith('healthy');
    expect(clear).toHaveBeenCalledTimes(1);
    fixture.componentRef.setInput('disabled', true);
    fixture.componentInstance.remove('healthy');
    fixture.componentInstance.clear();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(clear).toHaveBeenCalledTimes(1);
  });
  it('hides inactive selection and filter controls', () => {
    const fixture = TestBed.createComponent(JpTableToolbar);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=status]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('button')).toHaveLength(0);
  });
});
