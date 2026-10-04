import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpChip } from './chip';

describe('JpChip', () => {
  let fixture: ComponentFixture<JpChip>;
  let component: JpChip;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpChip],
    }).compileComponents();

    fixture = TestBed.createComponent(JpChip);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Healthy');
    fixture.detectChanges();
  });

  it('creates with medium size and a remove name that includes the label', () => {
    expect(component).toBeTruthy();
    expect(component.size()).toBe('md');
    expect(component.disabled()).toBe(false);
    expect(component.removeLabel()).toBe('Remove Healthy');

    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector('button');
    expect(host.classList.contains('jp-chip--md')).toBe(true);
    expect(button?.getAttribute('aria-label')).toBe('Remove Healthy');
    expect(button?.getAttribute('type')).toBe('button');
    expect(host.textContent).toContain('Healthy');
  });

  it('applies the small size and falls back when the size is invalid', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(component.size()).toBe('sm');
    expect(
      (fixture.nativeElement as HTMLElement).classList.contains('jp-chip--sm'),
    ).toBe(true);

    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(component.size()).toBe('md');
  });

  it('emits removed from the button and from Delete or Backspace', () => {
    const emitted: number[] = [];
    component.removed.subscribe(() => emitted.push(emitted.length + 1));
    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;

    button.click();
    const backspace = new KeyboardEvent('keydown', {
      key: 'Backspace',
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(backspace);
    const del = new KeyboardEvent('keydown', {
      key: 'Delete',
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(del);

    expect(emitted).toEqual([1, 2, 3]);
    expect(backspace.defaultPrevented).toBe(true);
    expect(del.defaultPrevented).toBe(true);
  });

  it('does not remove when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const emitted: string[] = [];
    component.removed.subscribe(() => emitted.push('removed'));
    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector('button') as HTMLButtonElement;

    expect(host.classList.contains('jp-chip--disabled')).toBe(true);
    expect(button.disabled).toBe(true);
    button.click();
    host.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Delete',
        bubbles: true,
        cancelable: true,
      }),
    );
    component.remove();

    expect(emitted).toEqual([]);
  });

  it('ignores keys other than Delete and Backspace', () => {
    const emitted: string[] = [];
    component.removed.subscribe(() => emitted.push('removed'));
    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    const enter = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    button.dispatchEvent(enter);

    expect(enter.defaultPrevented).toBe(false);
    expect(emitted).toEqual([]);
  });

  it('removes when the chip is already detached', () => {
    const emitted: string[] = [];
    component.removed.subscribe(() => emitted.push('removed'));

    (fixture.nativeElement as HTMLElement).remove();
    component.remove();

    expect(emitted).toEqual(['removed']);
  });
});

@Component({
  imports: [JpChip],
  template: `
    @for (item of labels(); track item.label) {
      <jp-chip
        [label]="item.label"
        [disabled]="item.disabled"
        (removed)="remove(item.label)"
      />
    }
  `,
})
class ChipListHost {
  readonly labels = signal([
    { label: 'Healthy', disabled: false },
    { label: 'Staging', disabled: true },
    { label: 'Preview', disabled: false },
  ]);

  remove(label: string): void {
    this.labels.update((current) =>
      current.filter((item) => item.label !== label),
    );
  }
}

describe('JpChip focus after removal', () => {
  let fixture: ComponentFixture<ChipListHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipListHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipListHost);
    fixture.detectChanges();
  });

  const buttons = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

  it('skips a disabled sibling and focuses the next remove button', async () => {
    buttons()[0].click();
    fixture.detectChanges();
    await Promise.resolve();

    const remaining = buttons();
    expect(
      remaining.map((button) => button.getAttribute('aria-label')),
    ).toEqual(['Remove Staging', 'Remove Preview']);
    expect(document.activeElement).toBe(remaining[1]);
  });

  it('focuses the previous enabled chip when the removed chip is last', async () => {
    buttons()[2].dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Backspace',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    await Promise.resolve();

    const remaining = buttons();
    expect(
      remaining.map((button) => button.getAttribute('aria-label')),
    ).toEqual(['Remove Healthy', 'Remove Staging']);
    expect(document.activeElement).toBe(remaining[0]);
  });

  it('leaves focus to the consumer when the last chip is removed', async () => {
    fixture.componentInstance.labels.set([
      { label: 'Healthy', disabled: false },
    ]);
    fixture.detectChanges();

    const button = buttons()[0];
    button.click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.nativeElement.querySelector('jp-chip')).toBeNull();
    expect(document.activeElement).not.toBe(button);
  });
});

@Component({
  imports: [JpChip],
  template: `
    @for (label of labels(); track label) {
      <jp-chip [label]="label" (removed)="clear()" />
    }
  `,
})
class ClearAllHost {
  readonly labels = signal(['Healthy', 'Staging']);

  clear(): void {
    this.labels.set([]);
  }
}

describe('JpChip focus when the neighbor is destroyed', () => {
  it('does not move focus onto a button that was removed too', async () => {
    await TestBed.configureTestingModule({
      imports: [ClearAllHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(ClearAllHost);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.nativeElement.querySelector('jp-chip')).toBeNull();
    expect(document.activeElement).not.toBe(button);
  });
});
