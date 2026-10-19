import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectDocumentTheme } from './document-theme';

@Component({
  template: '{{ theme.accent() }} / {{ theme.density() }}',
})
class ThemeConsumer {
  readonly theme = injectDocumentTheme();
}

describe('document theme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-jp-accent');
    document.documentElement.removeAttribute('data-jp-density');
    TestBed.configureTestingModule({ imports: [ThemeConsumer] });
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-jp-accent');
    document.documentElement.removeAttribute('data-jp-density');
  });

  it('uses the default theme when document attributes are absent', () => {
    const fixture = TestBed.createComponent(ThemeConsumer);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('gold / default');
  });

  it('reads theme attributes that are set before the consumer mounts', () => {
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');
    const fixture = TestBed.createComponent(ThemeConsumer);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('cobalt / compact');
  });

  it('updates the mounted consumer when attributes change or are removed', async () => {
    const fixture = TestBed.createComponent(ThemeConsumer);
    fixture.detectChanges();
    document.documentElement.setAttribute('data-jp-accent', 'neon');
    document.documentElement.setAttribute('data-jp-density', 'compact');
    await Promise.resolve();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('neon / compact');

    document.documentElement.removeAttribute('data-jp-accent');
    document.documentElement.removeAttribute('data-jp-density');
    await Promise.resolve();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('gold / default');
  });

  it('stops observing document changes when the consumer is destroyed', async () => {
    const fixture = TestBed.createComponent(ThemeConsumer);
    fixture.detectChanges();
    const theme = fixture.componentInstance.theme;
    fixture.destroy();
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    document.documentElement.setAttribute('data-jp-density', 'compact');
    await Promise.resolve();
    expect(theme.accent()).toBe('gold');
    expect(theme.density()).toBe('default');
  });
});
