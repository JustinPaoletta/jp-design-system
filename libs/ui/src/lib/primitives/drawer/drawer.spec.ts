import { TestBed } from '@angular/core/testing';
import { JpDrawer } from './drawer';
import { Component } from '@angular/core';
@Component({
  imports: [JpDrawer],
  template:
    '<button (click)="open=true">Open</button><jp-drawer title="Details" [open]="open" (openChange)="open=$event"><p>Body</p><button jpDrawerActions>Save</button></jp-drawer>',
})
class Host {
  open = false;
}
describe('JpDrawer', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpDrawer],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpDrawer);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('shares the dialog focus/dismissal contract and applies logical edge placement', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const opener = f.nativeElement.querySelector('button') as HTMLButtonElement;
    opener.focus();
    opener.click();
    f.detectChanges();
    const panel = f.nativeElement.querySelector('dialog') as HTMLDialogElement;
    expect(panel.classList.contains('jp-dialog__panel--end')).toBe(true);
    expect(panel.textContent).toContain('Save');
    panel.dispatchEvent(new Event('cancel', { cancelable: true }));
    f.detectChanges();
    expect(f.componentInstance.open).toBe(false);
    expect(document.activeElement).toBe(opener);
  });
  it('allows start and bottom placements and forwards controlled closing', async () => {
    const f = await mount({ title: 'Details', open: true, side: 'bottom' });
    expect(
      f.nativeElement
        .querySelector('dialog')
        .classList.contains('jp-dialog__panel--bottom'),
    ).toBe(true);
    f.componentRef.setInput('side', 'start');
    f.detectChanges();
    expect(
      f.nativeElement
        .querySelector('dialog')
        .classList.contains('jp-dialog__panel--start'),
    ).toBe(true);
  });
});
