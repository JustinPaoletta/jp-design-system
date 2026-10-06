import { TestBed } from '@angular/core/testing';
import { JpInlineEdit } from './inline-edit';
describe('JpInlineEdit', () => {
  function mount(save = jest.fn().mockResolvedValue(undefined)) {
    const f = TestBed.createComponent(JpInlineEdit);
    f.componentRef.setInput('label', 'Name');
    f.componentRef.setInput('value', 'Original');
    f.componentRef.setInput('save', save);
    f.detectChanges();
    return f;
  }
  it('focuses editing, validates, announces success and keeps feedback after controlled value update', async () => {
    const save = jest.fn().mockResolvedValue(undefined),
      f = mount(save),
      c = f.componentInstance,
      changed = jest.fn();
    c.valueChange.subscribe((value) => {
      changed(value);
      f.componentRef.setInput('value', value);
    });
    c.edit();
    f.detectChanges();
    expect(document.activeElement).toBe(f.nativeElement.querySelector('input'));
    f.componentRef.setInput('required', true);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    await c.commit();
    f.detectChanges();
    expect(save).not.toHaveBeenCalled();
    expect(c.error()).not.toBe('');
    f.componentRef.setInput('validate', (value: string) =>
      value === 'Blocked' ? 'Name unavailable' : '',
    );
    f.detectChanges();
    input.value = 'Blocked';
    input.dispatchEvent(new Event('input'));
    await c.commit();
    expect(c.error()).toBe('Name unavailable');
    input.value = 'Updated';
    input.dispatchEvent(new Event('input'));
    await c.commit();
    f.detectChanges();
    expect(changed).toHaveBeenCalledWith('Updated');
    expect(c.editing()).toBe(false);
    expect(c.feedback()).toBe('Saved');
    expect(document.activeElement).toBe(
      f.nativeElement.querySelector('button'),
    );
  });
  it('keeps drafts on save failure and allows retry', async () => {
    const save = jest
        .fn()
        .mockRejectedValueOnce(new Error('Denied'))
        .mockResolvedValue(undefined),
      f = mount(save),
      c = f.componentInstance;
    c.edit();
    f.detectChanges();
    c.draft.set('Updated');
    await c.commit();
    f.detectChanges();
    expect(c.error()).toContain('Could not save');
    expect(c.draft()).toBe('Updated');
    expect(c.editing()).toBe(true);
    await c.commit();
    f.detectChanges();
    expect(save).toHaveBeenCalledTimes(2);
    expect(c.feedback()).toBe('Saved');
  });
  it('aborts cancellation/external updates and suppresses stale completion or destroyed output', async () => {
    let resolve!: () => void;
    const save = jest.fn(
        (value: string, signal: AbortSignal) =>
          new Promise<void>((r) => {
            expect(value).toBeDefined();
            expect(signal).toBeInstanceOf(AbortSignal);
            resolve = r;
          }),
      ),
      f = mount(save),
      c = f.componentInstance,
      changed = jest.fn();
    c.valueChange.subscribe(changed);
    c.edit();
    f.detectChanges();
    const pending = c.commit();
    await c.commit();
    expect(save).toHaveBeenCalledTimes(1);
    const signal = save.mock.calls[0][1];
    expect(c.pending()).toBe(true);
    const escape = new KeyboardEvent('keydown', {
      key: 'Escape',
      cancelable: true,
    });
    c.keydown(escape);
    f.detectChanges();
    expect(signal.aborted).toBe(true);
    expect(escape.defaultPrevented).toBe(true);
    resolve();
    await pending;
    expect(changed).not.toHaveBeenCalled();
    c.edit();
    f.detectChanges();
    const external = c.commit();
    f.componentRef.setInput('value', 'External update');
    f.detectChanges();
    expect(save.mock.calls[1][1].aborted).toBe(true);
    resolve();
    await external;
    expect(c.draft()).toBe('External update');
    expect(changed).not.toHaveBeenCalled();
    c.edit();
    f.detectChanges();
    const destroyed = c.commit();
    f.destroy();
    resolve();
    await destroyed;
    expect(changed).not.toHaveBeenCalled();
  });
  it('blocks disabled editing, aborts when disabled, and ignores stale rejected work', async () => {
    let reject!: (error: Error) => void;
    const save = jest.fn(
        () =>
          new Promise<void>((_resolve, r) => {
            reject = r;
          }),
      ),
      f = mount(save),
      c = f.componentInstance;
    await c.commit();
    expect(save).not.toHaveBeenCalled();
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    c.edit();
    expect(c.editing()).toBe(false);
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    c.edit();
    f.detectChanges();
    const pending = c.commit();
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    reject(new Error('Too late'));
    await pending;
    expect(c.editing()).toBe(false);
    expect(c.error()).toBe('');
  });
});
