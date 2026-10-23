import { TestBed } from '@angular/core/testing';
import { JpCard } from './card';
import { Component } from '@angular/core';
import { JpPageHeader } from '../page-header/page-header';
import { JpDisclosure } from '../disclosure/disclosure';
import { JpInlineAlert } from '../inline-alert/inline-alert';
@Component({
  imports: [JpCard],
  template:
    '<jp-card title="Project" headingLevel="h3"><span jpCardHeader>Active</span><p>Details</p><button jpCardActions>Edit</button></jp-card>',
})
class Host {}
@Component({
  imports: [JpCard, JpPageHeader, JpDisclosure, JpInlineAlert],
  template: `
    <jp-page-header title="Rays roster" />
    <jp-card title="Player availability">
      <jp-disclosure title="Lineup notes"
        >Yandy Díaz is available.</jp-disclosure
      >
      <jp-inline-alert title="Lineup saved" message="Ready for ALCS Game 6." />
    </jp-card>
  `,
})
class StaticTitleHost {}
describe('JpCard', () => {
  it('uses static component titles as visible content without native browser tooltips', () => {
    const f = TestBed.createComponent(StaticTitleHost);
    f.detectChanges();
    for (const [selector, contentSelector, title] of [
      ['jp-page-header', 'h1', 'Rays roster'],
      ['jp-card', 'h2', 'Player availability'],
      ['jp-disclosure', 'summary', 'Lineup notes'],
      ['jp-inline-alert', 'strong', 'Lineup saved'],
    ]) {
      const host = f.nativeElement.querySelector(selector) as HTMLElement;
      expect(host.hasAttribute('title')).toBe(false);
      expect(host.querySelector(contentSelector)?.textContent).toContain(title);
    }
    expect(
      f.nativeElement.querySelector('[role="status"]').textContent,
    ).toContain('Ready for ALCS Game 6.');
  });
  it('lets consumers choose the heading level and exposes projected header, body and actions', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector('h3').textContent).toContain(
      'Project',
    );
    expect(f.nativeElement.querySelector('header').textContent).toContain(
      'Active',
    );
    expect(f.nativeElement.querySelector('.body').textContent).toContain(
      'Details',
    );
    expect(f.nativeElement.querySelector('footer button').textContent).toBe(
      'Edit',
    );
  });
});
