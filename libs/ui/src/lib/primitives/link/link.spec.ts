import { TestBed } from '@angular/core/testing';
import { JpLink } from './link';
import { Component } from '@angular/core';
import { provideRouter, RouterLink } from '@angular/router';
@Component({
  imports: [JpLink, RouterLink],
  template:
    '<a jpLink routerLink="/settings" target="_blank" rel="noopener">Settings</a>',
})
class Host {}
describe('JpLink', () => {
  it('keeps href and RouterLink behavior on a native anchor with projected text', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const anchor = f.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('href')).toBe('/settings');
    expect(anchor.textContent).toBe('Settings');
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noopener');
  });
});
