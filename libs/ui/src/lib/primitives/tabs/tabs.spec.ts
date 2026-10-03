import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpTabPanel, JpTabs } from './tabs';

@Component({
  imports: [JpTabs, JpTabPanel],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <jp-tabs
      ariaLabel="Account settings"
      id="account-tabs"
      [tabs]="tabs()"
      [(selectedValue)]="selected"
    >
      <ng-template jpTabPanel="profile"
        ><input aria-label="Display name" value="Justin"
      /></ng-template>
      <ng-template jpTabPanel="billing">Billing content</ng-template>
      <ng-template jpTabPanel="security">Security content</ng-template>
    </jp-tabs>
  `,
})
class Host {
  selected = signal('profile');
  tabs = signal([
    { value: 'profile', label: 'Profile' },
    { value: 'billing', label: 'Billing', disabled: true },
    { value: 'security', label: 'Security' },
  ]);
}

describe('JpTabs', () => {
  let fixture: ComponentFixture<Host>;
  const buttons = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('[role="tab"]'),
    ) as HTMLButtonElement[];
  const panels = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('[role="tabpanel"]'),
    ) as HTMLElement[];
  const key = (index: number, value: string) => {
    buttons()[index].dispatchEvent(
      new KeyboardEvent('keydown', {
        key: value,
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('links each tab and panel and names the tablist', () => {
    expect(
      fixture.nativeElement
        .querySelector('[role="tablist"]')
        .getAttribute('aria-label'),
    ).toBe('Account settings');
    buttons().forEach((tab, index) => {
      expect(tab.getAttribute('aria-controls')).toBe(panels()[index].id);
      expect(panels()[index].getAttribute('aria-labelledby')).toBe(tab.id);
    });
    expect(buttons().map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
    expect(panels().map((panel) => panel.hidden)).toEqual([false, true, true]);
    expect(buttons()[1].disabled).toBe(true);
  });

  it('skips disabled tabs and wraps focus without activating a panel', () => {
    key(0, 'ArrowRight');
    expect(document.activeElement).toBe(buttons()[2]);
    expect(buttons().map((tab) => tab.tabIndex)).toEqual([-1, -1, 0]);
    expect(fixture.componentInstance.selected()).toBe('profile');
    expect(panels()[0].hidden).toBe(false);
    key(2, 'ArrowRight');
    expect(document.activeElement).toBe(buttons()[0]);
    key(0, 'ArrowLeft');
    expect(document.activeElement).toBe(buttons()[2]);
  });

  it('supports Home and End and leaves Tab to the browser', () => {
    key(0, 'End');
    expect(document.activeElement).toBe(buttons()[2]);
    key(2, 'Home');
    expect(document.activeElement).toBe(buttons()[0]);
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    buttons()[0].dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('returns the focus entry point to the selected tab after leaving the list', () => {
    key(0, 'ArrowRight');
    (panels()[0].querySelector('input') as HTMLInputElement).focus();
    fixture.detectChanges();
    expect(buttons().map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
  });

  it('reverses horizontal arrow navigation for right-to-left layouts', () => {
    fixture.nativeElement.querySelector('[role="tablist"]').style.direction =
      'rtl';
    // Enable the middle tab so forward and backward movement are distinguishable.
    fixture.componentInstance.tabs.update((tabs) =>
      tabs.map((tab) => ({ ...tab, disabled: false })),
    );
    fixture.detectChanges();
    // jsdom does not compute inherited direction; make the computed button direction explicit.
    buttons().forEach((button) => (button.style.direction = 'rtl'));
    key(0, 'ArrowRight');
    expect(document.activeElement).toBe(buttons()[2]);
    key(0, 'ArrowLeft');
    expect(document.activeElement).toBe(buttons()[1]);
  });

  it('emits selection on native activation and preserves projected form state', () => {
    const input = panels()[0].querySelector('input') as HTMLInputElement;
    input.value = 'Updated name';
    buttons()[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe('security');
    expect(panels().map((panel) => panel.hidden)).toEqual([true, true, false]);
    expect(buttons()[2].getAttribute('aria-selected')).toBe('true');
    buttons()[0].click();
    fixture.detectChanges();
    expect((panels()[0].querySelector('input') as HTMLInputElement).value).toBe(
      'Updated name',
    );
  });

  it('reflects controlled updates and falls back when the selected tab is disabled', () => {
    fixture.componentInstance.selected.set('security');
    fixture.detectChanges();
    expect(panels()[2].hidden).toBe(false);
    fixture.componentInstance.selected.set('billing');
    fixture.detectChanges();
    expect(panels()[0].hidden).toBe(false);
  });

  it('handles an all-disabled list without a focus stop or active panel', () => {
    fixture.componentInstance.tabs.update((tabs) =>
      tabs.map((tab) => ({ ...tab, disabled: true })),
    );
    fixture.detectChanges();
    key(0, 'End');
    expect(buttons().every((tab) => tab.tabIndex === -1)).toBe(true);
    expect(panels().every((panel) => panel.hidden)).toBe(true);
  });
});
