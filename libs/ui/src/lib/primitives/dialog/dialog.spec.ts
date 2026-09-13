import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JpButton } from '../button/button';
import { JpDialog, JpDialogActions } from './dialog';

@Component({
  standalone: true,
  imports: [JpDialog, JpDialogActions, JpButton],
  template: `
    <button type="button" id="opener" (click)="open = true">Open</button>
    <jp-dialog
      [open]="open"
      title="Delete deployment?"
      (openChange)="open = $event"
    >
      <p>This cannot be undone.</p>
      <div jpDialogActions>
        <jp-button variant="secondary" type="button" (click)="open = false">
          Cancel
        </jp-button>
        <jp-button variant="destructive" type="button">Delete</jp-button>
      </div>
    </jp-dialog>
  `,
})
class DialogHost {
  open = false;
}

describe('JpDialog', () => {
  let fixture: ComponentFixture<DialogHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHost],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogHost);
    fixture.detectChanges();
  });

  function openDialog(): void {
    const opener = fixture.nativeElement.querySelector(
      '#opener',
    ) as HTMLButtonElement;
    opener.click();
    fixture.detectChanges();
  }

  it('renders dialog when open', () => {
    openDialog();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Delete deployment?');
    expect(
      fixture.nativeElement.querySelector('.jp-dialog__actions'),
    ).toBeTruthy();
  });

  it('closes on Escape', () => {
    openDialog();
    expect(fixture.componentInstance.open).toBe(true);

    const dialog = fixture.debugElement.query(By.directive(JpDialog))
      .componentInstance as JpDialog;
    dialog.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('closes on scrim click', () => {
    openDialog();

    const scrim = fixture.nativeElement.querySelector(
      '.jp-dialog__scrim',
    ) as HTMLElement;
    scrim.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('closes via close button', () => {
    openDialog();

    const close = fixture.nativeElement.querySelector(
      '.jp-dialog__close',
    ) as HTMLButtonElement;
    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('ignores Escape and close when already closed', () => {
    const dialog = fixture.debugElement.query(By.directive(JpDialog))
      .componentInstance as JpDialog;
    dialog.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    dialog.close();
    expect(fixture.componentInstance.open).toBe(false);
  });
});
