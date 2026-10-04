import { TestBed } from '@angular/core/testing';
import { JpCopyButton } from './copy-button';
describe('JpCopyButton', () => {
  let clipboardDescriptor: PropertyDescriptor | undefined;
  beforeEach(() => {
    clipboardDescriptor = Object.getOwnPropertyDescriptor(
      navigator,
      'clipboard',
    );
  });
  afterEach(() => {
    if (clipboardDescriptor)
      Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    else Reflect.deleteProperty(navigator, 'clipboard');
  });
  async function mount() {
    await TestBed.configureTestingModule({
      imports: [JpCopyButton],
    }).compileComponents();
    const f = TestBed.createComponent(JpCopyButton);
    f.componentRef.setInput('text', '<b>literal</b>');
    f.detectChanges();
    return f;
  }
  it('copies the exact plain text, announces success, and resets feedback when content changes', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const f = await mount();
    const copied = jest.fn();
    f.componentInstance.copied.subscribe(copied);
    await f.componentInstance.copy();
    f.detectChanges();
    expect(writeText).toHaveBeenCalledWith('<b>literal</b>');
    expect(copied).toHaveBeenCalledTimes(1);
    expect(
      f.nativeElement.querySelector('[role=status]').textContent,
    ).toContain('Copied');
    f.componentRef.setInput('text', 'Changed');
    f.detectChanges();
    expect(f.componentInstance.state()).toBe('idle');
  });
  it('announces denied/unavailable clipboard access without claiming success and allows retry', async () => {
    const writeText = jest.fn().mockRejectedValue(new Error('Denied'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const f = await mount();
    const failed = jest.fn();
    f.componentInstance.copyFailed.subscribe(failed);
    await f.componentInstance.copy();
    f.detectChanges();
    expect(f.componentInstance.state()).toBe('failure');
    expect(failed).toHaveBeenCalledTimes(1);
    expect(f.nativeElement.textContent).toContain('Select and copy');
    writeText.mockResolvedValue(undefined);
    await f.componentInstance.copy();
    expect(f.componentInstance.state()).toBe('success');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    await f.componentInstance.copy();
    expect(f.componentInstance.state()).toBe('failure');
  });
  it('blocks disabled/duplicate copies and ignores completion after changed content or destruction', async () => {
    let resolve!: () => void;
    const writeText = jest.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const f = await mount();
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    await f.componentInstance.copy();
    expect(writeText).not.toHaveBeenCalled();
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    const pending = f.componentInstance.copy();
    await f.componentInstance.copy();
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(f.componentInstance.state()).toBe('pending');
    f.componentRef.setInput('text', 'Other');
    f.detectChanges();
    resolve();
    await pending;
    expect(f.componentInstance.state()).toBe('idle');
    const copied = jest.fn();
    f.componentInstance.copied.subscribe(copied);
    const destroyed = f.componentInstance.copy();
    f.destroy();
    resolve();
    await destroyed;
    expect(copied).not.toHaveBeenCalled();
  });
});
