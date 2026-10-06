import { TestBed } from '@angular/core/testing';
import { JpAccordion } from './accordion';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { JpDisclosure } from '../disclosure/disclosure';
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [JpAccordion, JpDisclosure],
  template:
    '<jp-accordion id="settings" label="Settings" [multiple]="multiple()"><jp-disclosure title="First">One</jp-disclosure><jp-disclosure title="Second">Two</jp-disclosure></jp-accordion>',
})
class Host {
  multiple = signal(false);
}
describe('JpAccordion', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpAccordion],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpAccordion);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('names the group and shares an exclusive native group name with disclosures', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const details = f.nativeElement.querySelectorAll(
      'details',
    ) as NodeListOf<HTMLDetailsElement>;
    expect(details[0].getAttribute('name')).toBe('settings');
    expect(details[1].getAttribute('name')).toBe('settings');
    f.componentInstance.multiple.set(true);
    f.detectChanges();
    expect(details[0].hasAttribute('name')).toBe(false);
    expect(details[1].hasAttribute('name')).toBe(false);
  });
  it('generates a group name when consumers do not supply one', async () => {
    const f = await mount({ label: 'Settings' });
    expect(f.componentInstance.generatedId).toMatch(/^jp-accordion-/);
  });
});
