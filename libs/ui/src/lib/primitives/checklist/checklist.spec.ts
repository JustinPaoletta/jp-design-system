import { TestBed } from '@angular/core/testing';
import { JpChecklist } from './checklist';
describe('JpChecklist', () => {
  async function mount(
    items = [
      {
        id: 'group',
        label: 'Review',
        children: [
          { id: 'a', label: 'Tests' },
          { id: 'b', label: 'Approval', disabled: true },
        ],
      },
      { id: 'c', label: 'Publish' },
    ],
  ) {
    await TestBed.configureTestingModule({
      imports: [JpChecklist],
    }).compileComponents();
    const f = TestBed.createComponent(JpChecklist);
    f.componentRef.setInput('label', 'Release tasks');
    f.componentRef.setInput('items', items);
    f.detectChanges();
    return f;
  }
  it('counts only leaf tasks and represents partial completion with a native mixed checkbox', async () => {
    const f = await mount();
    f.componentInstance.writeValue(['a', 'a']);
    f.detectChanges();
    const boxes = f.nativeElement.querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>;
    expect(boxes[0].indeterminate).toBe(true);
    expect(boxes[1].checked).toBe(true);
    expect(boxes[2].disabled).toBe(true);
    expect(
      f.nativeElement.querySelector('[role=status]').textContent,
    ).toContain('1 of 3 completed');
    const changed = jest.fn();
    f.componentInstance.registerOnChange(changed);
    boxes[0].checked = false;
    boxes[0].dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(changed).toHaveBeenLastCalledWith([]);
    expect(boxes[0].indeterminate).toBe(false);
    boxes[0].checked = true;
    boxes[0].dispatchEvent(new Event('change'));
    expect(changed).toHaveBeenLastCalledWith(['a']);
    f.componentInstance.writeValue(['a', 'b', 'c']);
    f.detectChanges();
    expect(boxes[0].checked).toBe(true);
    expect(f.componentInstance.completed()).toBe(3);
  });
  it('propagates ancestor disabling, keeps disabled leaf completion unchanged, and touches on blur', async () => {
    const f = await mount([
      {
        id: 'group',
        label: 'Locked',
        disabled: true,
        children: [{ id: 'a', label: 'Task' }],
      },
      { id: 'c', label: 'Other' },
    ]);
    const changed = jest.fn(),
      touched = jest.fn();
    f.componentInstance.registerOnChange(changed);
    f.componentInstance.registerOnTouched(touched);
    const boxes = f.nativeElement.querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>;
    expect(boxes[1].disabled).toBe(true);
    f.componentInstance.toggle(
      f.componentInstance.rows()[0],
      new Event('change'),
    );
    expect(changed).not.toHaveBeenCalled();
    f.componentInstance.setDisabledState(true);
    f.detectChanges();
    f.componentInstance.toggle(
      f.componentInstance.rows()[2],
      new Event('change'),
    );
    expect(changed).not.toHaveBeenCalled();
    boxes[2].dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalledTimes(1);
    f.componentInstance.setDisabledState(false);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(boxes[2].disabled).toBe(true);
  });
  it('handles empty lists, empty values, all-disabled branches, and localized counts', async () => {
    const f = await mount();
    f.componentInstance.writeValue(null);
    f.componentRef.setInput('items', [
      {
        id: 'group',
        label: 'Blocked',
        children: [{ id: 'a', label: 'A', disabled: true }],
      },
    ]);
    f.detectChanges();
    expect(f.nativeElement.querySelector('input').disabled).toBe(true);
    f.componentRef.setInput('items', []);
    f.componentRef.setInput(
      'summaryLabel',
      ({ completed, total }: { completed: number; total: number }) =>
        `${completed}/${total} erledigt`,
    );
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('0/0 erledigt');
    expect(f.nativeElement.textContent).toContain('No tasks');
  });
  it('selects and clears all enabled nested leaves without mutating the supplied value', async () => {
    const f = await mount([
      {
        id: 'group',
        label: 'All',
        children: [
          { id: 'a', label: 'A' },
          {
            id: 'branch',
            label: 'Branch',
            children: [{ id: 'b', label: 'B' }],
          },
        ],
      },
    ]);
    const initial = ['unknown'];
    f.componentInstance.writeValue(initial);
    const box = f.nativeElement.querySelector('input') as HTMLInputElement;
    box.checked = true;
    box.dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(f.componentInstance.value()).toEqual(['unknown', 'a', 'b']);
    expect(initial).toEqual(['unknown']);
    box.checked = false;
    box.dispatchEvent(new Event('change'));
    expect(f.componentInstance.value()).toEqual(['unknown']);
  });
});
