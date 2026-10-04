import { TestBed } from '@angular/core/testing';
import { HierarchyPage, HIERARCHY_ASSETS } from './hierarchy.page';
describe('HierarchyPage', () => {
  it('renders a working asset browser and native hierarchical project table', () => {
    const fixture = TestBed.createComponent(HierarchyPage);
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('[role=tree]')
        .getAttribute('aria-label'),
    ).toBe('Design assets');
    expect(
      fixture.nativeElement.querySelector('caption').textContent.trim(),
    ).toBe('Project work');
    fixture.componentInstance.selectedAsset.set('wordmark');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Selected asset: Wordmark.svg',
    );
  });
  it('keeps lazy loading and its retry in the consumer', () => {
    jest.useFakeTimers();
    const fixture = TestBed.createComponent(HierarchyPage);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.load(HIERARCHY_ASSETS[2]);
    expect(component.assets()[2].loadState).toBe('loading');
    jest.advanceTimersByTime(300);
    expect(component.assets()[2].loadState).toBe('error');
    component.load(component.assets()[2]);
    jest.advanceTimersByTime(300);
    expect(component.assets()[2].loadState).toBe('loaded');
    expect(component.assets()[2].children).toHaveLength(2);
    fixture.destroy();
    jest.useRealTimers();
  });
});
