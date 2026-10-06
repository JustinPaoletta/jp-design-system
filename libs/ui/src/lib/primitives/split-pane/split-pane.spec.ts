import { TestBed } from '@angular/core/testing';
import { JpSplitPane } from './split-pane';

function setup() {
  const fixture = TestBed.createComponent(JpSplitPane);
  fixture.componentRef.setInput('id', 'workspace');
  fixture.componentRef.setInput('primaryLabel', 'Overview');
  fixture.componentRef.setInput('secondaryLabel', 'Inventory');
  fixture.detectChanges();
  return fixture;
}
function key(component: JpSplitPane, value: string, shiftKey = false) {
  const event = new KeyboardEvent('keydown', {
    key: value,
    shiftKey,
    cancelable: true,
  });
  component.onKey(event);
  return event;
}
describe('JpSplitPane', () => {
  it('exposes percentage bounds, orientation, and stable panel identity', () => {
    const fixture = setup();
    const separator = fixture.nativeElement.querySelector('[role=separator]');
    expect(separator.getAttribute('aria-controls')).toBe('workspace-primary');
    expect(separator.getAttribute('aria-valuenow')).toBe('40');
    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();
    expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
  });
  it('supports arrows, shift acceleration, Home/End, and collapse restoring size', () => {
    const fixture = setup();
    const pane = fixture.componentInstance;
    expect(key(pane, 'ArrowRight').defaultPrevented).toBe(true);
    expect(pane.value()).toBe(41);
    key(pane, 'ArrowLeft', true);
    expect(pane.value()).toBe(31);
    key(pane, 'Home');
    expect(pane.value()).toBe(15);
    key(pane, 'End');
    expect(pane.value()).toBe(85);
    key(pane, 'Enter');
    fixture.detectChanges();
    expect(pane.primaryCollapsed()).toBe(true);
    expect(fixture.nativeElement.querySelector('section').hidden).toBe(true);
    key(pane, 'Enter');
    expect(pane.value()).toBe(85);
    expect(pane.collapsed()).toBe(false);
    expect(key(pane, 'Tab').defaultPrevented).toBe(false);
    fixture.componentRef.setInput('collapsible', false);
    expect(key(pane, 'Enter').defaultPrevented).toBe(false);
  });
  it('normalizes malformed sizes, bounds, steps and applies vertical/RTL arrows', () => {
    const fixture = setup();
    const pane = fixture.componentInstance;
    fixture.componentRef.setInput('min', NaN);
    fixture.componentRef.setInput('max', Infinity);
    fixture.componentRef.setInput('size', NaN);
    expect(pane.value()).toBe(40);
    fixture.componentRef.setInput('min', 90);
    fixture.componentRef.setInput('max', 10);
    expect(pane.bounds()).toEqual({ min: 90, max: 90 });
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 90);
    fixture.componentRef.setInput('size', 40);
    fixture.componentRef.setInput('step', -5);
    fixture.componentRef.setInput('orientation', 'vertical');
    key(pane, 'ArrowDown');
    expect(pane.value()).toBe(41);
    key(pane, 'ArrowUp');
    expect(pane.value()).toBe(40);
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.nativeElement.style.direction = 'rtl';
    key(pane, 'ArrowLeft');
    expect(pane.value()).toBe(41);
    key(pane, 'ArrowRight');
    expect(pane.value()).toBe(40);
  });
  it('moves focus out before collapse and shows all content in mobile mode', () => {
    const fixture = setup();
    const pane = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    fixture.nativeElement.querySelector('section').focus();
    pane.toggle();
    expect(document.activeElement).toBe(
      fixture.nativeElement.querySelector('[role=separator]'),
    );
    pane.mobile.set(true);
    fixture.detectChanges();
    expect(pane.primaryCollapsed()).toBe(false);
    expect(fixture.nativeElement.querySelector('section').hidden).toBe(false);
    pane.setSize(70);
    key(pane, 'Home');
    pane.toggle();
    expect(pane.size()).toBe(40);
    expect(pane.collapsed()).toBe(true);
    fixture.nativeElement.remove();
  });
  it('captures matching pointer movement, clamps bounds and stops on cancellation', () => {
    const fixture = setup();
    const pane = fixture.componentInstance;
    const handle = fixture.nativeElement.querySelector(
      '[role=separator]',
    ) as HTMLElement;
    handle.setPointerCapture = jest.fn();
    jest
      .spyOn(fixture.nativeElement, 'getBoundingClientRect')
      .mockReturnValue({ width: 1000, height: 800 } as DOMRect);
    const pointer = (overrides: object = {}) =>
      ({
        button: 0,
        pointerId: 1,
        clientX: 400,
        clientY: 320,
        currentTarget: handle,
        preventDefault: jest.fn(),
        ...overrides,
      }) as unknown as PointerEvent;
    pane.startDrag(pointer({ button: 2 }));
    pane.moveDrag(pointer({ clientX: 500 }));
    expect(pane.size()).toBe(40);
    pane.startDrag(pointer());
    expect(handle.setPointerCapture).toHaveBeenCalledWith(1);
    pane.moveDrag(pointer({ pointerId: 2, clientX: 500 }));
    expect(pane.size()).toBe(40);
    pane.moveDrag(pointer({ clientX: 500 }));
    expect(pane.size()).toBe(50);
    pane.endDrag(pointer({ pointerId: 2 }));
    pane.moveDrag(pointer({ clientX: 1000 }));
    expect(pane.size()).toBe(85);
    pane.endDrag(pointer());
    pane.moveDrag(pointer({ clientX: 450 }));
    expect(pane.size()).toBe(85);
    fixture.componentRef.setInput('orientation', 'vertical');
    pane.startDrag(pointer());
    pane.moveDrag(pointer({ clientY: 400 }));
    expect(pane.size()).toBe(85);
    pane.endDrag(pointer());
    pane.collapsed.set(true);
    pane.startDrag(pointer());
    pane.moveDrag(pointer({ clientY: 400 }));
    expect(pane.size()).toBe(25);
    pane.endDrag(pointer());
    jest
      .spyOn(fixture.nativeElement, 'getBoundingClientRect')
      .mockReturnValue({ width: 0, height: 0 } as DOMRect);
    pane.startDrag(pointer());
    pane.moveDrag(pointer({ clientY: 900 }));
    expect(pane.size()).toBe(25);
  });
});
