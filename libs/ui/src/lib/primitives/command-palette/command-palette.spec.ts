import { TestBed } from '@angular/core/testing';
import { JpCommandPalette } from './command-palette';
describe('JpCommandPalette', () => {
  function mount() {
    const f = TestBed.createComponent(JpCommandPalette);
    f.componentRef.setInput('commands', [
      {
        id: 'home',
        label: 'Overview',
        section: 'Navigate',
        keywords: ['dashboard'],
      },
      {
        id: 'settings',
        label: 'Settings',
        section: 'Navigate',
        disabled: true,
      },
      {
        id: 'copy',
        label: 'Duplicate',
        description: 'Copy this project',
        section: 'Actions',
      },
    ]);
    f.componentRef.setInput('open', true);
    f.detectChanges();
    return f;
  }
  it('filters registry metadata, keeps section order, and uses active descendants while skipping disabled commands', () => {
    const f = mount(),
      c = f.componentInstance;
    expect(c.groups().map((g) => g.label)).toEqual(['Navigate', 'Actions']);
    expect(c.active()).toBe('home');
    const down = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      cancelable: true,
    });
    c.keydown(down);
    f.detectChanges();
    expect(c.active()).toBe('copy');
    expect(c.activeId()).toBe(c.optionId('copy'));
    expect(down.defaultPrevented).toBe(true);
    c.keydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(c.active()).toBe('home');
    c.keydown(new KeyboardEvent('keydown', { key: 'End' }));
    expect(c.active()).toBe('copy');
    c.keydown(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(c.active()).toBe('home');
    c.query.set('dashboard');
    f.detectChanges();
    expect(c.filtered().map((x) => x.id)).toEqual(['home']);
    c.searchInput({ target: { value: 'copy' } } as unknown as Event);
    f.detectChanges();
    expect(c.filtered().map((x) => x.id)).toEqual(['copy']);
    c.query.set('missing');
    f.detectChanges();
    expect(c.activeId()).toBeNull();
    c.keydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(f.nativeElement.textContent).toContain('No commands found');
  });
  it('runs only enabled commands, closes, and keeps global shortcut opt-in and away from editable fields', () => {
    const f = mount(),
      c = f.componentInstance,
      selected = jest.fn(),
      open = jest.fn();
    c.commandSelected.subscribe(selected);
    c.openChange.subscribe(open);
    c.choose(c.commands()[1]);
    expect(selected).not.toHaveBeenCalled();
    c.keydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(selected).toHaveBeenCalledWith('home');
    expect(open).toHaveBeenCalledWith(false);
    f.componentRef.setInput('open', false);
    f.detectChanges();
    c.choose(c.commands()[0]);
    expect(selected).toHaveBeenCalledTimes(1);
    const shortcut = () =>
      new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        cancelable: true,
      });
    c.onShortcut(shortcut());
    expect(open).toHaveBeenCalledTimes(1);
    f.componentRef.setInput('shortcutEnabled', true);
    f.detectChanges();
    const editing = shortcut();
    Object.defineProperty(editing, 'target', {
      value: document.createElement('input'),
    });
    c.onShortcut(editing);
    expect(editing.defaultPrevented).toBe(false);
    const prevented = shortcut();
    prevented.preventDefault();
    c.onShortcut(prevented);
    c.onShortcut(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, altKey: true }),
    );
    expect(open).toHaveBeenCalledTimes(1);
    const activation = shortcut();
    c.onShortcut(activation);
    expect(activation.defaultPrevented).toBe(true);
    expect(open).toHaveBeenLastCalledWith(true);
  });
});

describe('command shortcuts', () => {
  it('matches enabled modifier chords once, supports Mod and aliases, and ignores undeclared or unmodified keys', () => {
    const f = TestBed.createComponent(JpCommandPalette);
    f.componentRef.setInput('shortcutEnabled', true);
    f.componentRef.setInput('commands', [
      {
        id: 'disabled',
        label: 'Disabled',
        disabled: true,
        shortcut: ['Mod', 'Shift', 'D'],
      },
      { id: 'duplicate', label: 'Duplicate', shortcut: ['Mod', 'Shift', 'D'] },
      { id: 'control', label: 'Control', shortcut: ['Ctrl', 'X'] },
      { id: 'meta', label: 'Meta', shortcut: ['Command', 'X'] },
      { id: 'alt', label: 'Alt', shortcut: ['Option', 'X'] },
      { id: 'sequence', label: 'Not a chord', shortcut: ['G', 'O'] },
    ]);
    f.detectChanges();
    const selected = jest.fn();
    f.componentInstance.commandSelected.subscribe(selected);
    const invoke = (key: string, modifiers: KeyboardEventInit) => {
      const event = new KeyboardEvent('keydown', {
        key,
        cancelable: true,
        ...modifiers,
      });
      f.componentInstance.onShortcut(event);
      return event;
    };
    expect(
      invoke('D', { ctrlKey: true, shiftKey: true }).defaultPrevented,
    ).toBe(true);
    expect(
      invoke('D', { metaKey: true, shiftKey: true }).defaultPrevented,
    ).toBe(true);
    invoke('x', { ctrlKey: true });
    invoke('x', { metaKey: true });
    invoke('x', { altKey: true });
    expect(selected.mock.calls.map((call) => call[0])).toEqual([
      'duplicate',
      'duplicate',
      'control',
      'meta',
      'alt',
    ]);
    expect(invoke('d', { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(invoke('o', { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(invoke('x', {}).defaultPrevented).toBe(false);
    expect(
      invoke('x', { ctrlKey: true, shiftKey: true }).defaultPrevented,
    ).toBe(false);
  });
});
