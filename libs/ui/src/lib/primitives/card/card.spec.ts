import { TestBed } from '@angular/core/testing';
import { JpCard } from './card';
import { Component } from '@angular/core';
@Component({
  imports: [JpCard],
  template:
    '<jp-card title="Project" headingLevel="h3"><span jpCardHeader>Active</span><p>Details</p><button jpCardActions>Edit</button></jp-card>',
})
class Host {}
describe('JpCard', () => {
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
