import { TestBed } from '@angular/core/testing';
import { JpPageHeader } from './page-header';
import { Component } from '@angular/core';
@Component({
  imports: [JpPageHeader],
  template:
    '<jp-page-header title="Projects" description="Manage projects"><button jpPageActions>Create</button><span jpPageMeta>4 projects</span></jp-page-header>',
})
class Host {}
describe('JpPageHeader', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpPageHeader],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpPageHeader);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('provides the page heading and keeps actions and metadata in their named slots', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector('h1').textContent).toBe('Projects');
    expect(f.nativeElement.querySelector('.actions button').textContent).toBe(
      'Create',
    );
    expect(f.nativeElement.querySelector('.meta').textContent).toBe(
      '4 projects',
    );
  });
  it('supports embedded pages with a different heading level and no description', async () => {
    const f = await mount({ title: 'Embedded', headingLevel: 'h2' });
    expect(f.nativeElement.querySelector('h2')).not.toBeNull();
    expect(f.nativeElement.querySelector('p')).toBeNull();
  });
});
