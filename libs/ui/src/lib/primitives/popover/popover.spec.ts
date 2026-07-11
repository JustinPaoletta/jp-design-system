import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JpPopover, JpPopoverContent, JpPopoverTrigger } from './popover';

@Component({
  standalone: true,
  imports: [JpPopover, JpPopoverTrigger, JpPopoverContent],
  template: `
    <jp-popover [open]="open" (openChange)="open = $event">
      <button type="button" jpPopoverTrigger>Filters</button>
      <div jpPopoverContent>Filter panel</div>
    </jp-popover>
  `,
})
class PopoverHost {
  open = false;
}

describe('JpPopover', () => {
  let fixture: ComponentFixture<PopoverHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverHost],
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
  });

  function openPopover(): void {
    const trigger = fixture.nativeElement.querySelector(
      '[jppopovertrigger]',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
  }

  it('toggles open via trigger', () => {
    openPopover();

    expect(fixture.componentInstance.open).toBe(true);
    const content = fixture.nativeElement.querySelector(
      '[jppopovercontent]',
    ) as HTMLElement;
    expect(content.hasAttribute('hidden')).toBe(false);
    expect(content.textContent).toContain('Filter panel');
  });

  it('closes on Escape', () => {
    openPopover();

    const popover = fixture.debugElement.query(By.directive(JpPopover))
      .componentInstance as JpPopover;
    popover.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('closes on outside pointerdown', () => {
    openPopover();

    const popover = fixture.debugElement.query(By.directive(JpPopover))
      .componentInstance as JpPopover;
    const outside = document.createElement('div');
    document.body.appendChild(outside);
    const event = new Event('pointerdown', { bubbles: true }) as PointerEvent;
    Object.defineProperty(event, 'target', { value: outside });
    popover.onDocumentPointerDown(event);
    fixture.detectChanges();
    outside.remove();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('ignores Escape and outside click when closed', () => {
    const popover = fixture.debugElement.query(By.directive(JpPopover))
      .componentInstance as JpPopover;
    popover.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    const event = new Event('pointerdown', { bubbles: true }) as PointerEvent;
    Object.defineProperty(event, 'target', {
      value: document.createElement('div'),
    });
    popover.onDocumentPointerDown(event);
    popover.close();
    expect(fixture.componentInstance.open).toBe(false);
  });
});
