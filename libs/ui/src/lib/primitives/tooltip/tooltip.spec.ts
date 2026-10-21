import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JpTooltip } from './tooltip';

@Component({
  standalone: true,
  imports: [JpTooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <jp-tooltip content="Helpful tip" placement="top">
      <button type="button">Trigger</button>
    </jp-tooltip>
  `,
})
class TooltipHost {}

@Component({
  standalone: true,
  imports: [JpTooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <jp-tooltip content="Helpful tip" placement="bottom">
      <button type="button">Trigger</button>
    </jp-tooltip>
  `,
})
class TooltipBottomHost {}

@Component({
  imports: [JpTooltip],
  template: `
    <jp-tooltip
      content="Complete player name"
      style="display: contents; --jp-tooltip-trigger-display: contents"
    >
      <span class="cell-copy">Complete player name</span>
    </jp-tooltip>
  `,
})
class TooltipCellHost {}

describe('JpTooltip', () => {
  it('anchors to the projected noninteractive child when the wrapper has no layout box', () => {
    const fixture = TestBed.createComponent(TooltipCellHost);
    fixture.detectChanges();
    const copy = fixture.nativeElement.querySelector(
      '.cell-copy',
    ) as HTMLElement;
    jest.spyOn(copy, 'getBoundingClientRect').mockReturnValue({
      left: 200,
      right: 300,
      top: 100,
      bottom: 120,
      x: 200,
      y: 100,
      width: 100,
      height: 20,
      toJSON: () => ({}),
    });
    const host = fixture.nativeElement.querySelector(
      'jp-tooltip',
    ) as HTMLElement;
    host.dispatchEvent(new Event('pointerenter'));
    fixture.detectChanges();
    const panel = host.querySelector('[role="tooltip"]') as HTMLElement;
    expect(panel.style.left).toBe('200px');
    expect(copy.getAttribute('aria-describedby')).toBe(panel.id);
  });
  it('shows content on pointer enter and hides on leave', async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(TooltipHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector(
      'jp-tooltip',
    ) as HTMLElement;
    host.dispatchEvent(new Event('pointerenter'));
    fixture.detectChanges();

    expect(host.classList.contains('jp-tooltip--open')).toBe(true);
    expect(host.textContent).toContain('Helpful tip');
    expect(host.querySelector('[role="tooltip"]')).toBeTruthy();

    host.dispatchEvent(new Event('pointerleave'));
    await new Promise((resolve) => setTimeout(resolve, 110));
    fixture.detectChanges();
    expect(host.classList.contains('jp-tooltip--open')).toBe(false);
  });

  it('applies placement class', async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipBottomHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(TooltipBottomHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector(
      'jp-tooltip',
    ) as HTMLElement;
    expect(host.classList.contains('jp-tooltip--bottom')).toBe(true);
  });

  it('hides on Escape while open', async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(TooltipHost);
    fixture.detectChanges();

    const tooltip = fixture.debugElement.query(By.directive(JpTooltip))
      .componentInstance as JpTooltip;
    tooltip.show();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector(
      'jp-tooltip',
    ) as HTMLElement;
    expect(host.classList.contains('jp-tooltip--open')).toBe(true);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(host.classList.contains('jp-tooltip--open')).toBe(false);
  });

  it('falls back invalid placement to top', async () => {
    await TestBed.configureTestingModule({
      imports: [JpTooltip],
    }).compileComponents();

    const fixture: ComponentFixture<JpTooltip> =
      TestBed.createComponent(JpTooltip);
    fixture.componentRef.setInput('content', 'Tip');
    fixture.componentRef.setInput('placement', 'nope' as never);
    fixture.detectChanges();

    expect(fixture.componentInstance.placement()).toBe('top');
  });

  it('shows on focusin and hides on focusout', async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(TooltipHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector(
      'jp-tooltip',
    ) as HTMLElement;
    host.dispatchEvent(new Event('focusin'));
    fixture.detectChanges();
    expect(host.classList.contains('jp-tooltip--open')).toBe(true);

    host.dispatchEvent(new Event('focusout'));
    fixture.detectChanges();
    expect(host.classList.contains('jp-tooltip--open')).toBe(false);
  });

  it('does not open when content is empty', async () => {
    await TestBed.configureTestingModule({
      imports: [JpTooltip],
    }).compileComponents();

    const fixture = TestBed.createComponent(JpTooltip);
    fixture.componentRef.setInput('content', '');
    fixture.detectChanges();
    fixture.componentInstance.show();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });
});

describe('tooltip description composition', () => {
  it('preserves other descriptions when opening, closing and destroying', async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipHost],
    }).compileComponents();
    const fixture = TestBed.createComponent(TooltipHost);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    trigger.setAttribute('aria-describedby', 'help validation');
    const tooltip = fixture.debugElement.query(By.directive(JpTooltip))
      .componentInstance as JpTooltip;
    tooltip.show();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-describedby')).toBe(
      `help validation ${tooltip.tooltipId}`,
    );
    tooltip.hide();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-describedby')).toBe('help validation');
    tooltip.show();
    fixture.detectChanges();
    fixture.destroy();
    expect(trigger.getAttribute('aria-describedby')).toBe('help validation');
  });
});
