import { TestBed } from '@angular/core/testing';
import { JpTreeTable, type JpTreeTableRow } from './tree-table';

const rows: readonly JpTreeTableRow[] = [
  {
    key: 'group',
    label: 'Project',
    cells: { owner: 'Product' },
    children: [
      {
        key: 'child',
        label: 'Design',
        cells: { owner: 'Avery' },
        children: [
          { key: 'task', label: 'Landing page', cells: { owner: null } },
        ],
      },
    ],
  },
  {
    key: 'disabled',
    label: 'Archived',
    disabled: true,
    cells: { owner: 'Platform' },
    children: [{ key: 'old', label: 'Old work', cells: {} }],
  },
];
function requireElement<T extends HTMLElement = HTMLElement>(
  root: HTMLElement,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error('Expected element: ' + selector);
  return element;
}
function setup() {
  const fixture = TestBed.createComponent(JpTreeTable);
  fixture.componentRef.setInput('id', 'projects');
  fixture.componentRef.setInput('caption', 'Project work');
  fixture.componentRef.setInput('nameHeader', 'Task');
  fixture.componentRef.setInput('columns', [{ key: 'owner', header: 'Owner' }]);
  fixture.componentRef.setInput('rows', rows);
  fixture.componentInstance.expandedKeysChange.subscribe((keys) =>
    fixture.componentRef.setInput('expandedKeys', keys),
  );
  fixture.componentInstance.selectedKeysChange.subscribe((keys) =>
    fixture.componentRef.setInput('selectedKeys', keys),
  );
  fixture.detectChanges();
  return fixture;
}
describe('JpTreeTable', () => {
  it('changes native checkboxes through controlled state without selecting descendants', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selectable', true);
    fixture.componentRef.setInput('expandedKeys', ['group', 'child']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const parent = requireElement<HTMLInputElement>(
      el,
      '#projects-row-group input',
    );
    const task = requireElement<HTMLInputElement>(
      el,
      '#projects-row-task input',
    );
    parent.click();
    fixture.detectChanges();
    expect(parent.checked).toBe(true);
    expect(task.checked).toBe(false);
    parent.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedKeys()).toEqual([]);
  });
  it('collapses internally while focus is on a child checkbox and preserves descendant expansion', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selectable', true);
    fixture.componentRef.setInput('expandedKeys', ['group', 'child']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    requireElement<HTMLInputElement>(el, '#projects-row-task input').focus();
    requireElement<HTMLButtonElement>(el, '#projects-row-group button').click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      el.querySelector('#projects-row-group button'),
    );
    expect(fixture.componentInstance.expandedKeys()).toEqual(['child']);
    requireElement<HTMLButtonElement>(el, '#projects-row-group button').click();
    fixture.detectChanges();
    expect(requireElement(el, '#projects-row-task').hidden).toBe(false);
  });
  it('recovers removed focus to a surviving leaf checkbox and then an empty scroll region', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    requireElement<HTMLButtonElement>(el, '#projects-row-group button').focus();
    fixture.componentRef.setInput('rows', [
      { key: 'survivor', label: 'Remaining task', cells: { owner: 'Avery' } },
    ]);
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      el.querySelector('#projects-row-survivor input'),
    );
    fixture.componentRef.setInput('rows', []);
    fixture.detectChanges();
    expect(document.activeElement).toBe(el.querySelector('.frame'));
  });
  it('does not reclaim outside focus or an explicit blur when rows collapse', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selectable', true);
    fixture.componentRef.setInput('expandedKeys', ['group', 'child']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const outside = document.createElement('button');
    document.body.append(outside);
    requireElement<HTMLInputElement>(el, '#projects-row-task input').focus();
    outside.focus();
    fixture.componentRef.setInput('expandedKeys', []);
    fixture.detectChanges();
    expect(document.activeElement).toBe(outside);
    outside.remove();
    fixture.componentRef.setInput('expandedKeys', ['group', 'child']);
    fixture.detectChanges();
    const task = requireElement<HTMLInputElement>(
      el,
      '#projects-row-task input',
    );
    task.focus();
    task.blur();
    fixture.componentRef.setInput('expandedKeys', []);
    fixture.detectChanges();
    expect(document.activeElement).toBe(document.body);
  });
  it('recovers a removed nonselectable hierarchy to its scroll region when the remaining row has no control', () => {
    const fixture = setup();
    const el = fixture.nativeElement as HTMLElement;
    requireElement<HTMLButtonElement>(el, '#projects-row-group button').focus();
    fixture.componentRef.setInput('rows', [
      { key: 'leaf', label: 'Read-only work', cells: {} },
    ]);
    fixture.detectChanges();
    expect(document.activeElement).toBe(el.querySelector('.frame'));
  });
  it('renders zero and empty values faithfully and disables every row control when globally disabled', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selectable', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('rows', [
      { key: 'zero', label: 'Zero hours', cells: { owner: 0 } },
      { key: 'blank', label: 'Blank', cells: { owner: '' } },
      { key: 'missing', label: 'Missing', cells: {} },
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(
      el.querySelector('#projects-row-zero td:last-child')?.textContent?.trim(),
    ).toBe('0');
    expect(
      el
        .querySelector('#projects-row-blank td:last-child')
        ?.textContent?.trim(),
    ).toBe('');
    expect(
      el
        .querySelector('#projects-row-missing td:last-child')
        ?.textContent?.trim(),
    ).toBe('—');
    expect(
      [...el.querySelectorAll<HTMLInputElement>('input')].every(
        (input) => input.disabled,
      ),
    ).toBe(true);
    fixture.componentInstance.select(
      { key: 'zero', label: 'Zero hours', cells: {} },
      true,
    );
    expect(fixture.componentInstance.selectedKeys()).toEqual([]);
  });
  it('keeps native table semantics, named disclosures and hidden descendants', () => {
    const fixture = setup();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('table')?.getAttribute('role')).toBeNull();
    expect(el.querySelector('[role=treegrid]')).toBeNull();
    expect(el.querySelector('caption')?.textContent?.trim()).toBe(
      'Project work',
    );
    const button = requireElement<HTMLButtonElement>(el, 'button');
    expect(button.getAttribute('aria-controls')).toBe('projects-row-child');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector<HTMLElement>('#projects-row-child')?.hidden).toBe(
      true,
    );
    button.click();
    fixture.detectChanges();
    expect(el.querySelector<HTMLElement>('#projects-row-child')?.hidden).toBe(
      false,
    );
    expect(el.querySelector<HTMLElement>('#projects-row-task')?.hidden).toBe(
      true,
    );
    expect(el.querySelector('#projects-row-child th')?.textContent).toContain(
      'Project / Design',
    );
  });
  it('selects one row independently of expansion and preserves hidden/off-page selections', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selectable', true);
    fixture.componentRef.setInput('selectedKeys', ['off-page', 'task']);
    fixture.detectChanges();
    fixture.componentInstance.select(rows[0], true);
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedKeys()).toEqual([
      'off-page',
      'task',
      'group',
    ]);
    expect(fixture.componentInstance.expandedKeys()).toEqual([]);
    fixture.componentInstance.select(rows[0], false);
    expect(fixture.componentInstance.selectedKeys()).toEqual([
      'off-page',
      'task',
    ]);
  });
  it('disabled rows remain readable but cannot select or expand', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('#projects-row-disabled')?.textContent).toContain(
      'Archived',
    );
    expect(
      el.querySelector<HTMLButtonElement>('#projects-row-disabled button')
        ?.disabled,
    ).toBe(true);
    fixture.componentInstance.toggle(rows[1]);
    fixture.componentInstance.select(rows[1], true);
    expect(fixture.componentInstance.expandedKeys()).toEqual([]);
    expect(fixture.componentInstance.selectedKeys()).toEqual([]);
  });
  it('restores focus to the disclosure when a consumer collapses an ancestor', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selectable', true);
    fixture.componentRef.setInput('expandedKeys', ['group', 'child']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    requireElement<HTMLInputElement>(el, '#projects-row-task input').focus();
    fixture.componentRef.setInput('expandedKeys', []);
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      el.querySelector('#projects-row-group button'),
    );
    expect(el.querySelector<HTMLElement>('#projects-row-task')?.hidden).toBe(
      true,
    );
  });
  it('renders complete headers when empty and exposes busy/error and retry state', () => {
    const fixture = setup();
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('state', 'loading');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('table').getAttribute('aria-busy'),
    ).toBe('true');
    expect(
      fixture.nativeElement.querySelector('tbody td').getAttribute('colspan'),
    ).toBe('2');
    fixture.componentRef.setInput('state', 'error');
    fixture.detectChanges();
    const retry = jest.fn();
    fixture.componentInstance.retryRequested.subscribe(retry);
    fixture.nativeElement.querySelector('.state button').click();
    expect(retry).toHaveBeenCalled();
  });
});
