import { TestBed } from '@angular/core/testing';
import { JpButtonGroup } from './button-group';
describe('JpButtonGroup', () => {
  it('names a semantic group and supports vertical layout without changing Tab behavior', () => {
    const f = TestBed.createComponent(JpButtonGroup);
    f.componentRef.setInput('label', 'Actions');
    f.componentRef.setInput('orientation', 'vertical');
    f.detectChanges();
    expect(f.nativeElement.getAttribute('role')).toBe('group');
    expect(f.nativeElement.getAttribute('aria-label')).toBe('Actions');
    expect(f.nativeElement.classList.contains('vertical')).toBe(true);
    expect(f.nativeElement.hasAttribute('tabindex')).toBe(false);
  });
});
