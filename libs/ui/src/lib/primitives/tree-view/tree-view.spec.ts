import { TestBed } from '@angular/core/testing';
import { provideJpMessages } from '../../i18n';
import { JpTreeView, type JpTreeNode } from './tree-view';

const nodes: readonly JpTreeNode[] = [
  {
    key: 'folder',
    label: 'Assets',
    children: [
      { key: 'alpha', label: 'Alpha.svg' },
      { key: 'beta', label: 'Beta.svg' },
    ],
  },
  { key: 'lazy', label: 'Library', hasChildren: true },
  { key: 'disabled', label: 'Restricted', disabled: true },
];
function requireElement<T extends HTMLElement = HTMLElement>(
  root: HTMLElement,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error('Expected element: ' + selector);
  return element;
}
function setup(data = nodes) {
  const fixture = TestBed.createComponent(JpTreeView);
  fixture.componentRef.setInput('id', 'test-tree');
  fixture.componentRef.setInput('label', 'Assets');
  fixture.componentRef.setInput('nodes', data);
  fixture.componentInstance.expandedKeysChange.subscribe((keys) =>
    fixture.componentRef.setInput('expandedKeys', keys),
  );
  fixture.componentInstance.selectedKeyChange.subscribe((key) =>
    fixture.componentRef.setInput('selectedKey', key),
  );
  fixture.detectChanges();
  return fixture;
}
function press(element: HTMLElement, key: string) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
  return event;
}

describe('JpTreeView', () => {
  it('uses an initially selected visible node as the tree entry point', () => {
    const fixture = setup();
    fixture.componentRef.setInput('expandedKeys', ['folder']);
    fixture.componentRef.setInput('selectedKey', 'beta');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role=treeitem][tabindex="0"]')?.id).toBe(
      'test-tree-node-beta',
    );
    expect(
      el.querySelector('#test-tree-node-beta')?.getAttribute('aria-selected'),
    ).toBe('true');
  });
  it('recovers focus to the named empty tree if all nodes disappear', () => {
    const fixture = setup();
    const el = fixture.nativeElement as HTMLElement;
    requireElement(el, '#test-tree-node-folder').focus();
    fixture.componentRef.setInput('nodes', []);
    fixture.detectChanges();
    expect(document.activeElement).toBe(el.querySelector('[role=tree]'));
    expect(el.querySelector('[role=tree]')?.getAttribute('tabindex')).toBe('0');
  });
  it('preserves an explicit blur when a consumer later collapses a folder', () => {
    const fixture = setup();
    fixture.componentRef.setInput('expandedKeys', ['folder']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    requireElement(el, '#test-tree-node-alpha').focus();
    requireElement(el, '#test-tree-node-alpha').blur();
    fixture.componentRef.setInput('expandedKeys', []);
    fixture.detectChanges();
    expect(document.activeElement).toBe(document.body);
  });
  it('recovers browser blur during collapse even while the removed descendant is still connected', () => {
    const fixture = setup();
    fixture.componentRef.setInput('expandedKeys', ['folder']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const child = requireElement(el, '#test-tree-node-alpha');
    child.focus();
    fixture.componentRef.setInput('expandedKeys', []);
    // Browsers may blur a focused descendant before Angular removes its DOM.
    child.blur();
    expect(child.isConnected).toBe(true);
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      el.querySelector('#test-tree-node-folder'),
    );
  });
  it('uses Space to disclose in activation-only mode and leaves leaves unchanged', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selection', 'none');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const folder = requireElement(el, '#test-tree-node-folder');
    folder.focus();
    press(folder, ' ');
    fixture.detectChanges();
    expect(folder.getAttribute('aria-expanded')).toBe('true');
    press(folder, 'ArrowRight');
    const leaf = requireElement(el, '#test-tree-node-alpha');
    press(leaf, 'ArrowRight');
    expect(document.activeElement).toBe(leaf);
    press(leaf, ' ');
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedKey()).toBeNull();
    expect(leaf.hasAttribute('aria-expanded')).toBe(false);
  });
  it('matches multi-character and uppercase prefixes while preserving browser modifier shortcuts', () => {
    const fixture = setup([
      { key: 'amber', label: 'Amber' },
      { key: 'beta', label: 'Beta' },
      { key: 'apple', label: 'Apple' },
    ]);
    const el = fixture.nativeElement as HTMLElement;
    const amber = requireElement(el, '#test-tree-node-amber');
    const apple = requireElement(el, '#test-tree-node-apple');
    amber.focus();
    press(amber, 'A');
    expect(document.activeElement).toBe(apple);
    press(apple, 'm');
    expect(document.activeElement).toBe(amber);
    press(amber, 'z');
    expect(document.activeElement).toBe(amber);
    for (const modifier of ['ctrlKey', 'metaKey', 'altKey']) {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        [modifier]: true,
        bubbles: true,
        cancelable: true,
      });
      amber.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(amber);
    }
    press(amber, 'ArrowUp');
    expect(document.activeElement).toBe(amber);
  });
  it('does not repeat a consumer-marked loading request and retries a failed branch by pointer', () => {
    const fixture = setup([
      {
        key: 'lazy',
        label: 'Library',
        hasChildren: true,
        loadState: 'loading',
      },
    ]);
    const requested = jest.fn();
    fixture.componentInstance.loadRequested.subscribe(requested);
    const el = fixture.nativeElement as HTMLElement;
    const node = requireElement(el, '#test-tree-node-lazy');
    node.focus();
    press(node, 'ArrowRight');
    fixture.detectChanges();
    expect(node.getAttribute('aria-expanded')).toBe('true');
    expect(requested).not.toHaveBeenCalled();
    press(node, 'ArrowLeft');
    fixture.detectChanges();
    press(node, 'ArrowRight');
    fixture.detectChanges();
    expect(requested).not.toHaveBeenCalled();
    fixture.componentRef.setInput('nodes', [
      { key: 'lazy', label: 'Library', hasChildren: true, loadState: 'error' },
    ]);
    fixture.detectChanges();
    requireElement<HTMLButtonElement>(el, 'button').click();
    expect(requested).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(node);
  });
  it('global disabling makes a lazy branch discoverable without activating or retrying it', () => {
    const fixture = setup([
      { key: 'lazy', label: 'Library', hasChildren: true, loadState: 'error' },
    ]);
    fixture.componentRef.setInput('expandedKeys', ['lazy']);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const selected = jest.fn();
    const requested = jest.fn();
    fixture.componentInstance.selectedKeyChange.subscribe(selected);
    fixture.componentInstance.loadRequested.subscribe(requested);
    const el = fixture.nativeElement as HTMLElement;
    const node = requireElement(el, '#test-tree-node-lazy');
    node.focus();
    press(node, 'Enter');
    press(node, ' ');
    press(node, 'ArrowLeft');
    expect(selected).not.toHaveBeenCalled();
    expect(requested).not.toHaveBeenCalled();
    expect(requireElement<HTMLButtonElement>(el, 'button').disabled).toBe(true);
    expect(document.activeElement).toBe(node);
  });
  it('clicks a descendant without selecting its ancestors and keeps disclosure clicks independent', () => {
    const fixture = setup();
    fixture.componentRef.setInput('expandedKeys', ['folder']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    requireElement(el, '#test-tree-node-alpha .label').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedKey()).toBe('alpha');
    requireElement(el, '#test-tree-node-folder > .row .disclosure').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual([]);
    expect(fixture.componentInstance.selectedKey()).toBe('alpha');
  });
  it('does not reclaim focus after the user moves to another control', () => {
    const fixture = setup();
    fixture.componentRef.setInput('expandedKeys', ['folder']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    requireElement(el, '#test-tree-node-alpha').focus();
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    fixture.componentRef.setInput('expandedKeys', []);
    fixture.detectChanges();
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
  it('renders owned groups and explicit hierarchy positions, omitting expansion on leaves', () => {
    const fixture = setup();
    fixture.componentRef.setInput('expandedKeys', ['folder']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role=tree]')?.getAttribute('aria-label')).toBe(
      'Assets',
    );
    expect(
      el.querySelector('[role=group]')?.parentElement?.getAttribute('role'),
    ).toBe('treeitem');
    const child = el.querySelector('#test-tree-node-alpha');
    expect(child?.getAttribute('aria-level')).toBe('2');
    expect(child?.getAttribute('aria-posinset')).toBe('1');
    expect(child?.getAttribute('aria-setsize')).toBe('2');
    expect(child?.hasAttribute('aria-expanded')).toBe(false);
    expect(el.querySelectorAll('[role=treeitem][tabindex="0"]')).toHaveLength(
      1,
    );
  });
  it('moves focus independently of selection and activates using Enter/Space', () => {
    const fixture = setup();
    const el = fixture.nativeElement as HTMLElement;
    const folder = requireElement(el, '#test-tree-node-folder');
    const activated = jest.fn();
    fixture.componentInstance.activated.subscribe(activated);
    folder.focus();
    press(folder, 'ArrowRight');
    fixture.detectChanges();
    press(folder, 'ArrowRight');
    fixture.detectChanges();
    const alpha = requireElement(el, '#test-tree-node-alpha');
    expect(document.activeElement).toBe(alpha);
    expect(fixture.componentInstance.selectedKey()).toBeNull();
    press(alpha, ' ');
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedKey()).toBe('alpha');
    expect(activated).not.toHaveBeenCalled();
    press(alpha, 'Enter');
    expect(activated).toHaveBeenCalledWith(nodes[0].children?.[0]);
    press(alpha, 'ArrowLeft');
    expect(document.activeElement).toBe(folder);
    press(folder, 'ArrowLeft');
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual([]);
  });
  it('supports Home/End and repeated-character typeahead without stealing Tab', () => {
    const fixture = setup([
      { key: 'a', label: 'Alpha' },
      { key: 'b', label: 'Beta' },
      { key: 'c', label: 'Bravo' },
    ]);
    const el = fixture.nativeElement as HTMLElement;
    const a = requireElement(el, '#test-tree-node-a');
    const b = requireElement(el, '#test-tree-node-b');
    const c = requireElement(el, '#test-tree-node-c');
    a.focus();
    press(a, 'b');
    expect(document.activeElement).toBe(b);
    press(b, 'b');
    expect(document.activeElement).toBe(c);
    press(c, 'Home');
    expect(document.activeElement).toBe(a);
    press(a, 'End');
    expect(document.activeElement).toBe(c);
    expect(press(c, 'Tab').defaultPrevented).toBe(false);
  });
  it('mirrors expansion keys in RTL and keeps disabled nodes discoverable but inactive', () => {
    const fixture = setup();
    const el = fixture.nativeElement as HTMLElement;
    el.style.direction = 'rtl';
    const folder = requireElement(el, '#test-tree-node-folder');
    folder.focus();
    press(folder, 'ArrowLeft');
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual(['folder']);
    const disabled = requireElement(el, '#test-tree-node-disabled');
    press(folder, 'End');
    expect(document.activeElement).toBe(disabled);
    press(disabled, 'Enter');
    expect(fixture.componentInstance.selectedKey()).toBeNull();
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
  });
  it('recovers focus to an ancestor on external collapse, then to a surviving root on removal', () => {
    const fixture = setup();
    fixture.componentRef.setInput('expandedKeys', ['folder']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    requireElement(el, '#test-tree-node-alpha').focus();
    fixture.componentRef.setInput('expandedKeys', []);
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      el.querySelector('#test-tree-node-folder'),
    );
    fixture.componentRef.setInput('nodes', nodes.slice(1));
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      el.querySelector('#test-tree-node-lazy'),
    );
  });
  it('requests lazy branches once per expansion and exposes loading/error/retry without loading internally', () => {
    const fixture = setup();
    const requested = jest.fn();
    fixture.componentInstance.loadRequested.subscribe(requested);
    fixture.componentInstance.toggle(nodes[1]);
    fixture.detectChanges();
    expect(requested).toHaveBeenCalledTimes(1);
    fixture.componentInstance.toggle(nodes[1], true);
    expect(requested).toHaveBeenCalledTimes(1);
    fixture.componentRef.setInput('nodes', [
      nodes[0],
      { ...nodes[1], loadState: 'loading' },
      nodes[2],
    ]);
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('[role=tree]')
        .getAttribute('aria-busy'),
    ).toBe('true');
    fixture.componentRef.setInput('nodes', [
      nodes[0],
      { ...nodes[1], loadState: 'error' },
      nodes[2],
    ]);
    fixture.detectChanges();
    const lazy = fixture.nativeElement.querySelector(
      '#test-tree-node-lazy',
    ) as HTMLElement;
    lazy.focus();
    press(lazy, 'Enter');
    expect(requested).toHaveBeenCalledTimes(2);
    fixture.componentRef.setInput('nodes', [
      { ...nodes[1], loadState: 'loaded', children: [] },
    ]);
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('[role=treeitem]')
        .hasAttribute('aria-expanded'),
    ).toBe(false);
  });
  it('supports an activation-only contract with no selected attributes', () => {
    const fixture = setup();
    fixture.componentRef.setInput('selection', 'none');
    fixture.detectChanges();
    const activated = jest.fn();
    const selected = jest.fn();
    fixture.componentInstance.activated.subscribe(activated);
    fixture.componentInstance.selectedKeyChange.subscribe(selected);
    fixture.componentInstance.clickNode(nodes[0]);
    expect(activated).toHaveBeenCalledWith(nodes[0]);
    expect(selected).not.toHaveBeenCalled();
    expect(
      fixture.nativeElement
        .querySelector('[role=treeitem]')
        .hasAttribute('aria-selected'),
    ).toBe(false);
  });
  it('localizes empty/loading/error states and requests a root retry', () => {
    TestBed.configureTestingModule({
      providers: [
        provideJpMessages({
          tree: { empty: 'Keine Dateien', retry: 'Erneut versuchen' },
        }),
      ],
    });
    const fixture = setup([]);
    expect(fixture.nativeElement.textContent).toContain('Keine Dateien');
    fixture.componentRef.setInput('state', 'error');
    fixture.detectChanges();
    const retry = jest.fn();
    fixture.componentInstance.retryRequested.subscribe(retry);
    fixture.nativeElement.querySelector('button').click();
    expect(retry).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Erneut versuchen');
  });
  it('rejects duplicate/empty stable keys instead of rendering conflicting IDs', () => {
    expect(() =>
      setup([
        { key: 'x', label: 'X', children: [{ key: 'x', label: 'Duplicate' }] },
      ]),
    ).toThrow('globally unique');
  });
});
