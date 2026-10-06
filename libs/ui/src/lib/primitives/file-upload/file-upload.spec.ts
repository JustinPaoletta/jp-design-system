import { TestBed } from '@angular/core/testing';
import { JpFileUpload, type JpUploadItem } from './file-upload';
describe('JpFileUpload', () => {
  function mount() {
    const f = TestBed.createComponent(JpFileUpload);
    f.componentRef.setInput('label', 'Files');
    f.detectChanges();
    return f;
  }
  it('accepts MIME wildcards/extensions, separates invalid files, and counts the existing queue', () => {
    const f = mount(),
      c = f.componentInstance,
      selected = jest.fn(),
      rejected = jest.fn();
    c.filesSelected.subscribe(selected);
    c.filesRejected.subscribe(rejected);
    const text = new File(['ok'], 'README.TXT', { type: 'text/plain' }),
      image = new File(['ok'], 'photo.png', { type: 'image/png' }),
      bad = new File(['no'], 'script.js', { type: 'text/javascript' }),
      large = new File(['large'], 'large.txt', { type: 'text/plain' });
    f.componentRef.setInput('accept', '.txt, image/*');
    f.componentRef.setInput('maxBytes', 3);
    f.componentRef.setInput('maxFiles', 2);
    f.detectChanges();
    c.validateSelection([text, image, bad, large, text]);
    expect(selected).toHaveBeenCalledWith([text, image]);
    expect(
      rejected.mock.calls[0][0].map((r: { reason: string }) => r.reason),
    ).toEqual(['type', 'size', 'count']);
    expect(c.describedBy()).toContain('-error');
    f.componentRef.setInput('items', [
      { id: 'one', file: text, status: 'ready' },
    ]);
    f.componentRef.setInput('accept', 'text/plain');
    f.detectChanges();
    c.validateSelection([text, image, text]);
    expect(selected).toHaveBeenLastCalledWith([text]);
    expect(c.rejections().map((r) => r.reason)).toEqual(['type', 'count']);
    f.componentRef.setInput('multiple', false);
    f.detectChanges();
    c.validateSelection([text]);
    expect(c.rejections()[0].reason).toBe('count');
  });
  it('handles native reselection, empty limits, and controlled cancel/retry/remove intents', () => {
    const f = mount(),
      c = f.componentInstance,
      selected = jest.fn(),
      actions = jest.fn();
    c.filesSelected.subscribe(selected);
    c.action.subscribe(actions);
    const file = new File(['x'], 'a.txt');
    const input = f.nativeElement.querySelector('input');
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file],
    });
    input.dispatchEvent(new Event('change'));
    expect(selected).toHaveBeenCalledWith([file]);
    expect(input.value).toBe('');
    const uploading: JpUploadItem = {
        id: 'one',
        file,
        status: 'uploading',
        progress: 50,
      },
      failed: JpUploadItem = { id: 'two', file, status: 'error' },
      ready: JpUploadItem = { id: 'three', file, status: 'ready' };
    c.act(uploading, 'cancel');
    c.act(failed, 'retry');
    c.act(ready, 'remove');
    expect(actions.mock.calls.map((x) => x[0].type)).toEqual([
      'cancel',
      'retry',
      'remove',
    ]);
    c.act(ready, 'retry');
    c.act(ready, 'cancel');
    c.act(uploading, 'remove');
    expect(actions).toHaveBeenCalledTimes(3);
    expect(c.status(failed)).toBe('Upload failed');
    expect(c.status({ ...ready, status: 'complete' })).toBe('Uploaded');
    f.componentRef.setInput('hint', 'Text');
    f.detectChanges();
    expect(c.describedBy()).toContain('-hint');
    f.componentRef.setInput('maxFiles', 0);
    f.detectChanges();
    c.validateSelection([file]);
    expect(c.rejections()[0].reason).toBe('count');
    f.componentRef.setInput('maxFiles', NaN);
    f.detectChanges();
    c.validateSelection([file]);
    expect(c.rejections()).toEqual([]);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    selected.mockClear();
    c.validateSelection([file]);
    c.select({ target: input } as unknown as Event);
    c.act(failed, 'retry');
    expect(selected).not.toHaveBeenCalled();
    expect(actions).toHaveBeenCalledTimes(3);
  });
});
