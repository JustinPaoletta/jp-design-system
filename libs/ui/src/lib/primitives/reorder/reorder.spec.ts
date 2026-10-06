import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideJpMessages } from '../../i18n';
import { JpReorder, JpReorderContent, type JpReorderItem } from './reorder';
const items: JpReorderItem[] = [
  { id: 'a', label: 'Audit', description: 'Review access' },
  { id: 'b', label: 'Build' },
  { id: 'c', label: 'Publish', disabled: true },
];
function setup() {
  const fixture = TestBed.createComponent(JpReorder);
  fixture.componentRef.setInput('id', 'priority');
  fixture.componentRef.setInput('label', 'Priorities');
  fixture.componentRef.setInput('items', items);
  fixture.detectChanges();
  return fixture;
}
function key(component: JpReorder, name: string, item = items[0]) {
  const event = new KeyboardEvent('keydown', { key: name, cancelable: true });
  component.onKey(event, item);
  return event;
}
describe('JpReorder', () => {
  it('uses native ordered list, stable ids, instructions and boundary controls', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('ol')?.getAttribute('aria-label')).toBe(
      'Priorities',
    );
    expect(root.querySelectorAll('li')).toHaveLength(3);
    expect(
      root
        .querySelector('button[data-action=up]')
        ?.getAttribute('aria-disabled'),
    ).toBe('true');
    expect(
      root.querySelector<HTMLButtonElement>('button[data-item=c]')?.disabled,
    ).toBe(true);
    expect(root.textContent).toContain('Review access');
  });
  it('normalizes persisted unknown/duplicate ids while preserving item order', () => {
    const fixture = setup();
    fixture.componentRef.setInput('order', ['b', 'b', 'missing']);
    expect(fixture.componentInstance.normalized()).toEqual(['b', 'a', 'c']);
    fixture.componentRef.setInput('items', [
      { id: 'a', label: 'One' },
      { id: 'a', label: 'Two' },
    ]);
    expect(() => fixture.componentInstance.normalized()).toThrow('unique');
  });
  it('keeps keyboard moves draft-only, clamps boundaries, drops once and cancels without output', () => {
    const fixture = setup();
    const component = fixture.componentInstance;
    const output = jest.fn();
    component.order.subscribe(output);
    key(component, 'ArrowDown');
    expect(component.order()).toEqual([]);
    component.toggle(items[0]);
    key(component, 'ArrowDown');
    expect(component.rows().map((item) => item.id)).toEqual(['b', 'a', 'c']);
    expect(output).not.toHaveBeenCalled();
    expect(component.announcement()).toContain('2');
    key(component, 'Home');
    key(component, 'ArrowUp');
    key(component, 'End');
    key(component, 'ArrowDown');
    expect(component.rows().at(-1)?.id).toBe('a');
    expect(key(component, 'Tab').defaultPrevented).toBe(false);
    key(component, 'Escape');
    expect(component.rows().map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(output).not.toHaveBeenCalled();
    component.toggle(items[0]);
    key(component, 'End');
    component.toggle(items[0]);
    expect(output).toHaveBeenCalledTimes(1);
    expect(component.order()).toEqual(['b', 'c', 'a']);
    expect(component.activeId()).toBeNull();
    component.drop();
    component.cancel();
    expect(output).toHaveBeenCalledTimes(1);
  });
  it('supports click alternatives without pickup and retains focus at boundaries', () => {
    const fixture = setup();
    const component = fixture.componentInstance;
    document.body.append(fixture.nativeElement);
    component.move(items[0], -1, 'up');
    expect(component.order()).toEqual([]);
    component.move(items[0], 1, 'down');
    fixture.detectChanges();
    expect(component.order()).toEqual(['b', 'a', 'c']);
    expect((document.activeElement as HTMLElement).dataset['item']).toBe('a');
    expect((document.activeElement as HTMLElement).dataset['action']).toBe(
      'down',
    );
    component.move(items[2], -1, 'up');
    expect(component.order()).toEqual(['b', 'a', 'c']);
    component.pickUp(items[0]);
    component.move(items[1], 1, 'down');
    expect(component.order()).toEqual(['b', 'a', 'c']);
    fixture.nativeElement.remove();
  });
  it('cancels safely on external order, item removal or disabled state changes', () => {
    const fixture = setup();
    const component = fixture.componentInstance;
    component.pickUp(items[0]);
    key(component, 'End');
    fixture.componentRef.setInput('order', ['b', 'a', 'c']);
    fixture.detectChanges();
    expect(component.activeId()).toBeNull();
    expect(component.order()).toEqual(['b', 'a', 'c']);
    component.pickUp(items[0]);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.activeId()).toBeNull();
    component.pickUp(items[0]);
    expect(component.activeId()).toBeNull();
    fixture.componentRef.setInput('disabled', false);
    component.pickUp(items[0]);
    fixture.componentRef.setInput('items', [items[1]]);
    fixture.detectChanges();
    expect(component.activeId()).toBeNull();
    expect(component.rows()).toEqual([items[1]]);
  });
  it('captures pointer movement, ignores other pointers, and restores draft on cancellation', () => {
    const fixture = setup();
    const component = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    root.setPointerCapture = jest.fn();
    const handle = root.querySelector('button') as HTMLElement;
    handle.setPointerCapture = jest.fn();
    const rows = Array.from(root.querySelectorAll('li'));
    rows.forEach((row, i) =>
      jest
        .spyOn(row, 'getBoundingClientRect')
        .mockReturnValue({ top: i * 60, height: 60 } as DOMRect),
    );
    const pointer = (extra: object = {}) =>
      ({
        button: 0,
        pointerId: 1,
        currentTarget: handle,
        clientX: 10,
        clientY: 10,
        preventDefault: jest.fn(),
        ...extra,
      }) as unknown as PointerEvent;
    component.pointerStart(pointer({ button: 2 }), items[0]);
    component.pointerMove(pointer({ clientY: 170 }));
    expect(component.activeId()).toBeNull();
    component.pointerStart(pointer(), items[0]);
    component.pointerMove(pointer({ clientY: 12 }));
    expect(component.activeId()).toBeNull();
    component.pointerMove(pointer({ pointerId: 2, clientY: 170 }));
    expect(component.activeId()).toBeNull();
    component.pointerMove(pointer({ clientY: 170 }));
    expect(component.rows().at(-1)?.id).toBe('a');
    component.pointerEnd(pointer({ pointerId: 2 }));
    expect(component.activeId()).toBe('a');
    component.pointerEnd(pointer(), true);
    expect(component.order()).toEqual([]);
    expect(component.activeId()).toBeNull();
    component.pointerStart(pointer(), items[0]);
    component.pointerMove(pointer({ clientY: 170 }));
    component.pointerEnd(pointer());
    expect(component.order()).toEqual(['b', 'c', 'a']);
    component.toggle(items[0]);
    expect(component.activeId()).toBeNull();
    component.pointerEnd(pointer());
  });
  it('renders localized empty state and typed custom content', () => {
    TestBed.configureTestingModule({
      providers: [provideJpMessages({ reorder: { empty: 'Aucune priorité' } })],
    });
    const fixture = setup();
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Aucune priorité');
    @Component({
      imports: [JpReorder, JpReorderContent],
      template:
        '<jp-reorder id="custom" label="Custom" [items]="items"><ng-template jpReorderContent let-item let-index="index"><strong>{{ index }}: {{ item.label }}</strong></ng-template></jp-reorder>',
    })
    class Host {
      items = items;
    }
    const custom = TestBed.createComponent(Host);
    custom.detectChanges();
    expect(custom.nativeElement.querySelector('strong').textContent).toContain(
      '0: Audit',
    );
    expect(
      JpReorderContent.ngTemplateContextGuard({} as JpReorderContent, {}),
    ).toBe(true);
  });
});
