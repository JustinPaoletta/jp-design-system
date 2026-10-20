import { TestBed } from '@angular/core/testing';
import { JpNotificationList } from './notification-list';
describe('JpNotificationList', () => {
  it('groups unread items and emits controlled read/dismiss/retry intents without silently mutating data', () => {
    const f = TestBed.createComponent(JpNotificationList);
    f.componentRef.setInput('label', 'Inbox');
    const one = { id: 'one', title: 'Review', group: 'Today', unread: true },
      two = { id: 'two', title: 'Invite' };
    f.componentRef.setInput('items', [one, two]);
    f.detectChanges();
    const c = f.componentInstance;
    expect(c.groups()).toHaveLength(2);
    expect(c.unreadCount()).toBe(1);
    c.filter.set('unread');
    expect(c.groups()[0].items).toEqual([one]);
    const read = jest.fn(),
      dismiss = jest.fn(),
      all = jest.fn(),
      retry = jest.fn();
    c.readChange.subscribe(read);
    c.dismissRequested.subscribe(dismiss);
    c.markAllRequested.subscribe(all);
    c.retryRequested.subscribe(retry);
    c.mark(one);
    c.mark(two);
    c.dismiss(one);
    c.markAll();
    c.retry();
    expect(read.mock.calls.map((x) => x[0])).toEqual([
      { id: 'one', unread: false },
      { id: 'two', unread: true },
    ]);
    expect(dismiss).toHaveBeenCalledWith('one');
    expect(all).toHaveBeenCalledTimes(1);
    expect(retry).toHaveBeenCalledTimes(1);
    expect(one.unread).toBe(true);
    const row = f.nativeElement.querySelector('li');
    f.componentRef.setInput('loading', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('li')).toBe(row);
    expect(row.querySelector('button').disabled).toBe(true);
    c.mark(one);
    c.dismiss(one);
    c.markAll();
    c.retry();
    expect(all).toHaveBeenCalledTimes(1);
    expect(f.nativeElement.textContent).toContain('Loading notifications');
    f.componentRef.setInput('loading', false);
    f.componentRef.setInput('error', 'Network unavailable');
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role=alert]').textContent).toContain(
      'Network unavailable',
    );
    f.componentRef.setInput('error', '');
    f.componentRef.setInput('items', []);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('No unread notifications');
    c.markAll();
    expect(all).toHaveBeenCalledTimes(1);
  });
  it('uses an initial placeholder only until notification data is available', () => {
    const f = TestBed.createComponent(JpNotificationList);
    f.componentRef.setInput('label', 'Inbox');
    f.componentRef.setInput('loading', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('.loading-lines')).toBeTruthy();
    f.componentRef.setInput('items', [{ id: 'one', title: 'Lineup ready' }]);
    f.detectChanges();
    expect(f.nativeElement.querySelector('.loading-lines')).toBeNull();
    expect(f.nativeElement.querySelector('li').textContent).toContain(
      'Lineup ready',
    );
    f.componentRef.setInput('loading', false);
    f.detectChanges();
    expect(f.nativeElement.querySelector('.jp-refresh-status')).toBeNull();
    expect(f.nativeElement.querySelector('li button').disabled).toBe(false);
  });
});

describe('notification focus recovery', () => {
  it('moves focus to the next item or selected filter only when a controlled update removes its focused row', () => {
    const f = TestBed.createComponent(JpNotificationList);
    f.componentRef.setInput('label', 'Inbox');
    const one = { id: 'one', title: 'Review', unread: true },
      two = { id: 'two', title: 'Release', unread: true };
    f.componentRef.setInput('items', [one, two]);
    f.detectChanges();
    const c = f.componentInstance;
    c.filter.set('unread');
    f.detectChanges();
    const first = f.nativeElement.querySelector('li button');
    first.focus();
    c.readChange.subscribe((change) =>
      f.componentRef.setInput(
        'items',
        change.id === 'one'
          ? [{ ...one, unread: false }, two]
          : [
              { ...one, unread: false },
              { ...two, unread: false },
            ],
      ),
    );
    c.mark(one);
    f.detectChanges();
    expect(document.activeElement).toBe(
      f.nativeElement.querySelector('li button'),
    );
    c.mark(two);
    f.detectChanges();
    expect(document.activeElement).toBe(
      f.nativeElement.querySelector('button[aria-pressed=true]'),
    );
    f.componentRef.setInput('items', [one, two]);
    f.detectChanges();
    const existing = f.nativeElement.querySelector('li button');
    existing.focus();
    c.dismiss(one);
    f.detectChanges();
    expect(document.activeElement).toBe(existing);
  });
});
