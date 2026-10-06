import { TestBed } from '@angular/core/testing';
import { JpContextMenu } from './context-menu';
describe('JpContextMenu', () => {
  async function mount() {
    const f = TestBed.createComponent(JpContextMenu);
    f.componentRef.setInput('label', 'Project');
    f.componentRef.setInput('actions', [
      { id: 'rename', label: 'Rename' },
      { id: 'archive', label: 'Archive', disabled: true },
      { id: 'duplicate', label: 'Duplicate' },
    ]);
    f.detectChanges();
    await f.whenStable();
    return f;
  }
  it('supports visible, pointer and keyboard invocation; arrows/typeahead skip disabled actions', async () => {
    const f = await mount(),
      c = f.componentInstance,
      selected = jest.fn();
    c.actionSelected.subscribe(selected);
    c.show();
    f.detectChanges();
    await f.whenStable();
    const panel = f.nativeElement.querySelector('[role=menu]'),
      items = panel.querySelectorAll('button');
    expect(document.activeElement).toBe(items[0]);
    const key = (key: string) => {
      const e = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
      });
      document.activeElement?.dispatchEvent(e);
      f.detectChanges();
    };
    key('ArrowDown');
    expect(document.activeElement).toBe(items[2]);
    key('ArrowUp');
    expect(document.activeElement).toBe(items[0]);
    key('End');
    expect(document.activeElement).toBe(items[2]);
    key('Home');
    expect(document.activeElement).toBe(items[0]);
    key('d');
    expect(document.activeElement).toBe(items[2]);
    c.choose(c.actions()[1]);
    expect(selected).not.toHaveBeenCalled();
    c.choose(c.actions()[2]);
    f.detectChanges();
    await f.whenStable();
    expect(selected).toHaveBeenCalledWith('duplicate');
    expect(document.activeElement).toBe(
      f.nativeElement.querySelector('button'),
    );
    const context = new MouseEvent('contextmenu', {
      clientX: 50,
      clientY: 60,
      cancelable: true,
    });
    c.context(context);
    f.detectChanges();
    await f.whenStable();
    expect(context.defaultPrevented).toBe(true);
    expect(c.x()).toBe(50);
    expect(c.y()).toBe(60);
    c.context(new MouseEvent('contextmenu', { clientX: 80, clientY: 90 }));
    f.detectChanges();
    await f.whenStable();
    expect(c.x()).toBe(80);
    key('Escape');
    await f.whenStable();
    expect(c.open()).toBe(false);
    expect(document.activeElement).toBe(
      f.nativeElement.querySelector('[role=group]'),
    );
    c.regionKeydown(
      new KeyboardEvent('keydown', { key: 'F10', shiftKey: true }),
    );
    f.detectChanges();
    await f.whenStable();
    expect(c.open()).toBe(true);
    key('Tab');
    await f.whenStable();
    expect(c.open()).toBe(false);
  });
  it('preserves native editable context menus and outside focus and blocks disabled/empty actions', async () => {
    const f = await mount(),
      c = f.componentInstance;
    const native = new MouseEvent('contextmenu', { cancelable: true });
    Object.defineProperty(native, 'target', {
      value: document.createElement('input'),
    });
    c.context(native);
    expect(native.defaultPrevented).toBe(false);
    c.show();
    f.detectChanges();
    await f.whenStable();
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    const event = new Event('pointerdown', { bubbles: true });
    outside.dispatchEvent(event);
    f.detectChanges();
    await f.whenStable();
    expect(c.open()).toBe(false);
    expect(document.activeElement).toBe(outside);
    outside.remove();
    c.show();
    f.detectChanges();
    await f.whenStable();
    expect(c.open()).toBe(true);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    await f.whenStable();
    expect(c.open()).toBe(false);
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    await f.whenStable();
    expect(c.open()).toBe(false);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    c.show();
    c.context(new MouseEvent('contextmenu'));
    c.regionKeydown(new KeyboardEvent('keydown', { key: 'ContextMenu' }));
    expect(c.open()).toBe(false);
    f.componentRef.setInput('disabled', false);
    f.componentRef.setInput('actions', []);
    f.detectChanges();
    c.show();
    expect(c.open()).toBe(false);
    f.destroy();
  });
});
