import { TestBed } from '@angular/core/testing';
import { SchedulingPage } from './scheduling.page';
function button(root: HTMLElement, name: string): HTMLButtonElement {
  const result = Array.from(root.querySelectorAll('button')).find(
    (control) => control.textContent?.trim() === name,
  );
  if (!result) throw new Error('Missing consumer control: ' + name);
  return result;
}
describe('SchedulingPage', () => {
  it('shows collision-aware appointments and activates consumer-owned details', () => {
    const f = TestBed.createComponent(SchedulingPage);
    f.detectChanges();
    const event = f.nativeElement.querySelector(
      '.timed button',
    ) as HTMLButtonElement;
    expect(event.textContent).toContain('Review Game 6 notes');
    event.click();
    f.detectChanges();
    expect(f.componentInstance.detail()).toContain(
      'Tampa Bay’s 7–3 pennant-clinching win',
    );
    button(f.nativeElement, 'Close details').click();
    f.detectChanges();
    expect(f.componentInstance.selected()).toBeNull();
  });
  it('switches to an explicit DST example, resets, and recovers error state', () => {
    const f = TestBed.createComponent(SchedulingPage);
    f.detectChanges();
    button(f.nativeElement, 'Inspect clock change').click();
    f.detectChanges();
    expect(f.componentInstance.view()).toBe('day');
    expect(f.componentInstance.date()).toBe('2026-11-01');
    expect(f.componentInstance.zone()).toBe('America/New_York');
    expect(f.nativeElement.textContent).toContain('First photo backup');
    const secondHour = f.nativeElement.querySelector(
      '.timed button[aria-label^="Second photo backup,"]',
    ) as HTMLButtonElement;
    secondHour.click();
    f.detectChanges();
    expect(f.componentInstance.detail()).toContain('Second occurrence');
    button(f.nativeElement, 'Show calendar error').click();
    f.detectChanges();
    expect(
      f.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain('Appointments could not be loaded.');
    button(f.nativeElement, 'Retry').click();
    f.detectChanges();
    expect(f.componentInstance.state()).toBe('ready');
    button(f.nativeElement, 'Reset schedule').click();
    f.detectChanges();
    expect(f.componentInstance.date()).toBe('2026-10-19');
    expect(f.componentInstance.view()).toBe('week');
    expect(f.componentInstance.selected()).toBeNull();
    expect(f.nativeElement.textContent).toContain('Review Game 6 notes');
  });
  it('wires timezone conversion and loading/restoration through consumer controls', () => {
    const f = TestBed.createComponent(SchedulingPage);
    f.detectChanges();
    const select = f.nativeElement.querySelector(
      '[role="combobox"]',
    ) as HTMLButtonElement;
    select.click();
    f.detectChanges();
    const option = Array.from(
      f.nativeElement.querySelectorAll(
        '[role="option"]',
      ) as NodeListOf<HTMLElement>,
    ).find((item) => item.textContent?.trim() === 'UTC');
    option?.click();
    f.detectChanges();
    expect(f.componentInstance.zone()).toBe('UTC');
    const appointment = f.nativeElement.querySelector(
      '.timed button[aria-label^="Review Game 6 notes,"]',
    ) as HTMLButtonElement;
    expect(appointment.getAttribute('aria-label')).toMatch(/1:00\sPM GMT/);
    const viewport = f.nativeElement.querySelector('.days');
    button(f.nativeElement, 'Show loading').click();
    f.detectChanges();
    expect(f.componentInstance.state()).toBe('loading');
    expect(
      f.nativeElement
        .querySelector('jp-scheduling-calendar section')
        .getAttribute('aria-busy'),
    ).toBe('true');
    expect(f.nativeElement.querySelector('.days')).toBe(viewport);
    expect(
      f.nativeElement.querySelector(
        '.timed button[aria-label^="Review Game 6 notes,"]',
      ),
    ).toBe(appointment);
    expect(appointment.disabled).toBe(true);
    button(f.nativeElement, 'Restore schedule').click();
    f.detectChanges();
    expect(f.componentInstance.state()).toBe('ready');
    expect(appointment.disabled).toBe(false);
    expect(f.nativeElement.querySelector('.appointment')).toBeTruthy();
  });
  it('keeps consumer date/view signals synchronized with calendar navigation', () => {
    const f = TestBed.createComponent(SchedulingPage);
    f.detectChanges();
    const calendar = f.nativeElement.querySelector(
      'jp-scheduling-calendar',
    ) as HTMLElement;
    button(calendar, 'Day').click();
    f.detectChanges();
    expect(f.componentInstance.view()).toBe('day');
    button(calendar, 'Next').click();
    f.detectChanges();
    expect(f.componentInstance.date()).toBe('2026-10-20');
    expect(calendar.textContent).toContain('Finish the game collection');
    button(calendar, 'Previous').click();
    f.detectChanges();
    expect(f.componentInstance.date()).toBe('2026-10-19');
    button(calendar, 'Next').click();
    f.detectChanges();
    button(calendar, 'Today').click();
    f.detectChanges();
    expect(f.componentInstance.date()).toBe('2026-10-19');
    button(calendar, 'Week').click();
    f.detectChanges();
    expect(f.componentInstance.view()).toBe('week');
    expect(calendar.querySelectorAll('.day')).toHaveLength(7);
  });
});
