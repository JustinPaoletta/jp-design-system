import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WorkflowsPage } from './workflows.page';
describe('WorkflowsPage', () => {
  async function mount() {
    await TestBed.configureTestingModule({
      imports: [WorkflowsPage],
      providers: [provideRouter([])],
    }).compileComponents();
    const f = TestBed.createComponent(WorkflowsPage);
    f.detectChanges();
    await f.whenStable();
    return f;
  }
  it('validates temporal controls, focuses recovery, and saves a valid schedule', async () => {
    const f = await mount(),
      c = f.componentInstance;
    c.launch.setValue('2026-09-30');
    c.dates.setValue(['2026-10-12', '2026-10-10']);
    c.time.setValue('09:10');
    c.saveSchedule();
    f.detectChanges();
    await f.whenStable();
    expect(c.errors()).toHaveLength(3);
    expect(c.scheduleSaved()).toBe(false);
    expect(document.activeElement).toBe(
      f.nativeElement.querySelector('jp-error-summary section'),
    );
    c.launch.setValue('2026-10-10');
    c.dates.setValue(['2026-10-10', '2026-10-12']);
    c.time.setValue('09:15');
    c.saveSchedule();
    f.detectChanges();
    expect(c.scheduleSaved()).toBe(true);
  });
  it('owns file/notification state and records menu actions', async () => {
    const f = await mount(),
      c = f.componentInstance;
    c.addFiles([new File(['one'], 'one.txt')]);
    expect(c.uploads()[0].status).toBe('ready');
    c.uploadState('uploading');
    expect(c.uploads()[0].progress).toBe(40);
    c.uploadAction({ id: c.uploads()[0].id, type: 'cancel' });
    expect(c.uploads()[0].status).toBe('ready');
    c.uploadState('error');
    c.uploadAction({ id: c.uploads()[0].id, type: 'retry' });
    expect(c.uploads()[0].status).toBe('uploading');
    c.uploadState('complete');
    c.uploadAction({ id: c.uploads()[0].id, type: 'remove' });
    expect(c.uploads()).toEqual([]);
    c.changeRead({ id: 'review', unread: false });
    expect(c.notifications()[0].unread).toBe(false);
    c.markAll();
    expect(c.notifications().every((item) => !item.unread)).toBe(true);
    c.dismiss('review');
    f.detectChanges();
    await f.whenStable();
    expect(c.notifications()).toHaveLength(2);
    c.record('duplicate');
    expect(c.action()).toBe('duplicate');
  });
  it('demonstrates save failure/retry and accepts cancellation', async () => {
    const f = await mount(),
      c = f.componentInstance;
    await expect(
      c.saveName('Updated', new AbortController().signal),
    ).rejects.toThrow('Demo save failure');
    await expect(
      c.saveName('Updated', new AbortController().signal),
    ).resolves.toBeUndefined();
    const controller = new AbortController();
    const pending = c.saveName('Cancelled', controller.signal);
    controller.abort();
    await expect(pending).rejects.toThrow('Cancelled');
  });
});
