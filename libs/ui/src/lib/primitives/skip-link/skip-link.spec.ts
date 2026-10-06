import { TestBed } from '@angular/core/testing';
import { JpSkipLink } from './skip-link';
describe('JpSkipLink', () => {
  it('moves focus to the target and restores only its temporary tabindex', () => {
    const target = document.createElement('main');
    target.id = 'skip-test';
    document.body.append(target);
    const f = TestBed.createComponent(JpSkipLink);
    f.componentRef.setInput('target', target.id);
    f.detectChanges();
    const event = new MouseEvent('click', { button: 0, cancelable: true });
    f.componentInstance.activate(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(target);
    expect(target.getAttribute('tabindex')).toBe('-1');
    target.dispatchEvent(new Event('blur'));
    expect(target.hasAttribute('tabindex')).toBe(false);
    target.setAttribute('tabindex', '0');
    f.componentInstance.activate(new MouseEvent('click', { button: 0 }));
    f.destroy();
    expect(target.getAttribute('tabindex')).toBe('0');
    target.remove();
  });
  it('keeps modified/missing-target links native', () => {
    const f = TestBed.createComponent(JpSkipLink);
    f.componentRef.setInput('target', 'missing');
    f.detectChanges();
    const modified = new MouseEvent('click', {
      ctrlKey: true,
      cancelable: true,
    });
    f.componentInstance.activate(modified);
    expect(modified.defaultPrevented).toBe(false);
    const missing = new MouseEvent('click', { cancelable: true });
    f.componentInstance.activate(missing);
    expect(missing.defaultPrevented).toBe(false);
  });
});
