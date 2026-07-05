import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpSurface } from './surface';

describe('JpSurface', () => {
  let fixture: ComponentFixture<JpSurface>;
  let component: JpSurface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpSurface],
    }).compileComponents();

    fixture = TestBed.createComponent(JpSurface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses expected defaults', () => {
    expect(component.as()).toBe('section');
    expect(component.rootBackground()).toBe('var(--jp-color-surface-raised)');
    expect(component.rootBorder()).toBe(
      '1px solid var(--jp-color-border-default)',
    );
  });

  it('renders requested semantic tag', () => {
    fixture.componentRef.setInput('as', 'article');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.jp-surface__root');
    expect(root?.tagName).toBe('ARTICLE');
  });

  it('falls back to defaults for invalid values', () => {
    fixture.componentRef.setInput('tone', 'bad' as never);
    fixture.componentRef.setInput('border', 'bad' as never);
    fixture.detectChanges();

    expect(component.tone()).toBe('raised');
    expect(component.border()).toBe('default');
  });
});
