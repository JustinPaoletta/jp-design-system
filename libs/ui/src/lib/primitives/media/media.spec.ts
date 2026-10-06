import { TestBed } from '@angular/core/testing';
import { provideJpMessages } from '../../i18n';
import { JpMedia } from './media';
function setup(alt = 'Workspace diagram') {
  const fixture = TestBed.createComponent(JpMedia);
  fixture.componentRef.setInput('src', '/diagram.svg');
  fixture.componentRef.setInput('alt', alt);
  fixture.detectChanges();
  return fixture;
}
describe('JpMedia', () => {
  it('renders native responsive image attributes, captions and loading state', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('caption', 'Service architecture');
    fixture.componentRef.setInput('srcset', '/diagram.svg 640w');
    fixture.componentRef.setInput('sizes', '100vw');
    fixture.componentRef.setInput('loading', 'eager');
    fixture.detectChanges();
    const img = root.querySelector('img') as HTMLImageElement;
    expect(img.alt).toBe('Workspace diagram');
    expect(img.getAttribute('loading')).toBe('eager');
    expect(img.getAttribute('srcset')).toContain('640w');
    expect(root.querySelector('figcaption')?.textContent).toContain(
      'Service architecture',
    );
    expect(
      root.querySelector('.jp-media__frame')?.getAttribute('aria-busy'),
    ).toBe('true');
    const loaded = jest.spyOn(fixture.componentInstance.loaded, 'emit');
    img.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    expect(loaded).toHaveBeenCalled();
    expect(root.querySelector('.jp-media__placeholder')).toBeNull();
    expect(
      root.querySelector('.jp-media__frame')?.getAttribute('aria-busy'),
    ).toBe('false');
  });
  it('keeps meaningful fallback semantics and resets state when the source changes', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const img = root.querySelector('img') as HTMLImageElement;
    const failed = jest.spyOn(fixture.componentInstance.failed, 'emit');
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(failed).toHaveBeenCalled();
    expect(img.hidden).toBe(true);
    expect(root.querySelector('[role=img]')?.getAttribute('aria-label')).toBe(
      'Workspace diagram',
    );
    fixture.componentRef.setInput('src', '/repaired.svg');
    fixture.detectChanges();
    const repaired = root.querySelector('img') as HTMLImageElement;
    expect(repaired).not.toBe(img);
    expect(repaired.hidden).toBe(false);
    expect(fixture.componentInstance.phase()).toBe('loading');
    repaired.dispatchEvent(new Event('load'));
    expect(fixture.componentInstance.phase()).toBe('loaded');
    fixture.componentRef.setInput('aspectRatio', 0);
    expect(fixture.componentInstance.ratio()).toBe(16 / 9);
    fixture.componentRef.setInput('aspectRatio', Infinity);
    expect(fixture.componentInstance.ratio()).toBe(16 / 9);
    fixture.componentRef.setInput('aspectRatio', 1);
    expect(fixture.componentInstance.ratio()).toBe(1);
  });
  it('hides decorative fallback text and allows localized copy', () => {
    TestBed.configureTestingModule({
      providers: [
        provideJpMessages({ media: { error: 'Image indisponible' } }),
      ],
    });
    const fixture = setup('');
    const root = fixture.nativeElement as HTMLElement;
    (root.querySelector('img') as HTMLImageElement).dispatchEvent(
      new Event('error'),
    );
    fixture.detectChanges();
    expect(root.querySelector('[role=img]')).toBeNull();
    expect(
      root.querySelector('.jp-media__placeholder')?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(root.textContent).toContain('Image indisponible');
  });
  it('ignores queued events from the image instance for a superseded source', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const oldImage = root.querySelector('img') as HTMLImageElement;
    const loaded = jest.spyOn(fixture.componentInstance.loaded, 'emit');
    const failed = jest.spyOn(fixture.componentInstance.failed, 'emit');
    fixture.componentRef.setInput('src', '/new.svg');
    fixture.detectChanges();
    expect(root.querySelector('img')).not.toBe(oldImage);
    oldImage.dispatchEvent(new Event('load'));
    oldImage.dispatchEvent(new Event('error'));
    expect(fixture.componentInstance.phase()).toBe('loading');
    expect(loaded).not.toHaveBeenCalled();
    expect(failed).not.toHaveBeenCalled();
  });
});
