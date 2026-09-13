import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  JpDropdownMenu,
  JpDropdownMenuItem,
  JpDropdownTrigger,
} from './dropdown-menu';

@Component({
  standalone: true,
  imports: [JpDropdownMenu, JpDropdownTrigger, JpDropdownMenuItem],
  template: `
    <jp-dropdown-menu [open]="open" (openChange)="open = $event">
      <button type="button" jpDropdownTrigger>Actions</button>
      <button type="button" jpDropdownMenuItem (itemSelect)="onEdit()">
        Edit
      </button>
      <button type="button" jpDropdownMenuItem (itemSelect)="onDelete()">
        Delete
      </button>
    </jp-dropdown-menu>
  `,
})
class DropdownHost {
  open = false;
  edited = false;
  deleted = false;

  onEdit(): void {
    this.edited = true;
  }

  onDelete(): void {
    this.deleted = true;
  }
}

describe('JpDropdownMenu', () => {
  let fixture: ComponentFixture<DropdownHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownHost],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownHost);
    fixture.detectChanges();
  });

  function openMenu(): void {
    const trigger = fixture.nativeElement.querySelector(
      '[jpdropdowntrigger]',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
  }

  it('opens via trigger and shows menu role', () => {
    openMenu();

    expect(fixture.componentInstance.open).toBe(true);
    const menu = fixture.nativeElement.querySelector('[role="menu"]');
    expect(menu).toBeTruthy();
    const trigger = fixture.nativeElement.querySelector(
      '[jpdropdowntrigger]',
    ) as HTMLButtonElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('selects an item and closes', () => {
    openMenu();

    const items = fixture.nativeElement.querySelectorAll(
      '[jpdropdownmenuitem]',
    ) as NodeListOf<HTMLButtonElement>;
    items[0].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.edited).toBe(true);
    expect(fixture.componentInstance.open).toBe(false);
  });

  it('moves focus with ArrowDown', () => {
    openMenu();

    const items = fixture.nativeElement.querySelectorAll(
      '[jpdropdownmenuitem]',
    ) as NodeListOf<HTMLButtonElement>;
    items[0].focus();
    const menu = fixture.debugElement.query(By.directive(JpDropdownMenu))
      .componentInstance as JpDropdownMenu;
    menu.onItemKeydown(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }),
      items[0],
    );

    expect(document.activeElement).toBe(items[1]);
  });

  it('closes on Escape', () => {
    openMenu();

    const menu = fixture.debugElement.query(By.directive(JpDropdownMenu))
      .componentInstance as JpDropdownMenu;
    menu.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('supports ArrowUp, Home, End, and item Escape', () => {
    openMenu();
    const items = fixture.nativeElement.querySelectorAll(
      '[jpdropdownmenuitem]',
    ) as NodeListOf<HTMLButtonElement>;
    const menu = fixture.debugElement.query(By.directive(JpDropdownMenu))
      .componentInstance as JpDropdownMenu;

    items[1].focus();
    menu.onItemKeydown(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      }),
      items[1],
    );
    expect(document.activeElement).toBe(items[0]);

    menu.onItemKeydown(
      new KeyboardEvent('keydown', {
        key: 'End',
        bubbles: true,
        cancelable: true,
      }),
      items[0],
    );
    expect(document.activeElement).toBe(items[1]);

    menu.onItemKeydown(
      new KeyboardEvent('keydown', {
        key: 'Home',
        bubbles: true,
        cancelable: true,
      }),
      items[1],
    );
    expect(document.activeElement).toBe(items[0]);

    menu.onItemKeydown(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
      items[0],
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it('ignores item keydown when current is not focusable in panel', () => {
    openMenu();
    const menu = fixture.debugElement.query(By.directive(JpDropdownMenu))
      .componentInstance as JpDropdownMenu;
    const orphan = document.createElement('button');
    menu.onItemKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }),
      orphan,
    );
    expect(fixture.componentInstance.open).toBe(true);
  });

  it('closes on outside pointerdown and ignores when closed', () => {
    const menu = fixture.debugElement.query(By.directive(JpDropdownMenu))
      .componentInstance as JpDropdownMenu;
    const outside = document.createElement('div');
    document.body.appendChild(outside);

    const closedEvent = new Event('pointerdown', {
      bubbles: true,
    }) as PointerEvent;
    Object.defineProperty(closedEvent, 'target', { value: outside });
    menu.onDocumentPointerDown(closedEvent);
    expect(fixture.componentInstance.open).toBe(false);

    openMenu();
    const openEvent = new Event('pointerdown', {
      bubbles: true,
    }) as PointerEvent;
    Object.defineProperty(openEvent, 'target', { value: outside });
    menu.onDocumentPointerDown(openEvent);
    fixture.detectChanges();
    outside.remove();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it('does not select disabled items and routes item keydown', () => {
    openMenu();
    const itemDebug = fixture.debugElement.query(
      By.directive(JpDropdownMenuItem),
    );
    expect(itemDebug).toBeTruthy();
    const item = itemDebug.injector.get(JpDropdownMenuItem);
    // Simulate disabled input via direct call path
    Object.defineProperty(item, 'disabled', {
      value: () => true,
    });
    const event = new Event('click', { cancelable: true });
    item.onClick(event);
    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.edited).toBe(false);

    Object.defineProperty(item, 'disabled', {
      value: () => false,
    });
    item.onKeydown(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }),
    );
  });

  it('focusFirstItem no-ops without a panel', () => {
    const menu = fixture.debugElement.query(By.directive(JpDropdownMenu))
      .componentInstance as JpDropdownMenu;
    expect(() => menu.focusFirstItem()).not.toThrow();
    menu.close();
  });
});
