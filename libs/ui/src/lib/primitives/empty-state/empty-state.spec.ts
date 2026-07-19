import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpEmptyState } from './empty-state';

@Component({
  selector: 'jp-empty-state-host',
  imports: [JpEmptyState],
  template: `
    <jp-empty-state [title]="title()" [description]="description()">
      <span jpEmptyStateIcon>◇</span>
      <button type="button">Action</button>
    </jp-empty-state>
  `,
})
class EmptyStateHost {
  readonly title = input('No items');
  readonly description = input('Nothing to show yet.');
}

describe('JpEmptyState', () => {
  let fixture: ComponentFixture<EmptyStateHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateHost],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateHost);
    fixture.detectChanges();
  });

  it('creates with status role', () => {
    const host = fixture.nativeElement.querySelector(
      'jp-empty-state',
    ) as HTMLElement;
    expect(host).toBeTruthy();
    expect(host.getAttribute('role')).toBe('status');
  });

  it('renders title and description', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.jp-empty-state__title')?.textContent).toContain(
      'No items',
    );
    expect(
      root.querySelector('.jp-empty-state__description')?.textContent,
    ).toContain('Nothing to show yet.');
  });

  it('projects icon and action content', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[jpEmptyStateIcon]')?.textContent).toContain(
      '◇',
    );
    expect(root.querySelector('button')?.textContent).toContain('Action');
  });

  it('hides description when empty', () => {
    fixture.componentRef.setInput('description', '');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.jp-empty-state__description'),
    ).toBeNull();
  });
});
