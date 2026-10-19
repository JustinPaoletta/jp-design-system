import { TestBed } from '@angular/core/testing';
import { JpSplitButton } from './split-button';
describe('JpSplitButton', () => {
  it('shows only the primary action when no alternatives exist', () => {
    const f = TestBed.createComponent(JpSplitButton);
    f.componentRef.setInput('label', 'Create lineup');
    f.detectChanges();
    expect(f.nativeElement.querySelectorAll('button')).toHaveLength(1);
    expect(f.nativeElement.querySelector('button').textContent).toContain(
      'Create lineup',
    );
    expect(f.nativeElement.querySelector('jp-dropdown-menu')).toBeNull();
  });
  it('separates primary action from menu selection and blocks disabled actions', () => {
    const f = TestBed.createComponent(JpSplitButton);
    f.componentRef.setInput('label', 'Create');
    const action = { id: 'duplicate', label: 'Duplicate' },
      disabled = { id: 'archive', label: 'Archive', disabled: true };
    f.componentRef.setInput('actions', [action, disabled]);
    f.detectChanges();
    const c = f.componentInstance,
      primary = jest.fn(),
      selected = jest.fn();
    c.primary.subscribe(primary);
    c.actionSelected.subscribe(selected);
    c.runPrimary();
    expect(primary).toHaveBeenCalledTimes(1);
    c.open.set(true);
    c.select(disabled);
    expect(c.open()).toBe(true);
    c.select(action);
    expect(c.open()).toBe(false);
    expect(selected).toHaveBeenCalledWith('duplicate');
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    c.runPrimary();
    c.select(action);
    expect(primary).toHaveBeenCalledTimes(1);
    expect(selected).toHaveBeenCalledTimes(1);
  });
});
