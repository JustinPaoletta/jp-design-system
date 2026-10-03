import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JpButton } from '../button/button';
import {
  JpDropdownMenu,
  JpDropdownMenuItem,
  JpDropdownTrigger,
} from '../dropdown-menu/dropdown-menu';
import { registerOverlay } from '../shared/overlay-manager';
import { JpDialog, JpDialogActions } from './dialog';

@Component({
  standalone: true,
  imports: [
    JpDialog,
    JpDialogActions,
    JpButton,
    JpDropdownMenu,
    JpDropdownMenuItem,
    JpDropdownTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button type="button" id="opener" (click)="open = true">Open</button>
    <button type="button" id="keyboard-opener" (click)="open = true">
      Keyboard open
    </button>
    <jp-dropdown-menu [open]="menuOpen" (openChange)="menuOpen = $event">
      <jp-button jpDropdownTrigger type="button">Actions</jp-button>
      <button jpDropdownMenuItem type="button" (itemSelect)="open = true">
        Delete from menu
      </button>
    </jp-dropdown-menu>
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
  menuOpen = false;
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

  it('closes on a native backdrop pointerdown', () => {
    openDialog();

    const scrim = fixture.nativeElement.querySelector(
      '.jp-dialog__panel',
    ) as HTMLElement;
    scrim.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: -1,
        clientY: -1,
      }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('handles native cancel through the controlled open API', () => {
    openDialog();
    const panel = fixture.nativeElement.querySelector(
      'dialog',
    ) as HTMLDialogElement;
    const event = new Event('cancel', { cancelable: true });
    panel.dispatchEvent(event);
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.open).toBe(false);
  });

  it('leaves a parent dialog open when a child owns backdrop dismissal', () => {
    openDialog();
    const panel = fixture.nativeElement.querySelector(
      'dialog',
    ) as HTMLDialogElement;
    const unregisterChild = registerOverlay({}, panel.ownerDocument);
    panel.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: -1,
        clientY: -1,
      }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(true);
    unregisterChild();
    panel.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: -1,
        clientY: -1,
      }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it('recovers from native showModal state races without losing dismissal', () => {
    const original = Object.getOwnPropertyDescriptor(
      HTMLDialogElement.prototype,
      'showModal',
    );
    const showModal = jest.fn(() => {
      throw new DOMException('State changed', 'InvalidStateError');
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: showModal,
    });
    try {
      openDialog();
      const panel = fixture.nativeElement.querySelector(
        'dialog',
      ) as HTMLDialogElement;
      expect(showModal).toHaveBeenCalledTimes(1);
      expect(panel.open).toBe(true);
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true,
        }),
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.open).toBe(false);
    } finally {
      if (original)
        Object.defineProperty(
          HTMLDialogElement.prototype,
          'showModal',
          original,
        );
      else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    }
  });

  it('restores a pointer opener even when the click leaves another button focused', () => {
    const opener = fixture.nativeElement.querySelector(
      '#opener',
    ) as HTMLButtonElement;
    const unrelated = fixture.nativeElement.querySelector(
      '#keyboard-opener',
    ) as HTMLButtonElement;
    unrelated.focus();
    opener.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    opener.click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      fixture.nativeElement.querySelector('.jp-dialog__close'),
    );
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(opener);
  });

  it('clears an old pointer opener before a focused keyboard activation', () => {
    const pointerOpener = fixture.nativeElement.querySelector(
      '#opener',
    ) as HTMLButtonElement;
    const keyboardOpener = fixture.nativeElement.querySelector(
      '#keyboard-opener',
    ) as HTMLButtonElement;
    pointerOpener.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true }),
    );
    keyboardOpener.focus();
    keyboardOpener.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    keyboardOpener.click(); // jsdom does not synthesize the browser's activation click.
    fixture.detectChanges();
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(keyboardOpener);
  });

  it('restores the composite trigger when a hidden menu item opens the dialog', () => {
    const trigger = fixture.nativeElement.querySelector(
      '[jpdropdowntrigger] button',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    const item = fixture.nativeElement.querySelector(
      '[jpdropdownmenuitem]',
    ) as HTMLButtonElement;
    item.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    item.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="menu"]').hidden).toBe(
      true,
    );
    expect(fixture.nativeElement.querySelector('dialog')).not.toBeNull();
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger);
  });

  it('uses a native menu trigger when the clicked menu item becomes hidden', () => {
    const menu = document.createElement('jp-dropdown-menu');
    menu.innerHTML =
      '<button jpdropdowntrigger>Native trigger</button><div><button>Menu action</button></div>';
    document.body.append(menu);
    const trigger = menu.querySelector('button') as HTMLButtonElement;
    const item = menu.querySelector('div button') as HTMLButtonElement;
    item.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    (menu.querySelector('div') as HTMLElement).hidden = true;
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger);
    menu.remove();
  });

  it('falls back to current focus when an opener is no longer focusable', () => {
    const opener = fixture.nativeElement.querySelector(
      '#opener',
    ) as HTMLButtonElement;
    const fallback = fixture.nativeElement.querySelector(
      '#keyboard-opener',
    ) as HTMLButtonElement;
    opener.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    opener.disabled = true;
    fallback.focus();
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(fallback);
  });

  it('does not restore a hidden menu trigger and safely ignores non-element pointer targets', () => {
    const menu = document.createElement('jp-dropdown-menu');
    menu.innerHTML =
      '<button jpdropdowntrigger>Hidden trigger</button><button>Menu action</button>';
    document.body.append(menu);
    menu
      .querySelectorAll('button')[1]
      .dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    menu.hidden = true;
    const fallback = fixture.nativeElement.querySelector(
      '#keyboard-opener',
    ) as HTMLButtonElement;
    fallback.focus();
    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(fallback);
    menu.remove();
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
